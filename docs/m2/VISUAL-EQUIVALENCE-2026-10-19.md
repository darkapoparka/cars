# M2 proof-dealer visual comparison — 19 October 2026

All **54 full-page comparisons pass with zero unexpected pixels**. The six native designs for ZA Motors, Wadishee Used Cars and Granada Auto Sales retain their M1 appearance at 320px, 390px and 1280px, apart from the owner-requested correction to the design-switcher artwork and nine edge-antialiasing pixels. Page dimensions are unchanged across all 54 views.

The comparison covers 81,340,510 pixels on each side. It does **not** claim global pixel identity: replacing the M1 dealer mark inside the FAB with the existing fleet's active-design mark deliberately changes 29,691 artwork pixels. Every pixel outside that narrowly bounded artwork remains checked.

## Results

| Dealer | Views passed | Changed FAB artwork pixels | Edge-antialiasing pixels outside FAB | Unexpected pixels |
| --- | ---: | ---: | ---: | ---: |
| ZA Motors | 18 / 18 | 9,198 | 0 | 0 |
| Wadishee Used Cars | 18 / 18 | 9,321 | 3 | 0 |
| Granada Auto Sales | 18 / 18 | 11,172 | 6 | 0 |
| Total | 54 / 54 | 29,691 | 9 | 0 |

Outside the FAB artwork, 51 views are pixel-identical. Three Signature views differ by three antialiased edge pixels each: Wadishee at 320px, and Granada at 320px and 390px. No page logo, stock, page composition, copy or example-card difference appears elsewhere in the captured images.

This evidence concerns the exact CI-built candidates below. Anonymous hosted checks, resource measurements and account deployment receipts are separate acceptance evidence.

## Exact inputs and provenance

The M1 baseline is the final green [run 39284983471, attempt 2](https://github.com/darkapoparka/cars/actions/runs/39284983471/attempts/2), at source commit `a999878a921fb61b37bf198c43275550814f88cc`. Earlier failed M1 runs are not used. Its three passing build reports, three passing QA reports and 54 screenshot SHA256 values are pinned in [`dealer-pack-m1-visual-baseline.json`](../../scripts/fixtures/dealer-pack-m1-visual-baseline.json).

The M2 candidates come from the green [run 39314170350](https://github.com/darkapoparka/cars/actions/runs/39314170350), at source commit `26b626c979d2cfd653b3015d94ff8fe2df724a93`. Each downloaded report archive was verified against its GitHub artifact byte count and SHA256 before extraction. The build and QA reports must agree on dealer identity, pack digest, immutable release digest, output digest and execution. Both sides use the same immutable native template source releases.

The [machine-readable evidence](visual-equivalence-2026-10-19.json) records every archive ID and hash, build/QA report hash, full comparison-report hash, screenshot hash, dimension, artwork rectangle and pixel count. It also pins the exact comparator, tests and baseline-corpus bytes used for this result. Large screenshots and diagnostic PNGs remain outside Git.

## Comparison method

[`compare-dealer-pack-screenshots.mjs`](../../scripts/compare-dealer-pack-screenshots.mjs) requires the complete six-design, three-width corpus. Inputs must be regular opaque PNG files with matching authenticated hashes. It rejects missing cases, failed or stale QA, inconsistent identity/output bindings, path traversal and changed dimensions.

Both runs used Playwright Chromium with a 900px viewport height and the normal device scale factor of 1. The maintained native capture procedure waits for fonts, completes the template's welcome flow, scrolls through the full page to load encountered images, returns to the top and captures a full-page PNG with animations disabled. It does not restyle pages or replace the native DOM for the comparison.

Sharp 0.35.5 decodes the original PNG pixels without resizing. The pinned Playwright Core 1.62.1 pixelmatch comparator uses a **zero color threshold and zero unexpected-pixel allowance**. Its edge-antialiasing classifier is enabled. There is no percentage allowance, broad screenshot mask or caller-defined exclusion rectangle.

The optional `--allow-fab-correction` switch permits only the requested transition from the pinned M1 dealer-mark SHA256 to the exact active fleet-design artwork SHA256. The candidate QA must prove that a single expected image is visible and loaded in the 46 × 34 CSS-pixel FAB artwork bounds. Fractional positioning is rounded outward for raster comparison, to at most 47 × 35 pixels. The button border, count badge, shadow and all page pixels outside the artwork still participate in the strict comparison.

Observed Chromium layout viewports use either a 0px or 15px scrollbar gutter. The geometry validator explicitly accommodates those two cases; it does not allow arbitrary displacement. This corrects the comparator's coordinate assumption only and changes no template or rendered output.

Diagnostic images mark unexpected pixels red, antialiasing yellow and authorized changed artwork cyan. Zero unexpected pixels is required for success.

## Repeatability and focused tests

The same strict comparator was first run against M1's green cold and warm attempts, with no FAB exception. Fifty of 54 PNG pairs are byte-identical. The remaining four each have three antialiased Signature navigation-edge pixels, and no unexpected differences. This establishes that the very small M2 edge differences also occur between unchanged M1 builds.

All nine focused comparator tests pass with none skipped. They cover authenticated provenance, tampered screenshots, stale or failed QA, incomplete cases, path and image-format constraints, exact FAB policy and geometry, prohibition of arbitrary exceptions, and an actual three-pixel M1 antialiasing crop. Deliberate one-channel color changes, a one-pixel layout shift, changed dimensions and changes just outside the authorized artwork all fail.

## Reproduction

After retrieving and authenticating the report artifacts, run this once per dealer, supplying the extracted baseline and candidate directories:

```bash
node scripts/compare-dealer-pack-screenshots.mjs \
  --baseline /path/to/dealer-pack-evidence-za-motors-39284983471-2 \
  --candidate /path/to/m2-reports/dealers/za-motors \
  --out runtime/za-motors-m1-m2-comparison \
  --allow-fab-correction

node scripts/compare-dealer-pack-screenshots.test.mjs
```

Use the documented QA dependency installation, or set `CARS_QA_RESOLVE_FROM` to the package file containing the pinned Sharp and Playwright dependencies. The comparator requires a fresh output directory and writes a bound JSON report plus difference PNGs.
