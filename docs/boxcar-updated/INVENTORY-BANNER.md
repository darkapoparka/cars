# Boxcar inventory heading banner

Updated locally on 2 October 2026, [inventory on port 6455](http://127.0.0.1:6455/inventory/).

Inventory now opens with a shallow full-width pale blue banner. Its centered Cars for sale title, concise introduction and compact Home / Cars breadcrumb sit against a soft gradient and decorative circular shapes. The existing generated Browse Cars cutout appears on wide desktops, clear of the copy; it is hidden below 1241 px. The banner is 180 px high on wide screens and grows naturally for larger text. Filters and stock remain 20–28 px beneath it on the existing grey canvas, with white inventory panels.

The cutout is decorative marketing artwork with empty alt text, not a stock photograph or a new promotional offer. It reuses `public/media/services/boxcar-browse-v1.webp`; [existing generation provenance](../../templates/boxcar-updated/provenance/service-art-2026-10-02.md) applies. No new asset or image-generation call was needed. Saved cars retains its earlier centered heading on grey. The homepage, original ten reference homes and other supporting-page sources were not changed.

The earlier [compact card actions](CARD-ACTIONS.md) remain: one native card link, a small arrow cue, Compare beside the price and independent Save/Compare buttons. Earlier screenshots and receipts record the heading before this banner.

## Verification

Svelte check passed with zero errors and warnings; the final Vite production build passed, 161 modules. Chromium and WebKit passed 20 rendered banner states at 1440, 1241, 1024, 768, 390, 320 and 305 px, including 320 px with 200% root text and filtered inventory. Checks covered full-width geometry, centered copy, readable uncut text, complete desktop illustration placement, restrained height and unchanged compact card controls. Four desktop/phone journeys passed make filtering, independent comparison, card/detail/filtered Back, the breadcrumb homepage link and the existing Saved cars heading. No JavaScript errors were recorded. The current preview was also visually inspected in the in-app browser at desktop and 320 px.

[Browser receipt and source hashes](inventory-banner-results.json) · [Desktop](inventory-banner-1440.png) · [320 px](inventory-banner-320.png).

This is shared candidate-template source polish. No release pin, dealer source refresh or deployment changed. The commit scope combines these banner changes with the earlier locally verified compact-card changes; `runtime/boxcar-inventory-banner/owned-paths.json` records its 16 explicit paths.
