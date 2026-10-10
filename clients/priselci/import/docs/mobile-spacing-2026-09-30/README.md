# Mobile spacing and search — 30 September 2026

Inventory now displays the current filtered count in the search trigger: `Search (42)` initially and `Search (15)` after choosing BMW. It uses the full result set, including results beyond the first 12 loaded cards. A long query truncates before the count; the zero-result case remains visible as `(0)`.

Search uses the 18px input scale. The toolbar has one 12px gap before the first card instead of stacked padding and grid spacing totaling 19px. Selected make/model values use white text on the red pills. Home's mobile Buy/Import tabs now use the mode-tab token already used by the Sell and Import entry controls.

| Measured role               | 320px             | 390px             |
| --------------------------- | ----------------- | ----------------- |
| Search text                 | 18px / weight 400 | 18px / weight 400 |
| Home and service mode tabs  | 20px / weight 400 | 20px / weight 400 |
| Tab and toolbar tap targets | 44px              | 44px              |
| Search to filter row        | 8px               | 8px               |
| Filter pills to first card  | 12px              | 12px              |
| Pills and card left edge    | 14px              | 14px              |
| Horizontal overflow         | None              | None              |

Browser inspection covered Home, Cars, Sell and Import at 320px and 390px, both service tab selections, make-filter application, search submission, a long unmatched query, and resetting results. Selected BMW text computes to white (`rgb(255, 255, 255)`) on the accent background (`rgb(185, 22, 28)`). [Measured browser state](metrics.json).

Validation used Node 24.21.0 and the retained npm lockfile in an isolated source snapshot. The canonical development listener stayed on port 5174; the production QA preview ran on port 4199.

- `npm run check`: zero errors and warnings.
- `npm run build`: passed with the existing adapter/plugin warnings.
- Scoped ESLint and Prettier checks: passed.
- `npm run test:unit -- --run`: 117 passed across 16 files.
- Existing focused Playwright tests: 12 passed, 6 intentional viewport skips, zero failures. These covered inventory SSR, filter/detail return, desktop filter selection and tab reflow, public action typography, and automated WCAG 2.2 AA/reflow checks on `/en`, `/en/inventory`, `/en/import` and `/en/sell-your-car` at 320px.

The tested working-source digest is `0403d56d7a4789f838e6055e7add6c90db4fd20c1b4071083ba9b94bb9f92f72`, captured from main base `650cc783e5fc4f79687dc2c89686cad5975f94a6` plus this polish and the six pre-existing Import drafts. The scoped commit preserves those drafts and the unrelated staged files. This is local QA evidence; no template release or dealer publication was performed. Automated checks do not constitute WCAG certification or real-device acceptance. Full snapshot and logs remain in `C:/Users/radev/AppData/Local/Temp/import-mobile-final-20260930/spacing-polish`.

[Cars at 320px](inventory-320.jpg) · [Cars at 390px](inventory-390.jpg) · [Filtered Cars](inventory-bmw-390.jpg) · [Home](home-320.jpg) · [Sell](sell-320.jpg) · [Import](import-320.jpg)
