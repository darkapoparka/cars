# Day Night Auto Svelte

Production SvelteKit 2 / Svelte 5 implementation of the Day Night Auto storefront, inventory, vehicle detail pages, admin CMS, public lead intake, visitor chat, marketplace feeds, and owner handoff tooling.

The runtime source of truth is the native Svelte/Tailwind v4 storefront in `src/`, backed by Neon Postgres through Drizzle. The old Auxero/template material is historical reference only unless a route explicitly imports it; do not treat `.template-ref` as a launch dependency.

## Stack

- SvelteKit 2 with Svelte 5 runes mode.
- Tailwind CSS v4 via `@tailwindcss/vite`, with storefront tokens in `src/lib/styles/tokens.css` and Tailwind theme mappings in `src/lib/styles/storefront.css`.
- Vercel adapter for production, with adapter-node available for local production-like smoke.
- Neon Postgres, Drizzle ORM, Better Auth, Vitest, Playwright, and visual-regression screenshots.

## Developing

```sh
npm ci
npm run dev
```

The project expects Node 24 (`package.json` engines and `.nvmrc`).

## Production Environment

Vercel production must have these runtime env vars before deploy promotion:

- `DATABASE_URL`: pooled Neon runtime URL.
- `BETTER_AUTH_SECRET`: at least 32 characters.
- `CHAT_COOKIE_SECRET`: at least 32 characters.
- `DEFAULT_DEALER_SLUG`: `daynight-auto`.
- `BETTER_AUTH_URL`: exact production origin.
- `OPENAI_API_KEY`: optional; only needed when the admin assistant is enabled.

Use `DATABASE_URL_UNPOOLED` only for controlled operations such as migrations, seed, import/export, and admin linking. Do not store that direct URL as a general Vercel runtime variable.

## Data Operations

```sh
npm run db:migrate
npm run neon:seed
npm run neon:link-admin
npm run neon:export
```

The production storefront intentionally falls back to static inventory only when no database is configured. A configured database with zero published inventory should be treated as an operational data issue and caught by smoke tests.

## Verification

Run the local release gate before claiming a launch artifact is ready:

```sh
npm run check:backend-env
npm run check:schema-drift
npm run check
npm run lint
npm run test:unit -- --run
npm run build
npm run test:e2e
npm run visual:verify
npm run check:backend-secrets
```

For a production-like local backend smoke:

```sh
npm run build:preview-node
$env:BACKEND_SMOKE_BASE = "http://127.0.0.1:4399"
npm run smoke:backend
```

For live read-only smoke, set `BACKEND_SMOKE_BASE` to the production origin and `BACKEND_SMOKE_SKIP_PUBLIC_WRITES=1`. Credentialed admin and durable-write smoke require buyer-approved admin credentials.

## Visual Baselines

`npm run visual:verify` builds the current app and compares against committed screenshots under `tests/visual/__screenshots__/`.

When a visual change is intentional and reviewed:

```sh
npm run visual:baseline
npm run visual:verify
```

Baselines are platform-sensitive. The CI visual job runs on Windows to match the committed local baseline family.

## Route Hygiene

- Public launch routes include `/`, `/inventory`, `/inventory/map`, `/inventory/[slug]`, and the allow-listed support/content routes.
- `/home2` and `/home3` redirect to `/presentation/home2` and `/presentation/home3`.
- Presentation variants must stay `noindex,nofollow`, absent from the sitemap, and blocked in `robots.txt`.
- Admin routes must redirect unauthenticated visitors to `/admin/login`.

## Handoff Docs

- Production audit: `docs/production-audit/2026-06-21/`
- Launch runbook: `docs/production/launch-runbook.md`
- Maintenance runbook: `docs/production/maintenance-runbook.md`
- Production finalization plan: `docs/superpowers/plans/2026-06-21-daynight-production-finalization.md`
