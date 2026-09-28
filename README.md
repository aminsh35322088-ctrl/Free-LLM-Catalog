# Free LLM Catalog

A machine-readable catalog of LLM routes that can be used **without user-supplied credentials, account login, billing, or credits**.

## Admission policy

A provider is admitted only when the usable path does not require an API key, OAuth/login, user cookie/session, payment method, or trial credits. Public anonymous constants (for example AI Horde's documented `0000000000`) and non-secret placeholder strings required by an SDK are represented explicitly and are never treated as user credentials.

Entries are split by integration mode:

- `direct-openai`: safe for automatic OpenAI-compatible injection.
- `self-hosted-bridge` / `specialized-web` / `browser-websocket`: credentialless upstream, but needs a dedicated adapter.
- `opencode-client-contract`: already native to OpenCode and should not be duplicated as a generic provider.

The catalog intentionally keeps rejected candidates with a reason so they are not accidentally re-added later.

## Current sources

The initial catalog migrates the useful provider data from `opencode-telegram-core#6` (Kilo + OVH) and adds independently checked sources including Godde3s/gemini-free-api, UncloseAI, AI Horde, Duck.ai and selected OmniRoute no-auth transports.

`catalog.json` is the runtime artifact. `schema/catalog.schema.json` defines the contract consumed by OpenCode Telegram Bot.

## Bot contract

OpenCode Telegram Bot must only auto-inject entries where all of the following are true:

1. `status === "verified"`
2. `integration === "direct-openai"`
3. `enabledByDefault === true`
4. `auth.userCredentialRequired === false`

Everything else stays visible to catalog tooling but cannot silently become an OpenCode provider.

## Security

Do not add scraped account tokens, hidden cookies, OAuth refresh tokens, borrowed keys, or credentials generated from another user's session. No secret belongs in this repository.
