# Auto Best mobile polish — 1 October 2026

The mobile entry and card layouts now keep their visual hierarchy at narrow phone widths. This work updates the reusable Cars master in `templates/auto-best` on `main`.

## Changes

- Main mobile Home, Sell and Import fields use a pale borderless surface, regular 16px text and a 52px frame without a shadow. Buy has one leading search glyph; entry fields have no trailing glyph. Home's native Import URL input has a leading listing glyph. Standard editors and overlay search use the same pale surface. All icons retain the official Hugeicons family. Header location and call glyphs are 22px inside their retained 44px targets.
- The four Home shortcuts retain **Коли / Продай / Внос / Лизинг** and add smaller supporting text. Cars uses the real record count and identifies the current seven records as samples; verified inventory can use the available-count label. Service tiles grow with their text, including enlarged type and increased text spacing.
- Mobile model titles stop at two lines. Carousel fuel/transmission badges share one row. Every listing badge keeps its text on one line within the existing two-by-two grid. Electric, automatic and petrol/LPG have compact localized labels; unknown longer labels use ellipsis. Complete names, values and mileage units remain in accessible text/title attributes and detail views.
- Inventory search, sort and filter controls have a 4px layout gap and retain 44px targets. Quick filters have 4px above and 8px below their 44px targets. Home editorial and Blog category metadata is smaller, with the title 2px below it. Carousel prices follow their badges without an automatic spacer.
- Mobile controls suppress the native tap highlight. Focus uses the ink color, keyboard focus remains visible, and pointer focus does not leave an outline over an entry opener.

## Verification

Runtime: Node **22.20.0**, retained npm lockfile. Development preview: `http://127.0.0.1:6461/bg/`. First-pass browser suites used the owned local production preview at port 5186 after a successful build.

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

## Entry field design and toolbar refinement

The owner rejected the dark treatment, the reintroduced gray border, the redundant right-hand filter glyph and oversized header icons. Home/Sell/Import entry controls now use a 52px pale borderless frame, muted 16px/400 prompts and no shadow or trailing glyph. Entered values use ink. Overlay search uses the same visible pale surface and 12px control radius; header icons are 22px within their retained 44px targets. The default make/model prompt fits without truncation at 320px. Full edited values remain available in accessible labels and the editor. Inventory search, sort and filter gaps remain at 4px; sort/filter retain their 44px targets and 40px painted circles. The shared control-height guard explicitly permits the prominent role for entry fields.

CSS-policy, token and typography checks passed for the corrected fields; Svelte reported **0 errors and 0 warnings**, and the production build passed. On the owned built preview at port 5186, mobile-polish cases passed **8/8** for BG/EN at 320, 390, 430 and 1440px; service-editor cases passed **6/6**, including enlarged type and text spacing. Direct Home Import URL checks passed **3/3** on the running preview at port 6461 (BG 320/390 and EN 320), covering invalid-link feedback, focus and valid-link continuation. Placeholder contrast measured **5.04:1** against the pale surface. Rendered Home and overlay screenshots confirm the shared surface, removed trailing icon and reduced header glyphs. Current entry screenshots and logs are retained in `artifacts/surface-correction-2026-10-01/`; previous paired screenshots remain in `artifacts/mobile-final-2026-10-01/`. Functional test results do not establish owner visual acceptance.

Separate desktop Home work arrived during this follow-up and was committed independently. This field change preserves those edits and includes only its mobile entry components, shared roles, matching checks and documentation.
