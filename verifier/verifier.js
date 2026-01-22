// QRTP-4 Verifier v0.1 (MVP)
const $ = (id) => document.getElementById(id);

let issuers = {};
let registry = {};

function b64urlToBytes(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToUtf8(bytes) {
  return new TextDecoder().decode(bytes);
}

async function loadData() {
  issuers = await (await fetch("./issuers.json", { cache: "no-store" })).json();
  registry = await (await fetch("./registry.json", { cache: "no-store" })).json();
}

function render(html) {
  $("result").innerHTML = html;
}

function okBadge(txt) { return `<span class="ok">OK ${txt}</span>`; }
function warnBadge(txt) { return `<span class="ok">WARN ${txt}</span>`; }
function badBadge(txt) { return `<span class="ok">FAIL ${txt}</span>`; }

function verifyEnvelope(envelope) {
  if (!envelope || envelope.t !== "QRTP4" || envelope.v !== "0.1") {
    return { ok: false, reason: "Invalid envelope format" };
  }
  if (typeof envelope.p !== "string" || typeof envelope.s !== "string") {
    return { ok: false, reason: "Missing payload/signature" };
  }
  const payloadBytes = b64urlToBytes(envelope.p);
  const sigBytes = b64urlToBytes(envelope.s);
  const payloadJson = bytesToUtf8(payloadBytes);
  let payload;
  try { payload = JSON.parse(payloadJson); }
  catch { return { ok: false, reason: "Payload is not valid JSON" }; }
  if (payload.v !== "0.1" || !payload.pid || !payload.iss || !payload.ref || !payload.typ) {
    return { ok: false, reason: "Payload missing required fields" };
  }
  const pubB64u = issuers[payload.iss];
  if (!pubB64u) return { ok: false, reason: `Unknown issuer: ${payload.iss}` };
  const pubKey = b64urlToBytes(pubB64u);
  const sigOk = nacl.sign.detached.verify(payloadBytes, sigBytes, pubKey);
  return { ok: sigOk, reason: sigOk ? "Signature valid" : "Signature invalid", payload };
}

function registryStatus(pid) {
  const item = registry[pid];
  if (!item) return { exists: false, status: "unknown" };
  return { exists: true, ...item };
}

async function main() {
  await loadData();
  render(`<div>${warnBadge("Ready")}<div class="small">Registry loaded. Paste QR content.</div></div>`);

  $("loadBtn").onclick = async () => {
    await loadData();
    render(`<div>${okBadge("Registry reloaded")}</div>`);
  };

  $("verifyBtn").onclick = async () => {
    const raw = $("qr").value.trim();
    if (!raw) return render(badBadge("Paste QR content first"));
    let env;
    try { env = JSON.parse(raw); }
    catch { return render(badBadge("QR content must be JSON envelope")); }
    const v = verifyEnvelope(env);
    if (!v.ok) return render(`<div>${badBadge(v.reason)}</div>`);
    const st = registryStatus(v.payload.pid);
    let top;
    if (!st.exists) top = warnBadge("Signature OK, but PID not found in registry");
    else if (st.status === "issued") top = okBadge("Verified (issued)");
    else top = badBadge(`Not valid: ${st.status}`);
    render(`
      <div>${top}</div>
      <div class="small">${okBadge("Signature valid")}</div>
      <hr/>
      <div><b>PID:</b> <code>${v.payload.pid}</code></div>
      <div><b>Issuer:</b> <code>${v.payload.iss}</code></div>
      <div><b>Type:</b> <code>${v.payload.typ}</code></div>
      <div><b>Ref:</b> <code>${v.payload.ref}</code></div>
      <div><b>Status:</b> <code>${st.exists ? st.status : "unknown"}</code></div>
    `);
  };
}

main();
