import fs from "node:fs/promises";

const catalog = JSON.parse(await fs.readFile(new URL("../catalog.json", import.meta.url), "utf8"));
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.providers)) throw new Error("Invalid catalog root");

const seen = new Set();
let injectable = 0;
for (const provider of catalog.providers) {
  if (!provider || typeof provider !== "object") throw new Error("Provider must be an object");
  if (typeof provider.id !== "string" || !provider.id) throw new Error("Provider id is required");
  if (seen.has(provider.id)) throw new Error(`Duplicate provider id: ${provider.id}`);
  seen.add(provider.id);
  if (!Array.isArray(provider.models)) throw new Error(`${provider.id}: models must be an array`);
  if (!provider.auth || provider.auth.mode !== "none" || provider.auth.userCredentialRequired !== false || provider.auth.value !== undefined) {
    throw new Error(`${provider.id}: catalog providers must require no credentials or placeholder values`);
  }

  const ids = new Set();
  for (const model of provider.models) {
    if (!model || typeof model.id !== "string" || !model.id.trim()) throw new Error(`${provider.id}: invalid model id`);
    if (ids.has(model.id)) throw new Error(`${provider.id}: duplicate model ${model.id}`);
    ids.add(model.id);
  }

  if (provider.enabledByDefault === true) {
    injectable += 1;
    if (provider.status !== "verified") throw new Error(`${provider.id}: enabled provider must be verified`);
    if (provider.integration !== "direct-openai") throw new Error(`${provider.id}: enabled provider must be direct-openai`);
    if (provider.auth.mode !== "none") throw new Error(`${provider.id}: enabled provider must be literal no-auth`);
    if (typeof provider.baseURL !== "string" || !provider.baseURL.startsWith("https://")) throw new Error(`${provider.id}: enabled provider requires HTTPS baseURL`);
    if (provider.models.length === 0) throw new Error(`${provider.id}: enabled provider requires fallback models`);
  }
}
console.log(`Validated ${catalog.providers.length} providers; ${injectable} strict zero-auth providers enabled by default.`);
