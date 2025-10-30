// data/validate-serial.js
import fs from "fs";
import path from "path";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serial } = req.body;
    if (!serial) {
      return res.status(400).json({ error: "Missing serial" });
    }

    // Locate and read registry file
    const registryPath = path.join(process.cwd(), "data", "serial-registry.json");
    const fileData = fs.readFileSync(registryPath, "utf-8");
    const registry = JSON.parse(fileData);

    // --- Step 1: Verify checksum integrity ---
    const calculatedHash = crypto.createHash("sha256").update(fileData).digest("hex");

    // Compare against stored checksum
    if (calculatedHash !== registry.registry.checksum) {
      console.warn("⚠️ Registry checksum mismatch detected!");
      return res.status(500).json({
        error: "Registry integrity check failed. Please update or restore the serial registry."
      });
    }

    // --- Step 2: Validate serial existence ---
    const product = registry.products[serial];
    if (!product) {
      return res.status(404).json({ valid: false, message: "Invalid serial" });
    }

    // --- Step 3: Return product details if valid ---
    return res.status(200).json({
      valid: true,
      message: "Serial verified",
      productId: product.productId,
      name: product.name,
      category: product.category,
      status: product.status,
      version: registry.registry.version,
      generated: registry.registry.generated
    });

  } catch (err) {
    console.error("Serial validation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
