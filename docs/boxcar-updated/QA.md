# Boxcar Updated verification — 2 October 2026

Candidate source: `L:/CODEX/cars/templates/boxcar-updated`, version `2026.10.02-native-10-homes`, Cars `main`. Preview: [127.0.0.1:6455](http://127.0.0.1:6455/), the maintained source's Vite development server. Node: **22.23.2**.

## Verified behavior

| Check | Result |
| --- | --- |
| Svelte / TypeScript diagnostics | 0 errors, 0 warnings |
| Domain and local asset tests | 8 / 8 pass |
| Vite production build | Pass; CSS 67,016 bytes, JS 138,656 bytes; exact compressed output measurements are in `results.json` |
| Chrome rendered checks | 89 pass: ten homes and nine supporting pages at 1440, 390 and 320 px, plus all other 16 details at 1440 and 320 px |
| Playwright WebKit rendered checks | Same 89 checks pass |
| Chrome and WebKit journeys | 11 / 11 pass in each engine, with two additional rendered checks per run |
| Chrome and WebKit at 200% text / 320 px | Ten homes and nine supporting pages pass in each engine, with populated saved/compare fixtures and an expanded inventory filter panel |
| Cars workflow document check | Pass |

Each rendered check verifies working images, page width, visible control bounds and absence of error UI, page exceptions, console errors and local HTTP failures. The comparison table and photo thumbnails intentionally scroll within their own regions. Screenshots were visually inspected for the ten distinct hero designs, mobile inventory hierarchy and model/photo matching.

The journeys cover make/model dependency, search carry-through, filtered detail return and browser Back, sorting, pagination, empty-result recovery, saved persistence/removal, the four-car comparison limit, zero-interest calculation, invalid deposit handling, honest enquiry preview, mobile menu and dialog dismissal/focus return, actual gallery switching, mobile filter dismissal and featured-vehicle navigation. WebKit initially exposed missing opener focus on pointer clicks; native dialog openers now receive explicit focus, and the menu, gallery and enquiry checks pass in both engines.

The source catalogue initially contained mismatched photo/title combinations and mixed-model galleries. All 17 sample make/model titles now match their primary photos; galleries use matching model photos. Fixture specifications remain illustrative. The Volvo gallery includes different colour examples and says “Model photo previews · sample specifications.”

## Minimal visual evidence

- [Ten desktop homes](homes-desktop.png)
- [Ten mobile homes](homes-mobile.png)
- [Captured HTML design references](reference-desktop.png)
- [Machine-readable checks](results.json)
- [Template usage, routes and source notes](../../templates/boxcar-updated/TEMPLATE.md)

## Verification boundaries

The preview and browser checks use local fixture inventory and frontend state. Forms preview locally; no mail, appointment, account or finance provider is attached. The production bundle compiled successfully; a hosted deployment was not requested or tested. Playwright WebKit is engine verification rather than a physical iPhone/Safari-device test. Owner visual acceptance, commercial reference/asset entitlement and approved release selection remain open candidate checks.

The full Cars script suite passed **243 / 244** tests before integration and again after the new catalogue entry. The existing failure is `scripts/refresh-client.test.mjs`, “Auto Best refresh keeps approved hero artwork and restores Navara dealer data,” which expects `i18n.dealer('addressLine')` directly in Auto Best's hero. Boxcar Updated does not edit that template or refresh adapter. The final whole-repository suite result is recorded separately in `results.json`.
