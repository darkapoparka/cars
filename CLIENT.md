# Перфект Ауто — Varna

Three independent personalized demo applications: **Auto Best, Modern and Carwow**.

| Application | Folder | Local review |
|---|---|---|
| Auto Best | `auto-best` | Vite/SvelteKit |
| Modern | `modern` | Next.js web app |
| Carwow | `carwow` | SvelteKit |

## Content

Published Perfect Auto identity, phone, Varna location, dealer-profile logo, and a six-vehicle dated stock sample are integrated. The 30 local vehicle photos come from the dealer's published marketplace listings. Availability is not a live feed and should be confirmed with the dealer.

The demo only presents source-supported sales, barter, leasing-enquiry, viewing and test-drive contact paths. It does not claim unsourced warranty, workshop, transport, delivery, or finance terms.
## Executed verification

- Auto Best: `npm run check` and `npm run build` passed after fixing the six-item mobile budget assumption. Browser checks passed on home, inventory and contact at 1440 px and 390 px with correct dealer identity, no error overlay and no horizontal overflow.
- Modern: `pnpm --filter web typecheck` and `pnpm --filter web build` passed under Node 22.22.0. Browser checks passed on home/cars/contact at 1440 px and 390 px; the positioned logo-container warning was corrected and the build rerun successfully.
- Carwow: `npm run check` and `npm run build` passed. Browser checks passed on home/inventory/contact at 1440 px and 390 px after a clean mobile rerun.

## Source and review limits

Primary public source: `https://perfektauto.mobile.bg/`, observed 10 September 2026. The site is a local demo only: no public deployment, dealer approval, outreach, real form delivery, independently established media-reuse permission, or backend/provider integration is claimed. The browser checks cover representative routes, not every secondary interaction.