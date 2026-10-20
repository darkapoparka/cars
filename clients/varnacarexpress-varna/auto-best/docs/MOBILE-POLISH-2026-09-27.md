# Auto Best mobile polish — 27 September 2026

This changes the reusable master only. Existing dealers and immutable release selections are unchanged.

## Result

- Home budget shortcuts use compact inclusive upper limits, followed by existing brand shortcuts. The first three useful standard caps are derived from inventory; empty and duplicate-result caps are skipped. Current sample stock produces €60k, €80k and €100k. Full amounts remain in accessible link names and URL parameters. Lower budget options are available in the detailed filters.
- Inventory has a first Type shortcut on mobile and a primary type selector beside desktop search. Supported record types are `car`, `motorbike`, `van`, and `truck`; the existing eight sample records are explicitly cars. Category counts describe the inventory, not fabricated stock. A zero-stock category shows the existing empty-results state.
- `type` survives URL serialization, nested drafts, sorting, form submission and chip removal. The desktop discovery area reserves room for applied chips.
- The prior Sell/Import work uses compact entry forms with the existing enquiry review, photos and copy/share flows. Sell has one Sale/Trade-in switch; manual details and a listing/VIN link are alternative entry methods.
- Mobile navigation uses consistent simple icons, an inset dock and matching header contact icons. The generated logo has transparent light/dark variants in the header, menu and footer; see [identity provenance](../provenance/2026-09-27-auto-best-logo.md).

## Verification

Node 22.23.2, existing npm lockfile, local preview on port 6461.

- Svelte/TypeScript: zero errors and warnings.
- Architecture, locale source audit, assets, CSS policy, typography and token checks.
- Domain checks include mixed car/motorbike/van/truck fixtures, category roundtrips and filtering, invalid types, chip removal, sorting preservation, and budget caps for both affordable and current sample stock.
- EN/BG home and listing pages checked at 320, 390, 768 and 1440px. Desktop type controls also checked at 1024px. No page overflow or browser exceptions in those checks.
- Browser journeys exercised category apply, category plus price, sort preservation, nested category cancellation, draft restoration and chip removal.
- Existing enquiry smoke passed at 320, 390, 844 and 1440px, including photos, review, share, drafts and focus. Service typography smoke passed at 320, 390, 768 and 1440px and short mobile heights 667/712/844px.

Screenshots and command logs are retained in the Cars root's ignored `runtime/` directory under `autobest-final-*` and `final-polish-*`. This is local implementation and QA evidence, not dealer publication or owner visual acceptance.
