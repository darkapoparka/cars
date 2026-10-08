# Drive24 App template

A single-dealer showroom template built with Next.js App Router, React, TypeScript and StyleX. The primary journey and the `/2` mobile alternative share the same inventory, dealer configuration and vehicle-detail routes. The current visual design is an explicit compatibility contract: architectural changes must not restyle it.

## Run and verify

Use Node **22.x** (22.20 or newer) and the retained npm lockfile. Confirm `node --version` and that your npm launcher uses the same Node installation; the machine-wide launcher may otherwise select another runtime.

```sh
npm ci
npm run dev
npm run check
```

`check` runs ESLint, application type checking, the regression suite and a production build. `npm test` covers locale and `/2` routing, history ownership, saved/recent persistence, inventory filters, catalogue lookup, formatting, finance boundaries and server/client import boundaries. Test compilation is isolated under `runtime/unit-tests` and removed after execution.

For production smoke checks, start the built application and run:

```sh
npm run start -- --hostname 127.0.0.1 --port 6473
# In another terminal:
npm run qa:routes
npm run qa:screenshots
```

`QA_BASE_URL` defaults to `http://127.0.0.1:6473/`. Set it to the full mounted application URL when testing a dealer preview. `NEXT_PUBLIC_BASE_PATH` must match that mount when building the application. Route checks cover enabled languages and both journeys. Screenshot checks use 320, 390 and 1440 pixel viewports; set `CHROME_PATH` when Chromium is not auto-detected. Captures go to ignored `runtime/qa` (or `QA_OUTPUT_DIR`) and require visual review; capture success alone is not a visual-regression assertion.

Stop development/preview servers before `npm run clean`. Generated logs, screenshots and temporary build outputs do not belong in commits.

## Source boundaries

`app/[locale]` owns pages and route aliases. `components` owns rendered UI and browser hooks. `lib/vehicle.ts` is the inventory type contract; `lib/data.ts` selects the active catalogue, while `lib/format.ts` provides the shared formatter. Locale decisions are independent of translation catalogues in `lib/locale-policy.ts`; pure `/2` helpers live in `lib/home-paths.ts`. Persistence rules live in `lib/vehicle-storage.ts` and are consumed by the existing hooks.

Dealer content comes from `lib/dealer.json`, `lib/dealer-inventory.json` and `lib/dealer-import-inventory.json`. Full reference inspection snapshots stay on the server. Public artwork, fonts, inventory fixtures and asset-provenance files are not QA debris.

## Client releases

This remains a **preview template**, not a connected lead-processing backend. Enquiry screens prepare drafts; they do not submit messages, bookings, payments or credit applications. Keep preview notices and search-indexing restrictions until a separately approved production integration exists. Validate each dealer's public identity, verified contact destinations, inventory, currency, enabled languages and rights to published assets before release.

Cars `templates/app` is the canonical generator source; this repository is its standalone publishing snapshot. Reconcile changes made here into that source before the next export, and use the Cars release/lock workflow before rolling them out to dealers. A commit to this repository is not approval for a fleet-wide deployment.

See [TEMPLATE.md](TEMPLATE.md), [architecture](docs/ARCHITECTURE.md), [publishing guidance](docs/COMPARISON-PUBLISHING.md) and [history/provenance](docs/HISTORY.md).
