// data/validate-serial.js
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { serial } = req.body;
    if (!serial) {
      return res.status(400).json({ error: "Missing serial" });
    }

    // Read the registry file
    const registryPath = path.join(process.cwd(), "data", "serial-registry.json");
    const registryData = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

    // Find the serial in the registry
    const product = registryData.products[serial];

    if (!product) {
      return res.status(404).json({ valid: false, message: "Invalid serial" });
    }

    // Return details if valid
    return res.status(200).json({
      valid: true,
      message: "Serial verified",
      productId: product.productId,
      name: product.name,
      category: product.category,
      status: product.status
    });

  } catch (err) {
    console.error("Serial validation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
