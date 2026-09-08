# AutoDeal reference template

Licensed exact reference port for Agency OS automotive template use. The project is isolated under its own template key and preserves the reference route surface, static media, CSS, and client bundles.

## Run

```powershell
npm run mirror
npm run build
npm run dev
```

The local server defaults to `http://localhost:5173/`. Set `$env:PORT` to use another port.

## Locale overlay

The reusable overlay in `i18n/` adds URL-based Bulgarian, English, German, Greek, Romanian, Serbian, Russian, Ukrainian, and Turkish routes without changing the licensed page snapshots or client bundles. Bulgarian is the default, so `/` redirects to `/bg`; other examples are `/de/listing-grid`, `/el/contact`, and `/sr/about-us`.

The source inventory covers all visible text, metadata, form attributes, and compact controls across the 150 mirrored routes. Every source string is translated in each locale or recorded in `i18n/preserve.json` with an explicit factual, identifier, asset-label, punctuation, or licensed-placeholder reason. The server injects the selected catalog before the runtime executes, and the runtime keeps locale links, metadata, dynamic nodes, and the `html[lang]` contract aligned. This is a presentation-layer localization system for the static mirror, not a replacement for framework-native message extraction in an editable production application.

## Route surface

Home: `/`, `/home02` through `/home10`.

Listings: `/listing-grid`, `/listing-grid2`, `/listing-list`, `/listing-grid-map`, `/listing-list-map`.

Details: `/listing-detail-v1/1`, `/listing-detail-v2/1`, `/listing-detail-v3/1`, `/listing-detail-v4/1`, `/listing-detail-v5/1`.

Business and account: `/about-us`, `/pricing`, `/compare`, `/dealer-listing`, `/dealer-detail/1`, `/sale-agents`, `/sale-agents-detail/1`, `/blog`, `/blog-grid`, `/blog-detail/1`, `/faq`, `/contact`, `/add-listing`, `/dashboard`, `/my-favorite`.

`mirror-reference.mjs` is the repeatable acquisition step. It downloads the licensed reference pages and same-origin runtime assets into `mirror/`; `server.mjs` serves those snapshots without a dependency on the public host.
