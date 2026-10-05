# Preferred Mobile quick-pill shadow restored

The owner preferred the previous pill treatment. Restored `0 1px 4px rgba(27, 27, 33, 0.12)` in the shared quick-pill component. The lighter-shadow experiment remains documented separately as historical evidence.

`before-390.jpg` shows the rejected lighter shadow; `after-390.jpg` shows the restored treatment on the same Bulgarian inventory route, viewport and scroll position. Mobile geometry and colors match exactly, apart from the shadow. Faces remain 40px high within 48px button targets.

Computed styles and actual screenshot pixels confirm that the pill centres and canvas are both pure white. The tab rail ends at 168px, while pill faces begin at 184px. Its shadow shades the intervening gap, rather than the pill centres. Clearer white-surface contrast would require changing the surrounding canvas, a separate design choice.

Lint, typecheck, 95 existing domain/localization tests and a production build passed on Node 22.20.0. Browser checks at 320, 390 and 1440px found no page overflow or console errors; desktop pills retain their no-shadow treatment. Exact results and pixel samples are in `browser-verification.json`.

Local preview: `http://127.0.0.1:6474/`, build `RFue7O4fnldMttn_7PHGr`. Concurrent source and generated configuration were preserved. This restores the requested source styling without changing release selection or dealer deployments.
