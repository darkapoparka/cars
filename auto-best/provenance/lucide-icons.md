# Historical Lucide provenance

Retired from active navigation on 30 September 2026 at the owner's request. The current mobile family is [Hugeicons Stroke Rounded](hugeicons.md). The following records the earlier implementation and preserves its license.

# Navigation icons

`src/lib/components/layout/MobileNavIcon.svelte` uses the Lucide house, car-front, tag, globe, menu, map-pin and phone SVG geometry. Retrieved 27 September 2026 from https://github.com/lucide-icons/lucide/tree/main/icons. Paths are embedded locally without a runtime dependency; the original 24px viewBox and 2px stroke are retained. `BottomNavIcon.svelte` delegates to this renderer, keeping the dock and header in the same outline family. The dock maps Home to house, Cars to search, Sell to circle-plus, Import to globe and Menu to layout-grid. All five icons use a 24px frame, rounded stroke ends and joins, and no raised item or filled backdrop. The link/button captions supply their accessible names.

The additional [circle-plus](https://github.com/lucide-icons/lucide/blob/5a92b9ba262de5bf10e864219883267672c05db8/icons/circle-plus.svg) and [layout-grid](https://github.com/lucide-icons/lucide/blob/5a92b9ba262de5bf10e864219883267672c05db8/icons/layout-grid.svg) sources were retrieved 30 September 2026 at commit `5a92b9ba262de5bf10e864219883267672c05db8`. The two plus paths are combined without changing their geometry.

The accompanying `lucide-icons-LICENSE.txt` preserves the upstream ISC copyright and license. Search, filter, sort and close glyphs remain the existing template paths.
