# Motoria

A local, HTML-preserving reproduction of the supplied Motors references, served by **Svelte 5 + SvelteKit + TypeScript**. This is the requested first phase: preserve the reference DOM and appearance now, then migrate the widgets into native Svelte components later.

## Run

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:6440/**. The development server binds to localhost and fails if that port is already occupied.

```sh
npm run check
npm run build
npm start
```

Stop the development server before starting the production server on the same port. Production startup accepts `HOST` and `PORT` overrides.

## Routes

| Local route | Reference |
| --- | --- |
| `/` | Classified One homepage |
| `/inventory/` | Classified Four inventory |
| `/inventory/page/2/` through `/inventory/page/5/` | Inventory pagination |
| `/listings/bmw-m5/` | Classified One BMW M5 listing |
| `/pricing/` | Pricing style 7 |
| `/pricing/?style=all` | Complete nine-style pricing reference |
| `/pricing/?style=1` through `?style=9` | Individual pricing styles |
| `/contact-us/` | Contact |
| `/about-us/` | About |
| `/blog/` | Blog index |
| `/loan-calculators/` | Percentage and amount loan calculators |
| `/leasing-calculators/` | Leasing calculators |
| `/import-car-calculator/` | Import calculator |
| `/insurance-calculator/` | Insurance calculator |

Original `/elementor-classified-one/...` and `/elementor-classified-four/...` URLs also resolve for captured pages. Links to other, uncaptured reference pages remain links to the source site.

## What works locally

- Original layouts, responsive styles, fonts, icon fonts, photos, galleries, tabs and calculator widgets.
- Inventory search across the 50 captured sample vehicles, category and price/mileage filtering, sorting and pagination.
- Homepage vehicle tabs, BMW gallery thumbnails, and the inventory mobile menu.
- Original calculator input handling and automatic recalculation.
- Pricing style selection through the URL.
- Contact form validation and explicit local-only submission feedback.

## Scope and remaining work

This is **not yet a native Svelte component rewrite**. SvelteKit renders checked-in HTML snapshots on the server; hydration is disabled so the original theme scripts retain ownership of their widget DOM. There is no WordPress installation or remote WordPress proxy.

Accounts, paid plans, listing submission, lead delivery, saved favourites/compare persistence and email integrations need a real backend. Their original controls are retained for visual fidelity; a successful real transaction is never reported by the local adapter. Only the supplied BMW detail and blog index are captured, not every vehicle detail or article linked from them.

The contact map uses Google's public interactive embed at the reference coordinates, without the source site's Maps API key. Its map controls differ from the reference's JavaScript map. Vendor preview toolbar purchase links remain external; the toolbar's dynamic button colour can differ. The Classified One mobile header is preserved as supplied, including its limited navigation.

The reference inventory hamburger has no corresponding menu markup. The local version repairs that control with a keyboard-accessible drawer linking the captured pages. Its closed state preserves the reference header; Escape closes the drawer and returns focus to the trigger.

## Structure

- `src/routes/[...path]/+page.svelte`: explicit, server-only HTML rendering boundary.
- `src/lib/snapshots/`: generated, build-owned page documents.
- `src/lib/server/pages.ts`: allowlisted route lookup.
- `src/lib/server/inventory.ts`: local inventory querying over captured listing records.
- `src/hooks.server.ts`: narrow local compatibility endpoints; no remote forwarding.
- `static/local-runtime.js`: local form handling and compatibility adjustments.
- `static/elementor-classified-*/`: original-path assets, preserving relative CSS/font resolution.
- `static/mirror/`: captured resource originals and external font assets.
- `references/manifest.json`: exact source URLs, titles and page metadata.
- `references/assets.json`: source URL, local capture path, type and size for each asset.
- `references/screenshots/`, `references/local/`, `references/diffs/`: visual evidence.

Never feed user input into the raw HTML rendering boundary. Its content is restricted to generated files in this repository. The pricing style parameter is constrained to the supported values. This boundary intentionally receives an `@html` warning from the Svelte autofixer; the underlying strings are build-owned, not user HTML.

## Reproduce captures and verification

The scripts use Playwright attached to a dedicated browser started by `agent-browser`:

```sh
npx agent-browser --session motors-reference open https://motors.stylemixthemes.com/elementor-classified-one/
npx agent-browser --session motors-reference get cdp-url
node scripts/capture.mjs <reference-cdp-url>
node scripts/complete-assets.mjs <reference-cdp-url>
node scripts/prepare.mjs
node scripts/reference-mobile.mjs <reference-cdp-url>

npx agent-browser --session motoria-local open http://127.0.0.1:6440/
npx agent-browser --session motoria-local get cdp-url
node scripts/interactions.mjs <local-cdp-url>
node scripts/verify.mjs <local-cdp-url>
node scripts/compare.mjs
```

Desktop comparisons use 1440 × 1000, mobile 390 × 844. Screenshots cover the full page. The pixel comparison excludes the first 94 pixels on desktop because the theme vendor's preview toolbar is dynamic. Pixel comparisons are evidence for the tested states, not a guarantee that every possible interaction is identical.

Use `references/verification.json`, `references/interactions.json` and `references/comparison.json` for the latest results. The broad asset discovery log can contain unused legacy font/image URL failures; rendered-page checks separately record the assets actually requested by the browser.

## Native Svelte migration

Replace one reference widget or page at a time. Keep the current screenshots as the baseline. Extract the header, footer, listing cards, filters, gallery, pricing cards and calculators into typed components; remove each corresponding legacy initializer as it is replaced. Enable Svelte hydration only after ownership of that page's DOM is unambiguous.
