import fs from "fs";
import crypto from "crypto";

const registryPath = "./data/serial-registry.json";

// Read and hash the file
const data = fs.readFileSync(registryPath);
const hash = crypto.createHash("sha256").update(data).digest("hex");

// Load, update, and write
const json = JSON.parse(data);
json.registry.checksum = hash;
json.registry.generated = new Date().toISOString();

fs.writeFileSync(registryPath, JSON.stringify(json, null, 2));
console.log("✅ Registry checksum updated:", hash);
