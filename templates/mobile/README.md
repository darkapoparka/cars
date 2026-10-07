# Mobile — Cars template

A showroom template based on the preserved mobile.de Android interface.
Canonical source: `darkapoparka/cars`, `templates/mobile` on `main`.
See [TEMPLATE.md](TEMPLATE.md) for provenance, personalization and release status.

Use Node 22.x. Run `npm ci`, `npm run check`, then `npm start`.
Open **http://127.0.0.1:6474**. The production preview uses `.next-review`.
`npm run dev` uses the same port, so choose one mode at a time.

Cars is the home, with search, native vehicle-category tabs, quick filters and
inventory together. Used/New is inside Filters. The bottom navigation
is Cars / Services / Contact; saved cars work without registration. Dealer identity
and contact details are configured in `src/lib/showroom.ts`.

The included screens use captured sample inventory and local state. Enquiries are
local drafts. Finance, appointments and publication remain demonstrations.
The native reference is mobile.de 10.26 on the preserved emulator-5554.
Run `npm run qa:architecture` against the running preview for current showroom
browsing, persistence and responsive checks in Chromium and WebKit.
See [Architecture and checks](docs/ARCHITECTURE.md) for the source boundaries and
the distinction between current release checks and historical reference suites.

On this workstation, dependencies and build output are linked to dedicated
runtime directories on C: because the Android AVD shares the constrained L: drive.
The source stays here; a fresh checkout can install and build normally.
