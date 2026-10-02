# Boxcar PDP surfaces

Local candidate polish completed on 2 October 2026 in `templates/boxcar-updated`, preview [port 6455](http://127.0.0.1:6455/vehicle/bentley-bentayga-bronze/). No dealer copies, approved template releases or Vercel deployments were changed.

Later [heading polish](HEADING-POLISH.md) places the title and Save/Compare inside a gallery-width white card aligned with the purchase card, and centers Contact and supporting navigation. That record contains the latest source hashes and combined Git handoff scope; the evidence below records the preceding surface pass.

The adapted PDP now uses a soft grey canvas and separate white cards for overview, description, features and finance. Purchase and showroom occupy separate white cards in one sticky desktop sidebar. On phones the purchase actions remain before the photo, and the showroom remains after Features. Grey fields/results inside the finance card and grey specification groups inside related-car cards replace repeated lines. Homepage service-card composition and artwork are unchanged.

## Original detail selection

The [author's HTML preview](https://creativelayers.net/themes/boxcar-html/) offers five Inventory Single layouts. All five were visually reviewed. V4's grey canvas and white cards fit the requested surface treatment best. V2 most closely resembles the existing left-gallery/right-purchase composition; V5 relies on a wide multi-photo carousel, while many current sample vehicles have one photo.

The prior template documented vehicle details as adapted Svelte. Its archive contains the first detail layout, and it did not record a best-of-five selection. This change adapts the existing working PDP using V4's surface treatment; it does not claim a complete V4 DOM clone. [The selection receipt](../../templates/boxcar-updated/.template/pdp.json) records all five source URLs and the retained composition.

## Verification

- Svelte check passed with zero errors and zero warnings; the final production build passed with 161 modules.
- Chromium and WebKit passed 1440, 1024, 768, 390 and 320 px, plus 320 px with 200% root text. Twelve layouts and twelve expanded/calculated finance states passed. The enlarged monthly payment now fits its result container.
- All 17 vehicle routes passed at desktop and 320 px in both engines: 68 route/layout checks, with one visible showroom, contained specification text and no document overflow or JavaScript errors.
- Enquiry shows the correct vehicle and restores focus when dismissed. Repayments retains the vehicle price, showroom contact selects the viewing subject, and single/multi-photo gallery controls remain functional.
- The existing curated home/service assets and all ten original homepage source hashes match their previous receipts. Surface, image, button alignment and normal/hover contrast checks passed. These are focused browser checks, not a whole-site accessibility certification.

[Final source hashes and focused results](pdp-surfaces-results.json) · [All vehicle route results](pdp-catalogue-results.json) · [Desktop](pdp-surfaces-desktop.png) · [320 px](pdp-surfaces-320.png).

## Source scope

`src/pages/VehicleDetail.svelte` owns the two-card sidebar grouping. `src/styles.css` owns the PDP surface tokens, section spacing, specification wrapping and narrow finance result typography. The earlier service artwork and configured showroom banner remain preserved. Existing sample-inventory and local enquiry/finance disclosures remain in place.

This is source polish for the Boxcar candidate. Owner visual acceptance, promotion into the dealer generator, an approved immutable release and fleet deployment remain separate work.

## Git handoff

The final scoped staging attempt was deferred because `L:/CODEX/cars/.git/index.lock` was present. It was not removed or bypassed; no other task's staged or working files were changed. The 32 owned files for the service-art, showroom and PDP requests remain local, uncommitted and unpushed. Their exact allowlist is preserved in Cars' ignored `runtime/boxcar-pdp-surfaces/owned-paths.json`.

Repository: `L:/CODEX/cars`, branch `main`, working HEAD at inspection `f190421c4a2a80630a2170ec5c52a27a3c1df05b`. `workspace-doctor --fetch` confirmed Cars was not behind its fetched main; unrelated repository issues were left intact. After the shared writer releases the index, inspect staged state, stage only that allowlist, review the scoped diff, commit and push main without force. The application build/browser evidence is complete independently of that pending source handoff.
