# Home section banner styles and comparison history

Generated with the built-in `image_gen.imagegen` tool on 8 October 2026 for the owner's requested local comparison. These are decorative material illustrations, with no stock, premises, vehicle or business claims. This comparison does not select a template release or update dealers.

The earlier trials below record their original implementation. The latest selection and reusable client configuration are recorded at the end.

The initial comparison input was the generated four-row board, saved locally as `runtime/banner-background-concepts-20261008/banner-background-comparison-1e54b210.png`. Its Current row uses the existing `home-section-shared-backdrop-v1.webp`; that original remains intact and continues to serve the vehicle heroes. Featured Cars used it during the initial four-way comparison.

Each new plate was generated separately from its corresponding comparison row. The common instruction requested one full-bleed panoramic background, removed all labels, headings, buttons, symbols, margins and rounded corners, retained a wide charcoal center suitable for live white text, and preserved the selected material and edge lighting.

Initial four-way comparison:

| Home section | Comparison | Public asset | Natural dimensions | WebP bytes |
| --- | --- | --- | --- | --- |
| Featured Cars | Current graphite-dot texture | `home-section-shared-backdrop-v1.webp` | Existing original | Unchanged |
| Body Types | A: Matte Graphite | `home-section-matte-graphite-comparison-v1.webp` | 2172 × 724 | 110812 |
| Brands | B: Satin Metal | `home-section-satin-metal-comparison-v1.webp` | 2172 × 724 | 74888 |
| Guides | C: Soft Studio Light | `home-section-soft-studio-comparison-v1.webp` | 2103 × 748 | 156642 |

All public assets live in `static/assets/images/template/`. Sharp encoded the full generated canvases as WebP at quality 86, effort 6, without cropping, resizing or compositional edits. The original generated PNG files remain in the Codex generated-image directory.

## Individual generation instructions and outputs

- **Matte Graphite:** Use the second row only. Very dark matte charcoal graphite with extremely fine understated tactile grain, gentle tonal variation and almost even lighting; no dimples, obvious repeating pattern or metallic sheen. Source PNG: `exec-7cf796ee-226c-4892-8aaf-30d5a25a46ac.png`. WebP SHA-256: `db93d58cace3eb9134fe7a3aa6607d2b885ab31a5169cac86c0962822a1bf591`.
- **Satin Metal:** Use the third row only. Fine horizontal brushed dark steel grain, a broad charcoal-black center fading into lighter satin graphite at the extreme edges; restrained photographic texture, avoiding exaggerated chrome. Source PNG: `exec-5be539a2-205b-434c-8be4-4f6fcc23b903.png`. WebP SHA-256: `052a74f41b846afd656a43a1773df59a017c6f5d30abeba48172eae2fe4ddd70`.
- **Soft Studio Light:** Use the fourth row only. Fine charcoal matte grain with broad diffused neutral-gray studio illumination at the edges and a broad dark center; natural soft transitions without dimples, metal stripes, glossy reflections or sharp light beams. Source PNG: `exec-76b97ad6-d139-4e9d-af3f-287d97f4e117.png`. WebP SHA-256: `28af66bca96984bbafb7beede8a09276f490b0554e0154bf1ed09683e0e7d32c`.

Source PNG directory: `C:/Users/radev/.codex/generated_images/01a11b12-d233-79a0-805b-5f6447eb28f2/`.

The mapping is owned by `leadSite.artwork.desktopHomeSectionBackgrounds`. Home passes each background through its existing section wrapper. The only CSS consumer remains inside the existing `min-width: 992px` block, so mobile and tablet layouts, typography, banner geometry, live copy and buttons retain their current behavior. The existing `discoveryBackground` remains unchanged for other routes and hero consumers.

## Selected Motorsport stripe trial

The owner then requested the third row, Motorsport Stripes, from `runtime/banner-background-concepts-20261008/banner-car-directions-3a1ac648.png` (its printed label is `2` because that concept board starts at zero). All four desktop Home headings now use the same retained Matte Graphite plate with red and light diagonal accents drawn in CSS. The colors consume the existing dealer theme and surface tokens. Absolute pseudo-elements stay behind the live copy, have no pointer events, and are confined to the existing desktop breakpoint and heading overflow clip. Banner sizes, layout, markup, heading/button typography and mobile/tablet styles stay unchanged.

