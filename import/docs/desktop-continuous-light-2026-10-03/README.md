# Continuous off-white desktop canvas — 3 October 2026

The public desktop header, native heroes and content sections now share the existing cool off-white canvas. `src/lib/styles/tokens.css` aliases `--bc-desktop-hero-surface` to `--bc-desktop-canvas` inside the existing 768px desktop boundary. This removes the extra grey band through one shared value; no route override or palette literal was added.

White cards, soft discovery panels, red primary actions, black secondary actions, campaign imagery and the dark footer retain their roles. Centered automotive headings, car artwork and shadows, stock grids, vehicle/purchase layouts, content and interactions remain with their existing owners. The mobile theme and About trial retain their previous values.

## Before and after

[Live Home](http://127.0.0.1:6790/bg) · [implemented eight-route comparison](http://127.0.0.1:6795/unified-implemented.html). The comparison includes the previous grey hero, the supplied black Home reference, and complete Home pages. These are local review URLs.

| Page      | Before                            | After                                 |
| --------- | --------------------------------- | ------------------------------------- |
| Home      | [Grey hero](before-home.png)      | [Unified canvas](after-home.png)      |
| About     | [Grey hero](before-about.png)     | [Unified canvas](after-about.png)     |
| Contact   | [Grey hero](before-contact.png)   | [Unified canvas](after-contact.png)   |
| Full Home | [Grey hero](before-home-full.png) | [Unified canvas](after-home-full.png) |

Before screenshots show the real pre-change application. After screenshots come from the frozen production build with no injected CSS. Existing assets were rendered without image edits. External Google Maps rendering is excluded consistently; the configured frame and directions destinations remain.

## Verification and ownership

The retained QA output is `runtime/desktop-continuous-light-2026-10-03/implemented/qa/`, with its own installation and build output. [Source snapshot](source-snapshot.json) records 1,677 application/configuration/test/asset paths. The sole application change since the preceding tested theme is the hero-surface token alias. Node remains 24.21.0 and the retained npm lockfile is unchanged.

Verification results and screenshot hashes are recorded in [verification.json](verification.json). The earlier theme's complete unit and route audit remains in [its receipt](../desktop-cool-off-white-2026-10-03/README.md); this follow-up rechecks the changed surfaces and their existing desktop/mobile interactions.

- Svelte: zero errors and warnings. Scoped formatting, full ESLint, architecture, assets and the frozen production build pass.
- Production: 156 BG/EN route/viewport states at 320/390/1440px, including 56 desktop states, with expected status and zero page errors, broken visible images or horizontal overflow. Existing hero/reflow tests also cover 768/1024/1920px.
- All 100 mobile screenshots and measured presentation records match the preceding theme at 320/390px, including About. This comparison uses matched Vite development captures; development and production line-height serialization can differ by 0.0001px, so they are recorded separately rather than claimed as identical.
- The source-rendered production Home, About and Contact have identical computed shell/header/hero background colours. Eight desktop routes and full Home are retained in the interactive comparison. The frozen source digest is `415c8e6f4c3f2eac5fa441d47bf561e187985691b60f322ab6d9a2d22bb4e1a6`; every canonical application path matches the tested snapshot.

The full `npm run verify` command still stops on three unchanged formatting files: `public-assets.policy.json`, `scripts/public-asset-retention.mjs` and `svelte.config.js`. The browser run passes 47 tests, skips 22 intentionally, and exposes one unchanged assertion in `tests/style-parity.e2e.ts:44`: it expects the All filters button's old `strong` class, while the current discovery panel uses `secondary`. That component and the test are byte-identical to the preceding theme's QA source; the canvas token cannot change a Svelte class. No gate was weakened or unrelated UI variant changed. Task-owned formatting and the remaining relevant gates are recorded separately. Unrelated source, inherited ignore edits and historical drafts are preserved.

Work remains in the canonical Import master on Cars `main`. The maintained contracts are [Desktop styling](../DESKTOP-STYLING.md) and [QA](../QA.md). Template promotion, dealer deployment, hosted verification and further owner visual acceptance remain separate.

Scoped integration encountered an empty index lock last written at 10:23:36. The exclusive probe succeeded and no Git write was active. The original was preserved under `runtime/desktop-continuous-light-2026-10-03/implemented/recovery/index-2026-10-03-102336.lock`, with its timestamp and recovery receipt. A subsequent unheld empty lock, unchanged across repeated probes from 20:12:42, was preserved in the same recovery directory before scoped staging. No lock, index or recovery evidence was deleted.
