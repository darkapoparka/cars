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

## Follow-up: desktop filters, banners and content panels

The owner requested a final desktop pass after the first correction, using the current [Carwow homepage](https://www.carwow.co.uk/) as inspiration. Its compact task links, clearly grouped content and consistent spacing informed this pass. Day Night Auto retains its existing identity, imagery, content and routes; the white video/review containers are a deliberate choice for this template.

- Inventory shortcut pills now align with the filter triggers, with 12px between rows and 8px between chips. Removed the repeated hidden SVG markup and competing red selected-state rules. Keyboard selection retains focus, the URL filter and the black selected state/remove affordance.
- Buy / Sell cards use one grid owner in `DesktopHomeReviews.svelte`. Removed the conflicting flex/absolute-positioned composition rules and local override chain. Both cards have a 272px minimum height, grow for longer copy, keep illustrations in their own column and use the existing shared CTA component.
- The three campaign banners have a 360px minimum height, tighter copy spacing and contained illustration areas. Existing collection, viewing and financing routes remain intact.
- YouTube and reviews use matching flat white panels with neutral borders and 28px padding. Video thumbnails retain their 16:9 ratio and only create a player on activation. Review quotes use neutral inner cards; demonstration disclosure remains visible.
- WebKit exposed a second CSS hide gate on inventory at the 992px scrollbar boundary. The route already exclusively selects desktop. Removed that redundant shell gate and kept the shared hero visible inside the selected desktop inventory component, without changing its other consumers.
- Removed the desktop-only document `scrollbar-gutter: stable` rule. In WebKit, applying it at the composition breakpoint could repeatedly switch the rendered branch, losing keyboard focus and hiding images. The mobile media rules, viewport selection logic and dialog scroll-lock compensation are preserved.
- Desktop catalogue cards drop the transparent SVG candidate after mounting at a desktop width. WebKit could retain it instead of the real photograph at 992px, particularly when changing locales. SSR/mobile source guards remain in place; other callers keep the helper's original behavior.

A separate owner-authorized mobile chat edited mobile files in the same checkout during this follow-up. This desktop task did not edit those files or include them in its commit. All 125 protected mobile/data/assets/token files matched the snapshot taken after that chat's edits. The other chat's uncommitted work remains preserved. The earlier mobile verification above records the first correction, rather than acceptance of the other chat's later work.

Final follow-up production build passed. Desktop home source CSS is 10,515 bytes; its production stylesheet is 8,638 bytes with the same `daynight-home-desktop.BUZxmlDj.css` URL in client and server output. The sheet retains zero `!important` declarations. Svelte/TypeScript reports zero errors and warnings; scoped ESLint, typography across 297 source files, formatting and scoped diff checks passed.

Final Chromium: 25 tests passed. Final focused WebKit: seven tests passed, including the new inventory pills/photo/focus check in English and Bulgarian at 992/1280/1440/1920px. Both engines verified the CSS bootstrap/navigation, video lifecycle and mobile composition/asset separation. These are local production-preview checks; full WebKit route and hosted/device acceptance are not claimed.

Follow-up evidence lives in `.audit/desktop-2026-10-01/`, including `polish-accepted-chromium/`, `polish-accepted-webkit/`, `build-polish-verified.log`, `check-polish-verified.log`, `e2e-polish-accepted-chromium.log`, `e2e-polish-accepted-webkit.log` and `mobile-polish-preservation-final.json`. In-app browser inspection recovered for this follow-up, and the reference and local desktop were visually inspected there.

This follow-up does not close the download-budget, shared CSS/language weight, architecture, original-photo or hosted/device acceptance limits recorded above. It does not promote a template release or deploy dealers.

## Final desktop cards, browse tiles and YouTube artwork

The owner requested larger YouTube media without captions beneath it, rounded thumbnail corners, centered type/make headings with a final View all tile, and clearer desktop car cards. The current [Carwow used-car listings](https://www.carwow.co.uk/used-cars) informed the card hierarchy and photography proportions. This pass retains the existing Day Night identity and inventory behavior.

- Home now shows six cars in three columns. Home, catalogue, favorites and related desktop cards reuse `DesktopVehicleCardDetails.svelte`: a strong model title, transmission/fuel text, price and financing information, then year/mileage in a divided footer. Save/compare controls, actual availability, photo counts and detail links remain available. Map metadata keeps its original composition.
- Photo containers have a fixed 4:3 ratio and an absolutely positioned image link. This prevents flex sizing from giving the first row unequal photo heights. Home adopts the catalogue's existing desktop-mounted photograph guard; SSR/mobile placeholders retain their original behavior.
- Type and make headings are centered, with no heading CTA. The last tile opens all inventory: seven type tiles plus View all, and eleven make tiles plus View all. The full taxonomy remains available through inventory filters. The compact logo strip keeps its original behavior. Type/make artwork loads lazily.
- YouTube has a 196px-wide logo, one large featured thumbnail and two beside it. Captions beneath the thumbnails were removed; the video titles remain in accessible player/play/close labels. The media itself now clips all four rounded corners. Previously the radius belonged to the outer card and its caption area, leaving the bottom thumbnail corners square.
- The three official 1280×720 YouTube thumbnails were cached in a new desktop-only directory and encoded as WebP without changing the artwork. Together they use 353,742 bytes, compared with 432,524 bytes for the source JPEGs. Existing shared video data and mobile thumbnail files were preserved. No player loads before activation.
- WebKit exposed intermittent keyboard-focus loss on inventory shortcuts. Desktop activation now restores keyboard focus after the reactive updates and the next browser layout frame. Geometry and grid-column assertions retry while hydration settles, retaining the existing spacing, containment, column-count and focus requirements.

Final production build passed on Node 24.21.0. The desktop home sheet is 9,198 source bytes and 7,503 production bytes; server and client emit the same `daynight-home-desktop.C-gHG2ZJ.css` URL. The sheet still has zero `!important` declarations. Svelte/TypeScript reports zero errors and warnings; scoped ESLint, formatting, typography across 298 source files and diff checks passed. Unit tests remain 187 passing tests across 22 files.

The complete Chromium desktop suite passed all 26 tests. After the final focus correction, the inventory shortcuts and 991/992px route variants were checked again in Chromium. The screenshot/bootstrap and mobile asset checks also passed. The final focused WebKit run passed all nine tests: type/make tile navigation, shortcut geometry/filter/focus in both languages at 992/1280/1440/1920px, cold detail CSS navigation, one home CSS URL, boundary resizing, the home/catalogue/detail/map variants, mobile asset separation, desktop without JavaScript, and the video lifecycle. Earlier incomplete or failing runs are retained as diagnostic evidence rather than counted as passes.

Mobile at 320px and 390px retains its own Home/detail composition and requests no desktop-only home/detail CSS, inventory photographs or new YouTube thumbnails. All 125 protected mobile/data/assets/token files match this pass's baseline. Other chats' source work and commits were preserved; this task includes no mobile implementation edits.

Evidence is under `.audit/desktop-cards-2026-10-01/`, including `chromium.log`, `chromium-final.log`, `chromium-layout-verified.log`, `webkit-layout-verified.log`, `build-focus-layout.log`, `check-final.log`, `protected-final.json`, and the native screenshots `desktop-car-cards.png`, `desktop-browse-types.png`, `desktop-browse-makes.png` and `desktop-youtube-panel.png`. The final desktop and current Carwow reference were also inspected in the Codex in-app browser. Port 6464 serves the production preview.

The shared CSS/language payload, the existing Favorites weight-budget failure, the unreachable mobile module, sixteen original low-resolution listing photos, and physical-device/hosted acceptance limits remain as recorded above. This pass does not claim a new field-performance measurement, approve a template release or deploy dealers.
