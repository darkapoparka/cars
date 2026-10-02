# Compact Boxcar vehicle heading and thumbnails

The later [copy and navigation cleanup](COPY-NAVIGATION.md) removes repeated sample captions and replaces the centered Back text with a white button aligned above the title. Its receipt records the current source hashes and handoff; this document records the preceding compact-heading pass.

Completed locally on 2 October 2026 in `templates/boxcar-updated`, preview [port 6455](http://127.0.0.1:6455/vehicle/volvo-xc90-recharge/).

The title and summary now sit beside Save/Compare at desktop widths, inside the existing gallery-width white card. Scoped title sizing, smaller padding and 44 px action controls reduce the measured 1440 px Bentley heading from 220.36 px to 116.69 px, in both default and selected states. The card still starts level with the purchase card and stops before its column. At narrower widths the controls wrap beneath the title and remain contained when the selected comparison label grows or text is enlarged.

The thumbnails now occupy a separate rounded white tray with 14 px padding and a 16 px gap below the main photo. Narrow layouts scroll inside that tray. Existing thumbnail selection, previous/next controls and the enlarged photo dialog retain their behavior; thumbnail keyboard focus remains visible.

## Verification

- Svelte check passed with zero errors and zero warnings. Vite production build passed with 161 modules.
- Chromium and WebKit passed 26 focused heading states across 1440, 1024, 768, 390 and 320 px, including selected Save/Compare labels and 320 px with 200% root text. Desktop actions were verified beside the title, with retained purchase alignment and gallery width.
- All 17 sample vehicle pages passed at desktop and 320 px in both engines: 68 catalogue checks. Title/action containment, document width, loaded thumbnail assets and white tray geometry passed.
- Four multi-photo checks passed next-photo selection, keyboard activation of the last thumbnail, contained thumbnail scrolling, visible focus and selected-photo dialog/Escape dismissal.
- Four existing desktop/phone journeys passed filtered Back navigation, correct enquiry vehicle and restored focus, calculator price, showroom viewing intent and gallery dismissal. Enlarged phone finance results fit.
- No JavaScript errors were observed. The homepage/service assets and sources, all ten original homepage sources, supporting page source hashes and their prior layout work remain preserved. Supporting page layout checks were not repeated for this PDP-only CSS change.

[Browser results and source hashes](compact-pdp-results.json) · [Desktop title and thumbnails](pdp-thumbnails-1440.png) · [Desktop Bentley](pdp-compact-1440.png) · [320 px title](pdp-compact-320.png).

## Source scope

This follow-up changes the PDP rules in `src/styles.css`; the Svelte page structure and existing controls retain their prior implementation. Template documentation and the PDP selection receipt describe the compact header and thumbnail surfaces. The combined service-art, showroom, surface and heading polish owns 45 explicit paths, recorded in the ignored `runtime/boxcar-compact-pdp/owned-paths.json`. Cars remains on `main` and the initial `workspace-doctor --fetch` confirmed it was level with fetched main. Earlier index-lock evidence and recovery backups are preserved.

The final staging preflight found the shared `.git/index.lock` present and the staged list empty. No staging, commit or push was performed, and the lock was not removed or bypassed. The inspected main HEAD remains `f190421c4a2a80630a2170ec5c52a27a3c1df05b`. When its writer releases the index, inspect staged state, stage only the 45-file allowlist, review the staged diff, commit and push main without force. Local polish is ready independently of that source handoff.

These are local source, build and browser results. Owner visual acceptance, an approved template release, dealer refreshes and Vercel deployment are separate; none was changed by this polish.
