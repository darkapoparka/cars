# Menu and listing polish — 28 September 2026

Scope: the shared App master, including future dealer copies. This is not a fleet refresh or approval of a template release.

The current clarification is to follow the project's shared white/grey/charcoal styling and configuration rather than hardcode another menu treatment. Earlier isolated palette and raster-icon attempts below are superseded, not accepted designs.

The menu reuses `PageHeader` and shared theme tokens. `ShowroomIcon` provides the same Lucide symbols for the menu and dock; menu symbols render at 30px with no coloured tiles. Each row uses a 36px icon slot, flexible text and 18px chevron with 12px gaps, a minimum 56px secondary target and natural wrapping. A 62px charcoal Browse row and the visit row form the leading group. Saved joins the secondary actions; redundant activity/section headings are removed and group gaps are 12px. PageHeader shows Menu and the existing DealerBrand component, including configured dealer logos. Repetitive service descriptions are removed; location remains visible beneath Visit showroom.

Menu groups and destinations live in `lib/showroom.ts`; page JSX renders configuration. Rows use 15px labels and 12px location text; only a configured contact section needs a visible section label. Locale links come from `dealer.enabledLocales`, retain 44px targets and are hidden when only one locale is enabled. Dealer identity, contacts and location come from dealer configuration. Shared theme values and showroom banners remain unchanged; the PageHeader surfaces and vehicle-card location footer now consume existing tokens.
`lib/showroom-location.ts` shares dealer-location formatting between Menu and vehicle cards. Menu prefers address, then city; cards prefer city, then address. Cards localize ISO country codes as a fallback. The menu uses Plan your visit when neither an address nor city exists, rather than presenting a country as a useful visit location. No address is invented and captured inventory location never overrides the configured dealer. Vehicle-card location footers now link to the showroom and display the location, with a 17px pin and a 44px touch target.

## Listing consistency

Home, inventory and Saved use `components/VehicleCard.tsx`. Dealer adaptation supplies data through the existing adapter; it must not fork this component to change a dealer's appearance. `MiniVehicleCard` remains the intentionally smaller horizontal-rail card.

Preserve the shared listing hierarchy: photograph, title, optional trim, actual price or price-on-request, optional monthly estimate or disclosed example benefits, compact vehicle facts and a quiet showroom footer. Empty trim adds no space. Long benefit labels and translated price-on-request copy wrap inside the information column. Keep the 44px save control and existing photo proportions.

For future work across Auto Best, Modern, Import and Carwow, use this hierarchy as a visual reference while retaining each family's framework and composition. This pass changes no other template family or deployed dealer. Do not invent monthly prices, benefits or vehicle facts to make different inventories appear identical.

## Source limitation

At the start of this pass local main was `a1d4802811eac42fc9124f5285b9d92b0af951e4`, 64 commits behind fetched origin/main, with the App directory untracked locally and an existing `.git/index.lock`. The pre-edit menu matched the fetched main version. Preserve the shared index and integration work; scoped commit/push requires its reconciliation. The local URL initially served an older production build with the historical account menu rather than the current dealer-aware source.

## Verification

Current mobile hierarchy correction: `npm run check` passed on Node 22.20.0, exit 0 (`runtime/app-menu-polish/check-priorities.log`). Inspected EN 390x844, BG 320x780 and 320x568, and desktop 1440x1000. EN primary/visit rows measure 62/58px; secondary rows 56px. All icons render at 30px and labels align at x=77px. BG finance wraps to 61px; no overflowing row links or horizontal overflow. On the short viewport, scrolling puts language controls fully above the fixed dock (language bottom 374px, dock top 458px). Verified Browse, Saved, Visit and EN/BG switching. No captured console errors. Screenshots: `menu-priorities-390.png`, `menu-priorities-bg-320.png`, `menu-priorities-bg-320-short.png`, `menu-priorities-desktop.png` in `runtime/app-menu-polish/`. Preview restored to `/en/more`, viewport reset. No partner publication or owner acceptance claimed.

Previous shared-component correction: `npm run check` passed on Node 22.20.0 (exit 0, `runtime/app-menu-polish/check-shared.log`). Inspected EN 390px, BG 320px and desktop 1440px. At both mobile widths, every menu row's text begins at x=77px and icons render at 30px; ordinary rows are 58px, location 61px and wrapped BG rows 63px. No horizontal overflow or overflowing menu links. Browse, showroom and locale navigation work. Card footer verified at 320px with a 44px target and the shared surfaceAlt background. No captured console errors. Screenshots: `menu-shared-390.png`, `menu-shared-bg-320.png`, `menu-shared-desktop.png`, `card-shared-320.png` in `runtime/app-menu-polish/`. Preview is running at port 6473 and the temporary viewport is reset. This records technical verification, not owner visual acceptance.

