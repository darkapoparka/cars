# Boxcar Updated

`boxcar-updated` · `2026.10.02-native-10-homes` · native Svelte 5 / Vite 8 · local preview port **6455**.

Ten real homepage compositions share one editable catalogue and application state. The design reference is the [Boxcar HTML public preview](https://creativelayers.net/themes/boxcar-html/). The existing `templates/boxcar` WordPress capture remains its own template.

## Homepage choices

| Home | Composition | Entry |
| --- | --- | --- |
| 01 | Mountain photo, centred search | `/` |
| 02 | Featured vehicle, working slide controls | `/home-2/` |
| 03 | City photo, pill search and body categories | `/home-3/` |
| 04 | Luxury photo and glass specification panel | `/home-4/` |
| 05 | Pale background, search and vehicle cutout | `/home-5/` |
| 06 | Angular showroom photo and inventory count | `/home-6/` |
| 07 | Inset photo, centred header and floating search | `/home-7/` |
| 08 | Electric photo, vertical search panel | `/home-8/` |
| 09 | Lifestyle photo, upper search and lower headline | `/home-9/` |
| 10 | Touring photo, compact header and floating search | `/home-10/` |

The Home menu, mobile drawer and footer link to these actual routes. `index.html` and `index-2.html` through `index-10.html` also resolve locally. Section order, backgrounds, image treatments and vehicle shelf layouts differ between homes. Shared components keep filtering and vehicle browsing consistent.

## Run and checks

Use Node **22.23.2** (minimum 22.18 for the native TypeScript test runner), the checked-in lockfile and an independent install:

```powershell
cd L:/CODEX/cars/templates/boxcar-updated
npm ci
npm run check
npm test
npm run build
```

Start from Cars with the existing launcher on a free port:

```powershell
./scripts/start-preview.ps1 -Template boxcar-updated -Port 6455 -NodePath C:/Users/radev/AppData/Local/nvm/v22.23.2/node.exe
```

The Vite development preview is [http://127.0.0.1:6455/](http://127.0.0.1:6455/). A production build creates `dist/`; `vercel.json` supplies SPA route fallback for an eventual deployment.

With the local preview running, `npm run verify -- --views` checks all ten homes at 1440, 390 and 320 px, nine supporting pages, and every sample detail at desktop and 320 px. `npm run verify -- --flows` exercises search, filtered return/Back, sort, pagination, empty results, saved persistence, four-car comparison, calculator validation, enquiry preview, menu focus return, gallery and mobile filter dismissal. `npm run verify -- --text` checks 320 px at 200% text, including populated saved and comparison pages. Set `BOXCAR_BROWSER=webkit` to repeat with Playwright WebKit. QA output is ignored under `qa/<engine>/`.

## Application behavior

- `/inventory/`: URL-driven keyword, make/model, condition, body, fuel, year and price filters; sorting, pagination and grid/list views.
- `/vehicle/<slug>/`: model photos, specification overview, related cars, enquiry preview and repayment estimate. `return` keeps the browsing context; browser Back restores scroll.
- `/favorites/` and `/compare/`: native Svelte state persisted in this browser. Comparison accepts at most four cars and supports removal and clearing.
- `/calculator/`: amortized repayment estimates with zero-interest and full-deposit handling, valid-input checks and clear illustration copy.
- `/contact/`, `/contact/?intent=sell`, `/about/`, `/blog/`, `/blog/<slug>/`, `/faq/`, `/terms/`: shared supporting journeys.

Enquiry and newsletter forms show a local preview. Contact input is not persisted or delivered. There is no WordPress, account, booking, finance provider or mail service attached to this candidate.

## Personalization boundaries

`src/data/brand.ts` owns business name, logo paths, accent, contact, location and hours. `src/data/homes.ts` owns composition choices. `src/data/vehicles.json` owns stock, images, specifications and descriptive slugs. `src/data/journal.ts` owns buyer guidance. `public/media/` holds local assets; typography uses local variable DM Sans with its OFL license.

All 17 vehicles are samples. The inherited catalogue had mismatched titles and mixed-model galleries; this version re-matches the pictured makes/models and retains original IDs and legacy routes for provenance. Prices, years, mileage and specifications are illustrative. The five-image Volvo gallery is a model preview, including different colours, rather than evidence for one vehicle. Example customer reviews, staff and showroom images are labelled as examples. Replace these inputs with verified dealer facts before use.

## Reference, ownership and acceptance

[`.template/reference.json`](.template/reference.json) records ten source URLs, captured HTML SHA-256 values and section classes. [`.template/assets.json`](.template/assets.json) records every imported asset's source, size and hash. Raw DOM/CSS and design captures live in Cars' ignored `runtime/boxcar-updated-reference/`; the application renders native components instead of injecting that captured HTML. `scripts/reference.mjs`, `reference-shots.mjs` and `import-assets.mjs` support reference research; asset refresh rewrites source reference images, so it belongs in template research before personalization.

Reference assets retain their existing ownership. No new ThemeForest purchase or multi-client rights determination was made. The owner must check existing entitlement and image rights before commercial reuse.

This is a **reference-content candidate** in the Cars catalogue. Owner visual acceptance, an immutable approved template release and dealer-generator support remain separate from local source/build/browser verification. See [the dated evidence](../../docs/boxcar-updated/QA.md) and [Cars QA](../../docs/QA.md).
