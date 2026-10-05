# Desktop menu attachment — 5 October 2026

The three-link desktop menu remains 260px wide. Its gap is reduced from 8px to 6px, with a small decorative pointer centered below the Menu trigger and a softer shadow. The pointer follows the actual trigger width in either language, ignores pointer input, and contributes no accessible text. Menu behavior and phone source are unchanged.

Full lint, TypeScript, 95 domain/localization tests and a production build with 51 generated routes passed. Twelve Chromium/WebKit cases in BG/EN at 1023px, 1024x600 and 1440x960 passed: dropdown alignment, 6px gap, pointer, navigation, criteria retention, dismissal and keyboard focus. Thirty-two matched phone comparisons at 320/390px in both languages and browsers across Home, Services, Contact and Saved found no sampled geometry, text, state or computed-style changes, no overflow or console errors.

Independent QuickPills changes 49f3945b3 and 14640c2cc were committed by another writer during this task. That phone component was not edited or staged by this task. Pixel channel statistics are diagnostic and do not establish full pixel identity. Existing generated preview configuration was preserved.

See [BG before/after](bg-menu-before-after.jpg), [EN before/after](en-menu-before-after.jpg), [full BG desktop](bg-desktop-menu.png), [full EN desktop](en-desktop-menu.png), and [verification](verification.json). Captures use matched 1440x960 Chrome viewports; the comparison crops the same header and menu region without resizing.

Local preview: http://127.0.0.1:6478/?lang=bg. No template release or dealer publication is included.
