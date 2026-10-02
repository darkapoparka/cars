# Mobile showroom branding preview — 2 October 2026

The navigation icons and contrasting Filters treatment below were revised later
the same day. See [the current service-flow and control changes](mobile-service-flows-20261002.md).
The generated logo and read-only dealer-project audit remain unchanged.

## Implemented direction

The Mobile master at `templates/mobile` keeps Cars, Services and Contact as its
three bottom destinations. Their icons now use the same simple Lucide outlines,
22px size and 2px stroke; the current destination has a small accent background.
No Account destination was added because this template has no account workflow.

The Cars header remains white and now shows a generated, fictional **SHOWROOM**
logo on the left. Saved cars remains on the right, with its existing saved count
and local persistence. Filters stays beside the make/model and other quick pills;
it now has a stronger contrasting button. Unselected quick pills are light grey,
and selected pills use the existing orange accent. Filtering, category tabs,
sorting and return-to-inventory context retain their existing behavior.

## Dealer references checked

The Cars client registry and `docs/DEPLOYMENT-INVENTORY.json` record 25 public
dealer projects. All 25 names and project IDs were matched against the current
Vercel project listing for team `tyj5`. The connector returned the first page;
the installed Vercel CLI supplied the next page after the connector's project
lookup failed its argument validation. This was a read-only project audit.

Local branding contracts were checked for the registered dealers. There are 24
shared contracts; Al Reef keeps its independent ownership and has no shared
contract. Navara Car's logo was visually inspected as the style reference. This
does not represent a visual review of all 25 hosted sites.

| Dealer | Registered Vercel project |
| --- | --- |
| Al Basma Motors | cars-albasmamotors |
| Al Hamoor Al Thahabi | cars-alhamooralthahabi |
| Al Reef Used Cars | cars-alreefusedcars |
| Asko 96 | cars-asko96 |
| Astracar | cars-astracar |
| Autolife | cars-autolife |
| Automarket Varna | cars-automarketvarna |
| Avangard Auto | cars-avangardauto |
| Champion Auto Pro | cars-championautopro |
| Day and Night Auto Group | day-and-night-a |
| Eliqauto | cars-eliqauto |
| Elit Auto Import | cars-elitautoimport |
| Excellent Cars | excellent-cars |
| F1rst Motors | cars-f1rstmotors |
| Isauto Varna | cars-isautovarna |
| Ivo Auto | cars-ivoauto |
| KG Team Auto | cars-kgteamauto |
| Legend Auto | cars-legendauto |
| Navara Car | cars-navaracar |
| Outletcars Varna | cars-outletcarsvarna |
| Perfect Auto Varna | cars-perfectauto |
| Priselci | cars-priselci |
| Promosale Varna | cars-promosalevarna |
| Texas Drive Auto | cars-texasdriveauto |
| The Dealers Point | cars-thedealerspoint |

No dealer source, logo, deployment, release selection or public alias was changed.
Mobile remains a local template candidate; this preview does not propagate to
the registered dealer projects.

## Generated asset provenance

- Asset: `templates/mobile/public/branding/showroom-placeholder-20261002.png`.
- Header configuration: `templates/mobile/src/lib/showroom.ts`.
- Tool: built-in `image_gen.imagegen`, with `transparent_background: true`.
  The tool does not expose a model/version selector, so the requested “2.5”
  version could not be confirmed or selected.
- Reference: `clients/navara-car/dealer-brand/logo-on-light-20260919.webp`.
- PNG dimensions: 2162 × 727, RGBA, genuine alpha channel; 873,624 bytes.
- Visible alpha bounds (threshold > 8): x=38–2120, y=104–610.
- SHA-256: `7507bbf442fbdb8d54a32d64351eaf0c1d2fb263556d8c3a128b0a05bbb07369`.
- The generated result was copied unchanged into the Mobile master's assets.
  The name SHOWROOM is fictional and must be replaced with a dealer's verified
  identity when personalizing. It does not replace Navara Car's own logo.

Final generation prompt:

> Use case: logo-brand. Create a NEW neutral placeholder dealership logo for a mobile car showroom website, adapting the uploaded Navara Car image as a STYLE REFERENCE only. Replace its dealership wording with exactly "SHOWROOM" in English (S H O W R O O M); do not reproduce Navara's name or claim a real dealership identity. Retain the reference's recognizable automotive composition: a sleek single coupe roofline above a substantial italic wordmark, with a restrained red racing accent and dark graphite lettering with subtle silver edging. Optimize for a WHITE mobile header: strong dark letterforms, readable at roughly 160px wide by 40px high. Simplify tiny chrome details to keep the silhouette and letters clear at small size. It should feel like this existing Cars dealer-logo family, not a generic app icon. ONE compact horizontal logo lockup; tightly bounded wide canvas, approximately 4:1 aspect ratio with minimal transparent outer padding. Genuine alpha transparency; no black or white rectangle, no background scene, no mockup, no extra slogans, no rounded tile, no watermark, no sheets of variations. This is a fictional SHOWROOM template placeholder. Deliver the standalone logo asset.

## Validation

Passed with the pinned Node 22.20.0 runtime:

- ESLint with zero warnings, TypeScript `--noEmit`, and formatting/diff checks.
- All 58 domain tests.
- Production build using `review-preview.mjs`, build ID `kBZcSFjZRD-FrYEE_Pxfo`.
- HTTP 200 for `/`, `/services`, `/contact` and the PNG asset on port 6474.
  The retained `images.unoptimized` configuration serves the PNG directly.
- Selected-pill text contrast: 4.54:1 in the default palette and 4.51:1 in the
  dark palette. The filter count's white text on red is 4.74:1. These are focused
  color checks, not whole-page accessibility acceptance.
- `workspace-doctor.mjs --fetch`: Cars fetched main and preserved unrelated
  dirty source. Independently flagged Admin/template work was left with its owner.

Browser automation remains blocked by the earlier local-URL policy rejection.
No alternate browser surface was used. Fresh 320px, 390px and desktop visual
acceptance, interaction checks and before/after UI screenshots remain pending.
