# Contact detail cards

The joined Contact panel now uses a light grey right-hand surface (`#f2f4f7`). Showroom, opening hours, email and any configured phone occupy white rounded cards with blue icons. The viewing note uses the dealer's accent color with white text. The existing white form and connected outer container are retained.

The local Contact page was inspected in the Codex Chromium browser at 1440, 1024, 768, 390 and 320 px. All five layouts passed: the columns or stacked sections meet without a gap, the cards fit inside their container, and contact text has no clipping or horizontal overflow. No console errors were observed. The Vite production build passed using Node 22.23.2.

Only contact styles changed. The Contact component, enquiry behavior, shared page banner, brand configuration and general stylesheet retain the source hashes from the preceding panel verification.

- [Browser receipt](contact-cards-results.json)
- [Desktop panel](contact-cards-desktop.jpg)
- [320 px details](contact-cards-320.jpg)

No template release pin or dealer deployment changed.
