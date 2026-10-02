# Contact layout and optional map

The extra showroom photograph and its marketing caption have been removed from Contact. With no map configured, the joined enquiry/contact panel follows the shared page banner directly, with the same 28 px desktop or 20 px phone spacing. There is no reserved empty photo/map space.

The existing `brand.showroomMap` configuration is retained: `{ address, embedUrl, directionsUrl }`. A configured provider iframe and directions link appear below the page banner, with 36 px desktop or 24 px phone spacing before the contact panel. The generic Boxcars candidate still has no verified showroom address, so no location or pin has been invented and its map remains hidden.

The local unconfigured layout passed seven browser states in Chromium: Contact at 1440, 1024, 768, 390 and 320 px, plus viewing and selling modes at 320 px. Headings, subjects, selling fields, connected surfaces and text fit were inspected. No horizontal overflow or console errors were found. The map provider itself was not verified because no dealer map is configured.

Svelte check passed with zero errors and zero warnings. The Vite production build passed using Node 22.23.2. The enquiry component, shared banner, brand configuration and general stylesheet retain their previous source hashes.

- [Browser receipt](contact-layout-results.json)
- [Desktop Contact](contact-layout-desktop.jpg)
- [320 px Contact](contact-layout-320.jpg)

Template release pins and dealer deployments are unchanged.
