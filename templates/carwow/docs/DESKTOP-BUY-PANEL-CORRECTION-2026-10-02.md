# Desktop buy panel correction — 2 October 2026

The separate outlined mode buttons made the Home task-panel header look busier. The header now contains one continuous row of three equal tabs, each occupying one third of the panel with a 52px click target. The selected tab remains white with dark text; inactive tabs retain white text on black and a lighter charcoal hover. Individual borders, corners, gaps and the inset row padding are removed. The panel's existing outer corners contain the header, and keyboard focus remains inset and visible.

The short Bulgarian labels, full task-name tooltips, search/filter geometry, mode drafts and existing Buy/Sell/Import destinations remain intact. The financing-caption refinement is unchanged. Only `DesktopHomeSearchPanel.svelte` changes product styling; the desktop style guide and existing section geometry expectations follow its updated tab layout.

## Verification

- Pinned Node 24.21.0; Svelte check passed with zero errors and warnings.
- Scoped ESLint and Prettier passed; typography guard passed across 299 source files.
- All 187 unit tests passed across 22 files; production build passed.
- 12 existing Chromium tests passed against the production preview, covering keyboard mode switching and independent drafts, Buy query/filter submission, Sell intake, Import URL validation/routing, desktop section geometry and mobile composition.
- Home and Inventory passed at 992, 1280, 1440 and 1920px in English and Bulgarian: 400px heroes, 208px Home panels in all three modes, one filter row and no horizontal overflow. The three Home tabs fill the header equally in both languages.
- Eight mobile Home/Inventory comparisons at 320 and 390px matched the starting rendered geometry, typography, colors and destinations in development and production. All 125 protected mobile/content/asset files and the desktop financing-caption component retained their starting hashes.
- Browser inspection confirmed the English default and Sell states, the Bulgarian default, and a visible keyboard focus outline inside the header.

The architecture gate still reports the pre-existing unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. That mobile module remains untouched. This local correction does not approve a template release or deploy dealers.

Evidence is retained under ignored `.audit/desktop-buy-panel-correction-2026-10-02/`: before/development/production screenshots and measurements, check/unit/build/browser logs and protected-file hashes. The development server remains at `http://127.0.0.1:6464/en`; the separate production preview is temporary verification infrastructure.
