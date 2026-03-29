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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a gender verification AI for a women-only platform. Analyze the selfie image and determine if the person appears to be female. 
            
Respond ONLY with a JSON object (no markdown, no code fences):
{"gender": "female" or "male" or "unclear", "confidence": 0.0 to 1.0, "reason": "brief explanation"}

Be respectful and focus on visible facial features. If the image is unclear, blurry, not a face, or you cannot determine gender, set gender to "unclear" with low confidence.`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
              },
              {
                type: "text",
                text: "Analyze this selfie for gender verification."
              }
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

    const isApproved = result.gender === "female" && result.confidence >= 0.7;

    // Store the selfie in storage
    const selfieBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
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
      message: isApproved
        ? "Welcome to Femmly! Your identity has been verified."
        : result.gender === "male"
          ? "Femmly is a women-only platform. Your account will be reviewed."
          : "We couldn't verify your identity clearly. A manual review will be conducted.",
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
