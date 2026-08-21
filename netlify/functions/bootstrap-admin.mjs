// netlify/functions/bootstrap-admin.mjs
//
// One-time setup function that creates the Supabase admin auth user
// using the service_role key (kept server-side, never exposed to the browser).
//
// Required Netlify env vars:
//   SUPABASE_URL         — project URL
//   SUPABASE_SERVICE_ROLE — service role key (server only, NEVER in browser)
//
// Invoke once after deploy, e.g.:
//   curl -X POST https://YOUR_SITE/.netlify/functions/bootstrap-admin \
//        -H "Content-Type: application/json" \
//        -d '{"email":"admin@portfolio.local","password":"zh82864@me"}'
//
// If email/password are omitted, defaults are used.

const DEFAULT_EMAIL = "admin@portfolio.local";
const DEFAULT_PASSWORD = "zh82864@me";

export default async (req) => {
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = Netlify.env.get("SUPABASE_URL");
  const serviceKey = Netlify.env.get("SUPABASE_SERVICE_ROLE");

  if (!url || !serviceKey) {
    return Response.json(
      { ok: false, error: "SUPABASE_URL and SUPABASE_SERVICE_ROLE env vars are required." },
      { status: 500 }
    );
  }

  let email = DEFAULT_EMAIL;
  let password = DEFAULT_PASSWORD;
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.email) email = String(body.email);
      if (body.password) password = String(body.password);
    } catch {
      // ignore parse errors, use defaults
    }
  }

  try {
    // Use the Supabase Auth Admin API to create a confirmed user.
    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // User already exists -> that's fine, idempotent.
      const exists =
        data?.msg?.includes("already been registered") ||
        data?.code === "email_exists" ||
        data?.message?.toLowerCase().includes("already");
      if (exists) {
        return Response.json({ ok: true, message: "Admin user already exists." });
      }
      return Response.json({ ok: false, error: data }, { status: 400 });
    }

    return Response.json({
      ok: true,
      message: "Admin user created.",
      email,
    });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
};
