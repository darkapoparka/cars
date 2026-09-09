# DANGER AUTO — branch checkpoint review

**State: in-progress. No finished dealer trio or public preview.** All three application folders now contain retained application source, not wrappers or config-only folders. Work is owned by session 08 on `codex/astra-bg-08`.

## Independent applications and proposed entries

| Application | Folder | Local entry | Catalogue |
| --- | --- | --- | --- |
| Auto Best | auto-best | / | /listing-grid |
| Modern | modern (full monorepo; app in apps/web) | /cars | /cars |
| Carwow | carwow | / | /inventory |

Entries are source-derived, not browser-verified. No coordinator public-origin mounting or design switcher is implemented or tested.

## Retained source

Repository base: faf76e81c96a4e6dbe18e8ffcaf0a249df47b7ca. Existing Auto Best copy is resumed; not replaced. Modern source tree: 66bfb8196bbce18832ada6b34b02dda97baba25b. Carwow source tree read at the pinned commit: d4a08817e87cf84d08c4db1c08a515937245f2dd. Per-app `.client/source.json` records the copy method. The complete Modern apps/packages and the lockfiles are retained; no master symlinks are used.

## Local coordinator commands

Use each retained package.json and runtime-version file as authority. From auto-best: `npm ci`, `npm run validate`, then `npm run dev -- --host 127.0.0.1 --port 5181`. From modern: use its pinned pnpm, `pnpm install --frozen-lockfile`; inspect workspace package names before running the database-package generation/build and web typecheck/build in static demo mode. Do not configure a live database. From carwow: `npm ci`, `npm run check`, `npm run build`, then `npm run dev -- --host 127.0.0.1 --port 5183`. Ports are suggestions, not verified free; coordinate them locally or use scripts/start-client.ps1.

## Checks actually run

Earlier checkpoint 392b6fab9786640346a0beca23a7078a462d60b1 records **22 passed data-module checks** in checks/RESULTS.json. That evidence belongs to its recorded input blobs, not these new Modern/Carwow adapters. No dependency install, framework typecheck, build, HTTP route test or browser comparison has run for these new copies.

Public contacts and the Chevrolet listing were re-read. The listing's first photo was visually inspected through the web tool. Its local download failed. Image generation was called, but the service reported generation had not started; no resulting logo exists.

## Exact remaining work

1. Replace the explicitly temporary identity/stock states with final professional branding and permitted local photos/galleries. No media rights or generated output is claimed.
2. Complete all supporting-page consumers: finance copy, about/team/reviews/videos, metadata/favicon, stale alternate demo records, and empty social-link handling. Keep master layout and interactions.
3. Reconcile Modern wrapper typing with the retained domain enums and check all export consumers. Check Carwow unknown-door handling and its legacy availability filter bucket; the visible stock text is qualified.
4. Finish recursive copy-exclusion audit; no secrets are deliberately introduced. Root task runbooks, known env examples and npmrc were excluded, but this checkpoint is not a completed recursive audit.
5. Repair the existing Auto Best asset-count/JSON domain checker assumptions and zero-principal finance display.
6. Install retained lockfiles and run the actual per-app checks. Compare master and client at 390/1440 px and check header at 320 px, plus real detail, filters/reset, navigation/focus, back state and non-sending contact behavior. Save compact evidence before calling this implemented or verified.

No other dealer is started while this DANGER AUTO skin is unfinished. AUTOHOF's existing legacy variants are untouched. No deployment, dealer contact, main/astra update or Windows filesystem write occurred.
