# Mobile template desktop filter polish — 4 October 2026

The desktop filter sheet now uses 16px labels with a constant 600 weight and a
fixed 56px tab height. Label-based widths let all seven tabs fit at 700px. A quiet
tab background, warm selected surface and inset underline make selection clearer.
Search fields use a light bordered surface; make and model checkboxes both measure
20px, and removing a brand has a visible button. Desktop tabs and Apply have no
transition or pressed translation.

Selection previously changed the tab label weight, which could alter its width.
Desktop labels also shrank to 14px. The constant weight and fixed row remove that
source of movement. The existing equal-width panels, fixed modal frame, internal
scrolling and blurred backdrop remain in place.

## Validation

- ESLint, TypeScript and all 92 domain/localization tests passed.
- The production build passed; the source hash check confirms the served build
  contains the reviewed desktop changes and current phone components.
- All 86 recorded browser assertions passed, with no console errors.
- Bulgarian desktop checks: 700×900, 768×900, 1024×768, 1440×900 and 1920×1080.
- English desktop checks: 700×900, 1024×500 and 1440×900.
- Switching all seven tabs kept the modal, heading, footer and every tab's
  position and dimensions fixed. Every label fit inside its tab at those widths.
- Keyboard Home, End and ArrowRight, model search, selection, family expansion,
  variant input, brand removal, re-selection and Apply were exercised.
- Make/model columns measured 374px each at 1440px, with matching 44px fields.
- Phone checks at 320×844 and 390×844 matched the baseline geometry, tab styling
  and Apply behavior. The overflow tab rail still reveals the active tab.
- Matched phone screenshots are pixel-identical at both widths.

The phone baseline came from the current Mobile master preview on port 6478,
including the independent picker-row polish in Cars commit `399e33bd2`. The older
6474 process still served its preceding build at capture time. After this task's
build, port 6474 serves the current master plus these desktop changes. The
desktop baseline was captured from that preceding 6474 build.

The English modal was checked. Apply currently omits `lang=en` from its URL and
returns to Bulgarian; that existing locale behavior is outside this styling
change. These checks establish local preview behavior, not hosted acceptance or
a dealer release.

## Evidence

- [Matched desktop comparison](desktop-before-after.jpg)
- [Desktop after](after-desktop-1440.jpg)
- [English desktop after](after-desktop-en-1440.jpg)
- [320px before](before-mobile-320.jpg) / [after](after-mobile-320.jpg)
- [390px before](before-mobile-390.jpg) / [after](after-mobile-390.jpg)
- [Browser measurements and assertions](verification.json)
- [Phone screenshot pixel comparison](phone-pixels.json)
