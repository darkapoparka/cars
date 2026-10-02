# Finance calculator priority — 2 October 2026

The calculator previously appeared as a small button beneath the budget campaign. It now occupies the first block below the Finance hero, ahead of the four finance option cards. A charcoal panel and full-width white 56px Calculate action make it visible in the first phone viewport. The existing calculator opens in its shared modal.

The budget campaign follows the option cards, without the Drive24 Finance eyebrow. The mobile process heading is Стъпки / Steps. Finance now uses the same numbered, non-interactive process list as Services, preserving all six steps. These elements inherit the shared locale font and typography roles.

## Verification

- `npm run check` passed with Node 22.20.0 and `NEXT_DIST_DIR=.next-build-check`: ESLint, TypeScript and the optimized build (407 generated pages).
- Local `/bg/finance` was inspected at 320×720, 390×844, 768×1024 and 1440×1000; `/en/finance` at 320×720. The calculator precedes the option cards, the budget appears below, mobile Steps stays on one line, and no horizontal page overflow was found.
- The overlay recalculated a €30,000 car with 20% deposit, a three-year term and 0% interest to €667/month. Entered values persisted after closing and reopening. Escape restored launcher focus; Back closed the overlay without leaving Finance. Background content was inert and page scrolling locked while open.
- Browser logs contained no errors; the development server recorded a Fast Refresh full-reload warning during editing.

These checks cover the local App template. No dealer refresh or deployment was performed.

## Screenshots

- [390px page](finance-390.jpg)
- [320px page](finance-320.jpg)
- [Budget and Steps at 320px](budget-steps-320.jpg)
- [Calculator overlay at 390px](calculator-390.jpg)
- [1440px page](finance-1440.jpg)
- [Recorded geometry and interactions](verification.json)
