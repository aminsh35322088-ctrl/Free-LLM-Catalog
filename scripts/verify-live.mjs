import fs from "node:fs/promises";

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
    const byId = new Map(rows.filter((row) => typeof row?.id === "string").map((row) => [row.id, row]));
    const missing = provider.models.filter((model) => !byId.has(model.id)).map((model) => model.id);
    if (provider.discovery?.kind === "kilo-free") {
      const noLongerFree = provider.models.filter((model) => byId.has(model.id) && byId.get(model.id)?.isFree !== true).map((model) => model.id);
      if (noLongerFree.length) throw new Error(`catalog models no longer marked free: ${noLongerFree.join(", ")}`);
    }
    console.log(`${provider.id}: endpoint OK; models=${rows.length}; catalogMissing=${missing.length}`);
    if (missing.length) console.log(`  missing upstream: ${missing.join(", ")}`);
  } catch (error) {
    failures += 1;
    console.error(`${provider.id}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failures) process.exitCode = 1;
