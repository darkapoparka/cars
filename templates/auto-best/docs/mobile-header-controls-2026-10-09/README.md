# Mobile header controls — 9 October 2026

Home, Cars and the vehicle detail photo overlay share the existing `dn-icon-button` frame: a 44px tap area surrounding a 40px visible circle. Their icons share `dn-mobile-header-action` and the `--dn-mobile-header-icon-size` token (20px), using the pinned Fluent Regular renderer. Photo-overlay colors remain suited to the photograph.

The PDP previously used a 40px tap area and 24px icons. Its back, phone and share actions now reuse the common frame. Home header icons previously measured 22px; they now follow the same 20px role as Cars Sort/Filter. Dialog header controls retain their separate role.

| Surface, EN 390px | Before | After |
| --- | --- | --- |
| Home | [Before](before-home-en-390.png) | [After](after-home-en-390.png) |
| Cars | [Before](before-cars-en-390.png) | [After](after-cars-en-390.png) |
| PDP | [Before](before-pdp-en-390.png) | [After](after-pdp-en-390.png) |

`before.json` and `after.json` record 18 browser cases: Home/Cars/PDP at EN 320, 390, 767 and 1440px, plus BG 320 and 390px. Checks confirm the mobile dimensions, no horizontal clipping and unchanged desktop geometry. The PDP back action returns to Cars. `shared-role.json` checks all three routes at 390px after the Cars Sort/Filter controls were connected to the shared role.

Source, CSS/token/typography and production-build checks accompany these measurements. This is local verification; no dealer deployment or template release pin changes are included. Unrelated shared stylesheet and desktop-filter work remains outside this change.
