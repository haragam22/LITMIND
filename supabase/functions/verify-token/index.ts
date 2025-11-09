// supabase/functions/verify-token/index.ts
import { serve } from "std/server"; // supabase edge fn runtime (adjust if different)
import { createRemoteJWKSet, jwtVerify } from "jose";

const AUTH0_DOMAIN = Deno.env.get("AUTH0_DOMAIN") || "";
const AUTH0_AUDIENCE = Deno.env.get("AUTH0_AUDIENCE") || "";

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE) {
  console.error("Auth0 env not set");
}

const jwksUri = https://${AUTH0_DOMAIN}/.well-known/jwks.json;
const JWKS = createRemoteJWKSet(new URL(jwksUri));

serve(async (req) => {
  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 });

    const token = auth.split(" ")[1];

    // verify token signature and claims
    const { payload } = await jwtVerify(token, JWKS, {
      audience: AUTH0_AUDIENCE,
      issuer: https://${AUTH0_DOMAIN}/,
    });

    // success — payload contains claims
    return new Response(JSON.stringify({ ok: true, payload }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 401 });
  }
});