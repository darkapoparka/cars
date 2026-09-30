# Material Symbols Rounded

The preserved desktop footer contact renderer uses Google's official Material Symbols Rounded library: fill 1, weight 400, grade 0, optical size 24. Retrieved 30 September 2026 at commit bd8cb85bd4bad964fe6918f79665bb40c3a8efef from https://github.com/google/material-design-icons/tree/bd8cb85bd4bad964fe6918f79665bb40c3a8efef/symbols/web.

The home, directions_car, sell, public, menu, add_circle, grid_view, location_on, call, search, tune, sort and close SVGs come from each symbol's materialsymbolsrounded/<name>_fill1_24px.svg. Their original 0 -960 960 960 viewBox and path geometry are preserved in src/lib/components/layout/material-symbols.ts. MobileNavIcon.svelte renders the paths in currentColor with no icon font, remote request or runtime dependency. Mobile surfaces now use the separate Hugeicons renderer described in `hugeicons.md`. This renderer remains separate to preserve desktop presentation.

Icons are hidden from assistive technology; links and buttons retain their localized accessible names and 44px minimum targets. The retained material-symbols-LICENSE.txt contains upstream Apache 2.0 terms. Lucide is retired from the active navigation; its historical license/provenance remains preserved.
