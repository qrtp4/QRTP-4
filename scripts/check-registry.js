import fs from "fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/check-registry.js <registry.json>");
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(file, "utf-8"));
const pids = Object.keys(registry);

if (pids.length === 0) {
  console.error("❌ registry.json is empty. Issue at least one passport and commit registry.");
  process.exit(1);
}

// Find at least one issued entry
const issued = pids.map(pid => registry[pid]).find(x => x && x.status === "issued" && x.pid);
if (!issued) {
  console.error("❌ registry.json has no 'issued' passports.");
  process.exit(1);
}

console.log(`✅ registry.json OK (entries: ${pids.length}, sample issued pid: ${issued.pid})`);
