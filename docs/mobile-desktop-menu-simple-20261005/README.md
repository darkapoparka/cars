# Mobile desktop menu simplification — 5 October 2026

The desktop hamburger dropdown now has exactly three destinations: Cars, Services and Contact. Its width is reduced from 420px to 260px, with 48px rows and clear active-page styling. Individual offerings remain on Services. The menu uses the same navigation data as the phone dock; duplicated service mappings and styles were removed. Existing disclosure, keyboard, outside dismissal, breakpoint dismissal and retained inventory criteria behavior are preserved.

Full source lint, TypeScript, 95 retained domain/localization tests and the production build passed. Twelve Chromium/WebKit cases in BG/EN at 1023px, 1024x600 and 1440x960 passed, including all three primary destinations, Saved access, inventory criteria retention and keyboard behavior. Chromium traverses native links with Tab; the local WebKit preference skips links with Tab and dismisses the menu, while arrows reach all three links.

Thirty-two matched phone comparisons across Home, Services, Contact and Saved at 320/390px, in BG/EN and Chromium/WebKit, found no sampled geometry, text, state or computed-style changes, no overflow and no console errors. Screenshot channel statistics are retained as diagnostic evidence and are not a claim of full pixel identity. Existing generated preview configuration changes were preserved outside this change.

See [BG before/after](bg-menu-before-after.jpg), [EN before/after](en-menu-before-after.jpg), [BG menu](bg-desktop-menu.png), [EN menu](en-desktop-menu.png) and [verification](verification.json). The previous delivery's full 1440x960 captures are reused for the before view after verifying its menu source hash matches this task's preimage.

Local preview: http://127.0.0.1:6478/?lang=bg. No template release or dealer publication is included.