The Satin Metal and Soft Studio plates remain inventoried as retained comparison assets. The chosen trial adds no further runtime image; all four headings share one existing 110812-byte WebP. This remains a local review trial, with no release or dealer publication.

## Additional refined concept set

The owner also requested another set of banner ideas. The built-in image-generation tool produced a four-row comparison with labels numbered from 1 at the top: Precision Pinstripes, Apex Curve, Satin Bodywork and Track Edge. It used the previous automotive concept board as a composition reference and requested restrained material, quiet dark centers, identical live-style headings/buttons and automotive details confined to the outer edges.

The generated PNG is `exec-c553ba39-9dc5-4e5e-bedc-516ec9c5573a.png` in the same Codex generated-image directory. A copy is saved at `runtime/banner-background-concepts-20261008/banner-refined-directions-c553ba39.png`. This board is a preview; its alternatives are not runtime assets. The selected Motorsport stripe trial remains on the page.

## Final five-way Home preview

The owner requested a Home comparison, with the kerb repeated at the opposite lower-right corner and complete circuit outlines on both sides. The built-in image-generation tool created four separate background-only plates from `runtime/banner-background-concepts-20261008/banner-circuit-lights-2facd0f5.png` in one final generation round. The instructions removed all embedded text and UI, kept a calm dark center, placed useful detail near the middle horizontal crop, and retained the selected headlight/taillight direction. The circuit is a fictional decorative outline, not a named track map.

| Preview query | Asset under `static/assets/images/template/` | Source PNG | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `banner=motorsport` | Existing Matte Graphite plus CSS stripes | Retained original | 110812 | Recorded above |
| `banner=kerb` | `home-section-kerb-balanced-v1.webp` | `exec-53951cdc-671d-48bf-bf6f-db5e265ee67c.png` | 274714 | `328e69bd320f6e79872b9008f9006794d81b5dde87a7b750a3f80ff528cd80f2` |
| `banner=circuit` | `home-section-circuit-balanced-v1.webp` | `exec-e69add1f-3d45-4aaf-9fa5-9b2cafc345b7.png` | 14794 | `1c48550ae61edd9d405baee2150c95e221d2d2b67a6d74456c0d21539d4ad413` |
| `banner=headlights` | `home-section-headlights-v1.webp` | `exec-390b1c30-3658-43af-ad23-57aa7735f790.png` | 48258 | `4dbcda86cabb103707566ce18cef70f769625926c4bd7ebde4c6aa265d4efe76` |
| `banner=taillights` | `home-section-taillights-v1.webp` | `exec-ea13d031-b165-49e6-adac-11cd58189588.png` | 37270 | `bff2d59e00bb74145b8d7feff5a242544dd2e827afc55be1b80a1cd3088087a8` |

The first three new plates are 2172 × 724; the taillight plate is 2170 × 725. Original PNGs remain in the Codex generated-image directory above. Sharp only encoded the complete natural-size canvases as WebP at quality 86, effort 6.

The local Home page has a development-only desktop selector for the five variants. Its `banner` query selects one shared image for all four section headings; unknown values fall back to Motorsport. Switching preserves scroll and keyboard focus. The selector and URL override are gated by SvelteKit's `dev` flag, so the preview controls do not appear in production builds. The new paths are owned by `leadSite.artwork.desktopHomeBannerVariants`. Existing artwork and typography remain intact.

The circuit plate's visible white lines occupy source y=226…453. Its `center 45%` position keeps both complete outlines within the middle crop at the existing 164px minimum banner height and 1360px maximum content width. The source/HTTP verification record checks 992, 1280, 1440 and 1920px crop bounds; this is geometric crop evidence, not a browser screenshot. The selector is hidden below 992px and the existing mobile CSS remains unchanged. No release lock, dealer source or deployment was updated.

## Selected kerb and reusable client choices — 9 October 2026

The owner selected **Бордюри / Kerbs** as the favorite, requested a matching curved corner on the right, a mobile placement and retention of all five styles for client choice. `leadSite.artwork.homeSectionBanner` now selects `variant: 'kerb'` and `mobile: 'featured'`. The choice is a master default that a client copy owns independently; `mobile: 'none'` retains the previous plain mobile heading. `homeSectionBannerAssets` retains the five styles: Motorsport stripes, Kerbs, Circuit, Headlights and Taillights.

