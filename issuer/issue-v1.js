#!/usr/bin/env node
// QRTP-4 v1.0 Issuer - Production Grade
// Uses canonical message format (pipe-separated)
// Generates QR with ECC=H, margin=6 (IRON RULE: NEVER TOUCH QR MATRIX)

import fs from "fs";
import path from "path";
import nacl from "tweetnacl";
import QRCode from "qrcode";
import { randomUUID } from "crypto";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const KEYS_PATH = path.join(ROOT, "keys.json");

fs.mkdirSync(OUT_DIR, { recursive: true });


// === STABLE STRINGIFY (deterministic key order) ===
function stableStringify(obj){
  if(obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if(Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map(k => JSON.stringify(k)+":"+stableStringify(obj[k])).join(",") + "}";
}

// === CANONICAL MESSAGE FORMAT ===
function canonicalMessage(envelope) {
  const { v, iss, kid, pid, iat, exp, nonce, data } = envelope;
  return `${v}|${iss}|${kid}|${pid}|${iat}|${exp}|${nonce}|${stableStringify(data || {})}`;
}

// === KEY MANAGEMENT ===
function b64(bytes) {
  return Buffer.from(bytes).toString("base64");
}

function loadOrCreateKeys() {
  if (fs.existsSync(KEYS_PATH)) {
    const raw = JSON.parse(fs.readFileSync(KEYS_PATH, "utf-8"));
    return {
      publicKey: Buffer.from(raw.publicKey, "base64"),
      secretKey: Buffer.from(raw.secretKey, "base64"),
    };
  }
  const kp = nacl.sign.keyPair();
  const obj = {
    publicKey: b64(kp.publicKey),
    secretKey: b64(kp.secretKey),
    note: "DO NOT COMMIT. Keep local only.",
  };
  fs.writeFileSync(KEYS_PATH, JSON.stringify(obj, null, 2));
  console.log("✅ New keypair generated:", KEYS_PATH);
  return kp;
}

// === MAIN ===
const [, , type, address, label] = process.argv;

if (!type || !address) {
  console.log("Usage: node issue-v1.js <type> <address> [label]");
  console.log("Example: node issue-v1.js wallet xrp:rW6mfR5R8PEqY6idUB2Hz7HgvhS72S96k 'XRP Primary'");
  process.exit(1);
}

const { secretKey } = loadOrCreateKeys();
const now = Math.floor(Date.now() / 1000);

const envelope = {
  v: "1.0",
  iss: "QRTP-4",
  kid: "prod-key-01",
  pid: `QRTP4-${randomUUID()}`,
  iat: now,
  exp: now + 600, // 10 min TTL
  nonce: randomUUID().slice(0, 12),
  data: { type, address, label: label || address },
};

const canonMsg = canonicalMessage(envelope);
const msg = new TextEncoder().encode(canonMsg);
const sig = nacl.sign.detached(msg, secretKey);

envelope.sig = b64(sig);

// === QR GENERATION (IRON RULE: ECC=H, margin=6) ===
const qrData = JSON.stringify(envelope);
const pngPath = path.join(OUT_DIR, `${envelope.pid}.png`);

await QRCode.toFile(pngPath, qrData, {
  errorCorrectionLevel: "H", // IRON RULE
  margin: 6, // IRON RULE
  scale: 8,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
});

// === OUTPUT ===
const outPath = path.join(OUT_DIR, `${envelope.pid}.json`);
fs.writeFileSync(outPath, JSON.stringify(envelope, null, 2));

console.log("✅ Passport issued");
console.log("PID:", envelope.pid);
console.log("PNG:", pngPath);
console.log("JSON:", outPath);
console.log("Canonical:", canonMsg);
