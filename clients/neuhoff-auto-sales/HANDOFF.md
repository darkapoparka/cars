# Neuhoff Auto Sales — session 05 handoff

**Blocked before copying. This is source evidence, not three built applications.** Batch `lead-build-2026-09-08`; lead `us-in-evansville-neuhoff-auto-sales`.

## Verified and unresolved source observations

[SOURCE.json](SOURCE.json) retains official URLs, eight stock IDs, original USD/miles and the 2026-09-08 retrieval date. Published identity: Neuhoff Auto Sales, 1800 N Burkhardt Rd, Evansville, IN 47715; 812-477-6433.

Official extracted store/directions/homepage hours show Monday–Saturday 09:00–19:00. Sunday remains incomplete (`- pm`) and is stored as null. Do not infer that Sunday is closed. No dealer call was made.

Catalogue snapshots conflict: an older homepage make sum of 74, a newer homepage make sum of 79 and a last-week catalogue count of 72. The www query-bearing inventory was a last-year snapshot and was not used for the eight samples. None of these numbers is accepted as a independently verified live available-stock total; cache inconsistency alone is not a proven website defect.

Use Internet vehicle prices, not Retail/Savings values. The 2020 Malibu `Get ePrice` row remains null, never zero. The 2018 Malibu detail corroborated its catalogue record and notes that aftermarket wheels/tires can add cost. Financing is advertised subject to approval, not a guarantee or a verified APR. Samples are dated public listings, not independently verified condition or availability.

## Essential media/visual blockers

An official footer-logo URL and Malibu image URL were found but returned web cache misses. Chromium navigation was blocked with `net::ERR_BLOCKED_BY_ADMINISTRATOR`; see [source-access.json](evidence/source-access.json). No usable local image bytes, rendered branding inspection, professional refresh, favicon family or permitted asset pack was completed. Public visibility does not establish reuse permission. No substitute logo or another dealer's inventory was inserted.

## Master lineage inspected, not copied

At commit `4ef7edfe4c1566dcc0688bc78b87f812de1223c4`:

| Master | Version | Tree | Inspected install/check requirements |
| --- | --- | --- | --- |
| auto-best | 2026.09.08-polish-1 | 97833980ab127f6de8f675ac1a188e4b7f717976 | Node ^22.12.0, npm 10.9.8; `npm ci`, `npm run validate` |
| modern | 2026.09.06-refresh-1 | 66bfb8196bbce18832ada6b34b02dda97baba25b | Node >=22.22.0 <23, pnpm 11.4.0; full workspace; `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, `pnpm --filter web typecheck` |
| carwow | 2026.09.08-repair-1 | d4a08817e87cf84d08c4db1c08a515937245f2dd | Node 24.x; `npm ci`, `npm run check`, `npm run build` |

These commands were not run on Neuhoff apps; those directories do not exist. A future Modern preview needs distinct local origins and its web app within the full workspace; Prisma generation must not become a database migration. The Cars launcher, not the inherited Carwow fixed-port wrapper, governs local preview.

## Checks and missing implementation

Source-draft Python checks covered JSON parsing, eight unique stock IDs, original USD/mile numeric invariants, null request-price/Sunday fields and the make-count arithmetic of 79. Those are data checks, not application tests. No application consumers changed; no install, typecheck, build, page/browser, responsive, asset, layout-fidelity or enquiry checks were executed.

Initial main/astra client trees lacked the proposed path. Full alias/domain/profile/normalized-phone duplicate matching is still unfinished. Proposed ports 7447/7448/7449 were free only in this container's bind test; local owner-machine listener ownership is unknown.

All three applications, full content integration and permitted local imagery remain undone. Sunday/current-stock uncertainties are retained explicitly rather than fabricated. No deployment, contact, external form submission, database provisioning or private CRM changes occurred.

## Safe local inspection

Fetch `origin` from an owned clean checkout or create an isolated worktree without changing dirty work. Inspect the session-05 report, SOURCE.json and this handoff on `origin/astra`. Do not reset/clean or stop unrelated listeners. There are no Neuhoff apps to install/start, so do not run a copying/personalization generator as a substitute for delivered code. Application commit SHAs: none; evidence publication is tracked separately by the report and Git history.
