# Bulgaria session 09 — implementation handoff

**15 of 15 requested application sources are committed.** All five dealer trios are **implemented-unverified**: actual retained Auto Best, full Modern and Carwow trees with dealer-specific identity, eight dated marketplace listings and sixteen local listing photographs per dealer. No app is owner-reviewed, deployed or browser-verified.

Source base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`. Application head before this documentation commit: `e2ff40f24a760b8ce88cbd07f81a962d652f0988`. Branch: `codex/astra-bg-09`.

| Dealer | Apps | State | Dealer implementation commit |
|---|---:|---|---|
| CAR MAX — Sofia | 3/3 | implemented-unverified | `b9381dfffd5c1bcd36b6cc953ee6893babfd8f16` |
| NOVA CARS — Sofia | 3/3 | implemented-unverified | `ceb8ef6e10391abf7486398aa8f1887797fc928e` |
| СТЕНЛИ КАР — Sofia | 3/3 | implemented-unverified | `51cdc308f87246b11af01a3c056c996a1d6ab688` |
| ЛУКС АВТО — Stara Zagora | 3/3 | implemented-unverified | `5bd1e4547e85d6b375235617c93fc92e82538b47` |
| NEXT AUTO — Pernik | 3/3 | implemented-unverified | `5c027719e6463f78b53d383ba1f0c6628f845bcc` |

Final cross-dealer stale-address cleanup: `e2ff40f24a760b8ce88cbd07f81a962d652f0988`.

## What is actually committed

Every dealer has `auto-best/`, complete `modern/`, and `carwow/`; `CLIENT.md`, `REVIEW.md`, `SOURCE-PACK.json`, `ASSET-PROVENANCE.json`, `CHECKS.json`; and per-variant `.client/project.json` plus `.client/source-lineage.json`. Each app carries 17 local dealer assets: one published profile logo plus two source photos for each of eight selected dealer advertisements. Media was copied without removing source watermarks. Provenance explicitly does not claim a new publication licence.

Published source trees retained: Auto Best `97833980ab127f6de8f675ac1a188e4b7f717976` (2026.09.08-polish-1), Modern `66bfb8196bbce18832ada6b34b02dda97baba25b` (2026.09.06-refresh-1), Carwow `d4a08817e87cf84d08c4db1c08a515937245f2dd` (2026.09.08-repair-1).

Remote readback found 253 / 1313 / 1318 tracked files per Auto Best / Modern / Carwow app, with all 17 local dealer assets and both client metadata records present in every application. Total tracked application files: 14,420.

## Source checks

Before each dealer publish, every changed Svelte file was parsed/compiled in memory using the retained template compiler and every changed TypeScript/TSX file was syntax-transpiled with TypeScript 5.9.3. Results were zero errors. Sofia dealers: 63 Svelte + 55 TypeScript files; Stara Zagora/Pernik: 66 Svelte + 59 TypeScript files because city-specific source copy changed additional consumers. These are source checks, not full framework builds.

Remote metadata readback confirms all 15 `.client/project.json` records say `implemented-unverified`, eight inventory records, sixteen local stock photos, exact source template tree, QA flags false and owner review pending. Recursive tree scope verification against published main passed: changes are confined to the five owned client folders and `docs/lead-build/bulgaria-2026-09-09/reports/session-09`.

## Checks not run

No retained-lockfile install was run in these branch-only Git object builds. Auto Best `npm run validate`, Modern Prisma/database generation + web typecheck/build, and Carwow `npm run check && npm run build` remain for the local coordinator. No preview servers were started on the owner's shared checkout. No 320/390/1440 browser comparisons, gallery interactions, menu/focus checks, filter/reset/back-state checks, console/overflow checks or screenshots are claimed.

Forms are demo-only and no external delivery is claimed. Advertisement presence is not independent proof of current availability; the source packs say to confirm with the dealer. No deployment, public-origin FAB integration, outreach or CRM write was performed.

## Coordinator

Fetch `codex/astra-bg-09` without resetting unrelated local work. Inspect CAR MAX first:

`git -C J:/cars fetch origin refs/heads/codex/astra-bg-09:refs/remotes/origin/codex/astra-bg-09`

Then review `clients/car-max-sofia/REVIEW.md` and run the existing client launcher only after integrating the owned paths into the coordinator checkout. Continue dealer-by-dealer.
