# Modern bottom navigation artwork polish - 14 October 2026

Import, Sell and Lease now use the front-facing v6 cutouts documented in
`navigation-silver-front-v6.provenance.md`. The earlier generation and encoding
record below remains preserved; Cars and Menu retain their v5 assets.

The Cars and Menu cutouts reuse the current Cars-owned App dock artwork unchanged.
They are illustrative Image Gen assets, with transparent pearl-white, satin-silver
and graphite surfaces. No dealer or manufacturer identity is present.

| Modern asset | Source in Cars | SHA-256 |
| --- | --- | --- |
| navigation-silver-car-v5.webp | templates/app/public/navigation/dock/cars.webp | 2f998d5eabe6321e6a1dc837b4afc80fbd86d174ba8b00bc1a205d7fbcee60e3 |
| navigation-silver-menu-v5.webp | templates/app/public/navigation/dock/more.webp | 4970e5b97c5e78f2178a380c3aac5dcbd9e9f91172cca426c513aa739042041d |

Generation prompt, original generated-image references and web encoding provenance:
`templates/app/docs/DOCK-ARTWORK-TRIAL.md`.

`DealerBottomNavIcon` consumes these two versioned assets through `withBasePath`.
The Import and Lease v4 assets remain intact. Per-icon display widths balance
their visible silhouettes at approximately 22 CSS pixels high in a 40 by 26 pixel
frame. The existing alpha bounds set a common visible lower edge around pixel 25,
so transparent image padding does not create a gap above the labels. The selected
item alone has a quiet grey backing. Destinations, tap targets and the existing
SVG fallback remain in their original boundaries.

This is a local master polish candidate; no template release pin or dealer deployment
is changed. The previous v4 Cars and Menu assets remain preserved.

The owner's latest correction removes the per-icon circular decoration, increases
the visible artwork and reduces labels from 14/20 pixels to 11/13 pixels. The layout
gap is zero; the artwork's transparent lower inset and text metrics retain a small
visible gap. The bar remains 53 pixels tall with 52-pixel link targets. The existing
header controls keep their established treatment.

## Sell correction

`navigation-silver-sell-v5.webp` replaces the narrow tilted blank tag with a broad,
front-facing silver tag containing a simple charcoal car symbol. The built-in
Image Gen tool generated this decorative asset on 14 October 2026. Original:
`C:/Users/radev/.codex/generated_images/01a13abf-64cf-74d3-baff-d562c4d5d46c/exec-7cdd5b24-acdf-4f11-9aa0-c06d8ed57094.png`.

Generation prompt: Create one automotive Sell navigation icon with genuine alpha
transparency and no background. Match pearl white, satin silver and charcoal
graphite soft 3D icons with broad rounded shapes, low gloss and a clear silhouette
on white. Show one nearly front-facing broad silver sale price tag, no more than
8 degrees diagonal, with a dark hole at its left end and a simple bold inset car
front in its face. Use only a windshield, body and two headlights, readable at
24 CSS pixels. Keep the complete softly beveled tag tightly framed. No text,
numbers, currency symbols, logos, keyring, ribbon, hands, extra car, coin,
banknotes, floor, platform, exterior shadow, accent colour, tile or checkerboard.

Web delivery frames the visible alpha bounds (alpha above 8), fits the complete
object inside 56 by 56 pixels and adds a 4-pixel transparent inset. The 64 by 64
WebP uses quality 92 and alpha quality 100. All four corner alpha values are zero.
No painted content is redrawn or stretched. The file is 1488 bytes; SHA-256:
`d228d834dd53b55fa0e760f40139a0d99fbd66df8bdb58a65618305254f6298d`.
The v4 tag and original generation remain preserved.
The flatter tag shares the visible lower edge of the other navigation artwork.
