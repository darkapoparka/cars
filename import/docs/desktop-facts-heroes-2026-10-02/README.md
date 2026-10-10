# Desktop facts and shared hero frame

Mileage retained chip styling after the other desktop facts became plain text. Image heroes also used competing 400px discovery, 300px page and 240px compact variants.

Desktop cards now use the same plain-text treatment for year, fuel, transmission and mileage. Mileage remains aligned on the right; the image overlay stays hidden. Home and inventory use the same card component.

All eight image-hero routes now use `--bc-desktop-page-hero-height`: 400px above 900px, 450px at 768–900px. Home, Inventory, Services, About, Contact, Sell, Financing and Import share this frame. Content can still grow for enlarged text or applied filters. Plain text introductions and mobile presentation are unchanged. The unused compact prop, classes and competing height tokens were removed.

## Evidence and checks

- `before-*-1440.jpg` / `after-*-1440.jpg` compare every route at the same viewport and page-start position.
- `before-heroes.json` / `after-heroes.json` record the old and unified heights.
- `desktop-matrix.json` covers BG/EN at 768, 900, 1024, 1440 and 1920px: content fits, no horizontal overflow, single-row titles, matching fact typography and no desktop mileage chip or overlay.
- Eight mobile routes were compared at 320/390px. Fourteen of sixteen screenshots are pixel-identical. The remaining captures differ in native select and embedded Google Maps painting; controls and layout were visually checked. No mobile CSS or mobile components changed.
- Svelte check, scoped formatting/lint, architecture and production build passed with Node 24.21.0. The existing page-pattern, inventory and desktop-search suites passed 21 cases with 17 expected device-specific skips against a frozen production preview.

`verification.json` records the checked source hashes and QA result. Source verification does not promote a template release or deploy dealers. Unrelated drafts were preserved.
