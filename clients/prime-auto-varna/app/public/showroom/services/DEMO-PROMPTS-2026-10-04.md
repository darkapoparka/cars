# Demo service artwork - 4 October 2026

Created at the owner's request using built-in image_gen. The tool did not expose a model version. These synthetic illustrations do not depict the dealer's actual staff or premises or establish service availability. Only the three new service examples carry the compact Demo / Демо badge.

| Service | Selected original | Runtime image |
| --- | --- | --- |
| Tyres | tyres-v2.png | tyres-v2.webp |
| Brakes | brakes-v1.png | brakes-v1.webp |
| Air conditioning | air-conditioning-v1.png | air-conditioning-v1.webp |

Selected PNG originals are 1536 x 1024. WebP copies are 1200 x 800 at quality 82, produced with Sharp using only resize and encoding. The cards retain the existing 2:1 crop at object-position center 55%. Originals also remain at the tool's generated_images destination. No stock photo, dealer logo or third-party reference artwork was used.

## tyres-v1

Exact generation prompt:

```
Use case: photorealistic-natural. Create one original landscape automotive service photograph, 1536 by 1024 pixels, 3:2 composition. It will appear as a 2:1 service card cropped at center 55%, so keep the complete useful action inside the middle 60% of the image with generous space above and below. Subject: a close view of a mechanic's black gloved hands using a small unbranded tyre pressure gauge at the valve of a mounted black tyre and restrained silver alloy wheel on a modern silver car. The wheel, rubber tread, valve and tool must have physically coherent realistic proportions. Clean contemporary garage with charcoal and silver tones and a softly blurred background, natural professional daylight, controlled reflections, tactile editorial automotive photography. No face, no identifiable staff, no words, readable labels, logos, manufacturer emblems, brands, watermark, promotional text or website UI. This is a synthetic illustration for a demo tyre service card, not evidence of an actual dealer's staff or premises.
```

## brakes-v1

Exact generation prompt:

```
Use case: photorealistic-natural. Create one original landscape automotive service photograph, 1536 by 1024 pixels, 3:2 composition. It will appear as a 2:1 service card cropped at center 55%, so keep the complete useful action inside the middle 60% of the image with generous space above and below. Subject: a close view of a mechanic's black gloved hands inspecting a brake pad beside the exposed realistic brake disc and caliper of a modern silver car with its wheel removed. Correct plausible rotor, caliper and hub geometry, the brake pad is clearly recognizable and in the foreground; the properly supported car and clean garage are softly blurred behind. Clean contemporary garage with charcoal and silver tones, natural professional daylight, controlled reflections, tactile editorial automotive photography matching a restrained premium maintenance photo series. No face, no identifiable staff, no words, readable labels, logos, manufacturer emblems, brands, watermark, promotional text or website UI. This is a synthetic illustration for a demo brake inspection card, not evidence of an actual dealer's staff or premises.
```

## air-conditioning-v1

Exact generation prompt:

```
Use case: photorealistic-natural. Create one original landscape automotive service photograph, 1536 by 1024 pixels, 3:2 composition. It will appear as a 2:1 service card cropped at center 55%, so keep the complete useful action inside the middle 60% of the image with generous space above and below. Subject: a close view inside the clean graphite cabin of a modern unbranded silver car, a mechanic's black gloved hand checking a central dashboard air vent with a slim unbranded probe thermometer. Clear recognizable vents and thermometer, physically coherent dashboard and hand, no visible steering-wheel emblem. The softly blurred clean contemporary garage outside has charcoal and silver tones. Natural professional daylight, controlled reflections, tactile editorial automotive photography matching a restrained premium maintenance photo series. No exaggerated vapor or visual effects, no face, no identifiable staff, no words, readable screen numbers or labels, logos, manufacturer emblems, brands, watermark, promotional text or website UI. This is a synthetic illustration for a demo air conditioning service card, not evidence of an actual dealer's staff or premises.
```

## tyres-v2 correction

The first tyre image showed a duplicate valve stem. One built-in edit corrected the connection while retaining its composition. The unselected first image remains preserved at the tool's generated_images destination; the corrected original is the selected workspace asset.

Exact edit prompt:

```
Edit this tyre service photograph. Preserve the silver car, black tyre, alloy wheel, mechanic's black gloves, hands, pressure gauge, garage, framing, lighting, colors and photorealistic detail. Correct only the tyre valve connection: the brass tip of the pressure gauge must visibly attach to a single realistic black tyre valve mounted at the edge of the rim where the tip currently meets the wheel. Remove the separate unused black valve stem lower on the rim. There must be exactly one tyre valve and a coherent gauge-to-valve connection, rather than the gauge touching a wheel spoke. Do not change anything else. No logos or added text. Preserve the 1536 by 1024 landscape composition and centered action for a 2:1 card crop.
```
