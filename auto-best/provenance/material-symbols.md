# Material Symbols mobile icons

The owner's 3 October 2026 implementation request replaces Hugeicons in mobile navigation and actions with **Material Symbols Sharp**. Phosphor was explicitly rejected in this review. Do not change the selected family without another owner request.

Official source: [Google's repository](https://github.com/google/material-design-icons) at commit `bd8cb85bd4bad964fe6918f79665bb40c3a8efef`. These are the designed 400-weight, grade-0, optical-size-24 SVG exports. `material-symbols-mobile.ts` retains each upstream path and native `0 -960 960 960` viewBox; no paths are drawn or modified locally. `material-symbols.json` records exact source URLs and SVG/geometry hashes. Retain the [Apache 2.0 license](material-symbols-LICENSE.txt).

`MobileActionIcon.svelte` renders the selected native SVG paths in `currentColor`, with no added strokes, raw HTML, icon font or external font request. The dock uses `home`, `directions_car`, `sell`, `public` and `menu`. Active destinations use the official fill-1 variant; inactive destinations use fill-0. Header, menu, inventory and service consumers share this renderer. Dock frames stay 24px, header frames 22px; existing localized labels, focus and targets remain owned by their controls.

Desktop and social renderers remain separate. Historical Hugeicons and Phosphor data/notices are retained as provenance. The active mobile geometry and font pins are checked by `scripts/check-visual-system.mjs`, included in the typography validation.

## Retained desktop Material Symbols Rounded

The preserved desktop footer contact renderer uses Google's official Material Symbols Rounded library: fill 1, weight 400, grade 0, optical size 24. Retrieved 30 September 2026 at the same pinned commit from [the official symbols directory](https://github.com/google/material-design-icons/tree/bd8cb85bd4bad964fe6918f79665bb40c3a8efef/symbols/web).

The home, directions_car, sell, public, menu, add_circle, grid_view, location_on, call, search, tune, sort and close SVGs come from each symbol's `materialsymbolsrounded/<name>_fill1_24px.svg`. Their original `0 -960 960 960` viewBox and path geometry remain in `src/lib/components/layout/material-symbols.ts`. `MobileNavIcon.svelte` renders those paths in `currentColor`; Footer uses its phone and location glyphs. This retained renderer remains separate to preserve desktop presentation, and shares the retained Apache 2.0 notice.

Icons are hidden from assistive technology; their links and buttons retain localized accessible names and control targets. Lucide remains retired from active navigation; its historical license/provenance is retained.
