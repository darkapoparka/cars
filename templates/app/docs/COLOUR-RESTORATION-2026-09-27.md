# Preserve template styling while replacing branding

The requested correction is to retain the template's colourful, image-led compositions and replace Cars24 branding with original Drive24 equivalents. The preceding all-silver heroes and generic grey feature sections were too broad a redesign.

## Implemented scope

- Retained the accepted silver Home banner and shared shell, gutters, banner heights and headline alignment.
- Replaced Sell, Finance and Services studio scenes with three original blue photographic campaign assets, retaining the curved photographic opening and editable white copy.
- Restored violet/blue accent tokens, illustrated process rows, service-package cards, lavender surfaces and contact cards.
- Added original selling, car-care and finance campaign artwork with HTML branding, text and working actions. Restored the green vehicle-information composition in detail and information pages.
- Replaced the grey inventory promotion with the blue showroom treatment.
- Preserved generic reference step illustrations already in the template. Original source assets remain available; versioned generated replacements are separate files.
- Kept dealer copy truthful rather than inheriting Cars24's prices, guarantees, approval rates or testimonials. Removed the inherited 10,000-customer claim from the finance calculator.

All seven image assets were generated using the built-in image-generation tool. Exact prompts, reference roles and saved paths: `public/showroom/COLOUR-CAMPAIGN-PROMPTS.md`.

Build log: `L:/CODEX/cars/runtime/app-showroom-qa/colour-restoration-check.log`.

## Final verification

`npm run check` passed after the narrow-screen corrections; final authoritative log: `L:/CODEX/cars/runtime/app-showroom-qa/colour-restoration-final-check.log` (exit 0).

- Visually checked restored campaigns at 320px and 390px, Services at 768px and 1440px, and inventory at 390px.
- At 390px all four landing banners retain top 160px, height 180px and headline height 24.453px. No document overflow. Each campaign stays within the 12px page gutters.
- At 320px Finance and Sell campaign panels measured 281px wide within the available page, correcting their initial aspect-ratio/min-height overflow. Checked Car Care and green ownership artwork visually at this width.
- Service package Learn more opens its information sheet. Car Care opens `/service/details`. Sell campaign opens `/sell/details`. Finance campaign opens the assistance/login sheet; no form was submitted.
- Browser error log was empty during final verification. Local production preview remains on port 6473; viewport override reset.

Screenshots in `L:/CODEX/cars/runtime/app-showroom-qa/`:

- `service-text-after-390.png`: prior grey Services treatment (before this correction).
- `colour-service-390.png`: restored blue Services banner and service-card styling.
- `colour-care-panel-390.png`: Drive24 Car Care artwork and restored illustrated steps.
- `colour-inventory-390.png`: blue inventory promotion.

The earlier `colour-ownership-320.png` capture preceded the final image-crop fix and is not the final proof for that panel.

This remains a local template candidate. No release selection, client publication, outreach or Git staging is part of this correction. Existing demo inventory photographs and deeper fixture content still need client-specific adaptation.
