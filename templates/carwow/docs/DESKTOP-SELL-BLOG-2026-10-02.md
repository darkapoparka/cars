# Desktop Sell entry and Blog panel — 2 October 2026

## Scope and behavior

The requested changes are confined to desktop. Mobile components, shared filter
semantics and mobile styles were preserved. The reusable master was changed;
no template release was promoted and no dealer was deployed.

- Sell now starts with a labelled registration-number/VIN field beside Continue.
  Both modes share the existing valuation form's state. Continue or Enter opens
  that form with the identifier retained, and focuses Make when an identifier was
  supplied. An empty entry opens the identifier field. Escape returns focus to
  the entry or Continue control. Mode buttons wait for hydration before accepting
  clicks. Existing request links retain the selected identifier in their URL.
  This does not add a registration lookup or an automatic valuation service.
- Blog now uses three equal, connected category links: All, Buying and Selling.
  The panel uses the same 640px width and 52px segment height as Home. Its overall
  size changed from 1040 × 198px to 640 × 150px in both languages. Search occupies
  one row; quick topics, result count and clear-all move above the article grid.
  Category changes preserve search, tag and archive filters. All clears only the
  category; the separate reset clears every filter. URL navigation and Back remain
  functional. Any additional populated categories remain available beside topics.
- The shared desktop hero exposes an explicit segmented layout. Existing callers
  retain their standard layout, 400px hero and 720px panel. Home's controls and
  inventory composition were preserved.

## Reviewed source

- `src/lib/components/sell/DesktopSellYourCarPage.svelte`
- `src/lib/components/blog/BlogIndexPage.svelte`
- `src/lib/components/layout/DesktopYellowRouteHero.svelte`
- `tests/desktop-sections.e2e.ts`

## Verification

Pinned runtime: `L:/Toolchains/Node/24.21.0/node.exe`. The existing dev server on
6464 was preserved; production verification used a temporary preview on 6465.

- `npm run check`: zero errors and warnings.
- `npm run lint:code`: passed; final changed sources also passed scoped ESLint.
- Scoped Prettier and `git diff --check`: passed.
- `npm run check:typography`: 298 source files passed.
- `npm run test:unit -- --run`: 22 files, 187 tests passed.
- `npm run build`: passed, including the Vercel/public-assets adapter.
- `node scripts/backend-secret-boundary.mjs`: 362 source and 431 built client
  files passed.
- Chromium production tests for `desktop-discovery.e2e.ts` and
  `desktop-sections.e2e.ts`: 32 passed. They cover 992, 1280, 1440 and 1920px
  desktop states and the existing 390px route check, registration/VIN retention,
  focus return, Blog category/search/topic combinations, Back and reset.
- Separate production route sweep: 76 desktop states across 19 routes/queries,
  two languages and 992/1440px; no overflow or browser errors. The Home control
  signature matches the before snapshot.
- Mobile preservation: all 76 route/language/320/390px visible-text/control
  signatures match the before snapshot, including geometry, typography, spacing,
  color and URLs. All 64 protected mobile/shared source hashes match; no new
  desktop hero artwork was requested on mobile. This is a Chromium/source check,
  not a claim of physical-device or pixel-diff verification.

The architecture check still fails on the pre-existing unreachable
`src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. That protected
mobile source was preserved.

## Evidence

Independent before/after screenshots, logs, source hashes and route signatures
are saved in `.audit/desktop-sell-blog-entry-2026-10-02/`. Production examples:

- `production/bg--sell-your-car-1440.png`
- `production/bg--blog-1440.png`
- `production/en--sell-your-car-1440.png`
- `production/en--blog-1440.png`
- `production/results.json`
- `production-e2e.log`

No real enquiry was submitted. Browser tests verify the entry and existing form
opening, not staff delivery or live valuation integration. Owner visual acceptance
and any future release or dealer deployment remain separate steps.
