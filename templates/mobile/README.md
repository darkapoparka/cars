# Mobile — Cars template

A working Cars template based on the preserved mobile.de Android interface.
Canonical source: `L:/CODEX/cars/templates/mobile`.
See [TEMPLATE.md](TEMPLATE.md) for provenance, personalization and release status.

Use Node 22.x. Run `npm ci`, `npm run check`, then `npm start`.
Open **http://127.0.0.1:6474**. The production preview uses `.next-review`.
`npm run dev` uses the same port, so choose one mode at a time.

The included screens use captured reference inventory and local state. Seller
contact, authentication, finance, appointments and publication are demonstrations.
The native reference is mobile.de 10.26 on the preserved emulator-5554.

On this workstation, dependencies and build output are linked to dedicated
runtime directories on C: because the Android AVD shares the constrained L: drive.
The source stays here; a fresh checkout can install and build normally.
