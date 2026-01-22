import fs from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-json.js <file.json>");
  process.exit(1);
}

try {
  const txt = fs.readFileSync(file, "utf-8");
  JSON.parse(txt);
  console.log(`✅ JSON valid: ${file}`);
} catch (e) {
  console.error(`❌ Invalid JSON: ${file}`);
  console.error(e.message);
  process.exit(1);
}
