# Mobile Services polish

Implemented in `templates/mobile` on 2 October 2026. The development server is
running at `http://127.0.0.1:6474/` with Node 22.20.0.

The existing Cars/Services tab rail is retained. The first service category is
now **All services**, showing all six example offerings as compact rows with a
title, description and outlined Enquire or View button. Leading icon tiles and
chevrons are removed. Each action has a minimum 44px height and a service-specific
accessible name. Buttons wrap below the copy when the row cannot fit them beside
it. The headings and descriptions remain separate accessible content. Financing
and Parts open their detail tabs, with one full-width enquiry action in each.

Category tabs are derived from the service list: removing an unavailable Financing
or Parts offering also removes that tab. Deep-link values and return URLs remain
unchanged. Example service availability must be confirmed for a real dealer.

Contact gives a configured phone number a primary Call action, with Email and
Directions as secondary actions. Empty address/hours rows and their empty panel
are omitted. The neutral template has no verified contact destinations; none were
invented. Enquiries still save local drafts, with independent service/vehicle
contexts and no transmission claim.

## Checks and remaining evidence

Lint, TypeScript, all 58 domain tests and the isolated production build passed
(build ID `VnqNbyUIQKAKgRPnn8-5A`, after the button/icon refinement).
The showroom browser suite was updated for All services, overview/detail
navigation and the single detail action, and its syntax check passed.

Fresh browser verification and screenshots are pending. Browser Use rejected the
local preview under its URL policy in the preceding review. No alternate browser
surface or screenshot workaround was used. The updated browser suite has not been
executed, and the new 320/390/1440px appearance and interactions are not yet verified.

The pre-polish Services/Contact source matched the previously captured version
(`bd3b0f53d`). These saved 390px captures are the available before evidence, from
earlier on 2 October; they are not newly captured after images:

- [Services before polish](../runtime/mobile-services-contact-20261002/services-after-390.jpg)
- [Contact before polish](../runtime/mobile-services-contact-20261002/contact-after-390.jpg)

No fresh after screenshot is available. Browser access needs to be restored before
the requested matched comparison and visual acceptance can be completed. No
reviewed template release or dealer deployment is selected by this source change.

## Dev startup repair

The raw Next dev command was listening but returned HTTP 500 because it resolved
client entries through the dependency junction on C: instead of the project path
on L:. `npm run dev` now uses the same launcher and Windows symlink flags as the
production preview, while retaining its separate `.next` output.

After restarting with this launcher, `/services`, `/` and `/contact` returned
HTTP 200. The first development compile needed over 50 seconds; subsequent
Services responses were immediate. Launcher syntax, the Cars workflow check and
workflow test suite passed. The production build also passed, with build ID
`EG3zEDCbw2yFP5hWZqWcg`. These are server checks; fresh visual captures remain
pending under the browser access restriction described above.
