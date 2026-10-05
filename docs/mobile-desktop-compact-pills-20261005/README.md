# Compact desktop filter pills — 5 October 2026

Six natural-width pills give direct access to Year, Mileage, Fuel, Gearbox, Body type and Condition. A soft gray rail separates these secondary controls from the hero. White 36px pill faces sit inside 44px targets, and applied criteria use the existing orange accent. A dark All filters action sits at the end of the row and counts applied criteria. The row wraps as needed, without horizontal scrolling or a separator line.

Make, model, category and price stay in the approved hero. The four-car grid is preserved. Mileage, Gearbox and Body open the existing More editor at their actual fields, scrolling the panel and focusing the relevant control on desktop. These shortcuts share the existing normalized draft, sidebar, apply and clear flows. Editor URLs use filter=more plus a typed, whitelisted section; changing sidebar tabs, applying or closing removes the section appropriately. Phone section behavior and default shared Services controls remain unchanged.

Full source lint, TypeScript, 95 domain/localization tests and a production build with 51 generated routes passed. Sixteen Chromium/WebKit cases in BG/EN at 1023px, 1024x600, 1440x960 and 1920x1080 passed. Checks cover compact geometry, contrast, seven destinations, keyboard focus return, short dialog scrolling, real Fuel/Mileage/Body/Condition application, draft preservation across tabs, Clear, sticky scrolling, long values and direct section URLs.

Thirty-two matched phone cases at 320/390px, BG/EN and both engines cover Home, applied filters, More and Services. The sampled visible DOM, layout and computed styles match across the entire sampled page, including cards. Another 32 comparisons establish identical actual pill faces, including selected states. Whole phone screenshots have some raster differences; whole-page pixel identity is not claimed. Generated Next configuration was restored without discarding pre-existing or concurrent includes.

See [BG before/after](bg-home-before-after.jpg), [BG applied](bg-applied-before-after.jpg), [EN before/after](en-home-before-after.jpg), [EN applied](en-applied-before-after.jpg), [BG desktop](bg-desktop.png), [EN desktop](en-desktop.png) and [verification](verification.json). Comparisons use matched 1440x960 captures of the same hero, rail and result heading, without resizing.

Local preview: http://127.0.0.1:6478/?lang=bg. No template release selection or dealer publication is included.
