# DANGER AUTO — branch checkpoint review

**State: in-progress. No finished dealer trio or public preview.** All three application folders contain retained source, not wrappers or config-only folders. Session 08 owns this work on `codex/astra-bg-08`.

## Independent applications and review entries

| Application | Folder | Source-derived local entry | Catalogue |
| --- | --- | --- | --- |
| Auto Best | auto-best | / | /listing-grid |
| Modern | modern; full workspace, public app in apps/web | /cars | /cars |
| Carwow | carwow | / | /inventory |

These routes are not browser-verified. There is no public-origin mounting or design switcher implementation/verification in this branch handoff.

## Retained source

Base: `faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca`. Auto Best source tree: `97833980ab127f6de8f675ac1a188e4b7f717976`; Modern: `66bfb8196bbce18832ada6b34b02dda97baba25b`; Carwow: `d4a08817e87cf84d08c4db1c08a515937245f2dd`. These are the per-app `.client/source.json` records. Existing copies were resumed, not re-cloned over. Source QA is not client QA.

## Current implementation checkpoint

The Auto Best inventory module and Carwow `daynight-vehicles.ts` / `daynight-current-inventory.ts` consume the dated eight-record dealer snapshot. Modern retains the full workspace and dealer configuration; its complete adapter typing and rendered consumers still need review. These are advertised records, not a verified live-stock feed. Final local stock photos and professional identity assets are still missing.

The latest resumed Auto Best work fixes legitimate zero finance amounts (`32cc2e90b07ec0db5d8ec6c7677320e94d2f4506`), personalizes homepage guidance (`939562d7be8886fb3baf024c98cb28d58d937425`), removes the source dealer's videos, guards unconfigured video-channel links, preserves playback/grid/focus code, and corrects footer financing copy. The unavailable video state keeps the section and offers an actual phone link without claiming delivery. No official DANGER AUTO video channel is asserted.

The current contacts page confirms 0878 842 409 and 0888 000 055 at бул. Самоковско шосе 1, автоборса Джани до комплекс Боила, Горубляне. The contacts page has no entered hours while advert prose has separate hours. The current central configurations already match; do not restore the earlier inconsistent phone/address/hours values. Source: https://dangerauto.mobile.bg/contacts, re-read 2026-09-09.

## Local coordinator commands

Use current package manifests/runtime files as authority. No suggested port has been checked for availability on the coordinator's computer.

Auto Best: `cd clients/danger-auto/auto-best`, `npm ci`, `npm run validate`; start with `npm run dev -- --host 127.0.0.1 --port <free-port>`. Review `/`, `/listing-grid`, `/listing-detail-v1/1` and `/contact?vehicle=1&topic=inspection`.

Modern: retain the entire workspace. Its template documents Node >=22.22.0 <23 and pnpm 11.4.0. Run `pnpm install --frozen-lockfile`, `pnpm --filter @repo/database build`, and web typecheck/build in the existing static demo configuration. Prisma generation here is local code generation, not a live DB connection or migration. Use distinct public/API/private-app origins and the documented local-demo environment; start the public app from `apps/web`. Review `/cars` and `/bg/contact`, then inspect the actual current detail route.

Carwow: use its package's supported runtime (the assignment baseline is Node 24), `npm ci`, `npm run check`, `npm run build`; bypass the inherited fixed-port dev wrapper using the coordinator launcher. Review `/`, `/inventory`, `/inventory/chevrolet-cruze-1-6i-11788853280325556` and `/contact`.

## Checks actually run

The earlier stock checkpoint records 22 data-module checks in `checks/RESULTS.json`. They were not rerun in this resume and are not Modern/Carwow QA.

This resume ran **10 source/data checks, exit 0**, using Node v22.16.0 and the runner's preinstalled TypeScript 5.8.3. The actual script and input blob hashes are in `checks/content-contract.cjs` and `checks/CONTENT-RESULTS.json`. After Auto Best dependencies are installed, reproduce from repository root with `node clients/danger-auto/checks/content-contract.cjs`. This only checks TypeScript script syntax, evaluated data, and narrow source contracts; it does not compile Svelte markup, semantically typecheck the full app, build, or render a browser. A separate inverse-patch hash comparison reproduced the original video/footer source blobs after undoing the explicit copy/empty-state changes.

No retained-lockfile install, full framework check/build, HTTP route test, or browser comparison ran for these copies. The independent runner's GitHub clone attempt failed with DNS resolution exit 128; connector writes worked. No Windows checkout was used. Image generation was attempted but did not start, so no generated logo or asset bytes are claimed.

## Precise remaining work

1. Final professional identity/favicon and permitted local vehicle photos/galleries; temporary states are not finished assets.
2. Finish all other reachable content consumers: navigation, about, team/reviews, metadata, social-link handling and alternate demo records. Preserve the masters' layouts and interactions. The source video/footer changes do not constitute a whole-app stale-identity pass.
3. Review Modern wrapper/domain enum typing and exports; check Carwow unknown doors and its inherited availability filter bucket. Visible availability is qualified, but its `available` filter bucket is not independent stock verification.
4. Finish the recursive copy-exclusion audit. Existing clone provenance is not a new credential/license clearance or complete audit.
5. Adapt Auto Best's fixed asset-count and JSON-unaware domain checker assumptions. The zero-principal formatting fix is now committed; it is no longer an unapplied draft.
6. Run full app checks and compare retained master/client at 390/1440 pixels, plus header controls at 320. Exercise detail/gallery, filter/reset, menu/focus, detail-to-list state and non-sending enquiries. Save screenshots and route evidence before claiming implemented/verified status.

No deployment, outreach, main/astra update, private CRM write, Windows edit or background job was performed. AUTOHOF's legacy variants remain untouched. Fetch this branch for source review and continuation; there is no finished dealer trio to approve yet.
