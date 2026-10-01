# Import mobile listing and homepage details — 1 October 2026

Canonical source: `L:/CODEX/cars/templates/import`, Cars `main`. This follow-up refines the [earlier mobile card hierarchy](../mobile-card-hierarchy-2026-10-01/QA.md). It does not promote a template release or deploy dealer copies.

## Changes

- Inventory cards put transmission and compact mileage beside each other as matching badges. Year and fuel remain in the first row. Import recommendation cards retain year and photo-overlay mileage.
- Search, Filter and Sort have matching 44px control surfaces with 4px horizontal gaps. The gap between toolbar rows is 6px.
- Mobile homepage cards omit the redundant details button. Their image and title still open the vehicle; favorite and financing actions remain available.
- The homepage YouTube heading fits on one line at 320px with the configured brand name. A final horizontal card opens the existing configured channel.
- Homepage testimonials show `Клиент` / `Customer` beneath the name on mobile. Desktop retains the existing role text. No ratings were added because these source records do not contain ratings.

Dealer identity, contacts, inventory values, desktop composition and template/dealer release pins remain unchanged.

## Verification

Node `24.21.0`, retained npm lockfile. The task reused its independent temporary QA copy and dependencies, refreshed the complete working source, and verified 1,780 source/asset/configuration files byte for byte before adding this documentation receipt. SHA-256 manifest digest: `b88fd670189bda079ce64551d352e5aabc7471c0cf91c51e1be1af6e95acade4`. Dependencies, generated output, Git, environment files and local runtime evidence were excluded; retained `.template-ref` sources were included.

- `npm run check`: zero errors and warnings.
- Prettier and ESLint for all six changed Svelte files: passed. Scoped `git diff --check`: passed.
- `npm run test:unit -- --run`: 124 tests passed across 18 files.
- Frozen `npm run build`: passed with the Vercel adapter. Retained legacy `@reference` warnings and build-timing notices remain non-fatal.
- Dev-browser geometry and interaction checks: 18 passed on BG/EN home, inventory and import at 320/390px, including enlarged text at 320px, photo navigation/back and desktop preservation at 1440px. No clipped badges, horizontal overflow or page errors in the passing run.

- Frozen production preview: the same 18 geometry/interaction checks passed with no page errors. Every inventory card had transmission/mileage on one row with matching surfaces; there were no clipped badges. Mobile headings, testimonial labels, primary card links and the final YouTube card matched the intended behavior. Desktop retained three video cards and full testimonial roles.
- Focused Chromium suite: 12 passed, four viewport-specific skips, zero failures. `tests/inventory.e2e.ts` covers server rendering without JavaScript, filter URL preservation and detail return. Selected `tests/storefront-controls.e2e.ts` cases cover the locale-preserving inventory link, review avatars and article navigation. The three included `tests/mobile-final.e2e.ts` scans cover `/en`, `/en/inventory` and `/en/import` at 320px with zero detected WCAG-tagged violations.

An initial mutable-dev enlarged-text probe reported homepage overflow; the unchanged-source rerun and final frozen-build run passed. No application change or relaxed assertion was used for that rerun.

Final production captures: [inventory](inventory-320.png), [homepage cards](home-320.png), [YouTube heading](youtube-320.png), [channel card](channel-320.png) and [testimonials](reviews-320.png). [Layout measurements](layout.json) and [source manifest](source-manifest.json) preserve the evidence. The temporary production QA server was stopped after verification; the master dev preview remains on port 6790.

## Preservation and limits

The master preview stays on <http://127.0.0.1:6790/bg/inventory>. Other templates, dealer source and unrelated main changes were preserved. `workspace-doctor.mjs --fetch` confirmed current Cars tracking refs and identified the existing unrelated dirty checkouts.

The [earlier receipt](../mobile-card-hierarchy-2026-10-01/QA.md) records existing repository-wide formatting/lint gaps in preserved recovery artifacts. This scoped pass does not claim mounted `/variant-2`, physical devices, a public alias, real form delivery, an immutable template release or dealer rollout. Owner visual acceptance remains separate.

Automatic approval review previously rejected deletion of the verified temporary QA copy with `blocked by policy`. The task reused that retained directory rather than creating another copy: `L:/CODEX/cars/runtime/import-mobile-hierarchy-20261001/source`. It is QA output with no branch or worktree. Removal remains pending a permitted cleanup of that exact directory; the master and saved evidence must remain.
