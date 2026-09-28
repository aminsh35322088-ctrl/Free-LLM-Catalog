# Free LLM Catalog

A machine-readable catalog of LLM routes that can be used **without user-supplied credentials, account login, billing, or credits**.

## Admission policy

The catalog can record several kinds of anonymous access, but **automatic OpenCode injection is intentionally stricter**. A provider is auto-injected only when all of these are true:

1. `status === "verified"`
2. `integration === "direct-openai"`
3. `enabledByDefault === true`
4. `auth.mode === "none"`
5. `auth.userCredentialRequired === false`

That means the bot sends **no API key, OAuth token, account cookie, public anonymous token, or synthetic placeholder** for auto-injected providers.

Public anonymous constants (for example AI Horde's documented `0000000000`) and non-secret placeholders may still be kept in the catalog for research or future explicit adapters, but they are never silently enabled.

## Current automatic providers

- **Kilo Gateway (Anonymous)** — official docs explicitly allow unauthenticated access to free models.
- **OVHcloud AI Endpoints (Anonymous)** — keyless anonymous lane on the Kepler OpenAI-compatible endpoint.

The complete Kilo + OVH fallback model set from `opencode-telegram-core#6` is preserved here, so the Core patch is no longer the source of truth.

## Adapter/research entries

- **Gemini Web Guest Bridge** from `Godde3s/gemini-free-api`: guest mode needs no Google account/cookie, but it needs a local bridge process, so it is not generic auto-injection.
- Duck.ai, Cloudflare Playground, AI Horde, UncloseAI and OpenCode-native free routes remain catalogued with explicit integration/auth semantics. Their presence does **not** mean the Telegram bot auto-enables them.
- `diegosouzapw/OmniRoute` is used as a research index only; OmniRoute itself is not a catalog provider.

## Runtime artifact

`catalog.json` is the source artifact consumed by OpenCode Telegram Bot. `schema/catalog.schema.json` documents the contract.

Because this repository is private, the bot reuses its existing GitHub integration token to fetch the catalog and stores a last-known-good cache. No provider credential is introduced by this connection.

## Security rule

Never add scraped account tokens, hidden cookies, OAuth refresh tokens, borrowed API keys, generated session credentials, payment-dependent trials, or credit-backed routes.

## Public live registry

The catalog is intentionally public and can be consumed without GitHub authentication:

`https://raw.githubusercontent.com/aminsh35322088-ctrl/Free-LLM-Catalog/main/catalog.json`

Consumers should poll conditionally with `ETag` / `If-None-Match`, validate `schemaVersion` and provider admission rules before applying an update, and retain a last-known-good snapshot when the network or a newer catalog is invalid.

OpenCode Telegram Bot polls this public registry every five minutes. Catalog changes refresh its managed OpenCode config without requiring a bot deployment or a GitHub credential.
