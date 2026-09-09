# Plus Auto — coordinator review

Status: implemented-unverified. Three independent master applications; no iframe, deployment, live feed or public-origin switcher was added.

## Exact proposed local entries

Ports are proposals, not checked listeners. Confirm ownership and availability before launch.

| Design | Folder | Entry | Example detail |
|---|---|---|---|
| Auto Best | auto-best | http://127.0.0.1:6631/ | http://127.0.0.1:6631/listing-detail-v1/1 |
| Modern | modern/apps/web | http://127.0.0.1:6632/cars | http://127.0.0.1:6632/bg/listing/mercedes-benz-gle-coup-542818 |
| Carwow | carwow | http://127.0.0.1:6633/ | http://127.0.0.1:6633/inventory/mercedes-benz-gle-coup-amg-542818 |

## Install and check

Use the existing coordinator workspace only after scoped branch review and integration; do not reset unrelated dirty files.

Auto Best: Node 22.12+ in the 22 line; from auto-best run npm ci, then npm run validate.

Modern: Node >=22.22.0 <23 and pnpm 11.4.0; from the complete modern workspace run pnpm install --frozen-lockfile, pnpm --filter @repo/database build, pnpm --filter web typecheck and pnpm --filter web build. Prisma generation is local only; no database/migration is needed for existing static demo mode. For local review set SKIP_ENV_VALIDATION=true, AUTOMARKET_PUBLIC_DATA_MODE=demo, NEXT_PUBLIC_WEB_URL=http://127.0.0.1:6632, NEXT_PUBLIC_API_URL=http://127.0.0.1:6636, NEXT_PUBLIC_APP_URL=http://127.0.0.1:6637. The origins are configuration suggestions, not running services.

Carwow: Node 24; from carwow run npm ci, npm run check and npm run build.

From J:/cars after coordinator integration: ./scripts/start-client.ps1 -Client plus-auto-ruse -Prepare; then ./scripts/start-client.ps1 -Client plus-auto-ruse. The existing launcher checks ports; do not use inherited fixed-port wrappers or run Next build and dev together.

## Review matrix — NOT EXECUTED

At 390 and 1440 px for all three designs: entry, inventory, matching detail/gallery, contact, filters/reset/back state, menu Escape/focus return, image loads, horizontal overflow and browser console. At 320 px check complete logo/header controls. No full application browser review, dependency install, framework check or build ran in this session.

## Source checks actually executed

See source-checks.json. Pinned Svelte compilers parsed changed components, TypeScript parsed changed TS/TSX, and transpiled data adapters were executed in memory to compare vehicle IDs, prices, galleries and bundled image bytes across the trio. These are source/model checks, NOT framework typechecks or application browser tests.

## Boundaries

Demo enquiry delivery is explicitly unavailable; do not send real messages. Published stock is a dated sample and must be confirmed. Original dealer media is locally bundled with ASSETS.json provenance; commercial reuse/dealer approval remains unconfirmed. Exact source facts, caveats and dates are in SOURCE_PACK.json. Owner acceptance remains pending.
