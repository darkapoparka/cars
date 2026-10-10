# Mobile Audi chrome mark

`static/assets/images/brand-curated/audi-rings-chrome-mobile.webp` is an unchanged
copy of the tracked Cars Import template asset
`templates/import/static/assets/daynight/brands/audi.webp`.
It is inherited template artwork, not an official manufacturer download.
The Audi mark remains its owner's trademark and labels the Audi inventory shortcut.

The transparent 1800 by 1200px source contains chrome rings and a red wordmark.
The mobile card renders only its measured rings bounds `[73, 90, 1726, 672]`
through the existing visible-bounds crop; the source pixels are unchanged.
The frame is capped at 104px wide alongside the 46px BMW and Mercedes marks.

`mobileBrandArtwork` in `src/lib/data/home.ts` owns the source and bounds.
`BrandSection.svelte` selects it through a native picture source below 768px.
The existing Cardog SVG and its retained MIT record continue to serve desktop
and tablet. The existing make filter, stock counts and accessible brand name
are preserved.
