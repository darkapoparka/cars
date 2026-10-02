# Desktop hero family and inventory hierarchy

Verified locally on 2026-10-02 using Node 24.21.0. Source is the reusable Carwow master in `L:/CODEX/cars/templates/carwow` on Cars `main`.

## Result

`DesktopYellowRouteHero.svelte` owns one charcoal deck with white controls, yellow primary actions, a visible yellow keyboard outline and consistent panel spacing. Its 17 consumers no longer select conflicting light or compact variants. Standard decks use a 720px maximum width, 20px vertical / 24px horizontal padding and 12px corners. Blog retains a 1040px deck for its search and category/topic controls. The surrounding heroes remain 400px in the inspected route states, with the existing yellow background and artwork.

Action pairs share a centered row, a 12px gap and a 300px maximum width per action. Favorites uses those shared actions. About removes a second layer of padding and explicitly retains dark contact-link text on light buttons. Services has six choices in three equal columns and equal-height rows, with readable heading/help text on charcoal. Sell has compact supporting copy and a centered valuation action. Blog uses the same white search capsule and yellow circular submit action as Home/Inventory; selected category/topic controls use yellow for contrast on charcoal.

Inventory has no permanent All / SUV / Sedan / Coupe / Van row in either the hero or results. Its live count appears inside the search control as `(40)`, with a localized accessible status description. Sort and Grid / List / sidebar controls are centered below the hero. Every chosen filter, including body type, appears as a removable tag. Removing a body tag restores the URL and count. Two unused desktop shortcut components and their controller methods were removed.

Home's mode selector, vehicle cards, media/review panels and accepted section CTA styles retain their existing composition. Mobile components, shared inventory state/data, global mobile tokens and assets were not edited. No dealer copy or template release was updated.

## Verification

- `npm run check`: zero errors and zero warnings.
- `npm run lint:code`: passed across the source tree. Task-owned formatting and `git diff --check` passed.
- `node scripts/check-typography.mjs`: 297 source files, passed.
- `npm run test:unit -- --run`: 22 files / 187 tests passed.
- `npm run test:tooling`: 11 tests passed.
- `npm run build`: passed with the retained Vercel adapter and public-asset output.
- `npm run check:backend-secrets`: passed against source and the final built client.
- Targeted Chromium production tests in `desktop-discovery.e2e.ts` and `desktop-sections.e2e.ts`: 22 passed. Coverage includes counts, body-filter removal, dialog focus return, keyboard activation, hero hover/focus contrast, Sell dialog behavior, service preselection and Blog search/filter/Back/reset behavior. Inventory and section geometry were checked at 992, 1280, 1440 and 1920px in English and Bulgarian.
- Production route sweep: 76 desktop states at 992/1440px and 76 mobile states at 320/390px, covering 19 route states in both languages. Hero decks remained centered, their controls fit inside the panels and no document overflow or browser page errors were recorded. Mobile text/control geometry and computed styling matched the before baseline; desktop Home at 1440px also matched.
- The 131 retained protected files/assets match their original SHA-256 values. The intentionally removed desktop `InventoryTypePills.svelte` is recorded as an explicit scope exception. A separate 64-file mobile/shared-source manifest also matches.
- `node scripts/workspace-doctor.mjs --fetch` completed before editing and again before integration. Other Cars template/admin changes remain outside this task's staging scope.

Route states: Home, Inventory, Services, About, Blog, Sell, Contact, Contact with import intent, Financing, Calculator, Favorites, Compare, Reviews, FAQ, Terms, Team, a team profile, the dealer profile and a live Blog article. Private administration, vehicle-detail photography and the inventory-map composition are outside this hero-deck change.

## Existing check failures

Whole-repository `npm run lint` stops at Prettier warnings in ten unchanged files: `.impeccable/critique/2026-09-12T21-29-47Z__nents-home-mobile-mobilebottomdock-svelte-3d9500cd.md`, `AGENTS.md`, `docs/CARS-INTEGRATION.md`, `docs/MOBILE-VERIFICATION-2026-09-29.md`, `docs/refactor-2026-09-12/REPORT.md`, `public-assets.policy.json`, `README.md`, `scripts/public-asset-retention.mjs`, `src/lib/components/layout/LocaleSettingsMenu.svelte` and `svelte.config.js`. Each was compared with HEAD and remains unchanged. The task-owned files pass formatting, and the separate full ESLint command passes.

`check:architecture` still reports the existing unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. That mobile file was preserved. This task introduced no new unreachable module.

## Evidence and limits

Fresh baseline, final production screenshots, geometry/style profiles, check logs and source manifests are under `.audit/desktop-hero-family-2026-10-02/`. The baseline is `before-2/results.json`; the final sweep is `production/results.json`. Final representative screenshots include `production/bg-inventory-1440.png`, `production/bg-services-1440.png`, `production/bg-about-1440.png` and `production/bg-blog-1440.png`. Production browser tests are under `production-e2e/`. The original inventory baseline remains under `.audit/desktop-inventory-hero-toolbar-2026-10-02/before/`.

Local optimized rendering and interactions were verified. No hosted deployment, field performance measurement or real lead/form delivery was performed. Source integration does not promote a template release or certify dealer deployments. The existing user dev server on port 6464 is retained; the task's private preview on 6465 is stopped after verification.
