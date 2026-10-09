# App dealership template

A responsive, single-dealer showroom built with Next.js App Router, React, strict TypeScript and StyleX. The primary journey and the alternative phone composition at `/2` share inventory, detail pages, search, saved cars and enquiry drafts. English and Bulgarian are configurable per dealer.

## Develop and verify

Use Node **22.20 or newer on the 22.x line** and the committed npm lockfile.

```sh
npm ci
npm run dev
npm run check
npm start
```

Development and production builds validate the public dealer configuration and image paths first. Keep the Babel/StyleX integration and webpack flags; the template does not maintain a parallel Turbopack setup. Do not run development and production builds against the same output directory concurrently. `NEXT_DIST_DIR` can isolate a build when needed.

`npm run check` runs lint, application/browser-test type checking, unit and architecture tests, configuration validation and a production build. `npm run test:browser` starts that production build on an isolated port and tests navigation, filtering, persistence, dialogs and responsive layouts. Install its browser once with `npx playwright install chromium`. On a machine with Chrome, set `QA_BROWSER_CHANNEL=chrome` instead.

For an already-running server, set `QA_BASE_URL` to its origin **including the mount path**. `npm run qa:routes` checks the configured locale and journey routes. `npm run qa:screenshots` compares the responsive visual suite against local baselines; `npm run qa:screenshots -- --update-snapshots` deliberately records an accepted baseline. Never update baselines to conceal a regression. Screenshots, reports and traces belong under ignored `runtime/`, not in the application source.

## Adapt for a dealer

Start with `lib/dealer.json` for identity, logo, verified contacts, currency and enabled locales. Set `mode` to `dealer` and use a stable, unique dealer ID. Supply actual stock in `lib/dealer-inventory.json` and separate import listings in `lib/dealer-import-inventory.json`. Empty stock is valid. Run `npm run validate` after changing these files.

Missing prices and mileage use the explicit `priceOnRequest` and `mileageOnRequest` flags. Set unavailable monthly estimates to zero; they are not advertised as free finance. Optional `listedAt` is the actual listing date used by Recently added, not the model year or observation timestamp. Undated vehicles retain source order. Local images must exist under `public/`; configured HTTPS image origins are allowlisted for Next Image. Secrets, CRM tokens and private notes never belong in these public files.

Branding and copy beyond dealer identity live in `lib/showroom.ts`, `lib/showroom-art.ts`, locale dictionaries and the shared StyleX tokens. Service catalogue content lives in `lib/service-catalogue.ts`. Review these client-specific claims and imagery rather than assuming three JSON files approve every service or benefit.

Unprefixed routes resolve to an enabled locale. The main destinations are `/[locale]`, `/cars`, `/cars/[slug]`, `/sell`, `/finance`, `/service`, `/saved` and `/more`, with supported `/2` journey aliases. Set `NEXT_PUBLIC_BASE_PATH` **before building** for mounted previews. For an independent mounted site, set `CARS_PREVIEW_SWITCHER=0` so it does not request the Cars host’s `/preview-switcher.js`. The default preserves existing Cars previews. Request-dependent locale layouts mean the application is not universally statically rendered.

## Scope and ownership

This is a demo/enquiry template, not a checkout, booking, account or lending backend. Forms prepare local editable drafts and configured external contact actions. They do not claim to submit a booking or payment. Reference imagery and captured example records are retained for comparison; review permissions, actual claims and client content before release.

The maintained source is this `templates/app` master inside the Cars repository. The separate App repository retains publishing/review history. Reconcile its approved application changes into this subtree while preserving newer local polishing. Existing client releases still follow the Cars release lock and explicit refresh workflow.

See [the current template contract](TEMPLATE.md), [architecture](docs/ARCHITECTURE.md), [Cars PRO reconciliation](docs/pro-integration-2026-10-09/README.md), [original PRO review](docs/PRO-REVIEW.md) and [source provenance](docs/IMPORT.md).
