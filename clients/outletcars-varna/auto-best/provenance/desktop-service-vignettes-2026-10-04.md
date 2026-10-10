# Desktop service vignettes, 4 October 2026

The owner preferred the earlier reception and car-with-container compositions to the whole-showroom and cargo-ship concepts, and then requested a consistent vehicle direction across the service row. Two new decorative assets were generated with the built-in `image_gen` tool, using the retained `menu-showroom-v2.webp` and `menu-import-v2.webp` as composition and material references. Leasing was edited with the same tool to turn its car toward the lower right, using the retained appraisal illustration only as an orientation reference. The tool does not expose its model version; no specific version is claimed.

The showroom vignette uses a graphite reception counter, brushed metal and a glass entrance. Import uses one silver estate car emerging from one open graphite container. Leasing retains its graphite/red percentage symbol and document folio, with the car facing the same direction as import and appraisal. Its percentage symbol remains correctly oriented; the scene is not a mirrored raster. These are generated concepts, not photographs or evidence of Auto Best's facilities, stock or import arrangements. The appraisal illustration remains unchanged.

All three new images have genuine alpha transparency. Sharp/libvips only resized the complete generated canvases to 800×533 and encoded WebP with quality 90, alpha quality 100 and effort 6. No cropping, compositing, recolouring or creative pixel edits were applied outside ImageGen. The original generated PNGs remain under the tool's generated-images directory. The first showroom result was also saved from the returned image data after the tool's initial local save produced an empty file; the restored PNG is byte-identical to that returned data.

- `static/assets/images/template/desktop-service-inspection-v2.webp`
- `static/assets/images/template/desktop-service-import-v2.webp`
- `static/assets/images/template/desktop-service-leasing-v2.webp`

The shared `leadSite.artwork.desktopServiceCards` config supplies both About's desktop service cards and the About navigation dropdown. Mobile service icons and older mobile artwork are unchanged. Previous service v1 files remain in `static/` for provenance without being requested by these desktop consumers.

Exact prompts and input roles: [prompt set](desktop-service-vignettes-2026-10-04-prompts.json). Dimensions, encoding settings, source locations and SHA-256 hashes: [manifest](desktop-service-vignettes-2026-10-04.json).
