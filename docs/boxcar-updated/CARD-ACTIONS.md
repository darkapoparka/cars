# Boxcar compact card actions

Updated locally on 2 October 2026, [inventory on port 6455](http://127.0.0.1:6455/inventory/).

The later [inventory banner refinement](INVENTORY-BANNER.md) replaces this pass's heading directly on grey with a shallow pale blue banner. The screenshots and source hashes below record the earlier heading and the completed card-action work.

The vehicle card's title is now its single native navigation link, with a CSS hit area covering the photograph, specifications, price and surrounding card surface. Its actual URL retains the complete inventory query/view return context. Keyboard Enter, native modified-click navigation and a visible card focus outline are retained. Save and Compare stay independent buttons above the link's hit area.

The separate Details button and full-width Compare row are removed. A compact transparent Compare action shares the price row, alongside a small arrow cue. Selected comparison uses the concise visible label Compared, a pressed state and a vehicle-specific accessible removal label. Each action retains a minimum 44 px target. Inventory, Saved cars and PDP related cards use the same shared component. The curated homepage and all ten original references remain unchanged.

## Verification

Node 22.23.2: Svelte check passed with zero errors and zero warnings. Vite production build passed, 161 modules. Chromium/WebKit passed 32 card states at 1440, 1024, 768, 390 and 320 px, including grid/list, 200% root text, saved cards and related cards. Four desktop/phone journeys passed real clicks on photograph/specifications/price, filtered PDP Back, keyboard activation/focus, saved-card return context and independent Save/Compare. Desktop modified-click checks verify native new-tab behavior without replacing the original route. No JavaScript errors were observed. The existing browser verifier now selects the single card link and vehicle-specific comparison controls.

[Complete browser results and source hashes](card-actions-results.json) · [Desktop](inventory-compact-actions-1440.png) · [320 px](inventory-compact-actions-320.png).

This is shared candidate-template source polish. Earlier inventory evidence describes its earlier card actions. No template release pin or dealer deployment changed.
