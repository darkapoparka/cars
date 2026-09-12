# FRESH MOTORS review

Status: implemented-unverified. Owner manual review: pending.

## Suggested entries after coordinator integration

Auto Best: J:/cars/clients/fresh-motors-sheremetya/auto-best — http://127.0.0.1:6631/
Modern: J:/cars/clients/fresh-motors-sheremetya/modern, start apps/web — http://127.0.0.1:6632/cars
Carwow: J:/cars/clients/fresh-motors-sheremetya/carwow — http://127.0.0.1:6633/

These are proposed local URLs, not running servers. Ports were not started or stopped by this worker. The coordinator launcher verifies listener ownership and port availability. Preserve dirty local client files when integrating the branch.

From J:/cars after safe scoped integration:

```powershell
./scripts/start-client.ps1 -Client fresh-motors-sheremetya -Prepare
./scripts/start-client.ps1 -Client fresh-motors-sheremetya
```

Auto Best: Node 22.12+ in Node 22; npm ci; npm run validate. Modern: Node >=22.22 <23, pnpm 11.4.0; pnpm install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck. Keep the full workspace. Carwow: Node 24; npm ci; npm run check; npm run build. Do not run migrations or reuse inherited fixed-port wrappers.

## Routes and owner review

Auto Best: /, /listing-grid, /listing-detail-v1/1, /about-us, /contact?vehicle=1, /blog.
Modern: /cars, /bg/cars, /bg/listing/hyundai-kona-64-kwh-204-hp-815752, /bg/contact, /bg/imports, /bg/lease, /bg/legal/privacy.
Carwow: /, /inventory, /inventory/hyundai-kona-64-kwh-204-hp-815752, /about/fresh-motors-sheremetya, /contact, /team, /reviews, /terms.

Review 390 and 1440 px, plus logo/header at 320 px: real images, gallery selection, list-back state, make and price filters/reset, menu/Escape/focus, source prices, overflow, console and selected-vehicle enquiry context. Do not submit external messages.

## Executed and missing evidence

In-memory Svelte server compilation: 53 Auto Best and 321 Carwow files, zero errors; unused-CSS warnings retained. TypeScript syntax: 22/877/189 files, zero errors. Targeted semantic typechecks of Auto Best inventory/listing/brand and Carwow inventory/home modules passed. These are not full application typechecks or production builds.

Actual data modules executed with eight matching prices, mileage values, four photographs per car, source/slug lookup and price/filter checks. Thirty-eight binary assets per app are hashed. See checks/source-verification.json.

Not run: lockfile installation, Prisma generation, full framework checks/builds, rendered app/browser review or viewport screenshots. No inherited QA flags were kept. The original logo/source imagery was inspected as branding evidence, not a UI acceptance test.

No right-side design FAB or shared-origin mounting is included; those belong to the coordinator publishing pass.
