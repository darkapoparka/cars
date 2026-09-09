# CAR MAX — review handoff

State: **implemented-unverified**. Three independent Fast Skin application trees are committed on `codex/astra-bg-09`. No deployment or outreach.

## Entries
- Auto Best: `/` (inventory `/listing-grid`)
- Modern: `/cars` (localized route may resolve to `/bg/cars`)
- Carwow: `/` (inventory `/inventory`)

## Checks still required locally
Auto Best: `npm ci && npm run validate`. Modern: frozen pnpm install, database package generation/build, web typecheck/build. Carwow: `npm ci && npm run check && npm run build`. Then browser-check 320/390/1440 px, home, inventory, one detail/gallery, contact, menus/focus, filters/reset/back-state, image loads, console and overflow.

All forms remain demo-only; do not send anything. Inventory comes from the dated source pack and should be reconfirmed before publication.
