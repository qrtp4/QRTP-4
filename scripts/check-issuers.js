import fs from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/check-issuers.js <issuers.json>");
  process.exit(1);
}

const issuers = JSON.parse(fs.readFileSync(file, "utf-8"));

// Require qrtp4 issuer key
const key = issuers["qrtp4"];
if (!key) {
  console.error("❌ issuers.json missing key for issuer 'qrtp4'");
  process.exit(1);
}

// Block placeholder
if (key === "REPLACE_AFTER_FIRST_ISSUE") {
  console.error("❌ issuers.json still contains placeholder for qrtp4");
  process.exit(1);
}

// Basic base64url-ish check (not perfect, but catches obvious bad values)
if (!/^[A-Za-z0-9_-]{40,}$/.test(key)) {
  console.error("❌ qrtp4 public key does not look like base64url (too short/invalid chars)");
  process.exit(1);
}

console.log("✅ issuers.json looks good (qrtp4 key present, non-placeholder)");
