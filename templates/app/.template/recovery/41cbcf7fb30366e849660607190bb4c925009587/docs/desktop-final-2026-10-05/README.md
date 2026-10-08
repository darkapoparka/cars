# App desktop completion — 5 October 2026

The desktop vehicle cards no longer force the equipment badge onto another row. Mileage, transmission and equipment use a wrapping flex row from 1100px: one line when the text fits, additional lines only when required. Every fact remains visible. The four Home columns and the Cars three/four-column breakpoints are retained.

The desktop PDP now places the existing Viewing/Save panel alongside the gallery. Price and primary actions are visible in the first screen; the panel stays below the section navigation when scrolling. The gallery uses the same content gutters as the details and rounded desktop corners. Specifications use three desktop columns. The duplicate desktop floating contact control is hidden.

Phone/tablet gallery, cards, badge scrolling, controls and gutters retain their earlier geometry. The white logo header, right-side buttons, banner search, photo-first listings, album previews, information tabs, pill actions and existing enquiry/record behavior are preserved.

## Matched screenshots

These are raw local Chromium screenshots of the Bulgarian preview at `http://127.0.0.1:6483`. Each pair uses the same route, viewport and scroll target. Before captures were taken before this edit; the previous desktop header/listing pass was already present.

| Screen at 1440 × 1000 | Before | After |
| --- | --- | --- |
| Home inventory / badge rows | [Before](home-listings-1440-before.png) | [After](home-listings-1440-after.png) |
| Cars / narrow four-column cards | [Before](cars-1440-before.png) | [After](cars-1440-after.png) |
| PDP first screen | [Before](pdp-1440-before.png) | [After](pdp-1440-after.png) |
| PDP specifications / sticky actions | [Before](pdp-information-1440-before.png) | [After](pdp-information-1440-after.png) |

Longer badges still wrap in narrow Cars cards. For example, the 1440px four-column layout provides 193px for facts, while the Fortuner's Bulgarian labels require about 239px; forcing that card onto one line would clip text. Wider cards keep the same facts in one line.

## Validation

- 61 desktop checks passed: 34 locale/route cases, 16 responsive layout cases and 11 interaction cases. The completed interaction run reported no browser errors.
- `npm run check` passed under Node 22.20.0: ESLint, TypeScript and production build. The build used `.next-build-check`; the dev server retained its output. The generated `next-env.d.ts` was restored to its exact preimage. See [build output](build-check.txt).
- Browser checks cover EN/BG Home, Cars, PDP, equipment, full gallery, inspection, Sell, Finance, Services, Saved, menu, showroom, search, premium inventory, warranty and the legacy Sell/Services detail routes.
- Desktop layout checks cover 1100, 1280, 1440 and 1920px: first-screen gallery/actions, sticky actions below section navigation, three specification columns, no forced fact rows, no clipped badges and no desktop dock.
- Interaction checks cover photo albums, arrow-key photo navigation, zoom, Escape/focus return, information tabs, price and service-record drawers, viewing enquiry draft, Saved persistence, equipment search, gallery categories, filtered-inventory Back, Home search and menu navigation.
- Fifteen matched screenshot cases cover desktop plus Home/Cars/PDP at 320, 390 and 1099px. Both capture sets have no reported browser errors, horizontal document overflow or broken visible images.
- Eleven phone/tablet pairs preserve measured visible text and geometry exactly. Pixel comparisons show no differences greater than one color value outside reference vehicle photos. Some photo pixels vary between browser captures; see [preservation measurements](preservation.json).

Detailed results: [before capture](before-capture.json), [after capture](after-capture.json), [browser checks](verification.json).

This receipt covers the local App source and preview. Dealer publication and owner visual acceptance remain separate.
