# Silver Home service artwork, 4 October 2026

This record documents the initial Home artwork pass. The owner's subsequent request to standardize every service car is implemented in the [shared silver service family](silver-service-system-2026-10-04.md), which supersedes the valuation/leasing choices below and unifies the other service consumers.

The owner requested that Home's four action cards match the approved silver car-and-showroom services preview. Cars now uses one silver estate/SUV pair generated with the built-in ImageGen tool. Sell, Import and Finance reuse the existing reviewed About appraisal, container/import and leasing illustrations through the shared `leadSite.artwork.desktopServiceCards` configuration. Their source files were not changed.

The approved services preview also becomes one mobile Home overview card below brand discovery. Its native Bulgarian/English text links to the existing localized About service section. Both new illustrations are decorative concepts, not evidence of Auto Best's facility or verified stock. The tool does not expose its model version; no specific version is claimed.

New delivery assets:

- `static/assets/images/template/home-collection-silver-v1.webp`
- `static/assets/images/template/home-services-silver-v1.webp`

Both generated source PNGs retain genuine alpha transparency. Sharp/libvips only resized each complete canvas to 800 by 533 and encoded WebP at quality 90, alpha quality 100 and effort 6. No creative pixel edits, recolouring, compositing or mirroring were applied outside ImageGen. The original PNGs remain in the tool's generated-images directory. Home crop metadata fits the visible alpha footprint with a small margin while preserving each full delivery canvas.

`src/lib/data/feature-artwork.ts` owns the Home artwork and crop metadata. `MobileCoreActions.svelte` retains its existing card dimensions, labels, routes and typography. `MobileServicesOverview.svelte` owns the overview card's native layout, translations, lazy-loaded illustration and Fluent arrow. Its image and copy size naturally, with minimum-width handling and wrapping. It is hidden from 768px upward. Other mobile/service artwork consumers keep their existing choices.

Exact [prompts and reference roles](home-silver-cards-2026-10-04.prompts.json), [asset hashes and dimensions](home-silver-cards-2026-10-04.json), and [rendered verification](../docs/home-silver-cards-2026-10-04/README.md).
