# Reusable Import template logo

The reusable master uses a generated **IMPORT TEMPLATE** placeholder in the existing compact automotive style. It is a template preview identity, not an official dealership logo. The internal family ID remains `import`; release versions stay in source lineage.

Dealer personalization is documented in [TEMPLATE](../../TEMPLATE.md#dealer-logos-replace-the-configuration-preserve-the-banners) and the [Cars lead build guardrails](../../../../docs/LEAD-BUILD-GUARDRAILS.md). Replace the configured logo paths with the lead's permitted logo and set its favicon. Header, mobile navigation, footer, vehicle dealer banner and Home Sell/Finance banners read the shared identity configuration; banner backgrounds remain reusable artwork.

## Assets and provenance

- Integrated logo: [import-template-logo-v1.webp](../../static/brand/import-template-logo-v1.webp), transparent WebP, 600 × 164.
- Browser icon: [import-template-icon-v1.png](../../static/brand/import-template-icon-v1.png), transparent PNG, 192 × 192, derived from the same wheel emblem.
- Creation: built-in `image_gen.imagegen`, transparent background, 4 October 2026. No fallback CLI was used.
- Edit reference: the retained sample [Day Night logo](../../static/assets/daynight/brand/daynight-logo-generated-600.webp), used to match its compact wheel-and-wordmark composition. The original asset remains preserved.
- Mechanical processing: trim transparent padding, resize and export the generated raster with Sharp; crop the wheel emblem for the icon. No generated pixels were added to screenshots.

## Exact generation prompt

```text
Use case: text-localization / logo-brand.
Asset type: transparent logo for a reusable automotive website template, used on near-white headers and black promotional banners.
Edit target: the supplied horizontal automotive raster logo.
Primary request: replace the dealer identity with a neutral template identity, preserving its compact automotive styling. Keep the chrome wheel emblem on the left and the two-row italic block wordmark on the right. The exact top line must say "IMPORT", and the exact bottom line must say "TEMPLATE".
Color and material: polished silver/chrome, graphite edging, and dark keylines. Remove every red accent; use silver/chrome for the wheel ring and both text lines. Bright chrome faces with dark outlines must be readable on both white and black surfaces.
Composition: tightly bounded horizontal logo, approximately the same 3.5:1 proportions as the supplied reference. Keep the wheel emblem and wordmark balanced at very small UI sizes.
Constraints: genuine transparent background and clean alpha edges; no Day Night text, no Auto Group text, no extra slogan, version numbers, watermark, mockup, surrounding scenery, or background glow. Do not add a rectangular background.
```

## Rendered evidence

Matched local desktop captures at 1440 × 1000, Bulgarian Home, scroll Y 665:

- [Before](before-bg.jpg)
- [After](after-bg.jpg)

The logo overlay stays in its 112 × 32 slot. The car artwork, title, description, CTA and banner dimensions remain unchanged. Additional checks and source/asset hashes are recorded in `verification.json`.
