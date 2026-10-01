# Auto Best mobile polish — 1 October 2026

The mobile entry and card layouts now keep their visual hierarchy at narrow phone widths. This work updates the reusable Cars master in `templates/auto-best` on `main`.

## Changes

- Home, Sell and Import entry fields use a white surface, a light border and the shared control corner radius. Home uses the existing official Hugeicons family for its mobile search/filter glyphs. Header location and call glyphs are 28px inside their retained 44px targets.
- The four Home shortcuts retain **Коли / Продай / Внос / Лизинг** and add smaller supporting text. Cars uses the real record count and identifies the current seven records as samples; verified inventory can use the available-count label. Service tiles grow with their text, including enlarged type and increased text spacing.
- Mobile model titles stop at two lines. Carousel fuel/transmission badges share one row. Every listing badge keeps its text on one line within the existing two-by-two grid. Electric, automatic and petrol/LPG have compact localized labels; unknown longer labels use ellipsis. Complete names, values and mileage units remain in accessible text/title attributes and detail views.
- Inventory quick filters have 4px above and 8px below their 44px targets. Home editorial and Blog category metadata is smaller, with the title 2px below it. Carousel prices follow their badges without an automatic spacer.
- Mobile controls suppress the native tap highlight. Focus uses the ink color, keyboard focus remains visible, and pointer focus does not leave an outline over an entry opener.

## Verification

Runtime: Node **22.20.0**, retained npm lockfile. Development preview: `http://127.0.0.1:6461/bg/`. Final browser suites used the owned local production preview at port 5186 after a successful build.

| Check | Result |
| --- | --- |
| `npm run validate` | Architecture, CSS, token, typography, asset, domain, locale and production-build checks passed; Svelte reported **0 errors and 0 warnings**. |
| `node scripts/mobile-polish-smoke.mjs` | **8/8 passed**, BG/EN at 320, 390, 430 and 1440px. Includes long Tesla model, electric and petrol/LPG fixtures in carousel/listing layouts, badge containment, header targets and pointer/keyboard focus. Fixtures do not change the sample inventory. |
| `node scripts/service-entry-overlay-smoke.mjs` | **6/6 passed**, BG/EN at 320, 390 and 430px, including full-screen editors, save/cancel, validation and reflow. |
| `node scripts/mobile-reflow-smoke.mjs` | Full Chromium matrix: **76/78 passed initially**. The English 320px text-spacing tile overflow was corrected; that case and a dev-navigation timeout at BG 430px inventory both passed on the final built preview. Normal, 200% type, increased text spacing and short dialogs are covered. |
| Desktop comparison | Home, Inventory, Sell, Import and Blog at 1440px retain the same screenshot dimensions and **zero differing pixels outside image regions**. Sell/Import screenshots are identical. Remaining differences are confined to media loading/rasterization. |
| Preview browser check | Meaningful content, expected controls, no error overlay and no page errors on the final built Home. |
| `node scripts/workspace-doctor.mjs --fetch` | Completed. Unrelated Cars changes and independent repository state were preserved. |

Generated logs, comparison data and paired screenshots are retained under `artifacts/mobile-review-2026-10-01/`; focused suite reports/screenshots remain in their usual `artifacts/` folders. [Final mobile Home](../artifacts/mobile-review-2026-10-01/home-final-390.png).

The source started at Cars commit `437c9d24b1afc6dfe81af5d1172f7b7fd30b5c6a`. Other main work advanced the repository during the task without changing the Auto Best subtree. Only reviewed task paths are included in the implementation commit. This is local browser verification; template promotion, dealer deployment and physical-device acceptance are separate steps.
