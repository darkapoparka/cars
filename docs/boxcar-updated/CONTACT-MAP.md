# Contact city map

Contact now shows an interactive Varna city map directly below its shared hero, replacing the removed showroom photograph. OpenStreetMap supplies the map and visible attribution. The compact city link sits at the upper left, clear of the map's zoom controls and credits at desktop and phone widths.

`brand.previewCityMap` configures the city name, iframe URL and map link. It adds no showroom address or dealer marker. A verified `brand.showroomMap` takes priority and retains the existing directions action and dealer address consumers. Set both map fields to null to hide the map. The joined white form, grey details panel, white information cards and blue viewing note remain intact.

Seven Chromium browser states passed: Contact at 320, 390, 768, 1024 and 1440 px, plus viewing and selling modes at 320 px. Each has one map, a contained link, three information cards and no horizontal overflow. Viewing and selling subjects remain correct. The map tiles were visually inspected at desktop and phone widths; Zoom In changed the provider zoom from 13 to 14, and Zoom Out restored 13. Provider attribution stays unobscured. No browser console errors were reported.

Svelte check passed with zero errors and warnings. The Vite production build passed with 163 modules using Node 22.23.2. The existing local preview was restored on port 6455 after it had stopped. Dealer map-provider configurations are not covered by this generic city-preview check.

- [Browser receipt and source hashes](contact-varna-results.json)
- [Desktop Contact](contact-varna-desktop.jpg)
- [390 px Contact](contact-varna-390.jpg)
- [320 px Contact](contact-varna-320.jpg)

The Varna center comes from [OpenStreetMap's Varna page](https://wiki.openstreetmap.org/wiki/Varna); embedding follows its [share/export documentation](https://wiki.openstreetmap.org/wiki/Export). Template release pins and dealer deployments are unchanged.
