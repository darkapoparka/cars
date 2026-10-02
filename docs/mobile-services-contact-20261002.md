# Mobile Services and Contact

Implemented in the Mobile master at `templates/mobile` on 2 October 2026.
Local production preview: `http://127.0.0.1:6474/`, using Node 22.20.0.

Services now places Services, Financing and Parts below the showroom header.
Cars and Services use the same tab component: grey rail, 3px orange indicator,
roving keyboard focus and arrow/Home/End controls. Existing Cars category IDs,
native icons and inventory/filter behavior are retained.

Service categories live in the URL, with reload and Back/Forward support. Compact
cards link to their own enquiry. View service returns to the relevant category.
Financing and Parts contain short details to help frame the enquiry. These are
example offerings; availability must be confirmed during dealer personalization.

Contact leads with configured Call, Email and Directions actions, then the enquiry
and compact address/hours details. No empty action tiles are rendered when dealer
contacts are unset. The form remains a local draft; it makes no delivery claim.
Service and vehicle contexts retain separate draft keys. Changing context remounts
the contact screen so an unsaved edit cannot leak into another enquiry.

Matched 390px Services/Contact captures are retained in
`runtime/mobile-services-contact-20261002/`. Browser reports and route captures
are under its `qa/` directory. These are local template checks; no dealer release
or hosted deployment is selected by this change.

## Validation

Lint, TypeScript, all 57 domain tests and the production build passed. Final
build ID: `jcuz54k9U7we7MTC0vdu3`. The showroom suite passed 50 Chromium and
22 WebKit checks with no console/page errors. Coverage includes categories,
keyboard navigation, URL/reload/Back/Forward state, full-card enquiry actions,
separate financing/parts drafts, and retained vehicle/inventory navigation.

320/390/1440px checks cover Services, Financing, Parts and Contact alongside
the existing inventory journeys. Simulated 200% text checks include both service
categories and the contextual parts enquiry. Large text uses a scrollable tab
rail that keeps the selected tab visible; the enquiry context wraps its return
link onto a second row. The narrow, desktop and large-text captures were reviewed.
Call/email/directions were not exercised because the neutral dealer config has
no verified contact destinations.

- [Services before](../runtime/mobile-services-contact-20261002/services-before-390.jpg)
- [Services after](../runtime/mobile-services-contact-20261002/services-after-390.jpg)
- [Contact before](../runtime/mobile-services-contact-20261002/contact-before-390.jpg)
- [Contact after](../runtime/mobile-services-contact-20261002/contact-after-390.jpg)
- [Parts enquiry at 320px](../runtime/mobile-services-contact-20261002/contact-parts-after-320.jpg)

The fresh in-app preview tab was left on Services with its normal viewport.
