# Shared Admin entry and audit follow-up — 8 October 2026

Import now uses the existing [Cars Admin demo](https://cars-admin-blue.vercel.app/) from its desktop header and mobile menu. The former Account overview redirects there. This removes the public route into the older customer dashboard without building another dashboard design.

## Implemented

- The desktop Account icon becomes a dashboard icon with an explicit, localized demo label. The link opens the shared Cars admin in a new tab with `noopener noreferrer`.
- The mobile menu replaces Account and Messages with one Admin dashboard (demo) entry. Call/Message contact actions, Saved cars, Compare and locale settings remain available.
- `/account` returns a 302 to the shared demo. Query parameters, including any customer information, are not forwarded.
- Home make tiles without stock retain `intent=source` and the selected make. Honda now arrives prefilled in the sourcing wizard on desktop and mobile.
- The inventory live announcement uses the rendered count: 12 of 15 BMWs, then 15 after Show more, and 0 for an empty search.
- Retained account tests use the surviving subpages. The narrow account rail is tested for keyboard reachability with subpixel intersection tolerance, rather than requiring all links to fit simultaneously.

`src/lib/config/admin-demo.ts` owns the shared destination; `src/lib/content/site-shell.ts` owns the BG/EN label. Navigation changes are in `PublicHeader.svelte`, `MobileNavigationMenu.svelte` and `MobileMenuAction.svelte`. The retired overview is at `src/routes/account/+page.server.ts` / `+page.svelte`. The other fixes are in `home-five.ts` and `InventoryPage.svelte`. `tests/audit-followup.e2e.ts` covers the redirect, external destination, make handoff and loaded counts. `TEMPLATE.md` documents the new entry.

Historical customer subpages, their components and the optional private inquiry-admin backend remain preserved. They are separate from the shared browser-local admin demonstration. The shared Cars admin source was inspected at `L:/PLATFORMS/cars-admin`; it was not changed. Saved cars retain the localized native storefront route.

## Styling and concurrent work

The style blocks in all four modified styled components are byte-for-byte unchanged from their saved preimages. No artwork, image, font or shared token was edited by this task. See [preservation evidence](preservation.json). The visible storefront changes are the dashboard glyph and the simplified mobile menu entries.

Existing dirty/untracked work was preserved, including the new comparison components and mobile account navigation. The pre-existing active-link assertions and Overview navigation in `mobile-secondary.e2e.ts` were retained while adapting the entry/redirect expectation. No Git staging, commit, push, worktree, release selection, dealer deployment or outreach occurred.

The other active Import chat changed `src/lib/styles/tokens.css`, `HomeFiveHero.svelte`, `InventoryMobilePage.svelte` and `ImportBrowseControls.svelte` after the QA source capture. These changes were preserved and are outside this task. The live 6794 screenshots and frozen 6798 screenshots are recorded separately. The retained-account test subsequently changed to verify keyboard focus with fractional-pixel tolerance; no application code changed in this task for that correction. A combined release check must include the later parallel work.

## Verification

Node 24.21.0; main HEAD at inspection: `d0e306b889e7eff51e928f312a2ade387cc64eed`. The existing audit-owned QA directory was reused with its independently installed dependencies. The npm lockfile matched the maintained source. Source/static/config/tests were captured without `.env`, `.git`, deployment bindings or original CMS data. Synthetic tests used their own runtime fixture directory and empty database/AI credentials.

Build source digest: `f76bb329c802961dc110aee1c3e1d7ec692bfbb7f8bb4d061c23a42d6377b228`, 1,845 files. See [source manifest](source-manifest.json).

| Check                               | Result                                                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Svelte check                        | 0 errors, 0 warnings                                                                                            |
| ESLint                              | Passed                                                                                                          |
| Scoped Prettier and diff whitespace | Passed                                                                                                          |
| Unit tests                          | 162 passed                                                                                                      |
| Build                               | Passed, existing Vercel adapter; local production preview only                                                  |
| Architecture                        | Passed: 57 native routes, 259 reachable modules, one Tailwind entry                                             |
| Assets                              | Passed: 997 local images                                                                                        |
| Focused browser checks              | 37 applicable cases passed, 13 cases skipped for the other viewport                                             |
| Manual browser                      | Desktop 1440; mobile 390 and 320; shared hosted admin loads, Saved cars stays native, Compare opens its overlay |

The first focused browser run passed 33 cases and exposed four obsolete simultaneous-visibility assertions for the retained 320px account rail. Focusing each link revealed the expected horizontal scrolling; Chromium reported 99.86–99.96% intersection from subpixel rounding. The final focused rerun passed all four cases. Original and rerun logs are retained. The changed behavior passes in Bulgarian and English.

Svelte autofixer ran on every modified Svelte component. Its remaining href notices concern the project's existing localized `linkHref` helper, its `resolve` alias and deliberate external links. Svelte check and ESLint report no component issues.

The [earlier complete audit](../final-audit-2026-10-08/README.md) remains the release reference for the findings outside this bounded follow-up. Its whole-tree formatting issues, dependency advisory, other older browser assertions and dealer-personalization/delivery requirements were not cleared by this task. This is local implementation and QA, not a dealer release or real admin integration.

## Before and after

Before captures are from the maintained development preview on 6794. The first two pairs below show the same route/state at the requested desktop/mobile viewport. The last two compare the retired Account destination with the existing shared admin reached through the new link; that admin was reused without edits. Browser screenshot rasters can be scaled slightly by the in-app capture surface.

| View                                  | Before                                                                                                          | After                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Desktop storefront, 1440px            | ![Desktop before](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/before-home-1440.jpg)       | ![Desktop after](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/after-home-1440.jpg)                          |
| Mobile menu, 390px                    | ![Menu before](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/before-menu-links-390.jpg)     | ![Menu after](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/after-menu-links-390.jpg)                        |
| Desktop dashboard destination, 1440px | ![Old account](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/before-account-1440.jpg)       | ![Existing shared admin](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/after-shared-admin-1440.jpg)          |
| Mobile dashboard destination, 390px   | ![Old mobile account](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/before-account-390.jpg) | ![Existing shared admin on mobile](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/after-shared-admin-390.jpg) |
| Mobile storefront, 390px              | ![Mobile Home before](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/before-home-390.jpg)    | ![Mobile Home after](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/after-home-390.jpg)                       |

Frozen production-build evidence: [Home desktop](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/production-home-1440.jpg), [Home mobile](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/production-home-390.jpg), [menu 390px](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/production-menu-links-390.jpg), [menu 320px](L:/CODEX/cars/templates/import/docs/shared-admin-entry-2026-10-08/production-menu-links-320.jpg). These are local production-build views, not a published dealer.
