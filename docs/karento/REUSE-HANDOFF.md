# Karento Best reuse handoff

On 7 October 2026 the owner requested the native Svelte frontend and source promotion. The maintained application is now `templates/karento-best`, with the selected Home 3, List 2 and Details 3 compositions, all 39 compiled variants and the final approved shared Contact container. The standalone `darkapoparka/cars-template-karento` repository is a source mirror. See `NATIVE-SVELTE-QA.md` and the template's `IMPLEMENTATION-REPORT.md` for verification. Source promotion is separate from a template-lock release or dealer rollout.

## Small personalization boundary

Keep the existing Cars lead-build and release workflow. Prefer one dealer configuration plus content/assets over dealer-specific layout edits. It should supply:

- Recognizable lead identity: logo, business name, locale, contacts and locations.
- Permitted lead inventory and car imagery, with truthful descriptions and availability.
- Lead copy, services and optional packages, shop, import sources and editorial content.
- A small color palette only when the lead's identity needs it; neutral black is the default.

The native typed input is `templates/karento-best/src/lib/content.ts`; no parallel dealer generator was added. The four `--karento-accent*` values in `static/dealer-site.css` map onto existing vendor variables. Logo assets remain unchanged; the starter header/footer use CSS monochrome display. A real lead build replaces the starter identity rather than recoloring that placeholder into a dealer logo. Read `templates/karento-best/REUSE.md` for the actual input coverage and localization limits.

## Preserve the selected composition

`src/lib/routes.ts`, `components/Header.svelte`, and the compiled `pages`/`sections` own routes, shared navigation and composition. Account is the direct header entry. The grid button retains the original drawer with website links and Sign in/Register for visitors, or View account, settings and Sign out for the selected preview role. The homepage uses Home 1's nine unique monochrome brand logos in a centered grid. There are no fabricated inventory counts or moving tickers. Calendar, gallery and photo viewer are native Svelte; jQuery, Slick and the old datepicker are not loaded.

Use one light appearance for now. The original reference preserves dark styles, but enabling a theme is a separate choice requiring functional wiring and contrast/image checks across the selected pages.

## Before a dealer release

Account roles, memberships, purchases, bookings, wallet and saved dashboard changes retain demo behavior. Catalogue filters and conversion of rental panels into sale/enquiry panels remain pending. The lead build must replace inherited contacts, unrelated staff/testimonials, stock copy and reference imagery where required; mock actions must remain truthful.

The native production build is self-contained and no longer reads captured bodies from the sibling library. `../karento` stays preserved for reference, and `provenance/frozen-best` is an immutable test archive. Preserve licence evidence and use the existing immutable release/publisher tools. Root-relative route and asset references still need mounted-path publisher qualification. Keep dealer manifests and the approved template lock unchanged until that release work is requested and accepted.
