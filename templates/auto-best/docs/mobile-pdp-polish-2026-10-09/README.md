# Mobile PDP controls and hierarchy — 9 October 2026

The PDP back, phone and share controls now paint 40px white circles inside the shared 44px tap areas, with 20px Fluent icons. A `background` shorthand had reset the phone/share controls' shared `background-clip`, producing 44px visible circles. Using `background-color` preserves clipping; removing the overlay shadow also removes its extra visual bulk.

The mobile vehicle title uses the existing 20px/500 role, while the price retains 30px/600. An 8px gap separates them. All source changes are inside the existing maximum-767px media query.

| EN 390px | Before | After |
| --- | --- | --- |
| PDP | [Before](before-pdp-en-390.png) | [After](after-pdp-en-390.png) |
| Home | [Before](before-home-en-390.png) | [After](after-home-en-390.png) |
| Cars | [Before](before-cars-en-390.png) | [After](after-cars-en-390.png) |

`before.json` records six baseline cases. `after.json` records 18 cases: Home/Cars/PDP at EN 320, 390, 767 and 1440px, plus BG 320 and 390px. Pixel probes use a contrasting background in an isolated browser page to measure the painted controls, including their transparent 2px insets. Home header pseudo-elements are measured by their full border box. The normal screenshots are captured before the probe changes the temporary page background.

Checks confirm 40px painted surfaces, 44px tap areas, 20px icons, no horizontal overflow, the mobile PDP title/price roles and gap, and unchanged desktop geometry against the baseline. CSS policy, tokens, typography, visual-system pins, localization and the Node 22 production build passed. These are local source and rendered checks; no dealer deployment or template release selection is included.
