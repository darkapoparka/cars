# Mobile showroom density and navigation polish

Implemented in `templates/mobile` on 2 October 2026. The local production preview
is `http://127.0.0.1:6474/`; Node is `L:/Toolchains/Node/22.20.0/node.exe`.

The inventory entry keeps search, the five native vehicle categories and their
original grey rail/orange indicator. Filters now use the same outlined treatment
as the quick pills, with a count of active criteria. Range bounds and multiple
condition choices count as one criterion; the text search has its own clear control.
The Make pill retains the make/model picker. Sorting visibly names the selected
order in an outlined button.

The compact Clear control retains a 44px minimum target in both dimensions.
Card bodies have smaller padding and gaps, a single-line equipment subtitle and
the same photo aspect ratio. The title link covers the card through a positioned
pseudo-element; saving remains a separate control. The visible title, specs and
price remain accessible as separate content. Cards stay in one column on phones
and two columns from 700px. The bottom navigation now uses matching 24px outline
icons for Cars, Services and Contact, with grey inactive and orange active states.

## Matched before/after

The in-app browser was captured at 390 x 844 and 320 x 844, on the same inventory
entry at the top of the page with no filters. Its scrollbar leaves a 377px content
width in the 390px capture. The measured first car is BMW X6.

| Measurement at 390px | Before | After |
| --- | ---: | ---: |
| First card height | 429px | 367px |
| Card text area | 200px | 138px |
| Photo height | 229px | 229px |
| First photo top | 308px | 292px |
| Second card top | 757px | 673px |

- [Before at 390px](../runtime/mobile-density-20261002/before-390.jpg)
- [After at 390px](../runtime/mobile-density-20261002/after-390.jpg)
- [Before at 320px](../runtime/mobile-density-20261002/before-320.jpg)
- [After at 320px](../runtime/mobile-density-20261002/after-320.jpg)

## Validation

Lint, TypeScript, 57 domain tests and the production build passed. The final
production build ID is `AljNxQsRTbB0QN2ri5AbX`.

The showroom suite passed 38 Chromium and 19 WebKit checks with no console/page
errors. It covers category/filter state, visible sort labels, active filter count,
photo-area navigation, save controls, related-car Back/Forward and exact scroll
restoration. The Back test centers its target outside the sticky controls before
measuring scroll, retaining the strict four-pixel restoration threshold.

Chromium checks cover 320/390/1440px inventory, Services, Contact, saved cars and
vehicle detail; 320 x 480 sheets; and 200% text reflow. The narrow/default,
large-text, desktop and Services captures were visually reviewed. The maintained
browser was also checked at 320px with an active budget filter, then restored to
the unfiltered inventory and normal viewport.

The final automated report and captures are in
`runtime/mobile-density-20261002/qa/report.json`; matched captures are retained in
`runtime/mobile-density-20261002/`. These are local template checks and do not
select a dealer release or represent hosted acceptance.
