# Home and inventory search flow — 1 October 2026

## Restrained carousel polish — 2 October 2026

The mobile carousel keeps its position under the makes and reveals 20px of the next slide, separated by its existing 12px gutter. Each mobile slide is 32px narrower; responsive image sizing follows that width. The rail no longer rounds off the exposed next-slide edge. Desktop retains the existing two-column grid.

Removed 4px above the pagination and 16px above the mobile inventory heading. At 390px, the artwork-to-heading gap is now 53.8px instead of 73.8px; pagination buttons remain 44px tall. `carousel-polish-390.jpg` is the current screenshot. Checked 320/390/1440px with no document overflow. At 320px, financing and visit slides show their copy and CTA, and selecting the second, final and first pagination buttons selects the correct slide. Search, navigation, copy, brand strip and vehicle cards are unchanged.

## Owner correction: banner restored

The owner rejected moving the promotional carousel below four cars. It is restored directly under the make strip and before the inventory heading, with all eight initial cars in one feed. The search/filter changes remain. This supersedes the banner-placement notes and earlier screenshots below; `banner-restored-390.jpg` shows the corrected mobile composition. Checked at 320, 390 and 1440px with no document horizontal overflow. `npm run check` passed completely (lint, typecheck and production build, 407 pages) after this correction.

Canonical App candidate: `L:/CODEX/cars/templates/app`, preview on port 6483. No dealer refresh or deployment.

## Change

- Home retains dealer banner → search → stocked make strip, then adds an inventory heading and View all link. Removed the duplicate filter/sort navigation pills. The promotional carousel follows four cars; all eight initial listings remain in their original order without duplicates.
- Cars retains search → filter/sort pills → results, removing the showroom promotion between search and filters.
- Dealer identity, menu, vehicle card styling and filter behavior are unchanged in this pass.
- Updated AGENTS.md, TEMPLATE.md and the shared APP-VARIANT.md guidance to preserve this order in later adaptations.

## Browser evidence

In-app browser, Bulgarian routes, widths 320, 390 and 1440. No document horizontal overflow on Home or Cars at the inspected widths. Screenshots in this folder show both phone widths and desktop.

- Home at 390: first car starts at y=532.7px (about 200px earlier than the prior composition). Search remains in its prior position. Exactly four cards precede the carousel; eight unique cards remain in the initial inventory section.
- Home at 320: inventory heading stays on one line and View all has a 44px hit target. View all successfully opens `/bg/cars`.
- Cars at 320: search bottom and filter navigation top both y=116px; first car starts at y=182px.
- Search for Toyota updates 48 results to nine.
- Mobile brand drawer: selecting Toyota and applying displays nine results; sorting price ascending produces 31599, 53599, 64699, 94099, 94199, 98499, 175999, 201999, 224599.
- Home Toyota emblem navigates to `/bg/cars?brand=Toyota`, showing nine results.
- Desktop Home retains its two-column card grid; Cars retains its filter sidebar and two-column results. Temporary browser viewport overrides were reset.

## Validation environment

`npm run check` passed lint and typecheck. Its first production build compiled but could not resolve Next modules after build output was relocated to address a full L: drive. The inactive `.next-build-check` directory was preserved at `C:/Users/radev/.codex/tmp/cars-app-build-20261001/.next-build-check` and its original path replaced with a junction. A sibling `node_modules` junction now points to the existing App dependencies so server output resolves modules correctly. No source or recovery data was removed.

Production build rerun passed (exit 0) with Node 22.20.0 and `NEXT_DIST_DIR=.next-build-check`, including all 407 generated pages. Lint, typecheck and production build therefore each passed; no application code changed between the check and build rerun. Workspace doctor fetched Cars main with ahead=0/behind=0; unrelated template and admin work was preserved.

Carousel polish validation: npm run check passed (lint, typecheck and production build, 407 pages), using Node 22.20.0 and NEXT_DIST_DIR=.next-build-check.
