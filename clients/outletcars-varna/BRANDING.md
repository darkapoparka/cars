# Outletcars transparent logo integration

The owner's requested logo refresh is integrated into Auto Best, Carwow and Import. This is a demo branding refresh, not a claim of dealership approval.

## Artwork and provenance

The mark uses the lettering geometry from the ImageGen asset `black_and_yellow_outlet_cars_badge.png` in this conversation. Generation ID: `3ff25e57-faec-42ca-8bc6-565a4e4115f8`. Original raster SHA-256: `2a9285b45802d3cc3c8d4ff42c70fc9c0641c77ed6132274f769a924789ec349`.

`assets/branding/logo-geometry.json` preserves the traced generated contours and source identity. The flat SVG exports contain real paths, not fonts or embedded bitmaps. The surrounding black rectangle, glow and excess canvas were discarded. The light-surface mark has dark lettering; the dark-surface mark has yellow lettering. Both use genuine transparency. The dealership's published original is retained separately as `assets/branding/published-original.png`.

## Integrated consumers

All three applications bundle `static/dealer/logo-on-light-v2.svg`, `logo-on-dark-v2.svg`, 2x PNG exports and square browser/touch icons. Versioned paths replace old logo references. Auto Best switches its mobile dark-header artwork independently from its white desktop header. Carwow's yellow desktop header and dark mobile header use different contrast treatments. Import's dark header/footer use the dark-surface export. Mobile logo heights are constrained to their existing header slots.

`business-facts.json`, each live `dealer.json`, and per-app project metadata record the new asset paths and creation method. The original public brand source URL is retained.

## Checks

Run `python assets/branding/verify-assets.py` from this client folder for SVG, transparency, icon and integration assertions. Each app retains `npm run check` and `npm run build`. Final images are already integrated; running a generator is not required to view the projects.

Branding-specific browser results and captures are stored in each app's `.client/evidence/logo-refresh/`. These are not a re-certification of every application feature or external integration.
