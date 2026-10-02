# Boxcars showroom card polish

Completed locally on 2 October 2026 in `templates/boxcar-updated`, preview port 6455. This is candidate-template polish; no dealer copies, release selection or Vercel deployment were changed.

Later [PDP surface polish](PDP-SURFACES.md) separates the desktop purchase and showroom cards and replaces section rules with white cards on grey. The screenshots and hashes in this record describe the earlier showroom pass.

The vehicle detail card now uses an original generated showroom banner, a live configured dealer title, shorter viewing copy and a full-size contact action. The purchase buttons share readable 20 px arrows and alignment. Phones use full-width purchase actions; the showroom moves after Features and before Finance estimate so the vehicle photo stays near the top. The price adapts to narrow screens with enlarged text without expanding the grid track.

`brand.showroomBanner` accepts permitted dealer imagery or null. The current banner is an illustrative concept rather than actual premises. Its [provenance](../../templates/boxcar-updated/provenance/showroom-art-2026-10-02.md) records the built-in imagegen prompt and preserved original. The optimized opaque WebP is 960 x 540 and 95,868 bytes.

## Verification

- Svelte check: zero errors, zero warnings. Production build passed with 161 modules.
- Chromium and WebKit: 1440, 1024, 768, 390 and 320 px, plus 320 px with 200% root text size. Twelve layouts passed with one visible showroom card, loaded images, contained actions, consistent arrow alignment and no horizontal overflow.
- Enquiry opens for the correct car, closes and restores focus. Repayments retains the vehicle price. Showroom contact preselects Arranging a viewing. The photo dialog and multi-photo gallery retain their controls.
- Contact action text contrast passes in normal and hover states. This is a focused component check, not a site-wide accessibility claim.

[Browser results and source hashes](showroom-polish-results.json) · [Desktop proof](showroom-desktop-v1.png) · [320 px showroom](showroom-320-v1.png) · [320 px purchase card](showroom-purchase-320-v1.png).

## Source handoff

The related service-art changes from the preceding request remain preserved. The initial scoped commit/push attempt was blocked by the pre-existing zero-byte `L:/CODEX/cars/.git/index.lock`, created at `2026-10-02T14:48:31.1407722Z`. The lock was not removed or bypassed. Nothing was committed, pushed, released or deployed during that initial handoff. The later PDP pass completes the combined source handoff when the shared index is available.

During the last stylesheet edit L: ran out of space, interrupting that write. The stylesheet was recovered from its clean starting source plus the owned changes, and the final checks were repeated successfully. The previous generated build and clean stylesheet backup were preserved under `C:/Users/radev/AppData/Local/Temp/cars-boxcar-showroom-recovery-20261002/`. The final production build is again in the template's `dist/`. No session data, databases, source histories or recovery evidence were deleted.
