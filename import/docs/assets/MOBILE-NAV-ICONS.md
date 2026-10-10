# Mobile navigation icons

The current navigation uses the existing Hugeicons dependencies: `@hugeicons/core-free-icons` 4.3.2 and `@hugeicons/svelte` 1.1.5. `MobileNavIcon.svelte` renders their original vector paths at 24px with a consistent 1.75px outline. These replace the rejected filled Remix glyphs.

| Destination | Icon          |
| ----------- | ------------- |
| Home        | Home03Icon    |
| Cars        | Car01Icon     |
| Sell        | SaleTag02Icon |
| Import      | Globe02Icon   |
| Menu        | Menu01Icon    |

The active icon has a subtle accent tint behind it, an accent label, and `aria-current="page"`. The bar retains five full-height touch targets, 12px labels, safe-area padding, keyboard focus, and existing routing and modal behavior. No raster-generated icons, icon font, CDN, or new dependency is used.

The retained Remix license belongs to the superseded draft. See the existing Hugeicons packages for their licensing metadata.

Per-icon package subpaths keep the development payload to 6,174 bytes across the five icon modules, replacing the 7.7 MB barrel import without changing their SVG geometry. The package ships only barrel type declarations, so `src/lib/types/hugeicons.d.ts` declares these five subpaths using the package's existing exported types. Those type references introduce no runtime barrel import. The browser regression checks verify that the full icon collection is not requested.
