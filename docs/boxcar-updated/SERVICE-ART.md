# Boxcar service-card artwork - 2 October 2026

Auto Best at `http://127.0.0.1:6461/bg` was inspected at desktop and phone widths. Its transparent automotive artwork supplied the composition and photography reference for four new Boxcar service illustrations. Auto Best source and assets were not changed by this task.

Boxcar at `http://127.0.0.1:6455/` now uses generated browse, sell, compare and budget cutouts in Home 5's four-card structure. Titles, descriptions and destinations are live HTML. The cards have pale blue/neutral surfaces, matching blue actions and balanced two-line copy. The ten original reference homes retain their source artwork and hashes. Generated cars are decorative illustrations; the 17 sample inventory photographs remain separate.

[Asset paths, originals and complete built-in imagegen prompts](../../templates/boxcar-updated/provenance/service-art-2026-10-02.md) are recorded with the template. The four optimized 720 x 405 alpha WebP files total 222,398 bytes (about 217 KiB). Originals remain in the tool's generated-images directory.

## Verification

- Node 22.23.2: Svelte/TypeScript has zero errors and zero warnings; production build passes with 160 modules.
- Chromium and Playwright WebKit each pass all 12 existing curated journeys, including search/dropdowns, save/detail/Back, service destinations, mobile navigation and consistent supporting-page headers.
- Six focused rendered states cover 1440, 390 and 320px in both engines: all four images decode, `contain` preserves their full silhouettes, descriptions use two lines, actions meet 44px and no horizontal overflow occurs.
- All four WebP assets have alpha values from 0 to 255. Original generated PNGs are preserved, and transparent outer padding is normalized without intentionally cropping foreground objects.
- Final in-app browser inspection confirms all four images paint on desktop and the 320px card flow stays readable.

The [machine-readable receipt](service-art-results.json) records source hashes, output hashes, crops, asset sizes, exact geometry and the completed journey runs. [Desktop service row](curated-services.png) and [320px service flow](service-art-320.png) are the focused final captures. Other captures in this folder retain their earlier evidence dates.

This is a verified local candidate change. Owner visual acceptance, approved immutable release selection, dealer integration and hosted rollout are separate steps.

## Source handoff

Scoped staging was attempted after QA and failed because `L:/CODEX/cars/.git/index.lock` already existed. The lock was preserved. These changes remain unstaged and uncommitted in the maintained `main` checkout; this task did not push them. The running preview on port 6455 already serves the completed update.
