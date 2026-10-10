# Manrope interface typography

Selected on 2 October 2026 for the shared Auto Best master after comparing Onest,
Manrope and IBM Plex Sans on the actual Home and inventory pages at 390px and
1440px. Manrope provides geometric headings, legible open forms in small UI,
and native Bulgarian Cyrillic forms without a second interface typeface.

- Author: Mikhail Sharanda / The Manrope Project Authors.
- Upstream: https://github.com/googlefonts/manrope
- Google Fonts metadata: https://github.com/google/fonts/blob/main/ofl/manrope/METADATA.pb
- Distribution: `@fontsource-variable/manrope`, exact version `5.3.0` in the retained npm lockfile.
- License: SIL Open Font License 1.1; see [the retained notice](manrope-OFL.txt).
- Files: unmodified variable WOFF2 Latin, Latin Extended, Cyrillic and Cyrillic Extended subsets supplied by Fontsource.
- Integration: `src/routes/+layout.svelte` imports the package stylesheet, whose Unicode ranges select required subsets; `src/lib/styles/tokens.css` owns the family and existing semantic sizes/weights.
- Delivery: self-hosted build assets, with `font-display: swap`; no Google Fonts or Porsche runtime requests.

Porsche Next informed the automotive type direction only. The Porsche Design
System asset license restricts use to Porsche applications, so no Porsche font
or other Porsche design-system asset is redistributed by this template.
Reference: https://designsystem.porsche.com/v4/license/

The Onest font was loading correctly in the inspected Chromium pages. The change
addresses type choice and hierarchy; it does not claim to alter operating-system
or display-specific font rasterization. Existing source artwork and dealer logos
remain separate assets.
