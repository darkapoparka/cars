# Graphite mobile dock artwork

The owner requested implementation on 14 October 2026 after comparing App's
floating dock with Auto Best's Fluent outline dock. This is a new five-icon
family, generated together using App's Home, Cars and Menu artwork as style
references. It does not restore the rejected October 3 raster trial.

The [manifest](graphite-bottom-nav-2026-10-14.json) pins the original transparent
generation, reference hashes, five extracted RGBA PNGs and their source bounds.
The built-in image_gen tool supplied the artwork; its underlying model version
was not exposed. Packaging crops the separated silhouettes, preserves their
proportions, reduces them with Lanczos3 and centers them on transparent 96px
canvases. It does not trace, redraw or recolor the artwork. The original remains
in provenance; only the five small PNGs are served to the dock.

`dock-artwork.ts` explicitly binds Home, Cars, Sell, Import and Menu.
`BottomNavIcon.svelte` resolves these paths through SvelteKit's `asset()` helper
and renders each as a decorative image within the existing 24px frame.
Inactive icons use 78% opacity. The owner's follow-up requested a smaller Sell
tag; 2px of internal padding reduces its perceived weight without moving the
frame, label or touch target. Selection retains the existing underline and
semibold caption. Header, menu content, inventory actions and desktop retain
their existing Fluent renderers and notices.

The [matched comparison and focused checks](../docs/mobile-dock-artwork-2026-10-14/README.md)
record local implementation. Owner visual acceptance, immutable template
promotion and dealer publication remain separate states.
