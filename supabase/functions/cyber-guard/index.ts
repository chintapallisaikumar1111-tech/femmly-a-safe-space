import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ThreatRequest {
  event_type: string;
  user_id?: string | null;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
}

/** Lightweight rule-based scoring; AI gateway escalates suspicious patterns. */
function baseScore(evt: ThreatRequest): { score: number; severity: string; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const t = evt.event_type.toLowerCase();
  if (t.includes("failed_login")) { score += 25; reasons.push("Failed login attempt"); }
  if (t.includes("admin")) { score += 15; reasons.push("Admin surface accessed"); }
  if (t.includes("rate_limit")) { score += 40; reasons.push("Rate limit triggered"); }
  if (t.includes("injection") || t.includes("xss")) { score += 80; reasons.push("Injection pattern detected"); }
  if (t.includes("scrape")) { score += 35; reasons.push("Scraping behavior"); }

  const ua = (evt.user_agent || "").toLowerCase();
  if (!ua || ua.length < 10) { score += 20; reasons.push("Missing/short user-agent"); }
  if (/curl|wget|python|bot|scanner|sqlmap|nikto/.test(ua)) { score += 50; reasons.push("Automated tool UA"); }

  let severity = "info";
  if (score >= 70) severity = "critical";
  else if (score >= 40) severity = "warning";
  else if (score >= 20) severity = "low";

  return { score: Math.min(100, score), severity, reasons };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const evt = (await req.json()) as ThreatRequest;
    if (!evt?.event_type) {
      return new Response(JSON.stringify({ error: "event_type required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { score, severity, reasons } = baseScore(evt);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await supabase.from("security_events").insert({
      user_id: evt.user_id ?? null,
      event_type: evt.event_type,
      severity,
      ip_address: evt.ip_address ?? req.headers.get("x-forwarded-for"),
      user_agent: evt.user_agent ?? req.headers.get("user-agent"),
      threat_score: score,
      metadata: { ...(evt.metadata || {}), reasons },
    });

    return new Response(JSON.stringify({ score, severity, reasons }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("cyber-guard error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});