# CARS24 UAE — final visual-polish record

## Current local build

Checkout: L:\cars-app, main, base 1ee05e9556500f456b639d1134e90cdd108fb709.
Verified production build: iXFI2Mqx_f0GPieQ3j1XV. Preview: http://192.168.1.2:4173.
Next.js, React, TypeScript and StyleX remain unchanged. All earlier work and inventory fixtures are preserved. No reset, clean, migration, commit, push or public deployment was performed.

## Final corrections

The vehicle-heading font was matched against the native raster using 27 font/size/weight candidates. Poppins 600 at 18px matched the native title glyph dimensions; the former Geist 700 face did not. The price, EMI line and dealer strip now use the corresponding legacy-detail typography rather than inheriting the newer discovery-page font.
Exterior category thumbnails now use the captured right-side photograph rather than reusing the hero. Interior selection uses the observed front-door cabin image. Hero photography/video stays unchanged. Three- and four-category rails now match the measured native bounds, without losing responsive behavior.
Gallery category fonts and widths were corrected. The EMI sheet now matches the native 96px top edge, heading location and bottom action position at the reference viewport, with scrolling retained on shorter screens.

## Acceptance and tests

- visuals: 51 passed, 0 failed, 20 screenshots, 0 browser errors.
- regression: 224 passed, 0 failed, 80 screenshots, 0 browser errors.
- new-flows: 71 passed, 0 failed, 21 screenshots, 0 browser errors.
- vehicle-coverage: 323 passed, 0 failed, 21 screenshots, 0 browser errors.
- gestures: 8 passed, 0 failed, 2 screenshots, 0 browser errors.
- Loan calculation unit tests: 5 passed.
- Total: 682 automated checks and 144 screenshots. This is not a pixel-parity percentage or count of unique screens.
- npm run check passed. Application hashes and the build ID were stable during verification and were checked again before recording this result.
- Reference, smaller-phone, tablet and desktop layouts were exercised; the measured visual checks use 427×952 and 3× raster density.
- 12 Android/browser pairs: reference/2026-09-26-finish/visuals/pairs. Manual findings: reference/2026-09-26-finish/visual-review.md.

This final measured guest-interface polish pass is complete. This does not establish exhaustive pixel identity across every state of the entire Android application. Platform text rasterization/system chrome and changing offer positions are distinguished from layout defects. Authenticated account/transaction screens and the previously documented five legacy fixtures without detailed snapshots remain outside full-app acceptance.
OTP, real bookings, payments, lender decisions and live inventory synchronization remain disconnected. No real account, credit check, payment or appointment was submitted. Reference images and inspection/finance text are captured presentation, not independent certification or a commercial offer.

## Evidence and reproduction

Detailed reports, stable source hashes and logs: reference/2026-09-26-finish.
Run scripts/finish-build.ps1 to validate and rebuild after stopping only the verified preview owner, then run node scripts/verify-finish.mjs. Do not run a production build over the files of an active production server.
The previous report is preserved in reference/2026-09-26-finish/previous-status.json. Older screenshots and logs remain intact.
