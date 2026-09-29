# Showroom shell and inventory QA

## Follow-up: banner text and Services alignment

Removed explicit headline line breaks in the four landing banners. The shared copy column now spans the full mobile banner width, with a wider description measure and natural headline wrapping. Sell uses the concise heading "Sell your car.". Services now uses `service-banner-v2.png`, generated from the exact Home studio composition, replacing the larger-car technician scene. Existing versioned artwork remains preserved.

Follow-up check log: `L:/CODEX/cars/runtime/app-showroom-qa/banner-text-check.log`.

Follow-up verification passed: `npm run check` exited 0. All four routes at 320px and 390px have banner top 160px, height 180px, identical headline and CTA baselines, single-line headlines and no document overflow. Services at 1440px retains its 300px banner and single-line headline without overflow. Before/after screenshots: `L:/CODEX/cars/runtime/app-showroom-qa/service-text-before-390.png` and `L:/CODEX/cars/runtime/app-showroom-qa/service-text-after-390.png`. Production preview restarted on port 6473 after the build.

Local preview: http://127.0.0.1:6473/ . This is candidate work in the existing Cars main checkout, not an approved template release or client deployment.

## Changes

- Shared PageHeader aligns back buttons, titles and actions across inventory, saved, search, more, showroom, vehicle detail, inspection and service/sell journeys.
- Inventory uses a compact rounded silver showroom panel, neutral search/filter controls, actual result counts and clearer horizontal vehicle cards.
- Primary interface branding uses configured Drive24 identity; legacy promotional rasters and return/finance promises were removed from the refreshed surfaces.
- Built-in image generation produced Sell and Finance scenes using the Home studio scene as a reference, retaining the car's position and scale. Shared banner geometry and a base-scene underlay prevent a blank image area during navigation.
- Exact generation prompts and asset provenance are in ../public/showroom/ALIGNED-BANNER-PROMPTS.md.

## Verification

- npm run check passed (lint, TypeScript and production build). Log: L:/CODEX/cars/runtime/app-showroom-qa/shell-check-verified.log.
- Visual checks at 320px, 390px, 768px and 1440px. Inventory has no horizontal document overflow; shared header is 68px tall. Sell and Finance also fit 320px without document overflow.
- Inventory search Toyota returned 9 cars; clearing returned 48. Toyota filtering and ascending-price sorting worked.
- Saved a test car, verified it on Saved, then removed the test save to restore the initial state.
- Opened vehicle detail and checked the shared header. Sell and Services primary buttons opened their corresponding journeys.
- Checked Home, Sell, Finance, Services, inventory, search, saved, more and showroom views. First Finance navigation displayed the base scene while its contextual image loaded.
- No browser console errors in the final verification tab; production preview error log was empty.

## Screenshots

Before and after use the same mobile viewport setting:

- Before: L:/CODEX/cars/runtime/app-showroom-qa/inventory-before-390.png
- After: L:/CODEX/cars/runtime/app-showroom-qa/inventory-after-390.png
- Narrow mobile: L:/CODEX/cars/runtime/app-showroom-qa/inventory-after-320.png
- Desktop: L:/CODEX/cars/runtime/app-showroom-qa/inventory-after-1440.png

## Remaining release boundary

Existing reference inventory photos/data remain preserved. Some vehicle photos contain Cars24 numberplates, and deeper legacy demonstration content/claims still require a separate dealer-content audit before release. This work does not certify all retained fixture content for a real showroom. No form submission, finance approval, client release, commit, push or deployment was performed.

The app candidate remains untracked as a directory in the parent Cars repository. The nine unrelated staged files were preserved; they were not included in this work. Local preview remains running on port 6473.
