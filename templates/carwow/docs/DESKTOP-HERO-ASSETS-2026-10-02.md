# Desktop hero artwork and Services chooser

The owner requested the running AutoDeal reference's stronger hero assets and a simpler Services box. The reference was inspected at `http://127.0.0.1:6790/bg` and `/bg/services`; the Auto Best master was also inspected at port 6461. No donor source was edited.

## Composition

`DesktopHeroArtwork.svelte` owns the desktop decoration. Home and shared car heroes use the reference's side-profile vehicles, with alpha bounds placing their visible fronts 24px outside the control panels and their wheels on a shared baseline. Artwork is omitted below 1200px; the wide Blog panel omits it below 1600px. Those breakpoints avoid squeezing decorative cars between the panel and the viewport edge.

Services uses the reference's coordinated 1920 x 640 studio scene, with a white heading on the dark image. Its charcoal panel contains one native service selector and one yellow request action, followed by the existing phone-help link. Selecting a service updates both the action's localized query/hash URL and the form selection below. The six duplicate hero shortcut buttons and their unused icon entries were removed. The existing six service cards retain five columns per row.

Hero height, outer content shell, Home/Inventory control composition, vehicle cards and mobile source remain within their existing contracts. The dark Services scene is an intentional artwork treatment; other car heroes retain the yellow brand stage.

## Asset provenance

These reviewed local template assets were copied byte for byte from `templates/import/static/assets/daynight/banners/` into `templates/carwow/static/assets/desktop/heroes/`:

- `hero-car-left-profile-v1.webp`: `18a3a6d3a1cf1153455add77153db987ed6a7240d99787be00981c8f995d1f6a`.
- `hero-car-right-profile-v1.webp`: `1c7f0d9728f03a7f7fe07d78ef8f5019bcde844fed9c21e07ca4bb38b929d027`.
- `services-studio-desktop.webp`: `1f83f6ce189e2cf4b0638c3a89c9ee6aac6e605d47a2fb474f8e5b11017c8123`.

The vehicles are decorative template artwork, not representations of current stock. The studio scene is generated reference artwork, not a photograph of the dealer's premises. Existing template content/personalization rules still apply. No dealer identity, contact, review or inventory data was imported. The source/destination hashes and reference captures are recorded under `.audit/desktop-services-reference-2026-10-02/`.

`picture` media sources keep the new assets out of the phone composition. Original mobile assets and the superseded desktop originals are retained.

## Verification

Verified against the optimized local build on 2026-10-02 using the retained npm lockfile and Node 24.21.0:

- `npm run check`: zero errors and zero warnings.
- `npm run lint:code`: passed. Task-owned Prettier and `git diff --check` also passed.
- `node scripts/check-typography.mjs`: 298 source files, passed.
- `npm run test:unit -- --run`: 22 files / 187 tests passed.
- `npm run build`: passed, including the Vercel adapter and public-asset retention output.
- `node scripts/backend-secret-boundary.mjs`: passed against 362 client-exposed source files and 431 built client files.
- Production Chromium suites `desktop-discovery.e2e.ts` and `desktop-sections.e2e.ts`: 30 tests passed. The Services selector/action alignment, localized destination, keyboard activation and form preselection were checked in English and Bulgarian at 992, 1280, 1440 and 1920px. Existing card, filter, focus, navigation and section checks also passed.
- Production sweep: 76 desktop states at 992/1440px and 76 mobile states at 320/390px across 19 route states in both languages. Mobile text/control geometry and computed styling matched the retained before baseline; no new desktop artwork was requested on those phone visits. Home's visible text/control geometry and styling also match its baseline at 1440px. Hero heights remain 400px, controls fit inside their panels, and no page errors or document overflow were recorded.
- All 64 protected mobile/shared source hashes remain unchanged. All three borrowed assets match their donor files byte for byte.

The architecture guard still reports the unchanged, previously unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. It was preserved within the owner's mobile constraint. No new unreachable module was reported. Full combined formatting outside the task scope is covered by the earlier audit; this task ran whole-source ESLint and formatting for its own files.

Evidence is under `.audit/desktop-services-reference-2026-10-02/`, including `asset-provenance.json`, `mobile-source-before.json`, `production/results.json`, optimized-build screenshots and check logs. Representative final captures are `production/bg--services-1440.png`, `production/en-home-1440.png` and `production/bg--inventory-1440.png`.

Local implementation and reference inspection do not constitute owner visual acceptance, template promotion, mounted-dealer QA or deployment. No field performance or real enquiry delivery was measured. The user's dev server on 6464 is retained; the private verification preview is stopped after review.
