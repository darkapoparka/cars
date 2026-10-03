# Shared silver service illustrations — 4 October 2026

The owner requested that every service-card car match the bright silver estate in the approved Home services overview. The older valuation and leasing sedan was visibly different in model and paint. The built-in ImageGen tool replaced it in two existing illustrations, using `home-services-silver-v1.webp` as the explicit vehicle/paint reference. A third edit removed the showroom from that approved scene to create a standalone estate for the shared mobile Sell/Import hero.

New delivery assets:

- `static/assets/images/template/service-valuation-silver-v2.webp`: valuation estate and magnifier, 800 × 533.
- `static/assets/images/template/service-leasing-silver-v3.webp`: leasing estate, percentage and notebook, 800 × 532.
- `static/assets/images/template/service-car-silver-v2.webp`: standalone estate cutout, 800 × 532.

The generated PNGs remain in the tool's generated-images directory. Sharp/libvips resized each full canvas to 800px wide and encoded WebP at quality 90, alpha quality 100 and effort 6. No recolouring, creative pixel editing, compositing or mirroring occurred outside ImageGen. Alpha inspection confirmed transparent pixels and preserved the generated channel; measured crop metadata includes an 8px margin. The tool does not expose its model version.

`leadSite.artwork.serviceIllustrations` is the dealer-owned source registry. Existing About, banner and campaign configuration fields resolve to that registry. `serviceIllustrationArtwork` owns measured dimensions/crops; Home, service-card variants, desktop Home actions, discovery and service menus reuse its entries. About's full-canvas layout remains unchanged. Mobile Home and service heroes letterbox shared artwork into their existing aspect ratios; Sell and Import use the exact same standalone car pixels while retaining their service-specific side props.

Collection, overview, showroom and import reuse existing approved images. Inventory photography, dealer identity, labels, routes, typography, icon families and card CSS are unchanged. These illustrations are decorative concepts, not evidence of a dealership facility or verified inventory. Superseded sources are retained for provenance without active service-card requests.

Exact [prompts and reference roles](silver-service-system-2026-10-04.prompts.json), [source/delivery hashes and alpha bounds](silver-service-system-2026-10-04.assets.json), and [matched browser evidence](../docs/silver-service-system-2026-10-04/README.md).
