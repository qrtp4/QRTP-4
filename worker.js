/**
 * QRTP-4 Issuer — Cloudflare Worker
 * Signs QR passports with Ed25519
 */

import nacl from "tweetnacl";

function canonicalize(obj){
  if(obj === null || typeof obj !== "object") return obj;
  if(Array.isArray(obj)) return obj.map(canonicalize);
  const out = {};
  Object.keys(obj).sort().forEach(k => out[k] = canonicalize(obj[k]));
  return out;
}

export default {
  async fetch(req, env){
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle preflight
    if(req.method === "OPTIONS"){
      return new Response(null, { headers: corsHeaders });
    }

    if(req.method !== "POST"){
      return new Response("POST only", { status: 405, headers: corsHeaders });
    }

    const now = Math.floor(Date.now()/1000);
    const body = await req.json().catch(()=>({}));

    const passport = {
      v: "1.0",
      iss: "QRTP-4",
      kid: env.KID || "main-2026",
      pid: crypto.randomUUID(),
      iat: now,
      exp: now + (body.ttl || 180),
      nonce: crypto.randomUUID().slice(0,12),
      data: body.data || {}
    };

    // Sign with Ed25519
    const sk = Uint8Array.from(atob(env.PRIVATE_KEY), c=>c.charCodeAt(0));
    const msg = new TextEncoder().encode(JSON.stringify(canonicalize(passport)));
    const sig = nacl.sign.detached(msg, sk);
    passport.sig = btoa(String.fromCharCode(...sig));

    return new Response(JSON.stringify(passport), {
      headers: { 
        "content-type": "application/json",
        ...corsHeaders
      }
    });
  }
};
