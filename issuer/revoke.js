// QRTP-4 Revoke Script
// Usage: node revoke.js <pid>

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const REGISTRY_PATH = path.join(ROOT, "..", "verifier", "registry.json");

function readJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Registry not found:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

const [,, pid, action = "revoke"] = process.argv;

if (!pid) {
  console.log("Usage:");
  console.log("  node revoke.js <pid>          - revoke passport");
  console.log("  node revoke.js <pid> suspend  - suspend passport");
  console.log("  node revoke.js <pid> reinstate - reinstate passport");
  process.exit(1);
}

const registry = readJson(REGISTRY_PATH);

if (!registry[pid]) {
  console.error("PID not found in registry:", pid);
  process.exit(1);
}

const oldStatus = registry[pid].status;

switch (action) {
  case "revoke":
    registry[pid].status = "revoked";
    break;
  case "suspend":
    registry[pid].status = "suspended";
    break;
  case "reinstate":
    registry[pid].status = "issued";
    break;
  default:
    console.error("Unknown action:", action);
    process.exit(1);
}

writeJson(REGISTRY_PATH, registry);

console.log(`Passport ${pid}`);
console.log(`Status: ${oldStatus} -> ${registry[pid].status}`);
