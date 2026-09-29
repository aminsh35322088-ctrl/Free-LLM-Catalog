# Free LLM Catalog

A machine-readable catalog of LLM routes that can be used **without user-supplied credentials, account login, billing, or credits**.

## Admission policy

Every provider in this catalog must be usable without sending any API key, bearer token, static placeholder, user cookie, or login. A provider is auto-injected only when all of these are true:

1. `status === "verified"`
2. `integration === "direct-openai"`
3. `enabledByDefault === true`
4. `auth.mode === "none"`
5. `auth.userCredentialRequired === false`

That means the bot sends **no API key, OAuth token, account cookie, public anonymous token, or synthetic placeholder** for auto-injected providers.

Sources requiring even a public anonymous API key or placeholder are recorded only in `rejected`, not `providers`.

## Current automatic providers

- **Kilo Gateway (Anonymous)** — official docs explicitly allow unauthenticated access to free models.


The complete Kilo + OVH fallback model set from `opencode-telegram-core#6` is preserved here, so the Core patch is no longer the source of truth.

OVHcloud documents anonymous requests, but three cookie-free, key-free inference probes returned HTTP 429 from this egress on 2026-09-29. It is retained as a disabled candidate until generation succeeds from the bot's Railway egress.

## Adapter/research entries

- **Gemini Web Guest Bridge** from `Godde3s/gemini-free-api`: guest mode needs no Google account/cookie, but it needs a local bridge process, so it is not generic auto-injection.
- Duck.ai and Cloudflare Playground remain research entries requiring a transport adapter; their presence does **not** mean the Telegram bot auto-enables them.
- Gemini guest access is documented by its bridge author, but guest model availability is narrower than account access. Its listed models are candidates pending a cookie-free, model-specific inference probe.
- `diegosouzapw/OmniRoute` is used as a research index only; OmniRoute itself is not a catalog provider.

## Runtime artifact

`catalog.json` is the source artifact consumed by OpenCode Telegram Bot. `schema/catalog.schema.json` documents the contract.

The bot fetches this public catalog without a GitHub token and stores a last-known-good cache.

## Security rule

Never add scraped account tokens, hidden cookies, OAuth refresh tokens, borrowed API keys, public anonymous keys, Authorization placeholders, generated session credentials, payment-dependent trials, or credit-backed routes.

## Verification and freshness

Run `npm test && npm run validate && npm run verify:live` before publishing changes. The live verifier fails when an enabled model is absent from its upstream models endpoint or Kilo no longer marks it free. A successful models listing is **not** proof that chat inference works anonymously; test generation without Authorization and cookies on the actual bot egress before declaring a model verified. Network timeouts are inconclusive and do not justify a verified claim.

Polling the public JSON file only detects repository changes. The repository has no scheduled updater, so upstream model additions/removals are **not** automatically published here. Runtime discovery and fail-closed inference probes are still needed for a truly live catalog.

## Public live registry

The catalog is intentionally public and can be consumed without GitHub authentication:

`https://raw.githubusercontent.com/aminsh35322088-ctrl/Free-LLM-Catalog/main/catalog.json`

Consumers should poll conditionally with `ETag` / `If-None-Match`, validate `schemaVersion` and provider admission rules before applying an update, and retain a last-known-good snapshot when the network or a newer catalog is invalid.

OpenCode Telegram Bot polls this public registry every five minutes. Catalog changes refresh its managed OpenCode config without requiring a bot deployment or a GitHub credential.
