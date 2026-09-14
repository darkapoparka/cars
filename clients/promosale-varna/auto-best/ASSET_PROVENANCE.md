# Asset reference and provenance

Runtime media is stored under `static/`; its public URL omits that directory name. Source dimensions, crop regions and vehicle bounds are defined in the artwork/content modules. This page explains the media families without maintaining a second list of file counts.

## Runtime families

| Family | Main location / consumers | Notes |
| --- | --- | --- |
| Template identity | Auto Best logo under `assets/images/template`; icon selected in `src/app.html` | Template branding |
| Vehicle photography | Inventory records and `assets/images/lead/day-night-stock-*` | Source/sample stock photos; some fixtures reuse images |
| Hero cutouts | `vehicle-artwork.ts`, `HeroVehicles`, `VehicleCutout` | Generated vehicles with measured visible bounds |
| Service/menu illustrations | `feature-artwork.ts`, `service-artwork.ts` | Generated conceptual service imagery |
| Body/brand discovery | `home.ts`, `assets/images/icon-box`, `assets/images/partner` | Category art and marque graphics |
| Editorial images | `editorial.ts`, `assets/images/blog` | Mixed reference and photo-derived imagery; see credits |
| Videos | `videos.ts`, local thumbnails | Selected third-party YouTube content |
| Detail/enquiry banners | Current working-preview component references | Some generated images contain baked text or identity |
| Optional team/partners | `demo-content.ts` and related components | Sample presentation, disabled by default |
| Icons | Native SVG components | Retained source notices below |

A filename does not prove a file is currently rendered. Component/data references and `npm run check:assets` determine active ownership. Older revisions may contain intentionally retained source assets.

## Generation and photo records

| Record | Contents |
| --- | --- |
| [Vehicle cutouts](provenance/vehicle-cutouts-2026-09-06.md) | Generated vehicle imagery and encoding |
| [Side profiles](provenance/vehicle-side-profiles-2026-09-06.md) | Broadside artwork and original inputs |
| [Hero pairs](provenance/hero-vehicle-pairs-2026-09-06.md) | Distinct route vehicle pairs |
| [Collection lineup](provenance/collection-lineup-2026-09-06.md) | Homepage collection art |
| [Browse campaign pair](provenance/browse-campaign-pair-2026-09-06.md) | Collection/sell illustrations |
| [Mobile services](provenance/mobile-service-artwork-2026-09-06.md) | Mobile sell/import assets |
| [Mobile cutout](provenance/mobile-service-cutout-2026-09-10.md) | Later mobile cutout treatment |
| [Service cards](provenance/service-cards-2026-09-10.md) | Service-card imagery |
| [Menu services](provenance/menu-service-assets-2026-09-08.md) | Reception, import and leasing concepts |
| [Editorial photos](provenance/editorial-photos-2026-09-08.md) | Photo sources and credits |
| [Borderless editorial](provenance/borderless-editorial-2026-09-08.md) | Generated edits of photo inputs |

The dated records preserve historical filenames and generation descriptions; current runtime can use a later encoding. Decorative cars, facilities and documents are not evidence of real stock, a showroom or a finance agreement. Changing a file extension is not an image conversion.

## Icons and font

Icon history includes Phosphor, Hugeicons and Simple Icons. The components determine which geometry is rendered. Retained notices are [Phosphor](provenance/phosphor-icons-LICENSE.txt), [Hugeicons](provenance/hugeicons-LICENSE.txt) and [Simple Icons](provenance/simple-icons-LICENSE.md). These notices are preserved as received.

Onest is bundled by `@fontsource-variable/onest`. The inherited source record identifies its SIL Open Font License; see [SOURCE_LICENSE.md](SOURCE_LICENSE.md) and the installed package metadata.

## Replacing media

Keep source dimensions accurate and update the consuming record. Bounds use left/top/right/bottom; crop regions use x/y/width/height. Preserve transparent edges where present, use photo framing for stock and containment for decorative cutouts, and inspect text-bearing image pixels during dealer personalization.

Record the asset origin and limitations alongside the dated provenance notes. The presence of a dealer logo, portrait, stock photo or video thumbnail does not itself establish wider reuse rights. [Source notices](SOURCE_LICENSE.md) describes the inherited record.
