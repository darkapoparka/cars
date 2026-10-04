# Mobile filters, final polish — 4 October 2026

The phone editor now opens models directly from a brand row. One Makes back action
and a brand heading replace the two selector buttons. Model choices survive Back
and reopening. Selected brands retain their explicit removal action.

Price offers Any and upper limits of EUR 40,000, 60,000 and 100,000. A shortcut
replaces both price bounds; custom ranges clear its highlight. The labelled Clear
action resets the draft across sections while retaining the vehicle category.
Show applies the draft; Close and Escape cancel it.

The desktop frame remains 820 × 680 at a 1440 × 960 viewport. Its footer geometry,
seven tabs, 16px labels and 8px backdrop blur remain stable. The narrower 700 × 600
check also fits all seven tabs and keeps the frame and footer stationary.

## Evidence

- [Before](before.jpg) and [after](after.jpg): matched Bulgarian 390 × 844 budget
  and BMW model views. The after budget image shows the selected EUR 60,000 limit.
- [Browser verification](verification.json): 69 passing checks across Bulgarian
  and English at 320, 390 and 1440 pixels, plus a compact desktop and category
  reset check. Apply/cancel, custom price, explicit brand removal, model Back,
  keyboard Home, Escape/focus return and overflow were inspected. No console errors
  appeared during these flows.

Node 22.20.0: full source lint, TypeScript, 92 domain/localization tests and a
production build passed. The existing showroom harness was updated for the Clear
label and brand-row navigation; this turn's rendered checks used Codex Browser.
The retained native standalone picker and the separate App template were not edited.

The validated local build serves http://127.0.0.1:6478 using its own build output.
6474 remains the other existing Mobile preview. These checks establish local
browser behavior, not native-device parity or a dealer deployment. The release
lock and dealer variants remain unchanged.
