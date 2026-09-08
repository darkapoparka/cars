# Rencar polish style guide

Status: owner-requested direction, implemented for review in `clients/dayandnight/rencar`. Original `templates/rencar` is unchanged. This guide governs Rencar polish; it does not redesign the other automotive families.

## Design authority

Keep Rencar recognizable: its typography, vehicle cards, navigation, buttons, icons and five real homepage variants. The owner rejected an earlier replacement application. Existing source markup is the starting point; no equivalent-looking rebuild or framework migration is implied by this guide.

The 2026-09-06 follow-up explicitly expands the original Fast Skin scope for quieter motion, bounded rounded surfaces, and selected centered section compositions. A future routine client skin must inherit those completed decisions, not repeat the design work.

References: original Rencar at `http://127.0.0.1:6430/`; current trial at `http://127.0.0.1:6601/`; Day & Night Auto Best at `http://127.0.0.1:5173/`. Port identities must be rechecked. Auto Best contributes a centered page frame and clear rows/grids; it does not imply centering all text or copying its entire application.

## Layout and surfaces

| Element | Contract |
| --- | --- |
| Main desktop frame | Existing Bootstrap/Rencar container, maximum 1200px |
| Home 1 white header | Centered around the content frame; 24px overhang per side where space permits |
| Home 1 info strip | Same outer width as the white header; bounded dark surface, no full-width red band or oversized black pseudo-element; phone/location/appointment information only |
| Header widths | 1248px from 1200px; 1008px at 992–1199px; always cap to viewport minus 24px for at least 12px gutters |
| Header corners | 50px desktop; 28px mobile; both ends rounded |
| Sticky header | Same bounds, 8px from top; retain dropdown overflow and offcanvas behavior |
| Home 1 booking panel | Centered, max 1200px, 24px corners; 24px desktop/12px mobile minimum gutters |
| Home 1 hero | Centered headline and existing vehicle media; remove duplicate business-name eyebrow, filler paragraph, About More/Learn More buttons and decorative shapes |
| Hero/search placement | Compact hero; booking panel overlaps by 80px desktop/40px below 992px. At 1440/390 review widths its top is approximately 481/414px |
| Refined editorial sections | Centered content frame; short intro above a row/grid; avoid default decorative image-versus-text 50/50 splits |
| About section | Centered intro up to 760px; three service items, left-aligned text; stack below 768px; one existing About link below |
| About spacing | 80px vertical desktop, 48px mobile; 32px grid gap desktop, 24px mobile |
| Cards, lists and forms | Keep text and controls left-aligned for scanning; centering the section does not mean centering every element |

Prefer spacing to additional nested boxes. Keep the original button shapes and heading family. Do not add new gradients, icon families, display fonts or decorative backgrounds during section cleanup.

## Motion and interactions

- Content is visible immediately. No WOW section reveals or repeated hero entrance choreography.
- Carousels are manual. Keep arrows, dots and swipe behavior where the source offers them.
- Buttons change colour in 160ms; no expanding-circle wipes or rotating arrows.
- Remove card lift/scale and image zoom on the scoped source selectors. Preserve visible link/colour feedback.
- Menus use a short opacity transition, not a 3D flip. Search opens promptly without a delayed form reveal.
- Honour reduced-motion CSS. Never break visibility, focus, dropdown bounds or functional transitions to remove decoration.

## Branding and content boundaries

`public/daynight/brand.css` owns this client's identity colours and asset-fitting rules. Current primary colour is `#c40101`, dark is `#17191c`; these are client values, not fixed colours for future dealers.

`public/daynight/polish.css` owns reusable presentation decisions and their tokens. `public/assets/js/main.js` contains the limited source-widget motion changes. The original asset stylesheet stays intact. Home 1's About composition is in `src/pages/index.svelte`; it reuses Rencar's existing classes and icon assets.

Use relevant, source-backed content. The new About services are taken from the owner's running 5173 demo: vehicle collection, sale/trade-in, and import by request. That is existing owner-project evidence, not a new external business verification. The decorative collage and unverified “30+ years” claim were removed from this Home 1 section. Other retained pages still contain template content and require a separate content pass.

Do not carry a client's phone, address, stock, claims, watermarks, videos or finance terms into a generic master. Rental dates, driver age, daily rates and checkout require a real dealer adaptation before this becomes a branding-only dealer template.

## Section decisions

| Surface | Current decision |
| --- | --- |
| Home 1 header | Narrowed to the top-bar content frame plus a small overhang |
| Home 1 top strip and hero | Bounded information strip and centered compact hero; retain manual slider and original booking controls |
| Home 1 About | Centered introduction and three services; collage/experience badge removed |
| Why choose us | Preserve current composition as the owner's explicit exception |
| Vehicle/category/brand grids | Preserve Rencar components; these already use full-width rows/grids |
| FAQ, download, other editorial splits | Candidates for later centered cleanup, not changed by this pass |
| Rental-specific sections and flows | Separate dealer-adaptation work; a visual pass does not resolve them |
| Homes 2–5 | Retained; do not silently apply Home 1's composition to every variant |

## Review and promotion

Capture the current trial at 390px and 1440px; check header bounds at intermediate desktop widths and a wide screen. Check sticky navigation, open dropdowns, mobile menu dismissal, About text wrapping/link, and the unchanged Why choose us section. Keep checks/build and provenance notes current. Distinguish original reskin checks from later explicitly requested layout changes.

Follow [TEMPLATE-PROMOTION.md](TEMPLATE-PROMOTION.md) after the direction is finalized. Proposed family key: `rencar-polished`. It is not yet a registered or completed template. Routine new-client builds should then change identity and content only.
