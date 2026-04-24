import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const accounts = [
      {
        email: "admin@femmly.app",
        password: "FemmlyAdmin@2026",
        full_name: "Femmly Admin",
        is_admin: true,
        is_verified: true,
      },
      {
        email: "testgirl@femmly.app",
        password: "Femmly@2026",
        full_name: "Test User",
        is_admin: false,
        is_verified: true,
      },
    ];

    const results: any[] = [];

    for (const acc of accounts) {
      // Check if user already exists
      const { data: list } = await supabase.auth.admin.listUsers();
      let user = list?.users?.find((u) => u.email === acc.email);

      if (!user) {
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: acc.email,
          password: acc.password,
          email_confirm: true,
          user_metadata: { full_name: acc.full_name },
        });
        if (createErr) {
          results.push({ email: acc.email, error: createErr.message });
          continue;
        }
        user = created.user!;
      } else {
        // Reset password to known value
        await supabase.auth.admin.updateUserById(user.id, {
          password: acc.password,
          email_confirm: true,
        });
      }

      // Ensure profile exists & verified
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: acc.full_name,
        is_verified: acc.is_verified,
      });

      // Ensure role
      if (acc.is_admin) {
        const { data: existingRoles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");
        if (!existingRoles || existingRoles.length === 0) {
          await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
        }
      }

      results.push({
        email: acc.email,
        password: acc.password,
        user_id: user.id,
        is_admin: acc.is_admin,
        is_verified: acc.is_verified,
        status: "ready",
      });
    }

    return new Response(JSON.stringify({ success: true, accounts: results }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});