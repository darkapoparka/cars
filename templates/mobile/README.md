# Mobile — Cars template

A showroom template based on the preserved mobile.de Android interface.
Canonical source: `L:/CODEX/cars/templates/mobile`.
See [TEMPLATE.md](TEMPLATE.md) for provenance, personalization and release status.

Use Node 22.x. Run `npm ci`, `npm run check`, then `npm start`.
Open **http://127.0.0.1:6474**. The production preview uses `.next-review`.
`npm run dev` uses the same port, so choose one mode at a time.

Cars is the home, with search, filters and inventory together. The bottom navigation
is Cars / Services / Contact; saved cars work without registration. Dealer identity
and contact details are configured in `src/lib/showroom.ts`.

The included screens use captured sample inventory and local state. Enquiries are
local drafts. Finance, appointments and publication remain demonstrations.
The native reference is mobile.de 10.26 on the preserved emulator-5554.
Run `npm run qa:showroom` for the showroom browsing and responsive checks.

On this workstation, dependencies and build output are linked to dedicated
runtime directories on C: because the Android AVD shares the constrained L: drive.
The source stays here; a fresh checkout can install and build normally.
