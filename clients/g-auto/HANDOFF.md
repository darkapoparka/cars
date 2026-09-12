# G Auto handoff

Status: implemented-unverified. Owner review: pending. Independent sources live in auto-best/, modern/ and carwow/. This is branch-only delivery, not a public preview.

## Review entries after the coordinator integrates the owned paths

| Design | Physical folder | Suggested local entry |
| --- | --- | --- |
| Auto Best | J:/cars/clients/g-auto/auto-best | http://127.0.0.1:6631/ |
| Modern | J:/cars/clients/g-auto/modern (start apps/web) | http://127.0.0.1:6632/cars |
| Carwow | J:/cars/clients/g-auto/carwow | http://127.0.0.1:6633/ |

These URLs are proposed, not running listeners. Ports were not occupied or stopped by this worker. The coordinator launcher checks availability and ownership. Do not overwrite dirty local client paths or switch a shared checkout merely to inspect this branch.

From the coordinator Cars checkout after preserving local work and integrating the scoped client paths:

```powershell
./scripts/start-client.ps1 -Client g-auto -Prepare
./scripts/start-client.ps1 -Client g-auto
```

Individual setup from each retained lockfile: Auto Best, Node 22.12+ in Node 22: npm ci; npm run validate. Modern, Node >=22.22 <23 and pnpm 11.4.0: pnpm install --frozen-lockfile; pnpm --filter @repo/database build; pnpm --filter web typecheck. Retain the entire workspace. Carwow, Node 24: npm ci; npm run check; npm run build. Use start-client/start-preview rather than inherited fixed-port npm dev wrappers. No live database is required; do not run migrations.

## Real routes to review

Auto Best: /, /listing-grid, /listing-detail-v1/1, /about-us, /contact?vehicle=1, /blog. Modern: /cars, /bg/cars, /bg/listing/mercedes-benz-c-200-cabrio-506791, /bg/contact, /bg/imports, /bg/lease, /bg/legal/privacy. Carwow: /, /inventory, /inventory/mercedes-benz-c-200-cabrio-506791, /about/g-auto, /contact, /team, /reviews, /terms.

Check each at 390 and 1440 px; inspect header/logo at 320 px. Test gallery thumbnails, make/price filters and reset, back-to-list state, mobile drawer/Escape/focus return, real image loading, overflow, console, and selected-vehicle context. Do not submit a real enquiry.

## Executed evidence

- In-memory Svelte server compilation: Auto Best 53 files and Carwow 321 files, zero errors. Two and three unused-CSS warnings respectively. This is not a SvelteKit build or svelte-check.
- TypeScript/TSX transpile syntax: Auto Best 22, Modern 877 and Carwow 189 files, zero syntax diagnostics. This is not semantic typecheck.
- Executed source-module assertions: all eight prices, Carwow mileage parsing, four matched photos per car, slug lookup, Auto Best BMW filter (5), price filter (3999/6999/8999 EUR), Carwow budget counts, and Modern seller/media consistency passed.
- 38 binary files per design (32 photos plus brand/icons) have matching Git object hashes. Actual committed logo readback was visually inspected.

Not run: lockfile install, Prisma generation, full checks/typecheck/build, route browser review, 320/390/1440 screenshots or visual acceptance. No design FAB or shared-origin mounting is included; that remains the coordinator publishing pass.

## Content and limitations

The inventory is a dated seller-advertisement sample, not verified live stock. Unknown horsepower and door counts are not invented; sold/reserved and contradictory listings were excluded. Eight publication dates are taken from the source, separate from observation date.

Native reviews show an honest unavailable state; contact topics are not employee identities. G Auto has no verified social/video link in the supplied sources. Demo form delivery is disabled. Legacy raw HTML reference templates are retained as provenance but remain unrouted under the original empty raw-route allowlist; do not enable them as dealer pages. Unlinked inherited proposal/concept HTML exports were excluded.

Retained generic vehicle/service illustrations are illustrative, not dealer stock, staff or premises. Dealer media and prior-demo logos retain source provenance; no new dealer permission or official approval is asserted. Public publication requires the coordinator's rights and business review.


## Source lineage and active consumers

Published main base: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca. Initial application checkpoint: 5311c5e37a4fe324b57a01c22645cf023a709ffe. This follow-up extends the same branch non-force; no main/astra or shared files changed.

- auto-best 2026.09.08-polish-1, source tree 97833980ab127f6de8f675ac1a188e4b7f717976
- modern 2026.09.06-refresh-1, source tree 66bfb8196bbce18832ada6b34b02dda97baba25b
- carwow 2026.09.08-repair-1, source tree d4a08817e87cf84d08c4db1c08a515937245f2dd

Auto Best: src/lib/config/brand.ts, data/inventory.ts and listing.ts, native detail/gallery, home video state and layout/company consumers. Modern: packages/marketplace/lead-site.ts, packages/marketplace-domain/testing/mock-data.ts, marketplace-ui whole-logo consumers, native contact/supporting/metadata/legal pages. Carwow: src/lib/data/daynight-current-inventory.ts and daynight-vehicles.ts, actual/fallback inventory and home selectors, reviews/contact-topic data, native media/head/navigation, form clients and preview repository guard. All use the bundled dealer/ directory in each public/static root.

No Windows source checkout was written or used as a working tree. Read-only published-template bytes were locally SHA-verified; every change was made in memory and published through GitHub blob/tree/commit/ref APIs. No hidden job or website server was started.
