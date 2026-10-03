# Realistic vehicle category assets

Generated with the built-in image generation tool on 2026-10-03. The approved
silver car at `public/categories/car-realistic-20261003-v1.png` was used as the
style, camera and lighting reference for all four new assets. The tool did not
expose a selectable model version.

These are illustrative template assets. Full-resolution PNG originals and alpha
are preserved; no software image edits were applied. The initial preview used
contained 40 x 40 image boxes. The owner's later readability correction on
2026-10-03 enlarges every consumer to 64 x 40 within 88px-wide, 52px-high tabs.
The neutral underline and horizontal scrolling are retained. This source change
does not establish browser visual acceptance.

## Selected assets

Each PNG is 1774 x 887 pixels. The e-bike uses the framing refinement below.

| Category | Asset | SHA-256 | Bytes |
| --- | --- | --- | ---: |
| motorbike | [motorbike-realistic-20261003-v1.png](../public/categories/motorbike-realistic-20261003-v1.png) | `b695e5ba1e45f9fedcaf5527ab3ed6bd922b65fd7b64be478cdd7f7112149402` | 1675017 |
| ebike | [ebike-realistic-20261003-v1.png](../public/categories/ebike-realistic-20261003-v1.png) | `dbb047ba840f7b9f60f068f877afee62320cef32ca0e43380511f7e061132038` | 1171202 |
| motorhome | [motorhome-realistic-20261003-v1.png](../public/categories/motorhome-realistic-20261003-v1.png) | `745db213d722a6c8ce7f42e60636a1cb2253c74e87bbf0e3f360643af323f068` | 1283570 |
| truck | [truck-realistic-20261003-v1.png](../public/categories/truck-realistic-20261003-v1.png) | `79939daf8d1b1dd09d2f0b190677a5f25d10e2aedec1ef23499c95d024fa7be4` | 1369029 |

Consumer: `showroomCategories` in `src/lib/showroom.ts` supplies each image to
`ShowroomInventoryScreen.tsx`. The existing native glyphs remain available to
other consumers. No dealer release or live deployment is implied by this change.

## Initial generation prompts

Every initial prompt was the shared prompt below, followed by a newline and
`Subject: ` plus its exact subject description.

### Shared prompt

Use case: product-mockup.
Asset type: a single photorealistic 3D vehicle cutout for a mobile showroom category tab.
Image 1 is a STYLE, CAMERA and LIGHTING reference: the approved realistic silver car. Generate the new subject specified below instead of another car. Match its convincing real materials, restrained silver/white/black palette, crisp studio highlights and clean side-profile presentation.
Composition: whole vehicle in complete side profile facing RIGHT, wheels straight and level on one horizontal baseline, camera at mid-body height with minimal perspective and natural three-dimensional body contours. Wide approximately 2:1 canvas, subject centered and occupying about 90 percent of the width, all extremities completely visible with modest padding. No cropped mirrors, handlebars, wheels or vehicle body.
Style: premium photorealistic automotive studio product render. Realistic metal, glass and rubber with controlled softbox reflections; physically plausible proportions and sharp focus. The shape should remain recognisable as a small category thumbnail.
Background: genuinely transparent alpha. Isolated vehicle only, no floor plane, cast shadow outside the subject, road, background, pedestal or ground reflection.
Avoid: drawing, vector icon, flat pictogram, sketch, cartoon, clay, toy proportions, mist, bloom, motion blur, outlines, logos, writing, number-plate text, badges, watermarks, people or props.

### motorbike

One modern standard road motorcycle: satin silver fuel tank, dark saddle, realistic black engine and frame, silver alloy rims, two clearly visible rubber wheels, compact headlight, handlebars and mirrors. An elegant normal road bike with real-world proportions; no rider, no oversized fairing and no luggage.

### ebike

One modern pedal-assist trekking electric BICYCLE: silver aluminium diamond frame with an integrated battery inside a slightly thicker downtube, two large real bicycle wheels, black rubber tyres, visibly slender spokes, saddle, handlebar, cranks, pedals and chain drivetrain. Clearly an electric pedal bicycle, not a motorbike, scooter or moped. No rider, bag or decorative electric-bolt symbol.

### motorhome

One contemporary compact coach-built motorhome: a silver cab integrated with a clean pearl-white habitation body, dark tinted side windows, a subtle side entry door, realistic black tyres and silver wheel rims, visible front cab window and mirrors, restrained panel seams. An actual road-going self-powered motorhome, not a caravan trailer, bus or delivery van. No awning, furniture, camping props or logos.

### truck

One contemporary medium-duty enclosed box truck: a clean silver cab at the right, a restrained pearl-white/silver rectangular cargo box behind it, dark cab windows, realistic silver wheel rims and black tyres on two axles. Clearly a commercial box truck with a recognisable cab and cargo body, real-world proportions and restrained detail. No attached trailer, cargo, lettering or logos.

## E-bike framing refinement

Edit target: the first generated e-bike. This changed the framing to keep the
handlebars and tyres inside the image while preserving the realistic finish.

Edit target: the supplied realistic silver electric bicycle cutout. Keep the same bicycle design, silver frame, integrated battery, dark components, realistic materials, studio lighting, side profile facing right and genuinely transparent background. Change only the framing: reduce the bicycle slightly within the canvas and add clear transparent padding on EVERY side so the full handlebar, brake levers and cables are comfortably visible, both tyres are entirely visible, and nothing touches or crosses the canvas edges. At least 6 percent clear padding above the highest handlebar part and below the tyres. Keep a wide canvas, with the bicycle centered. Do not crop any vehicle part, stretch the wheels, change perspective, add scenery, cast a shadow outside the bicycle, add text/logos, or turn it into a drawing. Preserve the photorealistic 3D product-cutout appearance.
