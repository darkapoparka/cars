# Mobile Sell service illustration

## Current commerce banner, 30 September 2026

The owner selected the composition on the Cars App reference at `http://localhost:3001/bg/`. The current Sell and menu banners reuse `templates/app/public/showroom/black/home-exchange-v1.png`: charcoal studio background, two recognizable cars, exchange arrows and a key. Its Cars-owned generated source is recorded in the App template's `public/showroom/black/ASSETS.json`. No new Sell image was generated for this revision.

Responsive exports: `static/assets/daynight/services/sell-commerce-small.webp` (360 x 203), `sell-commerce.webp` (720 x 405), and `sell-commerce-large.webp` (1080 x 608). Sharp resizes the complete composition without cropping, WebP quality 85. The heading is live HTML on one line, and the white valuation button sits inside the banner. The mobile-only picture source avoids downloading the Sell artwork on the desktop Sell route.

Homepage and article asset mapping: [Commerce artwork](COMMERCE-BANNERS.md).

## Superseded v5 photographic banner, 30 September 2026

Generated with the built-in `image_gen` tool, with an opaque background. The current card uses one text-free photograph in both languages and a real HTML headline in the site's typography. It shows a graphite sedan and a small hand-held car key, with quiet dark space for the heading. This is generated service illustration, not inventory or a real dealership photograph.

Original: `C:/Users/radev/.codex/generated_images/01a0f0be-6d76-7612-9860-81094b9562f8/exec-11dbbf33-449d-469e-815b-4360513d1819.png` (1860 x 845).

Project assets: `static/assets/daynight/services/sell-valuation-mobile-generated-v5-small.webp` (360 x 164, 10412 bytes), `sell-valuation-mobile-generated-v5.webp` (720 x 327, 33902 bytes), and `sell-valuation-mobile-generated-v5-large.webp` (1080 x 491, 69302 bytes). Sharp resizes the complete composition without cropping and encodes WebP at quality 85. The mobile-only picture source preserves the desktop download boundary. Earlier assets remain preserved.

### v5 generation prompt

Use case: photorealistic-natural.
Asset type: photographic image for a premium automotive website's mobile "Sell your car" service banner, a wide 2.2:1 composition.
Primary request: a sophisticated, believable editorial automotive photograph that communicates handing over a car for sale. A beautiful unbranded dark graphite sporty sedan, front three-quarter view, parked outside a minimal contemporary dealership with pale limestone architecture. On the far right foreground, a natural close-up of one person's hand holding a small black car key fob, cropped at wrist, subtle and correctly proportioned, with car behind it in focus. No handshakes. The complete car sits in the right 65% of the frame, wheels and roof fully visible, generous breathing room. Keep the left 35% a quiet charcoal wall in shade with beautiful soft natural texture and no objects, suitable for a live white HTML heading.
Style: real high-end automotive campaign photography, precise paint reflections, real glass and rubber, understated editorial composition, no synthetic 3D look.
Lighting: clean soft daylight, slightly warm reflected light, restrained cinematic contrast. Palette charcoal, graphite, limestone, neutral natural color.
Constraints: 2.2:1 panoramic framing, car entirely visible, no typography or lettering anywhere, no logos, no readable plate, no badges, no watermark, no UI elements, no giant key props, no money graphics, no fake glowing effects. The key must be physically plausible and modest in scale. Preserve a calm dark left side that will comfortably carry a heading.

## Historical v2 draft

Generated on 30 September 2026 with the built-in `image_gen` tool, opaque background. The tool did not expose a model selector. This is an illustrative service photograph, not a real dealer location or a stock listing.

Original retained at `C:/Users/radev/.codex/generated_images/01a0ef2d-12ec-78e1-aa43-68ce3ef25d7f/exec-0a57b90a-22fd-4beb-90f3-9961df0a9b30.png` (1860 x 845).

Original SHA-256: `b39a0855f58a4b3c956329b15e4ffb763467c8c428ab4504659bfccbdf1e0590`.

Delivery assets under `static/assets/daynight/services/`:

| File                                          | Dimensions | Bytes |
| --------------------------------------------- | ---------- | ----: |
| sell-valuation-mobile-generated-v2-small.webp | 360 x 164  | 10090 |
| sell-valuation-mobile-generated-v2.webp       | 720 x 327  | 31560 |
| sell-valuation-mobile-generated-v2-large.webp | 1080 x 491 | 59380 |

Exports retain the complete generated composition. Sharp resizes and encodes WebP at quality 83. The service card presents a full-width panoramic banner with a short HTML headline on the dark left side and an aligned action beneath it. A mobile-only picture source avoids downloading this artwork in the hidden desktop composition. The image is decorative; the service title and action are real HTML. The banner reserves its aspect ratio and loads eagerly; delivery sizes range from 10KB to 59KB.

The superseded thumbnail draft's original is also preserved at `C:/Users/radev/.codex/generated_images/01a0ef2d-12ec-78e1-aa43-68ce3ef25d7f/exec-3e027950-174c-4c1a-9d3e-5cf70ee3423a.png`. Its WebP exports are retained under ignored `runtime/service-cards-20260930/thumbnail-draft/`.

## Generation prompt

Use case: photorealistic-natural. Create a premium automotive editorial photograph for a full-width mobile Sell your car banner. Landscape composition, deliberately designed to survive a panoramic 2.2:1 center crop. A tasteful unbranded metallic silver premium crossover parked in a contemporary charcoal glass-and-concrete appraisal forecourt, front three-quarter view, entirely visible in the right two-thirds of the composition. Keep the car within the middle 55 percent of image height so its wheels and roof remain visible in a wide banner crop. The left third should be clean, deep charcoal negative space with subtle realistic architectural reflections, providing quiet room for an HTML headline; do not generate any lettering. Restrained warm afternoon light, excellent natural photographic detail, realistic paint and glass, elegant confident composition, premium dealership photography without stock-photo cliches. A plain car key can sit discreetly on a dark foreground ledge, but no floating icons, no people, no giant props, no readable plate, no logos, no badges, no dealer branding, no text or watermark. This is a real photographic web asset, not a UI mockup or a diagram.
