# Finance controls — 2 October 2026

Superseded by the owner's subsequent calculator-banner direction. See [current Finance banner and interaction verification](../finance-calculator-banner-2026-10-02/README.md). This receipt and its screenshots preserve the earlier control-row pass.

The owner's screenshot rejected the stacked search/calculator bars and the crowded inventory heading. The final layout uses one 52px control row: a short Choose your car / Избери кола selector and a 52px calculator icon button. Both share the 12px radius token. The calculator has a descriptive accessible name and title and opens the full existing calculator sheet. Its accent colour comes from shared tokens, not component typography overrides.

Cars to finance / Коли за лизинг occupies its own line. Three existing vehicle cards follow immediately. Example assumptions sit below the cards, followed by the visible All cars / Всички коли button. That button is 48px high and spans the mobile content width; it opens the same car picker. Finance's bottom padding is reduced from 170px to 84px plus the safe area, leaving space for the fixed navigation. Sell and Services retain their padding and composition.

The retained Cars24 native Finance and inventory captures were inspected at `L:/inspiration/cars24/reference/cars24/25-finance.png` and `06-home-inventory.png`. The latter's search field with a trailing icon action informed this control row. No reference identity, lending claims or assets were imported.

## Verification

- Node 22.20.0, `NEXT_DIST_DIR=.next-build-check npm run check`: ESLint, TypeScript and production build passed, including 407 generated pages. Production CSS includes the updated Finance bottom padding. Development route-type imports were restored afterward.
- Bulgarian at 320px, 390px, 768px and 1440px; English at 320px. No document overflow; the control row remains 52px high and the mobile inventory heading stays one line. Inventory remains one, two or three columns at the existing breakpoints.
- Calculator icon and relocated All cars button open their sheets. Searching ATTRAGE returns two cars; choosing the 2023 Mitsubishi loads €24,799 and an example €393 monthly payment. Escape restores focus to All cars and releases body scrolling. Earlier verified calculator value persistence and car payment actions retain their handlers.
- React review: existing state and one shared modal boundary are preserved; buttons retain accessible names, expanded state and dialog relationships. Shared text roles remain unchanged. No dependency or CSS framework was added.

Evidence: [Bulgarian 320px](bg-320.png), [Bulgarian 390px](bg-390.png), [lower section at 320px](bg-320-lower.png), [English 320px](en-320.png), [desktop](bg-desktop.png).

## Git handoff

This correction is saved locally. Another active Cars task, Polish import desktop styling, owns ongoing writes in the shared main checkout. Its index lock was left intact. Commit/push remains pending; no template release or dealer deployment is claimed.

After the shared writer releases the checkout, commit only these App paths: `app/tokens.stylex.ts`, `components/action-button.stylex.ts`, `components/FinanceCalculatorLauncher.tsx`, `components/FeatureContent.tsx`, `components/FeatureLanding.tsx`, `lib/locales/en.json`, `lib/locales/bg.json`, `TEMPLATE.md`, this evidence directory and `docs/finance-car-selection-2026-10-02/`. Preserve the unrelated App documentation directories and other Cars changes. Push main without force after resolving fetched-main drift.
