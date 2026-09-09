# TROYA AUTO — local review

State: **implemented-unverified**. The three folders are independent Fast Skin copies of the published masters. No deployment exists.

## Auto Best
Path: `clients/troya-auto/auto-best`
Node 22; `npm ci`; `npm run validate`; then `npm run dev -- --host 127.0.0.1 --port 5173`.
Review entry: `/` · inventory: `/listing-grid`.

## Modern
Path: `clients/troya-auto/modern` (full workspace).
Node 22 / pnpm 11.4.0; `pnpm install --frozen-lockfile`; `pnpm --filter @repo/database build`; `pnpm --filter web typecheck`; `pnpm --filter web build`.
Use the retained static demo mode with no live DB or migrations. Review entry: `/cars`.

## Carwow
Path: `clients/troya-auto/carwow`
Node 24; `npm ci`; `npm run check`; `npm run build`; then `npm run dev -- --host 127.0.0.1 --port 5174`.
Review entry: `/` · inventory: `/inventory`.

The ports above are examples only; no server was started in this GitHub-only handoff. Branding, phone/address, cautious services, representative stock and inherited testimonial/staff/video cleanup are committed. Runtime/browser checks remain for the local coordinator.
