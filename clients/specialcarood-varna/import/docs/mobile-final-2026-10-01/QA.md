# Import mobile finishing audit — 1 October 2026

The existing mobile composition, Sofia Sans/Sofia Sans SemiCondensed fonts, colours, images, discovery rails, cards, banners and navigation are retained. The audit found a small set of functional and narrow-screen issues worth fixing; it did not justify a restyle.

## Changes

- Homepage vehicle financing now preserves the selected vehicle ID. Opening the first Mercedes card's monthly payment previously calculated a generic EUR 35,000 car; it now loads the actual EUR 19,500 car and keeps that identity in the financing enquiry link. Both languages are tested.
- The Sell contact step uses an intrinsic grid for its vehicle summary. The full VIN no longer runs beneath the absolutely positioned Edit button at 320px. Edit now has a 44px target; long vehicle names can wrap without clipping. The existing colours and typography are unchanged.
- Dismissing first-visit language preferences on mobile Contact restores focus to Menu, which contains the language entry. Contact also exposes the existing native language link in its no-JavaScript fallback. Normal JavaScript-enabled header geometry is unchanged.
- The homepage card reuses the existing base-path-aware image fallback action, removing a second hardcoded error handler.
- Regression coverage checks vehicle/price continuity, complete VIN presentation, Edit behaviour, language focus, reload, persistence and the no-JavaScript path. Preference tests wait for hydration before activating the mobile Menu after reload.

## Browser evidence

Manual Browser inspection used the requested `http://127.0.0.1:6790/bg` preview. Home and lower sections, inventory/filter drawers, selected vehicle details/enquiry/return, Sell, Import, Contact, menu/language preferences, About and financing were reviewed. Widths were 320px and 390px, with 320x568 used for the short-screen service flows. Financing also received a full-page 1440px desktop inspection. The visible pages had no document-wide horizontal overflow; the intended horizontal rails were retained.

Matched screenshots:

| Change                                         | Before                                | After                               |
| ---------------------------------------------- | ------------------------------------- | ----------------------------------- |
| Sell summary, 320x568                          | [Before](before-sell-contact-320.jpg) | [After](after-sell-contact-320.jpg) |
| Financing from the same Mercedes card, 390x844 | [Before](before-financing-390.jpg)    | [After](after-financing-390.jpg)    |

## Verification

- Node 24.21.0, retained npm lockfile; Svelte/TypeScript: **0 errors and 0 warnings**.
- Task-owned source/test formatting and ESLint checks passed.
- Full code lint passed in the frozen candidate. Architecture checks passed (57 native route modules, 200 reachable modules, one Tailwind entry); all 857 local image signatures passed; all 124 unit tests passed across 18 files.
- An isolated complete source snapshot with its own `npm ci` and production build passed. No `.env`, Git state or deployment binding was copied. The original dev server/build output was preserved.
- **57 mobile browser checks passed** on the frozen production preview: `mobile-final.e2e.ts`, `mobile-navigation.e2e.ts`, `mobile-sheet-regressions.e2e.ts`, and `mobile-finishing.e2e.ts`.
- **9 language checks passed** on that same build: `localization.e2e.ts` preferences/save/dismiss/reload/focus and `localization-interactions.e2e.ts` no-JavaScript contact submission, including 320/390px and 1440px controls.
- These **66 final checks** cover 20 English route accessibility/reflow checks, EN/BG regression journeys, mobile overlays and keyboard focus, gallery/return navigation, comparison, preview form validation and native fallback forms. This resolves the six narrow-screen language cases recorded in the preceding desktop audit.
- All 1,560 frozen runtime files matched the working source after verification. Runtime digest: `9680e91f83e9ae430d0494795dc4816bb14ee3ba48a919da6bd8daac03aeeb34`.
- `workspace-doctor.mjs --fetch` confirmed Cars main synchronized at inspection; unrelated template, dealer and admin work was preserved.

The existing archived `docs/mobile-service-cards-2026-09-30/metrics.json` still fails Prettier. It was checked explicitly and preserved; this is not a claim that the aggregate `npm run verify` gate is entirely green. The production build also retains nonfatal legacy `@reference` CSS minification warnings outside these changes.

## Preservation and limits

The concurrent desktop source was committed before these isolated mobile changes. No template promotion, dealer refresh, deployment or outreach was performed. The preview on port 6790 remains available. Forms were tested in synthetic preview mode; no delivery integration or financing approval is claimed.

The audit establishes local Chromium/browser behaviour and a standalone production build. Physical iOS/Safari keyboard/safe-area behaviour, real-user performance, mounted dealer variants, public deployment and owner visual acceptance remain separate checks. Further font or layout changes are not recommended from this audit's evidence.

Source/dev logs and screenshot baselines are in ignored `runtime/mobile-final-2026-10-01`. The frozen snapshot and final build/test logs are retained at `C:/Users/radev/AppData/Local/Temp/cars-import-mobile-20261001-01a0f61f` (C: was used to avoid the low free space on L:). The temporary production preview used port 6792 with provider credentials disabled.
