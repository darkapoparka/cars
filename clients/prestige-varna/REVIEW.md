# Автосалон ПРЕСТИЖ — coordinator review

**In-progress source checkpoint, not ready to send.** No public deployment exists. The three applications retain their own runtimes and layouts; no iframe wrapper or shared-origin FAB is included.

## Proposed local entries

The coordinator must confirm ports are free. Nothing was started by this session.

| Design | Source | Proposed URL | Runtime |
|---|---|---|---|
| Auto Best | `auto-best` | http://127.0.0.1:6631/ | Node ^22.12.0, npm 10.9.8 |
| Modern | `modern`, start `modern/apps/web` | http://127.0.0.1:6632/cars | Node >=22.22.0 <23, pnpm 11.4.0 |
| Carwow | `carwow` | http://127.0.0.1:6633/ | Node 24.x |

## Install/check commands

Auto Best: from `auto-best`, `npm ci` then `npm run validate`.
Modern: from `modern`, `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck`, `pnpm --filter web build`. Prisma generation is local only; do not run migrations. For local static review set `SKIP_ENV_VALIDATION=true`, `AUTOMARKET_PUBLIC_DATA_MODE=demo` and distinct `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` origins as documented by the master. No API/private service is required for the static review.
Carwow: from `carwow`, `npm ci`, `npm run check`, `npm run build`. Avoid the inherited fixed-port dev wrapper.

The launcher reads `clients/index.json` and refuses unlisted slugs. That shared file is outside this branch write scope. During integration, the coordinator must synchronize the index (the existing `node scripts/index-clients.mjs` regenerates it and the project inventory; review those changes separately). Do not run the following commands before that integration step.

Once integrated and indexed in the coordinator checkout, `./scripts/start-client.ps1 -Client prestige-varna -Prepare` and `./scripts/start-client.ps1 -Client prestige-varna` use the repository launcher. These commands have **not** been run here.

## Required remaining review

Complete authorized local real-photo galleries and review the integrated outlined logo proposals first. Review the full supporting-page content and every reachable retained route; false delivery must remain impossible. Compare against the recorded masters at 390 and 1440 px, plus 320 px header checks. Test catalogue/search/reset, one real detail, gallery, contact, navigation dismissal/focus, back-state and enquiry destination without sending anything. All browser/runtime/owner acceptance flags remain false.

## Executed source-only verification

Source parsing, isolated catalogue execution and targeted data/config type checks pass. `VERIFICATION.json` records exact file sets, runtime/compiler versions and zero diagnostics. None is a full Svelte/Next build or browser test. All runtime and owner-review flags remain false.

## Supporting-content and favicon repair — 2026-09-09

This continuation replaces inherited editorial/service assertions through the actual Auto Best, Modern and Carwow data consumers, preserves article routes, connects contact addresses in both Modern languages, and replaces the root favicon ICO in each app with the existing dealer mark. Article illustrations use the already-local proposed-brand Open Graph image; they are not stock or premises photographs.

`CONTENT-VERIFICATION.json` records the exact input hashes and executed source checks. From this client folder, after the retained dependencies are installed, run `node scripts/check-editorial.mjs` to repeat the isolated checks. The recorded run used Node 24.18.0 and TypeScript 5.9.3 through an in-memory payload, not a Windows client checkout. The marketplace barrel was narrowed to the exact editorial export module for this isolated test; full package/React integration remains unverified.

No source prices, inventory records, template layouts, master files or shared launchers were changed. Real stock-photo/gallery integration, the rest of the supporting-page review, dependency installs, full framework builds and 320/390/1440 browser checks are still incomplete. Owner review remains pending. The earlier research-only state does not describe the existing application trees.
