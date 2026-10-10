# Desktop Home section artwork - 1 October 2026

The owner explicitly requested imagegen artwork for the Home section headers and rejected the unrelated pale blue body-type header. These are decorative studio concepts; inventory records, photographs, manufacturer logos and article content retain their existing sources.

## Generation and saved assets

Mode: built-in `image_gen.imagegen`, one new opaque image per distinct section. No source-image references, edits, CLI/API fallback or generated text. Full generation prompts appear below.

The original PNG outputs remain at `C:/Users/radev/.codex/generated_images/01a0f599-9f43-7780-bd20-93899c12ae17/`. Source copies, conversion script, dimensions and prompts are preserved in ignored `runtime/desktop-home-artwork-2026-10-01/`. Final project assets are the four versioned WebP files below. Existing images were preserved.

| Section | Original PNG | Final project asset | Dimensions | Bytes |
| --- | --- | --- | --- | --- |
| inventory | `exec-6badaa1b-35dd-448e-9fcf-4511700ac5a6.png` | `static/assets/images/template/home-section-inventory-v1.webp` | 1440 x 480 | 42094 |
| body | `exec-0df34d1d-06c7-4c48-b289-2c74fccb56a1.png` | `static/assets/images/template/home-section-body-v1.webp` | 1440 x 481 | 37480 |
| brands | `exec-140564c4-f109-44c7-9b78-065a58359ecc.png` | `static/assets/images/template/home-section-brands-v1.webp` | 1440 x 480 | 42604 |
| guides | `exec-8f0402ec-7fdf-4dd6-9214-f6909dbda649.png` | `static/assets/images/template/home-section-guides-v1.webp` | 1440 x 480 | 29712 |

Conversion: proportional resize to 1440px width, Sharp WebP quality 88, effort 6. No crop, composite, retouch or background manipulation. The runtime uses a desktop-only picture source and a transparent one-pixel fallback below 992px. HTML owns localized headings, links and focus behavior; the image has empty alt text and is hidden from assistive technology.

`leadSite.artwork.homeSectionBanners` owns dealer-replaceable paths. `SectionBannerArtwork.svelte` owns the decorative image and fade; Home owns the 208px banner geometry. Copy and action sit together on the left with the subject on the right.

## Final prompt set

### inventory

```text
Use case: ads-marketing
Asset type: decorative photographic artwork for an Auto Best desktop website section banner.
Style: premium automotive editorial photography, restrained, believable materials, clean studio art direction.
Composition: very wide panoramic 3:1 image. Left 35 percent is empty nearly flat charcoal #15181d, fading naturally into the subject on the right. All meaningful subject details and complete vehicle silhouettes fit within the middle vertical 65 percent, with generous headroom and floor margin, so a shallow web banner remains usable. Keep the far right edge uncluttered.
Palette and lighting: charcoal black, neutral silver and white, with one subtle deep red #c40101 architectural accent. Soft white studio highlights, neutral shadows, no blue tint. Quiet premium mood.
Constraints: no letters, words, numbers, logo, manufacturer badge, watermark, UI, button, frame, collage, neon, dramatic smoke, road markings or people. The website will supply its own accessible heading and button.
Subject: one elegant silver European-style sport wagon, complete car in a three-quarter front view, facing slightly toward the empty left side, parked in a dark minimalist showroom. Beautiful realistic wheels, glass and bodywork. Thin deep red vertical architectural seam behind the car, subtle reflected light on the charcoal floor. Generic unbadged vehicle. Car occupies the right 60 percent.
```

### body

```text
Use case: ads-marketing
Asset type: decorative photographic artwork for an Auto Best desktop website section banner.
Style: premium automotive editorial photography, restrained, believable materials, clean studio art direction.
Composition: very wide panoramic 3:1 image. Left 35 percent is empty nearly flat charcoal #15181d, fading naturally into the subject on the right. All meaningful subject details and complete vehicle silhouettes fit within the middle vertical 65 percent, with generous headroom and floor margin, so a shallow web banner remains usable. Keep the far right edge uncluttered.
Palette and lighting: charcoal black, neutral silver and white, with one subtle deep red #c40101 architectural accent. Soft white studio highlights, neutral shadows, no blue tint. Quiet premium mood.
Constraints: no letters, words, numbers, logo, manufacturer badge, watermark, UI, button, frame, collage, neon, dramatic smoke, road markings or people. The website will supply its own accessible heading and button.
Subject: a carefully spaced lineup of three complete generic unbadged cars showing distinct body silhouettes: white compact SUV, silver sedan, graphite wagon. Three-quarter views at a consistent camera height, all wheels visible, no overlap between their silhouettes. Vehicles occupy the right 65 percent, balanced and visually calm. Dark minimalist studio floor with a very subtle deep red horizontal architectural light seam.
```

### brands

```text
Use case: ads-marketing
Asset type: decorative photographic artwork for an Auto Best desktop website section banner.
Style: premium automotive editorial photography, restrained, believable materials, clean studio art direction.
Composition: very wide panoramic 3:1 image. Left 35 percent is empty nearly flat charcoal #15181d, fading naturally into the subject on the right. All meaningful subject details and complete vehicle silhouettes fit within the middle vertical 65 percent, with generous headroom and floor margin, so a shallow web banner remains usable. Keep the far right edge uncluttered.
Palette and lighting: charcoal black, neutral silver and white, with one subtle deep red #c40101 architectural accent. Soft white studio highlights, neutral shadows, no blue tint. Quiet premium mood.
Constraints: no letters, words, numbers, logo, manufacturer badge, watermark, UI, button, frame, collage, neon, dramatic smoke, road markings or people. The website will supply its own accessible heading and button.
Subject: refined automotive craftsmanship, a dramatic close view of the front quarter of a neutral silver premium car: a crisp unbadged headlamp, sculpted bonnet, clean wheel and polished body edge. The car detail fills the right 60 percent, naturally disappearing into a charcoal studio at the left. No identifiable manufacturer design or logos. A restrained red reflection runs along one metal edge.
```

### guides

```text
Use case: ads-marketing
Asset type: decorative photographic artwork for an Auto Best desktop website section banner.
Style: premium automotive editorial photography, restrained, believable materials, clean studio art direction.
Composition: very wide panoramic 3:1 image. Left 35 percent is empty nearly flat charcoal #15181d, fading naturally into the subject on the right. All meaningful subject details and complete vehicle silhouettes fit within the middle vertical 65 percent, with generous headroom and floor margin, so a shallow web banner remains usable. Keep the far right edge uncluttered.
Palette and lighting: charcoal black, neutral silver and white, with one subtle deep red #c40101 architectural accent. Soft white studio highlights, neutral shadows, no blue tint. Quiet premium mood.
Constraints: no letters, words, numbers, logo, manufacturer badge, watermark, UI, button, frame, collage, neon, dramatic smoke, road markings or people. The website will supply its own accessible heading and button.
Subject: a tasteful automotive editorial still life on a charcoal desk on the right 60 percent: a realistic plain black car key fob, a small cream unprinted document folder and a single red pencil, with a softly out-of-focus neutral silver car behind glass in a minimalist showroom. No readable text, no invented symbols, no brand logos. Clean negative space and quiet professional buying-advice mood.
```
