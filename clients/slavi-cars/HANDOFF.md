# Slavi Cars — Дупница

Status: **implemented-unverified**. All three independent application sources are implemented: Auto Best, full-workspace Modern and Carwow. Owner review remains pending.

Демо селекция от обяви на Slavi Cars към 09.09.2026 г. Наличността и условията се потвърждават с продавача. Не е жив каталог.

Published contact: 0895 714 484; път E79, след отбивката за Блатино, Дупница. Email: slavicars@abv.bg. Source: https://slavicars.mobile.bg/

Сайтът и Mobile.bg публикуват различни часове; преди посещение уточнете по телефона.

This dealer has a functioning independent website. This is an alternative three-design comparison, not a claim that its website is absent or broken.

The Passat was excluded because the owned site reports 218000 km while Mobile.bg reports 216000 km. Hours also differ by source; the demo asks the viewer to confirm the appointment time.

The owned services page describes finance assistance, not direct own leasing. No provider approval or independently verified condition/history is promised.

No fake customer reviews, employee biographies, approval guarantees or successful demo delivery. Source prices, local photos and gallery/detail/search consumers use the same eight records. No external publication, outreach, private CRM read or database migration.

Read REVIEW.md and HANDOFF.md for actual checks and launch guidance.

# Slavi Cars review

Status: implemented-unverified. Owner manual review: pending.

## Suggested entries after coordinator integration

Auto Best: J:/cars/clients/slavi-cars/auto-best — http://127.0.0.1:6631/
Modern: J:/cars/clients/slavi-cars/modern, start apps/web — http://127.0.0.1:6632/cars
Carwow: J:/cars/clients/slavi-cars/carwow — http://127.0.0.1:6633/

These are proposed local URLs, not running servers. Ports were not started or stopped by this worker. The coordinator launcher verifies listener ownership and port availability. Preserve dirty local client files when integrating the branch.

From J:/cars after safe scoped integration:

```powershell
./scripts/start-client.ps1 -Client slavi-cars -Prepare
./scripts/start-client.ps1 -Client slavi-cars
```

Auto Best: Node 22.12+ in Node 22; npm ci; npm run validate. Modern: Node >=22.22 <23, pnpm 11.4.0; pnpm install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck. Keep the full workspace. Carwow: Node 24; npm ci; npm run check; npm run build. Do not run migrations or reuse inherited fixed-port wrappers.

## Routes and owner review

Auto Best: /, /listing-grid, /listing-detail-v1/1, /about-us, /contact?vehicle=1, /blog.
Modern: /cars, /bg/cars, /bg/listing/chevrolet-trax-1-6-846700, /bg/contact, /bg/imports, /bg/lease, /bg/legal/privacy.
Carwow: /, /inventory, /inventory/chevrolet-trax-1-6-846700, /about/slavi-cars, /contact, /team, /reviews, /terms.

Review 390 and 1440 px, plus logo/header at 320 px: real images, gallery selection, list-back state, make and price filters/reset, menu/Escape/focus, source prices, overflow, console and selected-vehicle enquiry context. Do not submit external messages.

## Executed and missing evidence

In-memory Svelte server compilation: 53 Auto Best and 321 Carwow files, zero errors; unused-CSS warnings retained. TypeScript syntax: 22/877/189 files, zero errors. Targeted semantic typechecks of Auto Best inventory/listing/brand and Carwow inventory/home modules passed. These are not full application typechecks or production builds.

Actual data modules executed with eight matching prices, mileage values, four photographs per car, source/slug lookup and price/filter checks. Thirty-eight binary assets per app are hashed. See checks/source-verification.json.

Not run: lockfile installation, Prisma generation, full framework checks/builds, rendered app/browser review or viewport screenshots. No inherited QA flags were kept. The original logo/source imagery was inspected as branding evidence, not a UI acceptance test.

No right-side design FAB or shared-origin mounting is included; those belong to the coordinator publishing pass.

## Lineage

Main source base faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca.
- auto-best 2026.09.08-polish-1; 97833980ab127f6de8f675ac1a188e4b7f717976
- modern 2026.09.06-refresh-1; 66bfb8196bbce18832ada6b34b02dda97baba25b
- carwow 2026.09.08-repair-1; d4a08817e87cf84d08c4db1c08a515937245f2dd

Full retained master files were materialized as independent Git paths; explicitly authored client-local data and consumer fixes were applied. No shared source checkout was written. Auto Best uses brand.ts/inventory.ts/listing.ts and native gallery/company/layout consumers. Modern uses lead-site.ts, marketplace-domain/testing/mock-data.ts and native public/marketplace-ui consumers. Carwow uses daynight-current-inventory.ts/daynight-vehicles.ts, fallback inventory/home selectors and native company/contact/review/metadata consumers. All critical logos and inventory imagery are bundled in each public/static dealer/ directory.

Historical raw reference HTML remains unrouted under the retained empty raw-route allowlist. Generic illustrations are not represented as current stock, employees or showroom photography. Actual data is a dated advertisement sample. No new media licence or dealer approval is asserted.
