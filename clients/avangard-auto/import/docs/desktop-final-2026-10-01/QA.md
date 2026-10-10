# Import desktop audit and implementation — 1 October 2026

Canonical master: `L:/CODEX/cars/templates/import`, `darkapoparka/cars`, branch `main`. Inspected preview: <http://127.0.0.1:6790/bg/>. Scope is reusable desktop frontend improvements; the existing charcoal/red identity, mobile layout, route contracts and dealer configuration remain in place.

## Findings and changes

- Home and Inventory duplicated hero geometry and decorative car placement. Both now use `PageIntro` and `HeroCars`; shared desktop title/height tokens distinguish the interactive hero from compact Sell, Financing and Import introductions.
- Desktop backgrounds, card fills, corner sizes and heading scales varied across sections. The shared desktop canvas is grey with white cards; Services, About, Contact, process, team and review cards use the same existing surface and typography tokens.
- The homepage search action opened another dialog even after selecting filters. Search now navigates directly with the selected canonical filters. The keyword entry still opens the full search dialog, retaining make/model selection and keyboard focus behavior.
- Hero service copy and destinations now live in `content/home-discovery.ts`. Quick discovery links use real inventory values and omit stock-dependent links when no matching stock exists.
- Sparse homepage Sell/Finance banners are 260px high on desktop. Brand/type labels are 20px. Homepage articles use an explicit compact `ArticleCard` presentation, with shallower images and two-line titles; the main blog retains its existing composition.
- Inventory defaults to four readable desktop columns. The existing Sidebar/Grid demo toggle is restored. The sidebar reuses `InventoryFilterGroup` and server options, submitting a native GET form. Canonical serialization preserves model, keyword, sort, view, locale and layout; Clear preserves sidebar layout, sort and view. Numeric maxima submit without JavaScript, without duplicate preset values.
- One GLC listing image returned HTTP 404. Its ID was added to the existing unavailable-media registry. The listing remains available with its neutral media fallback; the homepage selects four real listing photographs. This factual media correction also affects the shared mobile featured data.
- Two generated transparent vehicle illustrations face inward from the hero edges. Their combined WebP delivery size is 168,904 bytes. They are decorative assets, separate from listing media, and desktop media sources prevent downloading them on phones. [Asset prompts and provenance](../assets/DESKTOP-HERO-CARS.md) record the unverified requested Image Gen 2.5 version: the built-in tool provides no model selector/version report.

The existing alternate/account renderers, retained template references, licensing, npm lockfile and configuration/content boundaries were reviewed and preserved. This pass does not remove those implementations as presumed dead code or introduce another filter controller, generator or design system.

## Verification

A separate complete source snapshot was installed with the retained npm lockfile and Node `24.21.0`, outside the live preview's build output. Production preview: `127.0.0.1:6791`, synthetic fixture data, admin/AI disabled and no database or OpenAI credentials. [Verification receipt](verification.json) and [runtime manifest](runtime-source.json) identify the tested runtime files. Documentation and the corrected picker test are outside the runtime digest.

| Check                              | Actual result                                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Svelte/TypeScript                  | 0 errors, 0 warnings                                                                                                       |
| Scoped formatting                  | Passed for task-owned source, tests and documentation                                                                      |
| Full code lint                     | Passed                                                                                                                     |
| Architecture                       | Passed: 57 route modules, 200 reachable modules, one Tailwind entry                                                        |
| Local assets                       | Passed: 857 images                                                                                                         |
| Unit tests                         | 124 passed in 18 files                                                                                                     |
| Production build                   | Passed in the frozen candidate                                                                                             |
| Browser suite, `--project=desktop` | Initial run: 130 passed, 67 skipped, 7 failed; this project also contains explicit narrow-screen cases                     |
| Picker correction                  | Recheck: all 3 picker/quick-filter tests passed; the stale Search-button expectation now opens the retained keyword dialog |
| Remaining suite failures           | 6 explicit 320/390px locale-control cases, outside desktop scope; no other failed case remains after the picker correction |

The global `npm run verify` command stops at an existing formatting difference in `docs/mobile-service-cards-2026-09-30/metrics.json`. That historical raw evidence was preserved. Code lint, architecture, assets and unit checks were then run separately and passed. This is not an all-green global verification claim.

The six remaining cases are `localization-interactions.e2e.ts` no-JS contact submission (EN/BG at 320/390px) and `localization.e2e.ts` preferences/focus (320/390px). Contact submissions and localized demo status pass; their later selector/focus assertions fail because the current mobile header has no visible `[data-locale-selector]`. Desktop equivalents pass. The existing native locale-settings page remains tested, but the missing mobile entry/focus target requires a separate mobile correction. These assertions were neither skipped nor weakened.

Manual browser inspection used the actual 1440×1000 in-app browser viewport: Home, its lower sections, Inventory grid/sidebar, Services, About, Contact, Sell and Financing. Reviewed geometry includes inward-facing car artwork, the search/filter panel, compact banners, readable discovery cards and compact article cards. Automated desktop searches cover 768/1024/1440/1920px, and typography/contact checks cover 768/1024/1100/1200/1440px. A browser viewport override did not change the actual in-app viewport and was reset; other manual widths are not claimed.

Browser journeys checked selected BMW search, SUV discovery, keyword replacement while retaining model/filter state, sidebar multi-select and custom maximum, Clear preserving presentation, Grid toggle, native no-JS sidebar submission, retained pickers and keyboard focus. The broader suite also covers EN/BG routes, resource loading, overflow, demo forms, favorites, compare and existing accessibility assertions.

## Screenshots

[Home](home-desktop.jpg), [brand/type discovery and banners](home-browse-desktop.jpg), [articles](home-articles-desktop.jpg), [Inventory sidebar](inventory-sidebar-desktop.jpg), [Services](services-desktop.jpg), [About](about-desktop.jpg), [Contact](contact-desktop.jpg).

## Preservation and limits

Other Cars templates, dealer changes and the concurrent Import mobile header/homepage work were preserved. The shared checkout/index was inspected before scoped integration; `workspace-doctor.mjs --fetch` confirmed Cars main was synchronized and reported unrelated workspace drift separately.

This receipt proves a standalone local build and browser behavior. It does not establish owner visual acceptance, an immutable template release, mounted three-design behavior or a public deployment. No dealer publication, template promotion or outreach was performed.

The ignored QA snapshot and logs remain at `L:/CODEX/cars/runtime/import-desktop-20261001`. Browser artifacts, including failure recovery traces, remain under `C:/Users/radev/.codex/visualizations/2026/10/01/01a0f5d8-ed62-75e2-8b8d-bf083ccc6484/desktop-qa-*`. Automatic approval review rejected removal of the temporary QA deployment bundle with “blocked by policy”; no more specific reason was supplied. The rejected cleanup was not retried through another filesystem API. The original preview on port 6790 remains running.
