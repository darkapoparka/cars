# Full-width Inventory search and pills — 5 October 2026

Desktop Inventory now has a full-width, white outlined search field on its own row. It is 48px high with an 18px hint and an integrated icon submit action. Type shortcuts and quick filters use outlined pills underneath it, with no separator lines. Selected types and filters use black fill and white text. Retained vehicle artwork, the native query behavior and existing dialogs remain in their current owners.

## Matched comparison

Before images are the native after captures from the immediately preceding source at `d9af90f381b94eda336a0febebc11148f794a86c`, copied without image changes. After images are fresh native-browser captures from the frozen production build in [verification inputs](verification-inputs.json). Locale, default query, scroll position and viewport match. The desktop viewport is 1440 × 1000; both native image canvases are 1425 × 990.

![Before, BG Inventory](inventory-bg-1440-before.jpg)

![After, BG Inventory](inventory-bg-1440-after.jpg)

EN comparisons are [before](inventory-en-1440-before.jpg) and [after](inventory-en-1440-after.jpg). Additional after captures cover BG/EN at 768, 1024 and 1920px, and a [selected SUV](inventory-bg-1440-selected-after.jpg). Search spans the available inner panel width at every desktop width. Pills wrap into two filter rows at 768px. No captured width has horizontal overflow or unloaded visible images. At 1440px, the panel is 222px high and the first card starts at 599.23px, compared with 586px before. Measurements are in [before](metrics-before.json) and [after](metrics-after.json).

## Verification

- Svelte check: zero errors and warnings. Scoped ESLint, Prettier, architecture and Git whitespace checks pass. Image signatures pass for 976 retained assets.
- Production build passes from frozen QA inputs, including the retained adapter and public asset packaging. Existing LightningCSS `@reference` warnings remain.
- **Nine focused browser cases pass** in the existing desktop search, style parity and storefront control suites. They cover BG/EN Enter and icon submission, clearing and history, canonical query preservation, native submission without JavaScript, type links, header search, filter dialogs and accessibility.
- Native-browser warning/error logs are empty after the capture matrix and type selection.
- **All four BG/EN mobile comparisons at 320 and 390px are byte-identical.** The separate mobile composition remains unchanged. See [mobile comparison](mobile-comparison.json).
- Task source hashes match the frozen production QA input. The [finished preview measurements](final-preview.json) verify the same layout on the owner's existing port 6790.

Logs and frozen QA inputs remain in ignored runtime storage. These are local source and browser checks; template release and dealer deployment were not performed.

## Source boundary

Six components changed: `InventoryPage`, `InventorySearch`, `InventoryTypeShortcuts`, `InventoryToolbar`, `InventoryFilter`, and the desktop-only compact appearance of `DesktopSearchControl`, which Inventory alone uses. Architecture and desktop styling references describe the revised layout. The lockfile, approved assets, query domain, mobile composition and dialogs retain their previous contents. Unrelated dirty work remains preserved.
