# Home 3D mode artwork — 4 October 2026

The owner rejected the Home line icons and explicitly requested generated 3D assets. Buy, Leasing, Sell and Import now show matching red-and-silver cutouts: a car, percent sculpture, sales tag and globe. The white discovery card, black labels, red actions and centered automotive hero retain their established styling.

[Before/after gallery](http://127.0.0.1:6795/home-3d-tabs.html) · [Live Home](http://127.0.0.1:6790/bg) · [Asset paths and exact prompts](../assets/HOME-MODE-3D-2026-10-04.md)

## Ownership and screenshots

Typed homeModeArtwork records in content/home-discovery.ts own paths and dimensions. MobileModeTabs renders decorative, media-gated pictures and owns native tab behavior, hover, focus and selected underline. One theme token sizes the artwork at 48px; equal targets grow to 66px including padding and borders, and the red underline follows the artwork-and-label group. The recorded browser metrics resolve the labels to the default desktop mode-tab token (22px/400). The [typography follow-up](../desktop-discovery-type-2026-10-04/README.md) corrects the panel labels to the intended 20px; mode actions stay intact. Other consumers keep their existing icon defaults. No new dependency or route was introduced.

The four 192px transparent WebP images total 43676 bytes. Original generated PNGs are preserved in runtime and at their recorded Codex paths. The available built-in image generator does not expose a model selector; no 2.5 model claim is made. Source activation starts at 768px, with the existing transparent fallback below it.

| View         | Before                           | After                           |
| ------------ | -------------------------------- | ------------------------------- |
| Buy box      | [Screenshot](before-buy.png)     | [Screenshot](after-buy.png)     |
| Leasing      | [Screenshot](before-finance.png) | [Screenshot](after-finance.png) |
| Home context | [Screenshot](before-home.png)    | [Screenshot](after-home.png)    |

The gallery also shows Sell and Import. Before uses the canonical baseline source; after uses the frozen production build. Fonts and visible images were loaded and decoded before capture, without injected styling. The heading anchor and automotive hero imagery remain intact.

## Verification

The frozen manifest covers 1683 application/configuration/test/asset paths with SHA-256 4ec84a44d224a9ab628f78dd2e293155ede5dd491d01e70f0d4a1b2bbfc3db37. QA has its own npm ci and production build output with provider bindings disabled. The retained lockfile is unchanged. [source-changes.json](source-changes.json) records the task source hashes; [verification.json](verification.json) records gates, screenshot hashes and raw evidence locations.

Svelte reports zero errors/warnings. Task formatting, full ESLint, architecture, assets and production build pass. Full formatting retains the same three untouched failures: public-assets.policy.json, scripts/public-asset-retention.mjs and svelte.config.js. Full verify is not claimed. Domain unit tests were not repeated for this decorative artwork/markup follow-up.

Twenty-four before, 48 after and eight production states have no response, page-error, overflow or visible-image decoding failures. All 16 matched BG/EN Home/Sell/Import/About 320/390px PNGs and complete-page presentation records are identical, including the About trial. Four production mobile probes record no new artwork requests. Thirty-two production mode states confirm decoded and contained artwork/labels, content-width underlines, equal targets, hover and focus at 768/1024/1440/1920px. Thirty-two keyboard cases, eight accessibility scans and two JavaScript-disabled artwork/native Buy fallback checks pass. Existing browser journeys pass 5 with 3 intentional mobile-project skips, no failures or flaky cases. The comparison gallery passes 36 responsive/control states.

Thirty-two hero-anchor checks retain the stationary title, including all eight matched before states at 1440px. All four production-served artwork files match the recorded output hashes. An initial mobile QA helper wait on offscreen lazy images was corrected before the successful full rerun; its diagnostic note remains in runtime.

Raw evidence, original artwork and frozen QA stay at L:/CODEX/cars/templates/import/runtime/desktop-home-3d-tabs-2026-10-04/. Integration is scoped to these Import source/assets/docs on Cars main; inherited ignore/evidence/asset drafts and other Cars work remain preserved. This template work does not promote a release or deploy dealers.
