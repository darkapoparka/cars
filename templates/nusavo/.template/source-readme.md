# Nusavo — Svelte 5 visual clone

A visual-first port of the [Nusavo author demo](https://shop.creativemox.com/nusavo/), linked from [ThemeForest item 64724420](https://preview.themeforest.net/item/nusavo-car-rental-elementor-pro-template-kit/full_screen_preview/64724420).

The original page geometry, content, Rajdhani / Inter Tight typography, colors, images, icons, and responsive styling are preserved. This is an editable Svelte application: the pages compile to native components, with no WordPress runtime, remote page mirroring, or runtime HTML injection.

## Run

```powershell
cd J:\cars\nusavo
npm install
npm run dev
```

Open **http://127.0.0.1:6420/**. The port is strict so a different project cannot silently be selected.

```powershell
npm run check
npm run build
npm run preview
```

## Pages

36 page components cover the homepage, about, team, services, contact, FAQ, car listing, eight vehicle details, blog, six articles, six category archives, author archive, date archive, account, password recovery, cart, checkout, purchase summary, and 404.

Primary routes:

| Page | Route |
| --- | --- |
| Home | `/` |
| About | `/about-us/` |
| Team | `/our-team/` |
| Services | `/services/` |
| Cars | `/car-listing/` |
| Vehicle detail | `/car-listing/urbango-hatchback/` |
| Contact | `/contact-us/` |
| FAQ | `/faq/` |
| Blog | `/blog/` |
| Article | `/self-drive-or-chauffeur-rental-which-is-better/` |
| Account | `/my-account/` |
| Password recovery | `/my-account/lost-password/` |
| Cart | `/cart/` |
| Checkout | `/checkout/` |
| Purchase summary | `/purchase-summary/` |
| 404 | `/404/` |

The source demo's Elementor query URLs also resolve to their corresponding local pages. Full source route metadata is in `src/pages.json` and `reference/routes.json`.

## Local interactions

- Desktop dropdowns and mobile menu, including keyboard open and Escape close.
- Responsive, draggable, autoplaying car, logo, and testimonial carousels.
- Fleet category filters, FAQ disclosures, vehicle image viewer, and video popup.
- Local cart with vehicle selection, quantities, removal, and persistence through refresh.
- Checkout field validation, payment-method disclosure, alternate shipping address, and local summary.
- Contact, newsletter, login, and password-recovery forms provide local feedback. They do not send messages, create accounts, charge money, or submit reservations.

The template's original demo copy and fictional rental details are intentionally retained for visual fidelity. The map and introductory video use the reference's external Google Maps / YouTube embeds; their availability depends on those providers.

## Files and later refactoring

- `src/pages/`: editable page components, preserving the reference's markup and class names.
- `src/App.svelte`: route selection and shared interaction state.
- `src/Cart.svelte`, `src/OrderSummary.svelte`: local commerce components.
- `src/carousel.js`: Swiper attached through Svelte 5 attachments.
- `src/interactions.css`: behavior and rendering adjustments around the reference styles.
- `public/assets/`, `public/styles/`: local reference assets and page styles.
- `reference/pages/`: captured source markup and screenshots.
- `reference/qa/`: responsive screenshots and verification results.

`scripts/generate.mjs` is the one-time import/conversion utility. Re-running it overwrites the generated route components. Edit the Svelte pages directly for the planned refactor, or deliberately update the conversion rules before regenerating.

The broad original stylesheet structure is preserved intentionally for this visual-first stage. Component extraction, CSS pruning, production content, and real booking/account services are separate follow-up work.

## Verification

`npm run check` and `npm run build` validate the source. `scripts/verify.mjs` checks all routes at 1440px and 390px with Chrome and saves screenshots, image status, overflow, and browser errors. `scripts/flows.mjs` exercises navigation, filtering, disclosures, image viewing, cart persistence, checkout validation, and local form feedback. These scripts use the local dev server on port 6420.
