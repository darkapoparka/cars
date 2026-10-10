# Import desktop inventory controls

Make and Model are rounded glass pills alongside Price, Mileage, Fuel, Body and All filters inside the hero. The keyword search uses the shared search field. One Sort by disclosure opens the existing choices with a selected checkmark; View stays beside it. The Home/Inventory artwork frame is retained.

The popup submits the existing native GET contract, preserving repeated makes and other query values. Escape restores focus, outside clicks close the popup, and Sort/View cannot remain open together. Mobile components and presentation are unchanged.

## Visual evidence

- `before-1440.jpg` and `after-1440.jpg`: same 1440 × 1000 viewport and page-start position.
- `sort-menu-1440.jpg`: choices behind the single Sort by control.
- `after-768.jpg`, `after-1024.jpg`, `after-1920.jpg`: responsive desktop composition.
- `desktop-matrix.json`: BG/EN at six desktop widths; six pill targets, one closed sort trigger, no overflow or clipped default labels.
- `mobile-comparison.json`: 320px and 390px screenshots are pixel-identical before/after.
- `interactions.json`: filter focus, sort query preservation, keyboard dismissal and popup exclusivity.

## Verification

Svelte check, scoped formatting/lint, architecture checks and production build passed with pinned Node 24.21.0. The existing inventory, filter-input and desktop-search suites passed 26 cases, with 22 expected device-specific skips. Tests used a frozen full working-source production preview so the active dev server's build output stayed independent. Eight task paths match the checked snapshot by SHA-256; see `verification.json`.

This is local source verification. Template release promotion and dealer deployment are separate actions. Unrelated repository drafts were preserved.
