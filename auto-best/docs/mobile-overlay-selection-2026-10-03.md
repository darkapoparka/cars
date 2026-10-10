# Mobile filter selection polish

The native selected radio showed a thin red outer ring, a white gap and an inner red dot. Mobile `QuickFilterSheet.svelte` now uses a solid brand-accent control with a small white check, softer empty outlines and a white selected row. Radios remain round and checkboxes use rounded squares. The shared component covers standalone quick filters, Sort and nested Home/inventory pickers.

Native input semantics, value bindings, Clear, Apply and draft ownership remain unchanged. The entire row stays selectable, keyboard focus outlines the row, and long labels can wrap without shrinking the control. The new CSS is limited to widths below 768px; forced-colors mode restores native input rendering.

Validation on the canonical Auto Best Vite server at `http://127.0.0.1:6461`, using Node 22.20.0:

- Svelte/type check: zero errors and warnings. CSS policy and production build, including locale prebuild checks, passed.
- `scripts/mobile-filter-smoke.mjs`: all four journeys passed at 320×677, 390×844, 430×932 and 700×390, covering nested choices, Apply/Cancel, draft preservation, equipment and applied URL values.
- Focused `scripts/mobile-reflow-smoke.mjs`: Bulgarian and English Home/Inventory Make pickers passed at 320px, including enlarged text, text-spacing overrides and 420px viewport height.
- Direct Type inspection at 320, 390 and 430px: five 44px rows with centered 20px controls, one selected radio and no label or dialog overflow. At 768 and 1440px the controls retain native rendering.
- Native radio arrow keys move the single selection and show a 2px row focus outline. Equipment supports two checked values; Clear resets them. Equipment controls and labels fit at 320px.

Matched Type before/after images, Equipment evidence and geometry data are retained under ignored `runtime/overlay-selection-2026-10-03/`. Checks/build used the working tree with pre-existing desktop/font drafts; those changes remain outside this commit. These are local UI checks, not template promotion or dealer deployment evidence.
