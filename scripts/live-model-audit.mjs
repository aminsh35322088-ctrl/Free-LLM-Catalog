export function auditModelRows(provider, rows) {
  const byId = new Map(rows.filter((row) => typeof row?.id === "string").map((row) => [row.id, row]));
  const missing = provider.models.filter((model) => !byId.has(model.id)).map((model) => model.id);
  const issues = missing.length ? [`missing upstream: ${missing.join(", ")}`] : [];
  if (provider.discovery?.kind === "kilo-free") {
    const notFree = provider.models.filter((model) => byId.has(model.id) && byId.get(model.id).isFree !== true).map((model) => model.id);
    if (notFree.length) issues.push(`no longer free: ${notFree.join(", ")}`);
  }
  return issues;
}
