import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, items } = await req.json();
    if (typeof query !== "string" || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "query (string) and items (array) required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!query.trim()) {
      return new Response(JSON.stringify({ ids: items.map((i: any) => i.id) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const catalog = items.map((i: any) => ({
      id: i.id,
      caption: i.caption ?? "",
      tags: i.tags ?? [],
    }));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a semantic search engine for a women-only social app called Femmly. Given a user's natural-language query and a catalog of posts (with id, caption, tags), pick the IDs that best match the user's intent. Understand synonyms, mood, and topic. Return only ids, sorted by relevance (best first). If nothing matches, return an empty array.",
          },
          {
            role: "user",
            content: `Query: "${query}"\n\nCatalog:\n${JSON.stringify(catalog)}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_results",
              description: "Return matching post ids ranked by relevance.",
              parameters: {
                type: "object",
                properties: {
                  ids: { type: "array", items: { type: "string" } },
                },
                required: ["ids"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_results" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit, try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await response.text();
      console.error("smart-search gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    let ids: string[] = [];
    try {
      const args = JSON.parse(call?.function?.arguments ?? "{}");
      if (Array.isArray(args.ids)) ids = args.ids.filter((x: unknown) => typeof x === "string");
    } catch {
      ids = [];
    }

    return new Response(JSON.stringify({ ids }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("smart-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});