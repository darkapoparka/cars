# Import wordmark

Owner correction, 4 October 2026: the visible identity now says **IMPORT**, with no subtitle. The chrome wheel and monochrome lettering style are retained.

The integrated asset is [import-logo-v2.webp](../../static/brand/import-logo-v2.webp), transparent WebP, 600 × 164. Both logo fields in `src/lib/config/dealer.ts` point to it, and the configured name/display name now use Import / IMPORT. The existing wheel favicon is unchanged. Dealer copies still replace these configured paths with each lead's permitted logo.

Generated with built-in `image_gen.imagegen`, editing [version 1](../../static/brand/import-template-logo-v1.webp) on 4 October 2026; no fallback CLI was used. Sharp only trimmed transparent padding and resized/exported the generated raster. Version 1 remains preserved as previous artwork.

## Exact edit prompt

```text
Use case: text-localization.
Edit target: the supplied transparent automotive logo.
Change the wordmark to exactly one word: "IMPORT". Completely remove the lower "TEMPLATE" line. Preserve the existing chrome wheel emblem on the left and the polished silver/chrome, graphite-edged italic lettering style. Vertically center the single IMPORT wordmark beside the wheel, using the available height naturally. Preserve compact horizontal proportions and small-size legibility. Keep the identity monochrome with no red accents. Genuine transparent background with clean alpha edges. No subtitle, second line, extra words, slogan, numbers, watermark, mockup or background.
```

## Local visual evidence

Matched Bulgarian Home captures at 1440 × 1000, scroll Y 665: [before](before-bg.jpg) and [after](after-bg.jpg). The logo remains in the 112 × 32 banner slot. Mobile checks cover 320/390 px in Bulgarian and English; source, asset and check details are recorded in `verification.json`.
