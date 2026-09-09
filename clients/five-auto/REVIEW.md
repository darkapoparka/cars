# FIVE AUTO — review handoff

Status: **implemented-unverified**. Dealer facts, common eight-record catalogue, local FIVE AUTO logo, and 24 matched stock photographs are connected in all three designs. Runtime/browser QA is not claimed.

## Local entries
- Auto Best: `/`
- Modern: `/cars`
- Carwow: `/`

## Install/check
- Auto Best (Node 22): `npm ci`, `npm run validate`
- Modern (Node 22 / pnpm 11.4.0): `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck`, then the documented static-demo web build
- Carwow (Node 24): `npm ci`, `npm run check`, `npm run build`

## Exact review entries
1. At 390px, review home → inventory → one real detail/gallery → contact; test menu dismissal, filter/reset and back-to-list state without sending a form.
2. At 1440px, repeat the same route journey and verify the FIVE AUTO wordmark, Burgas address/phone, eight sourced vehicles, EUR prices and listing-specific tax notes.
3. At 320px, inspect logo/header controls and overflow. Then verify direct routes and console errors.

Owner review remains pending. Do not treat the branch as deployed or dealer-approved.
