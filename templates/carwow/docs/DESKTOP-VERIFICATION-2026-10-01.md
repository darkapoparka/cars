# Desktop composition and loading correction — 1 October 2026

The default desktop home, catalogue and vehicle detail have been corrected in the reusable Carwow master. Mobile presentation, original inventory data/images and shared design tokens were preserved. This is local production-preview verification, not template promotion or hosted acceptance.

## Source and runtime

- Canonical folder: `L:/CODEX/cars/templates/carwow`, parent repository `darkapoparka/cars`, working branch `main`.
- Audit began at Cars commit `437c9d24b`; unrelated Cars template/dealer changes and other writers' commits were preserved.
- Build and checks: Node 24.21.0, retained npm lockfile. Preview: `http://127.0.0.1:6464/en`, Vite production preview. The previous development listener was replaced with the verified production preview.
- Cars workspace doctor was fetched/inspected before implementation and again before committing. No release selection, dealer refresh, deployment or outreach was run.

## Corrected behavior

- Replaced the accumulated desktop home sheet and competing component overrides with one scoped composition owner. Source CSS fell from approximately 249KB / 9,281 lines to 14,057 bytes / 541 lines, with zero `!important` declarations in that sheet. `DesktopHome.svelte` now composes sections without its former 1,355-line override block.
- Unified desktop search/filter/chip treatment and readable flat card geometry. The catalogue defaults to four columns, with three at smaller desktop widths; explicit density settings remain available. Category counts include the existing SUV alias, and empty counts have readable contrast.
- Pinned the existing client CSS targets for both builds so server/client URL imports emit one identical home/detail stylesheet. Desktop navigation waits for destination CSS before replacing the current page. Desktop no-JavaScript loading remains supported.
- Removed a redundant CSS hide rule from the already-exclusive desktop home branch. It caused a blank WebKit home at 992px despite JavaScript selecting the desktop composition. Mobile still renders its own exclusive branch.
- Sourced larger versions of the same first listing photos for 24 of 40 cars. Desktop cards choose accurate 320/640px derivatives; detail uses 1280px. The other 16 listings returned empty source pages and retain their original thumbnails. No gallery photos or inventory claims were invented. Provenance: `DESKTOP-PHOTO-SOURCES-2026-10-01.json`.
- Desktop video thumbnails load without embedded players; activation opens one player, closing removes it and restores focus. Play icons/durations explicitly retain white contrast against the dark controls. Below-fold desktop review/action imagery is lazy-loaded.
- Desktop card/map badges follow the inventory data. Map photo counts use the actual gallery length; fabricated price/photo/video badges were removed.

## Production CSS evidence

Sizes are decoded output bytes, not compressed transfer sizes.

| Asset              |                                            Before |                                                                   Final |
| ------------------ | ------------------------------------------------: | ----------------------------------------------------------------------: |
| Desktop home CSS   | 216,583 client / 215,630 server, different hashes | 11,559, one identical hash (94.7% smaller than the former client sheet) |
| Home component CSS |                                           106,803 |                                                                  74,704 |
| Shared root CSS    |                                           234,039 |                                234,039, identical `0.CqibbjdF.css` hash |

## Verification

- Production build passed, including localization catalog validation and Vercel adapter output.
- Svelte/TypeScript: zero errors and warnings. Scoped ESLint and formatting passed. Typography check passed across 296 source files; scoped `git diff --check` passed.
- Unit tests: 187 tests across 22 files passed.
- Final Chromium desktop suite: 24 tests passed. Coverage includes cold CSS navigation, single CSS URL, desktop without JavaScript, video/focus lifecycle, native home variants, 991/992px selection and resizing, 1280/1440/1920px layouts, filters/search, saved/compared state, sell/import handoffs and mobile preservation.
- Final focused WebKit suite: six tests passed, covering cold detail navigation, one home CSS URL, the 992px home/resizing regression, mobile image/composition preservation, desktop without JavaScript and video/focus lifecycle. An expanded WebKit multi-route crawl stalled in the local worker and was stopped; full WebKit route acceptance is not claimed.
- Original hashes were retained for all 126 checked mobile components/styles, original inventory photos/data and shared tokens/base styles. Final mobile home/detail do not request desktop-only photos or home/detail CSS.
- Final mobile acceptance: all 17 existing English-flow Chromium tests passed on the production preview after the desktop corrections. The known 200% text failures from the earlier mobile audit are outside this suite and remain open.

## Download weight and remaining limits

The existing desktop weight audit read 15 routes at 1440×900. All returned HTTP 200 and loaded no legacy template scripts, `app.css` or Google Maps scripts. These totals are decoded response bodies from a local production preview, not LCP, field performance or a comparison against other websites.

| Route          | Decoded initial payload | Existing initial budget |
| -------------- | ----------------------: | ----------------------: |
| Home           |                  3.16MB |                   4.8MB |
| Catalogue      |                  2.51MB |                   2.7MB |
| Vehicle detail |                  1.66MB |                   4.6MB |
| Map            |                  2.09MB |                   5.6MB |
| Favorites      |                  1.75MB |     1.2MB — still fails |

The shared language chunk remains about 464KB decoded, and the root stylesheet remains 234KB. Those common mobile/desktop owners were preserved under the desktop-only instruction. Several aspirational target budgets remain unmet. Favorites is the one failure of the existing initial desktop weight gate; do not describe that gate as passed.

`check:architecture` still flags the pre-existing unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. That mobile source was preserved rather than deleting it or suppressing the gate. The previous mobile audit's 320px / 200% text clipping remains open; no mobile styling fix is included here. Sixteen catalogue photos still have only the original 280×210 source. Physical-device, authenticated/backend and hosted performance acceptance remain separate.

## Evidence

Ignored local artifacts: `.audit/desktop-2026-10-01/`. Key files are `home-desktop-after.png`, `home-desktop-full-after.png`, `inventory-desktop-after.png`, `detail-desktop-after.png`, `videos-desktop-after.png`, `mobile-home-before.jpg`, `mobile-home-after.png`, `e2e-desktop-final.log`, `e2e-webkit-focused-final.log`, `e2e-mobile-final.log`, `unit-final.log`, `build-final.log`, `built-css-before.json`, `built-css-final.json`, `desktop-weight-final.log` and `mobile-source-preservation-final.json`.

Codex in-app tab inspection timed out during the final pass; final screenshots and checks came from the purpose-built browser QA suite against the same port-6464 production preview.