The built-in image-generation tool edited the earlier kerb plate, retaining and refining the left-hand curve and replacing the right kerb with quiet asphalt. The reusable output contains one curve only. CSS clips its left half and repeats that exact image with a 180-degree rotation at the lower-right. Both sides therefore share the same curvature, proportions and segment geometry rather than separately generated approximations. Both layers are decorative, behind live text and without pointer events.

- New asset: `static/assets/images/template/home-section-kerb-corner-v2.webp`.
- Source PNG: `exec-92fdf860-442c-4f96-8195-5b8049140352.png` in the original Codex generated-image directory above.
- Full canvas: 2172 × 724; WebP quality 86, effort 6; no resizing, cropping or compositional edits during encoding.
- Encoded size: 206216 bytes; SHA-256: `258a5297e0d8116457591c6b8e37ca4b13981da8212ee55eff2ccd3d9825dbdb`.
- Earlier `home-section-kerb-balanced-v1.webp` remains inventoried as comparison history. The original discovery/hero texture remains intact.

All four desktop headers use the configured style. On mobile below 768px, only the Featured Cars heading gets a compact banner, with a 64px minimum height that can grow with text, centered white copy and the same matched corners. Other mobile headings, cards, controls, typography and icons keep their existing presentation. Tablet layouts from 768px to 991px retain their previous layout.

