# AUTOHOF review

State: implemented-unverified on `codex/astra-bg-08`.

- Auto Best: `cd clients/autohof/auto-best`; `npm ci`; `npm run validate`; entry `/`.
- Modern: `cd clients/autohof/modern`; use the retained Node/pnpm versions; `pnpm install --frozen-lockfile`; build the database package for local Prisma generation, then typecheck/build `apps/web`; entry `/cars`.
- Carwow: `cd clients/autohof/carwow`; `npm ci`; `npm run check`; `npm run build`; entry `/`.

Inspect home/entry, inventory, one real sample detail, contact, navigation, filter/reset and demo enquiry destination at 390 and 1440 px; check header/logo controls at 320 px. Do not submit external enquiries.

The same eight seller-advertised records drive all three variants. The local stock image placeholder is intentionally not a vehicle photo. Replace it only with a matched permitted image for that record.
