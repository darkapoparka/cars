# Desktop service-card illustrations, 3 October 2026

Four decorative concept cutouts replace the desktop About service-card icons: a glass-front showroom, a cargo ship, a percentage symbol with a document folio, and a magnifying glass for vehicle appraisal. They share graphite, silver and restrained red materials. These illustrations do not depict a verified facility, actual inventory, a real shipping arrangement or offered financing rates. Mobile retains its existing icon treatment.

Generated with the built-in ImageGen tool. Its exact model version is not exposed by the tool; this record does not claim a particular version. The showroom was generated first. Each companion used that local image as a style reference with a distinct prompt and transparent-background output. Full [generation prompts](desktop-service-cards-2026-10-03.prompts.json) and [source/output manifest](desktop-service-cards-2026-10-03.json) preserve the generation and delivery details.

| Service | Runtime asset |
| --- | --- |
| Viewing | `static/assets/images/template/desktop-service-inspection-v1.webp` |
| Import | `static/assets/images/template/desktop-service-import-v1.webp` |
| Financing | `static/assets/images/template/desktop-service-leasing-v1.webp` |
| Trade-in appraisal | `static/assets/images/template/desktop-service-trade-in-v1.webp` |

Sharp/libvips 0.35.4 resizes each complete 1536 x 1024 source canvas to 800 x 533 and encodes WebP at quality 90, alpha quality 100 and effort 6. No subject crop, compositing, recolouring, alpha removal or creative pixel editing is applied. All four delivery files retain alpha. Original PNG outputs remain at the generated-image paths recorded in the manifest; earlier icons and their provenance are retained.

`leadSite.artwork.desktopServiceCards` owns the replaceable asset paths. `AboutProcess.svelte` selects the desktop picture source at 992px and above; a transparent one-pixel fallback prevents these illustrations from loading on mobile. The artwork is decorative with empty alternative text; the existing localized heading, description and enquiry link communicate each service.

The desktop About navigation dropdown reuses the viewing, import and financing illustrations through `desktopServiceArtwork` in `src/lib/data/feature-artwork.ts`. Its existing card frame and black/red surfaces are retained. The showroom has a centered optical inset through its crop frame, matching the 92% treatment in the About cards. Earlier menu illustrations remain available to the independent mobile action consumers; the mobile menu continues to use its existing direct links.

The showroom is displayed at 92% inside the shared frame to balance its larger rectangular silhouette against the shipping, percentage and magnifying-glass scenes. This is a desktop CSS adjustment; the source image, frame size, copy alignment and mobile treatment are unchanged.
