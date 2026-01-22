import fs from "fs";
import path from "path";
import nacl from "tweetnacl";
import { ulid } from "ulid";
import QRCode from "qrcode";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
fs.mkdirSync(OUT_DIR, { recursive: true });

const ISSUER_ID = "qrtp4";
const KEYS_PATH = path.join(ROOT, "keys.json");
const REGISTRY_PATH = path.join(ROOT, "..", "verifier", "registry.json");
const ISSUERS_PATH = path.join(ROOT, "..", "verifier", "issuers.json");

function b64urlFromBytes(bytes) {
  return Buffer.from(bytes).toString("base64")
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function bytesFromB64url(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replaceAll("-", "+").replaceAll("_", "/") + pad;
  return new Uint8Array(Buffer.from(b64, "base64"));
}

function loadOrCreateKeys() {
  if (fs.existsSync(KEYS_PATH)) {
    const raw = JSON.parse(fs.readFileSync(KEYS_PATH, "utf-8"));
    return {
      publicKey: bytesFromB64url(raw.publicKey),
      secretKey: bytesFromB64url(raw.secretKey),
    };
  }
  const kp = nacl.sign.keyPair();
  const obj = {
    publicKey: b64urlFromBytes(kp.publicKey),
    secretKey: b64urlFromBytes(kp.secretKey),
    note: "DO NOT COMMIT THIS FILE. Keep it local only."
  };
  fs.writeFileSync(KEYS_PATH, JSON.stringify(obj, null, 2));
  return kp;
}

function canonicalPayload({ pid, typ, ref, meta = {}, exp = null }) {
  const now = Math.floor(Date.now() / 1000);
  return { v: "0.1", pid, typ, ref, iss: ISSUER_ID, iat: now, exp, meta };
}

function signPayload(payloadObj, secretKey) {
  const payloadJson = JSON.stringify(payloadObj);
  const payloadBytes = new TextEncoder().encode(payloadJson);
  const sigBytes = nacl.sign.detached(payloadBytes, secretKey);
  return {
    payloadJson,
    payloadB64u: b64urlFromBytes(payloadBytes),
    sigB64u: b64urlFromBytes(sigBytes),
  };
}

function readJsonOrDefault(p, def) {
  if (!fs.existsSync(p)) return def;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

const [,, typ, ref, label = "QRTP-4 Passport"] = process.argv;
if (!typ || !ref) {
  console.log("Usage: node issue.js <typ> <ref> [label]");
  process.exit(1);
}

const { publicKey, secretKey } = loadOrCreateKeys();
const pid = ulid();
const payloadObj = canonicalPayload({ pid, typ, ref, meta: { label } });
const { payloadJson, payloadB64u, sigB64u } = signPayload(payloadObj, secretKey);

const envelope = { t: "QRTP4", v: "0.1", p: payloadB64u, s: sigB64u };
// Encode envelope JSON to base64url token for URL hash (safe for all scanners)
const envelopeJson = JSON.stringify(envelope);
const envelopeToken = b64urlFromBytes(new TextEncoder().encode(envelopeJson));

// Public verify link (Pages)
const verifyUrl = `https://qrtp4.github.io/QRTP-4/#${envelopeToken}`;

// QR now contains universal verify link instead of raw JSON
const pngPath = path.join(OUT_DIR, `${pid}.png`);
await QRCode.toFile(pngPath, verifyUrl, { errorCorrectionLevel: "M", margin: 2, scale: 8 });

const issuers = readJsonOrDefault(ISSUERS_PATH, {});
issuers[ISSUER_ID] = b64urlFromBytes(publicKey);
writeJson(ISSUERS_PATH, issuers);

const registry = readJsonOrDefault(REGISTRY_PATH, {});
registry[pid] = { pid, status: "issued", iss: ISSUER_ID, iat: payloadObj.iat, typ, ref };
writeJson(REGISTRY_PATH, registry);

const out = { pid, envelope, verifyUrl };
const outPath = path.join(OUT_DIR, `${pid}.json`);
writeJson(outPath, out);

console.log("Issued passport:", pid);
console.log("PNG:", pngPath);
console.log("Envelope:", JSON.stringify(envelope));
