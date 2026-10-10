# Standard desktop Home browse cards — 3 October 2026

The owner asked to standardize Home's inconsistent image, black and white browse destinations. White is the chosen desktop treatment for the current off-white canvas: the same card, red arrow, dark label, quiet hover and visible keyboard focus. Real category/vehicle images and make logos retain their purpose.

[Before/after comparison](http://127.0.0.1:6795/browse-standard.html) · [Live Home](http://127.0.0.1:6790/bg)

## Implementation

All five desktop end cards now use `HomeBrowseCard.svelte`: stock, makes, body types, reviews and guides. The black All makes tile and image-based View all type tile are replaced with the existing shared component from 768px. Makes' generic end card no longer adds the separate total-count line; individual make counts and the inventory total remain with their data/results owners. Labels and destinations retain existing BG/EN content and native links. There are no new palette values or per-grid desktop card overrides.

`HomeFiveTypeCard` now has the same explicit `allTile` metadata as make cards. The full-inventory type destination is identified by this flag rather than inferring it from an image path or localized label. Existing data fields, images, taxonomy and query links remain compatible. The old make/type end markup renders only in its retained mobile composition; the desktop component is hidden below 768px. Mobile images, labels, targets and styles remain unchanged.

Existing browser journeys now locate the make destination by its accessible name and cover all five grid end links. They retain native navigation, locale hints and JavaScript-disabled behavior.

## Actual screenshots

| View       | Before                             | After                             |
| ---------- | ---------------------------------- | --------------------------------- |
| Makes      | [Screenshot](before-brands.png)    | [Screenshot](after-brands.png)    |
| Body types | [Screenshot](before-types.png)     | [Screenshot](after-types.png)     |
| Full Home  | [Screenshot](before-home-full.png) | [Screenshot](after-home-full.png) |

Before images use the canonical source at baseline `598b46c34e010d2ce185c33b167fb4314460454d`. After images use the frozen production build. Styles were not injected for screenshots. The comparison includes full Home so the five end cards can be assessed together.

## Verification

The complete working-source and QA manifest contains 1,678 application/configuration/test/asset paths. Its SHA-256 digest is `c81ba78f3603c4d20445e28b468b1041654bbb995a935d25c0ca632172e5bc6a`; [source-snapshot.json](source-snapshot.json) records the per-file hashes. The retained npm lockfile is unchanged. The C: QA copy has its own install/build output and no environment-secret, Git or deployment bindings; the live source's output remains untouched.

Svelte reports zero errors/warnings. Scoped formatting/lint, full ESLint, architecture, assets, 124 unit tests and production build pass. Full `npm run verify` still stops on the same three unchanged formatting files: `public-assets.policy.json`, `scripts/public-asset-retention.mjs`, and `svelte.config.js`. Subsequent checks were run separately; full verify is not reported as passing.

Three existing browser suites pass 26 applicable cases with ten intentional project skips. Three focused grid/native-link cases pass, with three intentional mobile skips. There are no failures or flaky cases. Coverage includes make and type end destinations, all five grids at 768/1024/1440/1920px, BG/EN links with JavaScript disabled, search GET behavior, readable cards, avatars/articles, focus and accessibility.

Sixteen before and sixteen after responsive states plus two production Home states have no response, page-error, overflow or visible-image decoding failures. All eight matched Home/About mobile viewport PNGs and complete-page computed presentation records at 320/390px are identical. Forty individual card probes across BG/EN and four desktop widths confirm identical surface, border, radius, shadow, label/arrow roles, neutral hover and keyboard focus for all five cards. End cards contain no decorative image; actual make/category cards retain their media. [verification.json](verification.json) records exact dimensions, check logs and screenshot hashes.

## Integration and boundaries

Work remains in `L:/CODEX/cars/templates/import` on Cars `main`. The workspace doctor fetched before writing and integration. Only the four reviewed source/test paths, maintained styling/architecture/QA/handoff references and this receipt are staged. Inherited ignore edits, older evidence drafts, unused untracked assets and other template/dealer work are preserved. No reset, blanket staging, branch/worktree creation or force push is used.

An unchanged empty index lock from 19:38:42 UTC was unheld and had no surviving Git owner; current app status readers started later and were left running. It was preserved with native PowerShell `Move-Item -LiteralPath` under `runtime/desktop-browse-standard-2026-10-03/recovery/index-lock-2026-10-03T193842-preserved`, with observations in `index-lock-receipt.json`. Scoped staging then succeeded. A second unchanged empty lock from 20:11:51 UTC is retained in the task's C: recovery archive after the same owner and exclusive-open checks. Neither lock was deleted.

L: became full during integration. This task's raw PNGs and the older white-panel QA copy's generated build, static-copy and install files were archived to C: with per-file SHA-256 checks. Canonical source, committed screenshots, the running app and gallery remain in place. The relocation receipts identify every moved or retained file; build symlinks were excluded.

Evidence and the frozen QA copy remain at:

- Logs and computed records: `L:/CODEX/cars/templates/import/runtime/desktop-browse-standard-2026-10-03/`
- Current QA and raw PNG archive: `C:/Users/radev/.codex/tmp/cars-import-browse-standard-2026-10-03/qa/`, including `runtime/captured-images/relocation.json`.
- Older generated-copy archive: `C:/Users/radev/.codex/tmp/cars-import-white-panels-archive-2026-10-03/`, with `build-relocation.jsonl`.
- Second Git lock and observations: `C:/Users/radev/.codex/tmp/cars-import-browse-standard-2026-10-03/recovery/`.

These are local standalone master checks. Owner visual acceptance, the full browser catalogue, hosted/mounted behavior, immutable template promotion and dealer deployment remain separate. No release promotion, dealer rollout or outreach was performed.
