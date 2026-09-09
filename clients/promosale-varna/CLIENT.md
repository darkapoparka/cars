# Promosale Varna

Three independent personalized demo applications: **Auto Best (AutoDeal-derived), Carwow and Import**.

| Application | Folder | Local port |
|---|---|---|
| Auto Best | `auto-best` | 6761 |
| Carwow | `carwow` | 6762 |
| Import | `import` | 6763 |

## Content

Published original dealer logo and contact details are integrated. `business-facts.json` records the public sources and observation date. `stock.json` contains six dated dealer-advertised vehicles with 18 corresponding local photos, reused consistently across all three applications. Availability is not a live feed and must be confirmed with the dealer. Shared category/service artwork is illustrative, not additional advertised stock.

## Run from J:/cars

Use `./scripts/start-preview.ps1 -Client promosale-varna -Template auto-best -Port 6761`; substitute `carwow`/6762 or `import`/6763. Dependencies have been installed locally. For a fresh checkout, run `npm ci` inside each application first. Auto Best uses Node 22.23.2; the other two were checked with Node 24.18.0. Each application also has its own `npm run dev`, `npm run check` and `npm run build` commands.

## Executed verification

All three Svelte checks and production builds passed. Each application passed 18 browser route/navigation checks at 390 and 1440 px: home, inventory, a real detail, contact, about, a service journey, sell, blog, and card-to-detail/back navigation. Results and screenshots are in each application's `.client/evidence/browser/`. `node clients/promosale-varna/verify-content.mjs` passed all 54 per-application stock-photo checks plus data, identity, icon and logo consistency assertions.

## Remaining limits

Local demo review only: no public deployment, dealer approval, independently established media-reuse permission, outreach, or real message delivery is claimed. Forms and provider integrations remain unverified demos. The browser checks do not establish every secondary interaction, all alternate routes, or full visual parity. This dealer batch does not mean the remaining Varna lead queue is complete. Existing CRM/contact history was not modified.
