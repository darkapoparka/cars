# App dock icons

## Current Day & Night artwork — 2 November 2026

The standard phone dock has five labelled destinations (Home, Cars, Shop, Services, Menu), using transparent silver 3D raster icons at 28px. Its existing 328px maximum width, 56px surface height and 48px link height remain. The alternate journey retains the original four-icon layout. The four original Phosphor glyphs below remain available as vector fallbacks.

Shop uses `public/navigation/dock/shop-v1.webp` in both the dock and Menu. Generated with the built-in image-generation tool, then trimmed and resized without altering its generated alpha: 128×128px, 5,466 bytes. Original output: `C:/Users/radev/.codex/generated_images/01a195f9-4bcd-7583-afa3-a1b71a6ba081/exec-676251c5-5534-4536-8598-4d18a6b7da86.png`. No existing asset was overwritten.

Generation prompt: single silver metallic shopping-bag navigation icon for Day & Night; realistic polished 3D object matching the house, car and chrome-wrench family; graphite/silver monochrome, bevelled body, rounded arch handle and dark handle opening, subtly visible side, bold readable silhouette at 28px, upper-left studio light, transparent background and handle opening, centred square composition, no text, logo, backdrop, platform or extra objects.

## Original vector fallback provenance

The four mobile dock glyphs use Phosphor Icons regular and fill variants, rendered as inline SVG paths in `components/dock-icons.ts`. Regular glyphs identify unselected destinations; fill glyphs identify the selected destination. Both App journeys use the same renderer, 24px SVG frames and existing 44px links.

Source repository: https://github.com/phosphor-icons/core
Pinned source revision: `2b75f3ad12b420c9504ef05df8d2564a28f8500e`
License: MIT; retained in `docs/licenses/phosphor-icons.txt`.
Retrieved: 14 October 2026. Paths were extracted from the upstream SVGs without changing the artwork; the shared 256x256 view box and inherited currentColor are retained.

| Destination | Weight | Source SVG | SHA-256 |
| --- | --- | --- | --- |
| home | regular | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/regular/house.svg | 180e9259e99e23da197b59b19394d006d6a5d33e384cc2b9c8381cb0214a5716 |
| home | fill | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/fill/house-fill.svg | 4783cdf0ae5f5ec363df6f77167a41642aac42fe8d73251b9a61232ab43f355d |
| cars | regular | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/regular/car.svg | 394e30a020b4e1dbe4dc789f0161e607142211b4b0f65f97855ec1de4ad2397b |
| cars | fill | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/fill/car-fill.svg | ba61d87b3526dec2adee1311ebc83518a0c85893384b068d2dd7b2c51d4dc917 |
| service | regular | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/regular/wrench.svg | 690d657aa4a9c99d620583cf6247cfefa5372c10e2bc60e9255a3ce19e3e9c47 |
| service | fill | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/fill/wrench-fill.svg | a04703c10ffb2adaae16d1e434c76cd013938027d74adc5d80c66ab8eae9c61d |
| more | regular | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/regular/list.svg | fb1851842c74b40a3f42ce3d6ae0e67ede556b624218e79c0f4ead7d9ceec51f |
| more | fill | https://raw.githubusercontent.com/phosphor-icons/core/2b75f3ad12b420c9504ef05df8d2564a28f8500e/assets/fill/list-fill.svg | 1df4bd0e497c551871da87fc5de752a81ff397c9b8fd9da10e319630e60d412f |
