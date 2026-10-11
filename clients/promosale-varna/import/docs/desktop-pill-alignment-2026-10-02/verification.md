# Desktop inventory pill alignment

The quick filters previously used text-dependent widths and asymmetric padding. Their arrow positions changed with the label and language. All six desktop filters now share equal widths, a fixed trailing arrow column, centered labels, symmetric 12px padding and 16px control text. All filters uses the same text size.

Only desktop CSS changed in `InventoryFilter.svelte` and `InventoryToolbar.svelte`. The shared markup, mobile styles, filter data, query contracts and dialogs are preserved. Long selected values use the existing ellipsis, full title and accessible label rather than changing the row width.

## Evidence

- `before-bg-1440.jpg`: the starting inventory at 1440 × 960.
- `after-bg-1440.jpg`: the same route and viewport after the change.
- `after-selected-en-1440.jpg`: BMW and X3 selected through the actual Make and Model dialogs.
- `geometry.json`: measurements from the rendered local app.

BG default checked at 768, 900, 1024, 1440 and 1920px. EN default checked at 768, 1024 and 1440px. Selected Make/Model checked at 1024 and 1440px, plus multiple makes and price at 1440px. All six arrows have a 13px inset from the button border, 48px control height and equal widths within browser rounding (0.02px). Default labels fit without truncation and no horizontal page overflow was observed.

Make → BMW → Show cars and Model → X3 → Show cars produced one matching car. Escape closed the reopened Model dialog and returned focus to Model: X3. The QA tab recorded no browser console errors.

At 320 and 390px, the desktop controls remain hidden and these desktop rules do not apply. The source before the first media query and the existing narrow toolbar layout were compared against the starting source and are unchanged.

## Checks and scope

- Scoped Prettier, ESLint and `git diff --check` passed for both source files.
- The running Node 24.21.0 / Vite server at 6790 compiled the changed components and served the inspected routes. No fresh production build was run for this CSS-only follow-up.
- `workspace-doctor --fetch --json` confirmed Cars on main at `e97c9ae57b7226c84692d4fc57c747c24ece24ec`, matching fetched origin/main with no divergence before integration. Other working changes are preserved.
- No dealer publishing or template promotion was performed.

Source SHA-256 at capture:

- `InventoryFilter.svelte`: `03ED688805D64EC59333543F5BC1EB141AD1627C8EBA6ACD42AD4296C34C4B30`
- `InventoryToolbar.svelte`: `C452C1D6267D9180BDC19C07B0EDD749BD1476185AD77421299283E9CA6133A0`
