# Boxcar — Svelte 5 local demo

Reproduction of the [Boxcar public demo](https://demoapus1.com/boxcar/), captured September 6, 2026. Svelte **5.57.0**, TypeScript, Vite **8.2.2**. No WordPress or PHP installation is required.

## Run

```powershell
cd J:\cars\boxcar
npm install
npm run dev
```

Open **http://127.0.0.1:6450/**. The port is strict, so it will report a conflict instead of silently serving on a different port.

```powershell
npm run check
npm run build
npm run preview
```

Stop the development server before starting preview on the same port. Production files are in `dist`; static hosts must rewrite page requests to `index.html` while serving `/assets/` and `/pages/` directly.

## Requested pages

| Page | Local route |
| --- | --- |
| Home 1 | `/` |
| Listing 1 | `/listings/` |
| Listing detail v4 | `/listing/ranger-white-2022/` |
| Full blog | `/blog/?style=full` |
| BMW X6 article | `/bmw-x6-m50i-is-designed-to-exceed-your-sportiest/` |
| Contact | `/contact-us/` |
| About | `/about-us/` |
| Compare | `/compare/` |
| Calculator | `/calculator/` |
| Services | `/services/` |
| Terms | `/terms-and-conditions/` |

35 captured routes include the other vehicle detail pages, blog articles, and second listing/blog pages so cards can open locally. Alternate home/listing menu entries lead to the requested local layouts.

## Implementation

- Original public markup, CSS, fonts, icons, and images preserve the reference geometry and content. Per-page JSON is served from `public/pages`; the app does not embed or proxy the live WordPress website.
- `src/App.svelte` renders the imported page. `Calculator.svelte` and `Compare.svelte` own reactive local functionality. `src/interactions.ts` connects filtering, sorting, pagination, galleries, dialogs, navigation, and browser storage.
- The original jQuery, Slick, Select2, Bootstrap, and Sliding Menu presentation libraries run locally. WordPress, WooCommerce, Contact Form 7, analytics, and provider AJAX scripts do not run.
- `src/local.css` contains the small behavior/accessibility additions. Original styling remains in `public/assets`.
- Imported HTML is trusted, checked-in reference content, not user-authored HTML. The importer removes scripts and inline event handlers. Svelte's autofixer reports the intentional `@html` rendering points for review; do not feed them unsanitized CMS/user content.

## Working local behavior

Search by condition, make, model, price, and advanced vehicle attributes; URL-based results; sort and paginate; save cars on this device; compare up to four cars; vehicle carousels and photo lightbox; menu subpanels; loan calculations including zero-interest and invalid-input handling. The detail map uses Leaflet and OpenStreetMap.

Contact, newsletter, reviews, service requests, dealer inquiries, login, and listing submissions have **no backend**. Forms validate locally and explicitly report that nothing was sent. Demo document links without a downloaded document report that it is unavailable. Third-party map tiles, Google Maps, YouTube, and outbound links still need internet access. Demo text, pricing, testimonials, and vehicle/image mismatches are retained from the supplied reference.

The empty Compare page is captured from the reference. Its populated comparison table and request-dialog behavior are local implementations; exact visual parity is not certified for those added states. Other source menu destinations outside the captured routes are not implemented.

## Verification evidence

- `qa/render-report.json`: all 11 requested routes at 1440×1000 and 390×844, overflow, image failures, and runtime errors.
- `qa/flow-report.json`: search/reload, sorting, empty results, pagination, advanced filters, saved cars/compare, calculator edge cases, gallery/dialog, mobile menu, and honest form feedback.
- `qa/*-desktop.png`, `qa/*-mobile.png`: local full-page renders. `reference/`: matching reference captures.
- First-viewport pixel differences measured at 1440×1000: Home **0.09%**, Listings **0.04%**, Ranger detail **0.01%**, Calculator **0.17%** at Pixelmatch threshold 0.15. These are scoped screenshot measurements, not a certification of every page/state.
- `npm run check` and `npm run build` are the source checks. `npm run verify` and `node scripts/flows.mjs` run browser checks against the dev server. Playwright is configured to use installed Google Chrome.

To refresh source captures: `node scripts/import-reference.mjs`, then `node scripts/build-data.mjs`. This overwrites generated reference/page assets. `node scripts/capture.mjs` captures the public demo for visual comparison.
