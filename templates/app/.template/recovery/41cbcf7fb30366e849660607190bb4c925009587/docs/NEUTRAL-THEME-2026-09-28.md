# Neutral theme refinement

The previous color-only CSS pass preserved dimensions but did not recolor embedded raster banners, and literal grayscale fills made some secondary controls too heavy. This correction keeps the existing component layout and adjusts the remaining artwork and tonal hierarchy.

- Replaced PDP service, car finance and video-tour images with generated neutral variants. The service banner keeps its curved-line motif and technician/car arrangement; the video-tour banner keeps its circular pattern and angled phone scene; finance keeps a light canvas with a large dark symbol and silver sedan. The finance artwork omits unverified bank affiliations and zero-deposit promises.
- Four Finance-page benefit illustrations retain their subjects, curved bands and 3:2 card slots with neutral backgrounds. Next Image serves the seven new assets at responsive sizes. All assets and built-in image_gen prompts are in `public/showroom/black/PDP-THEME-PROMPTS.md`.
- Secondary PDP buttons use a soft neutral surface and fine border, while selected pills and primary actions remain charcoal. The inline finance result and service-package gradients are lighter. The finance calculator keeps its decorative background using luminosity blending.
- A native neutral watch label covers the blue label baked into the inspection poster. Playback and its accessible button name are preserved.
- Banner slots, navigation, rounding and type scales are preserved. The finance image has an explicit reserved ratio matching the old slot. One narrow-screen exception: below 360px the service-history note overlaps its banner by 36px instead of 63px, keeping the final checklist line visible. Natural photo colors and green informational checks remain.

The source color scan found no saturated blue/purple literal CSS colors in active default component styles. The optional blue campaign theme and preserved reference assets remain available for comparison. Historical footage, inventory photos and small reference illustrations still need dealer-content adaptation before release; this is not a claim that every pixel in reference media is neutral.

## Verification

- Final `npm run check` passed on Node 22.23.2 (ESLint, TypeScript and production build). Log: `L:/CODEX/cars/runtime/app-showroom-qa/theme-refinement-final-check.log`.
- Inspected PDP at 320px, 390px and 1440px; checked Home, Finance, Sell, Services, Saved and Menu at 390px. No page overflow on the checked 320px PDP.
- Verified responsive image loading, section navigation and inspection-video play/pause. No browser console errors in the QA tabs.
- Rechecked the final 320px service banner after rebuilding: all six checklist lines remain visible above the note.
- Before/after screenshots are in `L:/CODEX/cars/runtime/app-showroom-qa/`: `theme-pdp-service-before.png`, `theme-pdp-service-after-390.png`, `theme-pdp-service-after-320.png`, `theme-pdp-finance-after-390.png`, `theme-pdp-tour-after-390.png` and `theme-finance-after-390.png`.
- Preview restarted at port 6473. Temporary tabs closed and viewport override reset. No commit, deployment, client changes or release-lock changes; the unrelated staged files remain untouched.
