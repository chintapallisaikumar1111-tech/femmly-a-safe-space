import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user from JWT using service-role client (accepts the access token directly)
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    // Accept either legacy single image OR new 3-frame liveness payload
    const frames: { front?: string; blink?: string; side?: string } =
      body.frames || (body.imageBase64 ? { front: body.imageBase64 } : {});

    if (!frames.front || !frames.blink || !frames.side) {
      return new Response(
        JSON.stringify({ error: "All 3 liveness frames required (front, blink, side)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use Lovable AI (Gemini) for gender detection from selfie
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are the gender + liveness verification AI for "Femmly", a strictly women-only social platform.

You will be given 3 sequential selfies of the SAME person taken seconds apart:
  1. FRONT  — face straight at camera, eyes open
  2. BLINK  — eyes closed (blink moment)
  3. SIDE   — head turned to the left or right side

Your job is to confirm BOTH:
  (A) Liveness — it is a real live human, not a photo of a photo, screen, mask, doll, or AI-generated image. The 3 frames must show natural human variation (different eye state, different head pose, consistent lighting/skin).
  (B) Gender  — the person is clearly an adult or teen FEMALE. Reject if male, ambiguous, a child, a cartoon, an animal, or anything other than a real woman.

Be strict. If liveness fails OR gender is not clearly female, you MUST reject.

Respond ONLY with a single JSON object — no markdown, no code fences, no extra text:
{
  "gender": "female" | "male" | "unclear",
  "is_live": true | false,
  "blink_detected": true | false,
  "head_turn_detected": true | false,
  "same_person": true | false,
  "confidence": 0.0 to 1.0,
  "reason": "one short sentence explaining the decision"
}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Frame 1 of 3 — FRONT (eyes open, looking at camera):" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${frames.front}` } },
              { type: "text", text: "Frame 2 of 3 — BLINK (eyes closed):" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${frames.blink}` } },
              { type: "text", text: "Frame 3 of 3 — SIDE (head turned left or right):" },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${frames.side}` } },
              { type: "text", text: "Analyze all 3 frames together for liveness + female gender verification. Respond with the JSON object only." }
            ]
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Verification service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";
    
    let result;
    try {
      // Try to parse directly or extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      result = { gender: "unclear", confidence: 0, reason: "Could not parse AI response" };
    }

    const isApproved =
      result.gender === "female" &&
      result.is_live === true &&
      result.same_person !== false &&
      result.blink_detected === true &&
      result.head_turn_detected === true &&
      (typeof result.confidence === "number" ? result.confidence >= 0.7 : true);

    // Store the selfie in storage
    const selfieBuffer = Uint8Array.from(atob(frames.front), c => c.charCodeAt(0));
    const selfieFileName = `${user.id}/${Date.now()}.jpg`;
    await supabase.storage.from("verification-selfies").upload(selfieFileName, selfieBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

    // Save verification request
    await supabase.from("verification_requests").insert({
      user_id: user.id,
      selfie_url: selfieFileName,
      ai_result: result,
      ai_confidence: result.confidence,
      status: isApproved ? "approved" : "pending",
    });

    // If approved, mark profile as verified
    if (isApproved) {
      await supabase.from("profiles").update({ is_verified: true }).eq("id", user.id);
    }

    return new Response(JSON.stringify({
      verified: isApproved,
      confidence: result.confidence,
      details: {
        gender: result.gender,
        is_live: result.is_live,
        blink_detected: result.blink_detected,
        head_turn_detected: result.head_turn_detected,
        same_person: result.same_person,
      },
      message: isApproved
        ? "Welcome to Femmly! Your live identity has been verified."
        : result.gender === "male"
          ? "Account rejected. Femmly is a women-only platform."
          : !result.is_live
            ? "Liveness check failed. Please retry with a real, well-lit live selfie (no photos or screens)."
            : !result.blink_detected
              ? "We didn't detect a real blink. Please retry."
              : !result.head_turn_detected
                ? "We didn't detect a clear head turn. Please retry."
                : "We couldn't clearly verify you as female. Please retry in better lighting.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-gender error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
