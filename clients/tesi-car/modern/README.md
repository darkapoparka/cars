# Теси Кар · Modern

Actual independent copy of the complete `templates/modern` workspace at `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`, version `2026.09.06-refresh-1`. All application and package workspace directories, lockfile and original composition remain. This is not a web-only reconstruction. Inherited root agent/master-instance instructions are excluded.

## Implementation checkpoint — not review-ready

`packages/marketplace/lead-site.ts` consumes local dealer facts. The actual domain provider `packages/marketplace-domain/testing/mock-data.ts` now derives the same eight sourced Tesi Car listings, EUR prices, kilometres and matching photographs as the other variants. Its existing lookup, filter, sort and related-listing APIs are retained. Fabricated customer leads, trust reviews, moderation reports, promotions and saved-search activity are removed. Source photographs still use the exact original URLs pending the local asset transfer. The remaining visible content sweep is in progress.

The published dealer logo is bundled in this app. `staticDemoMode` is true. The robots and sitemap routes and global `X-Robots-Tag` configuration mark the copy as an unindexed preview; no official domain or deployment is invented.

## Commands

Use Node `>=22.22.0 <23` and pnpm `11.4.0`, subject to the retained package manifests. From this workspace: `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck`, `pnpm --filter web build`. Database build means Prisma generation, not pushing a schema or contacting a production database.

For the local preview, use the repository coordinator's existing launcher and its assigned ports. The documented demo environment uses `SKIP_ENV_VALIDATION=true`, `AUTOMARKET_PUBLIC_DATA_MODE=demo`, and distinct local `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL` origins. No real account or provider secrets should be supplied for this preview.

Entry `/cars` (localized `/bg/cars`); first detail `/bg/listing/mitsubishi-asx-2015-917784`; contact `/bg/contact`. No shared launch scripts were changed.

## Checks actually performed

The replacement provider was transpiled in the independent Linux container using TypeScript, then executed with its eight-record facts fixture. Seventeen assertions passed for counts, makes, gearbox filtering, price range/sorts, missing results, related records, no guessed delivery eligibility, EUR/km, unverified sellers and empty customer/trust activity. The uploaded provider blob was checked against the exact tested local file hash. This is **not** a workspace typecheck, dependency install, app build or browser check; none of those has run.

Source/template licences do not establish rights to a new dealer's images. Sources and the unverified reuse/availability boundaries are recorded in each local facts copy. Do not deploy before factual and media review.
