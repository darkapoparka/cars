# Desktop hero car artwork

Generated on 1 October 2026 with the built-in image generation tool, using transparent backgrounds. The requested model label was Image Gen 2.5; the tool does not expose or report a model version, so that exact version is unverified.

`HeroCars.svelte` owns decorative artwork for the desktop Home and Inventory heroes; `PageIntro.svelte` owns their layout. These are concept illustrations, not listing photographs. Desktop media sources avoid downloading the artwork on mobile. The original three-quarter assets below are retained as design provenance; the current pair uses the side profiles recorded at the end of this document.

The two original 1536 × 1024 PNGs remain in the Codex generated-images folder for this chat. Sharp exports are 960 × 640 WebP, quality 90 and alpha quality 100, with no creative edits or crop. Combined delivery size is 168,904 bytes.

## Left edge

Asset: `static/assets/daynight/banners/hero-car-left-v1.webp`

Original: `exec-c99d9aa6-4278-49df-98ec-92c9305912d7.png`

Use case: product-mockup. Asset type: a single transparent vehicle cutout for the LEFT edge of a premium automotive website hero. Primary request: a photorealistic graphite grey European performance SUV, front three-quarter view, viewed mostly from its side. Its FRONT points RIGHT, toward the middle of a webpage. Style: clean professional manufacturer studio photography, physically realistic proportions and tires, crisp glossy graphite paint, subtle soft studio highlights that remain readable against a nearly black webpage. Composition: a single entire car, tightly framed with only a little transparent breathing room, landscape 3:2 canvas. Camera at wheel height, front bumper at the right, rear at the left. Realistic soft contact shadow immediately under the tires with transparency. Backdrop: genuinely transparent alpha, absolutely no room, no scenery, no rectangular floor or backdrop. Constraints: exactly one car, all wheels and body fully visible, no people, no text, no watermark, no fake badges, no exaggerated futuristic features. This is decorative illustrative artwork, not an inventory photograph.

## Right edge

Asset: `static/assets/daynight/banners/hero-car-right-v1.webp`

Original: `exec-359a104e-ca65-46ad-a2bf-8edfa6ef2e57.png`

Use case: product-mockup. Asset type: a single transparent vehicle cutout for the RIGHT edge of a premium automotive website hero. Primary request: a photorealistic silver European premium SUV, front three-quarter view viewed mostly from its side. Its FRONT points LEFT, toward the middle of a webpage. Style: professional manufacturer studio photography with realistic proportions, clean bright silver paint and restrained dark wheels, soft studio highlights readable against a nearly black webpage. Composition: exactly one entire car, tightly framed with little transparent breathing room, landscape 3:2 canvas. Camera at wheel height, front bumper at the LEFT, rear at the RIGHT. Realistic soft transparent contact shadow just below the tires. Backdrop: genuinely transparent alpha, no scene, no room, no rectangular floor or background. Constraints: all wheels and body fully visible, no people, no text, no watermark, no fake badges, no futuristic styling. Decorative illustrative artwork, not an inventory photograph.

## Current side-profile pair — 2 October 2026

The owner requested the side-facing cars shown on Auto Best's local dev server. Import reuses exact, unchanged copies of the two existing generated cutouts from that master. Auto Best's assets and source are unchanged. Their generation, original PNGs and prompts are recorded in [Auto Best side-profile provenance](../../../auto-best/provenance/vehicle-side-profiles-2026-09-06.md).

| Import runtime file            | Auto Best source under static/assets/images/lead | Original generated PNG                        |
| ------------------------------ | ------------------------------------------------ | --------------------------------------------- |
| hero-car-left-profile-v1.webp  | day-night-cutout-gclass-v1.webp                  | exec-0fbd2614-341c-4be0-ba20-e00ea171d1d6.png |
| hero-car-right-profile-v1.webp | day-night-cutout-urus-v1.webp                    | exec-6f719dca-1ddd-4abc-ac53-acb926e9ad3e.png |

Both files are 1000 × 667, with real alpha transparency. Combined delivery size is 149,322 bytes. `content/desktop-hero-artwork.ts` records their measured opaque bounds. The left profile is mirrored in CSS to face inward. The fronts stay 24px outside the shared discovery panel, and both cars rest on one baseline 32px above the hero bottom. Below 1200px the artwork is hidden and its media sources are inactive, keeping narrow layouts clear. No listing photographs or mobile assets were changed.
