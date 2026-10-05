# Desktop inventory quick pills — 5 October 2026

Year, Fuel, Gearbox and More now fill one four-column desktop rail aligned with the car grid. Faces are 44px high inside 48px targets, with small icons, left-aligned labels and right chevrons. White fills and thin neutral borders keep these secondary controls quiet; applied filters use a darker border and stronger text. Spacing replaces the full-width separator beneath the rail. The hero's vertical field dividers remain to identify its separate selectors.

Make and Price remain in the hero when applied, avoiding duplicate pills. Clear sits beside the inventory count and sort control on desktop, so selections keep the rail at four columns. The grid and neutral selected appearance use the opt-in fillDesktop presentation. Phone and Services rails retain their existing presentation.

Full source lint, TypeScript, 95 domain/localization tests and a production build with 51 generated routes passed. Sixteen Chromium/WebKit cases in BG/EN at 1023px, 1024x600, 1440x960 and 1920x1080 passed, including column alignment, all four dialog destinations, keyboard focus return, real Fuel application, Clear, pinned scrolling and long selected labels. The verification waits for browser Back to finish before opening the next filter.

Thirty-two matched phone comparisons at 320/390px, BG/EN and Chromium/WebKit across Home, applied filters, More and Services found no differences in the filter controls, dialogs, header, dock or full Services view. An additional 32 matched pill-face comparisons found identical geometry, typography, backgrounds, borders, shadows, padding and spacing. The shared checkout also has a concurrent ShowroomVehicleCard.tsx draft that changes inventory screenshots, including phone cards. That file was preserved outside this task; no full inventory pixel-identity claim is made.

See [BG default before/after](bg-home-before-after.jpg), [BG applied before/after](bg-applied-before-after.jpg), [EN default before/after](en-home-before-after.jpg), [EN applied before/after](en-applied-before-after.jpg), [full BG desktop](bg-desktop.png), [full EN desktop](en-desktop.png), and [verification](verification.json). Comparisons use matched 1440x960 captures and crop the same hero, rail and result-heading region without resizing; the concurrent card draft is outside these cropped comparisons.

Local preview: http://127.0.0.1:6478/?lang=bg. No template release or dealer publication is included.
