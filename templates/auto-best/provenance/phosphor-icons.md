# Mobile dock icons

`src/lib/components/layout/BottomNavIcon.svelte` embeds Phosphor's duotone house, car-profile, tag, globe-simple and squares-four SVG geometry. The dock uses these at 24px. They replace the dock's Lucide glyphs; other header and search glyphs retain their existing renderer.

Sources retrieved 30 September 2026 from [Phosphor Icons core](https://github.com/phosphor-icons/core/tree/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/duotone), commit `2b75f3ad12b420c9504ef05df8d2564a28f8500e`. Original 256px viewBoxes, filled paths and 20% duotone opacity are retained. The SVGs inherit the navigation foreground color, are hidden from assistive technology and have no focus target. Link/button text supplies their accessible names. No runtime package or font is loaded.

The existing [Phosphor MIT notice](phosphor-icons-LICENSE.txt) matches this source and preserves its copyright and license for redistribution.
