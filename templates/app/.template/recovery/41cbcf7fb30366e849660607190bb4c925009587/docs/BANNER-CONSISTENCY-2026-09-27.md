# Consistent showroom banner framing

Scope: local App candidate only. Applied the approved rounded, inset treatment to Home, Sell, Finance and Services through one shared `ShowroomBannerFrame` component. Preserved existing feature imagery, editable messages, 2.5:1 composition and actions. Adjusted feature text spacing/sizing for the narrower inset area, including 320px. Search remains on Buy only.

Navigation decision: keep Home / Cars / Saved / More in the compact dock and Buy / Sell / Finance / Services at the top. The showroom/location link remains visible in the header. Vehicle categories should live in inventory; SUV is a car body type, not a peer of Cars. No account, leasing workflow, new stock category or dealer contact facts were fabricated.

Source at start: Cars main `18ecaeb1af58672f9967fa2d35d2d80235164635`, six local commits and 28 remote commits divergent from fetched origin/main, nine unrelated staged paths, App import entirely untracked. Preserved that state and made no index/commit/push changes.

The initial production check passed (Node 22.23.2, `npm run check`, 205 generated pages). Browser checks covered all three feature banners at 320px, 390px and desktop, plus the Services tablet layout and Finance dialog opening/closing. A preserved text fragment in the Services raster was visible on wider screens; its left portion is now masked over a matching CSS gradient, retaining the mechanic photograph and original file. Tablet hero text was reduced to fit the composition. Final verification of these corrections follows.

Final `npm run check` passed again after the corrections. Rechecked Services at 320px, 768px and 1440px, plus 390px Home parity and Sell. The fragment is no longer visible, tablet typography fits, and no console errors were recorded. Production preview remains on port 6473. Evidence: Cars `runtime/app-showroom-qa/banners-sell-390.png`, `banners-finance-390.png`, `banners-service-390.png`. Existing reference identities, claims and disconnected flows still require dealer adaptation; no release readiness or financial approval is implied.
