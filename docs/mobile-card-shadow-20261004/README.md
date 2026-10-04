# Mobile vehicle card edge polish

4 October 2026. The visible vehicle-card outline is replaced with a shallow
`0 1px 4px rgba(27, 27, 33, 0.08)` shadow. The white surface, 1px border geometry,
16px outer corners, photo inset and content layout remain unchanged. The existing
shared `ShowroomVehicleCard` supplies inventory, Saved and related vehicle cards.
No new component, JavaScript state or dependency was added.

## Visual evidence

Matched Bulgarian BMW inventory captures at the same filter and scroll position:

| Viewport   | Before                            | After                           |
| ---------- | --------------------------------- | ------------------------------- |
| 390 x 844  | [Before](cars-before.jpg)         | [After](cars-after.jpg)         |
| 320 x 844  | [Before](cars-320-before.jpg)     | [After](cars-320-after.jpg)     |
| 1440 x 900 | [Before](cars-desktop-before.jpg) | [After](cars-desktop-after.jpg) |

[Saved](saved-after.jpg) and [related vehicles](related-after.jpg) confirm the
shared style. The temporary saved vehicle was removed after inspection.
[Card measurements](card-surfaces.json) record the same 343 x 318.125px card
bounds and `rgb(255, 255, 255)` surface before and after at 390px. The browser's
vertical scrollbar occupies 15px of that viewport.

## Validation

Node 22: source lint, TypeScript, formatting of the touched files, all 91 existing
domain/localization tests and the production build passed. The build generated
51 routes in a separate output directory, without replacing active build output.

[Browser checks](browser-checks.json) record the Chromium and WebKit checks for
Bulgarian/English routes at 320/390/1440px, image rendering, overflow, keyboard
focus, sticky controls, card facts and enquiry/draft behavior. A first Chromium
pass on port 6474 was interrupted by a local preview restart. Both engines were
then checked against the same completed build on dedicated port 6478.

The local build includes concurrent picker drafts from the shared checkout;
those edits are outside this scoped change. These checks establish local source
and browser behavior, not native parity, release-lock acceptance or dealer
publication.
