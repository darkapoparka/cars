# Inventory browse artwork — 4 October 2026

The owner asked to fill the taller Home inventory browse card with car artwork and three small previews. The card now uses the retained three-car cutout above the existing red arrow and View all label. White surface, typography, spacing, border, shadow, hover and focus still come from the shared card and theme. The smaller make/type/review/guide destinations retain their arrow treatment.

[Before/after comparison](http://127.0.0.1:6795/inventory-artwork.html) · [Live Home](http://127.0.0.1:6790/bg)

## Implementation

`HomeBrowseCard.svelte` adds one optional typed `artwork` prop. `HomePage.svelte` opts in for the desktop inventory destination. Asset selection and dimensions have one content owner: `homeBrowseArtwork.inventory` in `src/lib/content/home-discovery.ts`. The existing mobile body-type compatibility data consumes the same asset path. No image file, listing photograph, copy, destination or mobile composition changed.

The picture source activates from 768px. Its transparent fallback is shared with `HeroCars` through `utils/assets.ts`, retaining that component's exact existing fallback. The picture has empty alternative text and is decorative; the entire card remains one accessible native link. The artwork is the existing [three-car illustration](../assets/ALL-CARS-TILE.md), not photographs of available stock. No new palette values, localized strings, per-route card styles or asset generation were added.

## Screenshots

| View       | Before                             | After                             |
| ---------- | ---------------------------------- | --------------------------------- |
| Stock grid | [Screenshot](before-vehicles.png)  | [Screenshot](after-vehicles.png)  |
| Full Home  | [Screenshot](before-home-full.png) | [Screenshot](after-home-full.png) |

Before uses canonical source at baseline `f47a5c684f17cd4af8f180b726d9785b73c273e1`, with inherited ignore edits and unused assets preserved. After uses the frozen production build. Images were loaded and decoded before capture; no screenshot styles were injected.

## Verification

The full working-source/QA manifest covers 1,678 application, configuration, test and asset paths. Its SHA-256 digest is `18f346b144f75221506af578925be95694da6b0e6b545577af2ce435e56355fd`. [source-changes.json](source-changes.json) records all six task-owned source hashes and the full manifest location; [verification.json](verification.json) records the checks, probes and screenshot hashes. The npm lockfile is unchanged. The QA copy has its own `npm ci` and build output, with no environment-secret, Git or deployment bindings.

Svelte reports zero errors/warnings. Scoped formatting/lint, full ESLint, architecture, assets, 124 unit tests and production build pass. Full `npm run verify` still stops on the same three untouched formatting files: `public-assets.policy.json`, `scripts/public-asset-retention.mjs` and `svelte.config.js`. Subsequent gates passed separately; full verify is not reported as passing.

The production browser run passes nine applicable cases with three intentional mobile-project skips, zero failures and zero flaky cases. It covers all five grid destinations, keyboard Enter/Back, BG/EN navigation without JavaScript, the make end card, review/article images and Home accessibility. The preliminary live-source browse run also passes its three existing journeys.

Sixteen before and sixteen after responsive states plus two production states have no response, page-error, overflow or visible-image decoding failures. All eight matched Home/About mobile viewport PNGs and complete-page computed presentation records at 320/390px are identical. Twelve production media probes in BG/EN at 320/390/768/1024/1440/1920px confirm the transparent mobile fallback, the decoded 720 × 264 desktop artwork, image containment and equal stock-grid card heights. Forty individual card probes confirm the shared white surface, arrow, label, hover and keyboard focus at all four desktop widths.

Raw screenshots, logs, full source manifest and the QA build remain at `C:/Users/radev/.codex/tmp/cars-import-inventory-browse-artwork-2026-10-03/`. The gallery and committed comparison screenshots remain under the canonical Import runtime/docs owners.

## Integration boundary

Work stays in `L:/CODEX/cars/templates/import` on Cars `main`. The workspace doctor fetched before writing and integration. The commit scope contains the six source paths, maintained styling/architecture/QA/handoff references, asset provenance and this evidence receipt. Inherited ignore changes, older untracked evidence, the unused About asset and other template/dealer work are preserved. No branch/worktree, blanket staging, reset, clean or force push is used.

These are standalone master checks. Mounted/hosted behavior, owner visual acceptance, immutable template promotion and dealer deployment remain separate. No promotion, dealer rollout or outreach was performed.
