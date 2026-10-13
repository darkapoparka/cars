# Desktop seller banner map pin removal

Removed the map pin and its circular background from `VehicleDealerBanner.svelte`. The address now occupies the first grid column, with the destination arrow in the second. The banner still links to the configured map destination.

Verified locally at `http://127.0.0.1:6790/bg/inventory/21778067767337633`:

- Desktop 1440px: no map pin or empty icon slot; address and destination arrow remain; no horizontal overflow.
- Mobile 320px and 390px: the independent mobile PDP mounts, the desktop banner is absent, and neither viewport has horizontal overflow. No mobile source was changed.
- Scoped ESLint passed; Svelte check reported zero errors and zero warnings; scoped diff whitespace check passed.

`after-1440.jpg` shows the updated seller banner beside the desktop specifications and finance calculator. The previous state is recorded in `../desktop-pdp-alignment-2026-10-02/after-1440.jpg`.

This is local template verification, not a template release or dealer deployment.
