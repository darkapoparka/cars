# Mobile Services polish

Implemented in `templates/mobile` on 2 October 2026. The development server is
running at `http://127.0.0.1:6474/` with Node 22.20.0.

The existing Cars/Services tab rail is retained. The first service category is
now **All services**, showing all six example offerings as compact rows with a
title, description, icon and chevron. The repeated red enquiry links are removed
from the overview. Each whole row remains tappable, and its heading/description
remain separate accessible content. Financing and Parts open their detail tabs,
with one full-width enquiry action in each.

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
(build ID `f4S-gFcGOzZK3n3Lc6OL0`).
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
