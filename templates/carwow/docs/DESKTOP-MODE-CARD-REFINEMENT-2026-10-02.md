# Desktop mode and card refinement — 2 October 2026

The Home mode selector previously gave inactive modes only text on a dark header. Bulgarian labels were unnecessarily long. Each mode now has a visible charcoal button, neutral border and 8px corners, with a white selected state. Bulgarian uses Купи / Продай / Внос; tooltips retain the full task names. English wording remains descriptive. The attached header stays 52px high and the complete task panel stays 208px high in all three modes.

The detail arrow reduced the financing caption's available width in five-column car grids, wrapping Финансиране по запитване into two lines. Desktop cards now display Financing / Финансиране as one line of 14px supporting text beneath the price. Tooltips and accessible text retain the full enquiry wording, Home financing links keep their existing destination, and actual monthly figures are preserved.

Only the desktop Home search component and desktop vehicle price component changed product behavior. Keyboard mode navigation, independent drafts, query submission, sell/import intake and card actions retain their existing contracts. The existing browser tests and desktop style guide were updated to match the requested labels and one-line caption.

## Verification

- Pinned Node 24.21.0; `npm run check`: zero errors and warnings.
- Scoped ESLint and Prettier checks passed; typography guard passed across 299 source files.
- `vitest run`: 187 tests passed across 22 files.
- `npm run build`: passed with the existing Vercel/public-assets adapter.
- 18 existing Chromium cases passed against the production preview, covering keyboard modes/draft retention, buy filtering, sell/import routing and validation, car actions, shared card/frame geometry, and desktop route sections.
- Home and Inventory passed in English and Bulgarian at 992, 1280, 1440 and 1920px: no horizontal overflow, 400px heroes, one row of quick filters and equal Home mode heights. Card captions remain single-line and contained at 992 and 1440px, including related detail-page cards.
- Eight English/Bulgarian Home and Inventory mobile comparisons at 320 and 390px matched the starting rendered control/text geometry, typography, colors and destinations in both development and production. All 125 protected mobile, shared content and asset files retained their starting SHA-256 hashes.

The existing architecture check still fails on the unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`, whose Git blob remains `7a0ee36e8a44c5745bda8a0055134534458507aa`. This desktop refinement leaves that mobile module untouched. This is local source/build/browser evidence; it does not approve a template release or deploy dealer copies.

Evidence is retained under ignored `.audit/desktop-mode-card-refinement-2026-10-02/`: matching before/development/production measurements and screenshots, check/unit/build/browser-test logs, and protected-file hashes. The user's development server remains at `http://127.0.0.1:6464/en`; the separate production preview was used for verification only.
