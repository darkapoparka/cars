# ЕКСТРА КАР-СМ — coordinator review

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

Once integrated into the coordinator checkout, `./scripts/start-client.ps1 -Client extra-car-sm -Prepare` and `./scripts/start-client.ps1 -Client extra-car-sm` use the repository launcher. These commands have **not** been run here.

## Required remaining review

Complete authorized local real-photo galleries and final source-based branding first. Review the full supporting-page content and every reachable retained route; false delivery must remain impossible. Compare against the recorded masters at 390 and 1440 px, plus 320 px header checks. Test catalogue/search/reset, one real detail, gallery, contact, navigation dismissal/focus, back-state and enquiry destination without sending anything. All browser/runtime/owner acceptance flags remain false.