The five query choices also work in a built client review while `template.mode` is `preview`. An explicit `?banner=...` review link shows the desktop selector; a normal built Home page omits it. Development retains its local selector. Published production sites ignore query overrides and use their configured default. Invalid preview choices fall back to that same configured default. See [dealer reuse](../REUSE_GUIDE.md#home-section-background-choices).

The browser tool remains blocked by its earlier URL-policy rejection. Asset inspection, source/crop checks and HTTP/build verification are separate from new rendered desktop/mobile screenshots and physical-device acceptance. This iteration does not update the release lock, client sources or deployments.

Verification on Node 22.20.0 passed: Svelte/TypeScript reported zero errors and warnings; architecture, CSS, token, typography, asset and locale-source guards passed; the production build completed; and the Cars workflow documentation check passed. The existing mobile/tablet CSS is identical outside the explicitly enabled Featured Cars heading rules. The new plate is requested by one selected style and reused by both corners rather than adding separate left/right image downloads.

The final local checks covered 14 BG/EN development HTTP cases, 28 production component SSR cases across preview/published modes, and 14 BG/EN HTTP cases on a fresh built preview. All five assets served successfully. Published-mode SSR used `dev=false` without changing the source config and ignored every review override. A normal built Home page omitted the selector, while explicit review links retained all five choices. The temporary built-preview helper stopped only its own server; the development server remained available on port 6461. Final records are saved under `runtime/banner-background-concepts-20261008/selected-kerb-verification.json` and `client-banner-preview-verification.json`.

The Svelte autofixer retained its existing generic `goto()` advisory because it does not recognize `resolve(...)` inside the localized `i18n.href(...)` wrapper. The handler still uses the project's native localized route contract, and Svelte/TypeScript and the build passed. A temporary full-disk condition interrupted writing a QA module; available space recovered, and the final QA completed without changing source/recovery ownership. No recursive cleanup was performed after the automatic policy rejection.

## Clean curved strips and real Nordschleife — 9 October 2026

The owner rejected the coarse textured kerbs and asked for a more finished composition: a left strip paired with a similar strip at the opposite angle on the right, and a recognizable Nürburgring map. The owner delegated the finish choice to the agent. The selected direction is clean red/white curved ribbons with a quiet charcoal center.

The built-in image-generation tool refined the earlier single-corner plate into `home-section-kerb-clean-v3.webp`. Its source is `exec-87e4e250-9f36-48b5-add8-8c7d97693a20.png` in the original Codex generated-image directory. The full 2172 × 724 canvas was encoded as WebP quality 92, effort 6, without cropping, resizing or compositional edits: 32110 bytes, SHA-256 `dc2d564577e6e2a2c065701092afac9c11ba8ac212dd5de46f742b3159997505`. The asset removes distressed asphalt and cracked paint in favor of smooth alternating segments and restrained matte shading. Earlier versions remain inventoried as history.

The frontend now fits the full natural canvas height into the banner edge rather than using the old wide `cover` crop. This retains the visible bend. Separate edge layers anchor the left ribbon and rotate the identical source into the lower-right. A mask blends only their quiet background into the shared dark surface; the live copy remains centered above the decoration. The same composition appears in the compact mobile Featured Cars heading.

The former fictional circuit has been replaced by the [sourced Nordschleife SVG](nordschleife.md), retaining the original track coordinates and its public-domain source. Both edge boxes use `contain` so the entire outline remains visible. Their orientation is identical rather than geographically mirrored. The localized preview option now reads **Нюрбургринг / Nordschleife**; its existing `banner=circuit` link remains valid. The five client configuration choices are retained.

This is a local visual revision. The existing browser-policy block still prevents fresh rendered screenshots; source, asset and HTTP/build evidence does not constitute final owner visual approval. No template release, client refresh or deployment is selected here.

Verification of this revision completed on Node 22.20.0: Svelte/TypeScript reported zero errors and warnings; architecture, CSS policy, tokens, typography, assets (361 guarded media files), locale-source and Cars workflow-document checks passed. All 27 locale unit tests passed, and the production build completed with the adapter. The focused verification covered 14 development HTTP cases, 28 preview/published component SSR cases and 14 HTTP cases on a fresh built preview, with all five assets served. Published-mode SSR ignored review overrides; normal built Home omitted the selector. Existing mobile/tablet CSS remained identical outside the explicit Featured Cars banner rules.

The Svelte autofixer again returned only its generic localized `goto()` advisory; the handler still resolves the route inside `i18n.href(...)`. The built-preview helper stopped its own temporary server, while the Node 22 development server remained on port 6461. These results are source/server checks, not new rendered desktop/mobile screenshots. The revision remains local and uncommitted for review.

## Annotated curve correction and quieter circuit — 9 October 2026

The owner supplied a marked desktop screenshot showing that the right curve should sweep inward toward the lower centre, matching the left horizontally. The previous 180-degree rotation was the wrong orientation. The owner explicitly requested image generation and delegated a quieter Nürburgring treatment.

The built-in image-generation tool used the owner's marked screenshot and the earlier clean kerb as references to generate both inward-facing curves together. The red annotations, heading, button and surrounding UI were excluded from the background. A companion asphalt plate leaves the right side quiet for the separately retained real Nordschleife geometry. Neither raster contains embedded text or dealer identity, and the circuit plate contains no invented track outline.

| Runtime asset | Source PNG in the retained Codex generated-image directory | Dimensions | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `home-section-kerb-paired-v4.webp` | `exec-a31fd129-db2f-4cdb-b1fa-fcf67f6622f0.png` | 2079 × 756 | 71206 | `16350d7384b16f469065304b5656a6e8d74582beb5ae80ef5c2aad1fd760cea7` |
| `home-section-circuit-asphalt-v3.webp` | `exec-01443610-f699-4412-81b0-ce9972e58300.png` | 2079 × 756 | 185282 | `13f542eab065d61b065199a2657ed6169773e86b2e9f8847732849714072bfe0` |

Sharp encoded each complete natural canvas at WebP quality 90, effort 6; it performed no crop, resize or compositional edit. The original PNGs and earlier runtime assets remain retained.

The frontend fits the kerb's full height inside edge layers and reflects the same left curve horizontally with `scaleX(-1)` on the right. Bounded edge widths prevent the other curve from the paired source from entering the centre. The corner background fades after the painted curve into the shared dark surface. Both sides now sweep inward from the outer top corners. The circuit uses its generated asphalt plate with one contained, unmirrored Nordschleife outline at opacity 0.24 on desktop and 0.16 on mobile. Both styles remain behind live text without pointer events.

The default remains Kerbs for all four desktop Home headers and the compact mobile Featured Cars heading. All five client styles and their preview/published behavior remain available. At this revision's closeout it was local and uncommitted; the supplied screenshot was before evidence, while fresh rendered after screenshots were unavailable under the then-current browser-policy block.

## Final finish and phone selection

The owner's subsequent [9 October polish](home-section-polish-2026-10-09.md) supersedes the edge/map treatment described above. It retains the admired asphalt, pairs the Circuit kerbs, removes the map and replaces the Kerbs material. All five choices remain. The menu now offers a centered review pill opening a separate selection modal. Matched rendered evidence and final built-preview checks are saved under [banner polish](../docs/banner-polish-2026-10-09/); the owner authorized the scoped Cars source commit/push.
