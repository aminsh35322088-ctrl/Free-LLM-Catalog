import fs from "node:fs/promises";
import { auditModelRows } from "./live-model-audit.mjs";

const catalog = JSON.parse(await fs.readFile(new URL("../catalog.json", import.meta.url), "utf8"));
const providers = catalog.providers.filter((p) => p.status === "verified" && p.integration === "direct-openai" && p.enabledByDefault === true && p.auth?.mode === "none");

let failures = 0;
for (const provider of providers) {
  if (!provider.modelsURL) continue;
  try {
    const response = await fetch(provider.modelsURL, {
      headers: { Accept: "application/json", "User-Agent": "Free-LLM-Catalog/live-verifier" },
      signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];
    if (!rows.length) throw new Error("models endpoint returned no usable model rows");
    const issues = auditModelRows(provider, rows);
    if (issues.length) throw new Error(issues.join("; "));
    console.log(`${provider.id}: endpoint OK; models=${rows.length}; catalogMissing=0`);
  } catch (error) {
    failures += 1;
    console.error(`${provider.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failures) process.exitCode = 1;