Previous mobile-pattern attempt: `npm run check` passed on Node 22.20.0 (exit 0, `runtime/app-menu-polish/check-mobile.log`). EN 390px and BG 320px measurements show every menu row's text starts at x=68px, each original icon is 40px wide, and every icon/text-group centre differs by 0px. Plain rows measure 61px (63px for a wrapped Bulgarian label); service/location rows measure 66px. No overflowing links or horizontal page overflow. Raw measurements: `runtime/app-menu-polish/mobile-alignment.json`. Also visually inspected at 1440px. Language switching and header back navigation work; no captured console errors.

Filtered inventory to the Suzuki Ciaz at 320px: footer shows България, has a 44px target, and navigates to `/bg/stores`; location content matches the configured BG country rather than the captured UAE inventory. Screenshots in `runtime/app-menu-polish/`: `menu-mobile-final-390.png`, `menu-mobile-final-bg-320.png`, `menu-mobile-final-desktop.png`, `card-location-bg-320.png`. Preview restarted at port 6473, viewport overrides reset. Source is local; commit/push and dealer publication remain pending the pre-existing repository reconciliation.

The following entries are historical checks of earlier attempts, not the current design or owner acceptance.

Original-template correction (supersedes the rejected colour-tile pass): `npm run check` passed on Node 22.20.0; final exit 0 recorded in `runtime/app-menu-polish/check-original-exit.txt`, with full log in `check-original.log`. Verified EN 390px, BG 320px and desktop 1440px. Original icons all loaded, measured 28px (location strip 24px), with computed filter `none`. No overflowing links at 320px, language navigation and location destination worked, and no captured console errors. Screenshots: `menu-original-390.png` and `menu-original-bg-320.png` in the same runtime directory. The original source and its screenshots were inspected directly before this correction. The broader App palette was not changed.

Colour/icon follow-up: `npm run check` passed again with Node 22.20.0 (exit 0; `runtime/app-menu-polish/check-colour.log`). Visually verified EN at 390px and BG at 320px/1440px, including language navigation and contact icon. At 320px, no links overflow their boxes and the page has no horizontal overflow. No captured console errors. Updated screenshots are `runtime/app-menu-polish/menu-colour-390.png` and `menu-colour-bg-320.png`. The preview was restarted with this build, and temporary viewport overrides were reset.

- `npm run check` passed with Node 22.20.0: ESLint, TypeScript and the production build. Final exit status: 0. Log: `../../../runtime/app-menu-polish/check.log`.
- Stale generated route types from the earlier pre-locale build initially failed type checking. They were preserved under `runtime/app-menu-polish/` and regenerated with `next typegen`; no source routes or fixtures were removed.
- Restarted the production preview at `http://127.0.0.1:6473/` against the current `.next` build.
- Inspected menu at 320px, 390px and 1440px; EN/BG navigation, localized location label and current-language indicator verified. Language controls measure 44px high. No page overflow at the inspected widths.
- Inspected inventory cards at 320px and 1440px and Saved at 390px. Search for Ciaz reduced 48 results to one; saving showed the same card in Saved; its detail link opened the matching Suzuki detail. Removed the test save afterward. No captured browser console errors.
- Screenshots: `runtime/app-menu-polish/menu-en-390.png`, `menu-bg-320.png`, `menu-bg-desktop.png`, `cards-320.png`, `cards-desktop.png` and `home-390.png` (paths relative to Cars).
- This is focused styling QA. Existing reference-fixture content and incomplete translations in deeper routes are outside this pass; it does not certify dealer content or production fleet readiness.

Commit/push is pending reconciliation of the pre-existing shared index lock and main drift. Changed source also includes `components/ShowroomIcon.tsx`, `components/AppShell.tsx`, `components/PageHeader.tsx` and `lib/showroom.ts`. Earlier changed source: `app/[locale]/more/page.tsx`, `components/VehicleCard.tsx`, `lib/showroom-location.ts`, the EN/BG copy catalogs and this note. No partner publication was requested or performed.




