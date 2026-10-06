# Full-quarter mobile navigation underline — 6 October 2026

Owner asked whether the active underline should span one of four equal mode segments. `components/ReferenceUI.tsx` now uses mobile `left: 0` and `width: 100%` within the active link: exactly 25% of the four-column navigation. The 3px height, active label, artwork and header surfaces are retained. The compact header shares the treatment. Wider-screen declarations and link destinations are unchanged.

## Evidence

- Four matched Bulgarian 390 × 400 before/after captures show the previous 40px mark and the full active quarter.
- Local development observations covered all four Bulgarian modes at 320px and 390px before the dev server's automatic memory restart interrupted the remaining check.
- The final compiled application was inspected on the temporary local origin `http://127.0.0.1:6485`: four modes, Bulgarian and English, 320 × 844 and 390 × 844, in both expanded and compact states. All 32 header observations fit without document overflow. The active underline measured 74px in a 296px navigation row and 91.5px in a 366px row, exactly one quarter in both cases. Normal expanded/compact header heights remained 102px/52px; compact link targets remained at least 44px high.
- Node 22.20.0 `npm run check` passed lint, TypeScript and the production build, including 431 generated pages. The prior task's isolated build directory was reused to avoid allocating another build cache on the nearly full workspace drive. Log, source hash and guarded generated-configuration restoration receipt are in `runtime/mobile-full-rail-20261006/`.
- The in-chat comparison contains eight actual browser screenshots. All four carousel states and 320px reflow were inspected; images loaded and no preview errors were recorded.

An earlier temporary production tab stalled when activating Leasing from Sell. During final publication preparation, a fresh Node 22 production build and browser tab successfully activated Sell → Leasing → Services → Buy → Sell. Each URL and active mode matched, with no document overflow or browser console errors. This resolves the earlier local navigation observation. No navigation logic was changed in the underline refinement; hosted verification is recorded separately.

This evidence covers the local mobile underline refinement. It is not hosted deployment, dealer release selection or native-device usability acceptance. Screenshots, source preimages and other work are preserved.
