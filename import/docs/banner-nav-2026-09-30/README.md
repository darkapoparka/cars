# Commerce banners and mobile navigation revision

Current local source: Cars `main`, `L:/CODEX/cars/templates/import`, HEAD `807e2d6ee76aaa26fc08ffab64221faece3a2fdb`, Node 24.21.0.

The owner selected the rendered Cars App banners at `http://localhost:3001/bg/` as the visual reference. The Sell service, menu and homepage campaigns now use its Cars-owned automotive campaign artwork: charcoal backgrounds, recognizable cars and service objects, live titles and white pill actions. Homepage and menu campaigns share `src/lib/components/common/CommerceBanner.svelte`. The short Sell title remains on one line at 320px and 390px in both languages. Menu navigation and both VIN/manual valuation modes remain working.

All three guide covers now use brighter silver/white service compositions. The inspection and appraisal assets reuse existing Cars App art; the registration cover was generated with the built-in image tool using the inspection art as a style reference. Centralized `src/lib/data/blog.ts` image paths also update blog detail and social metadata. Article cards show the complete source composition. The shared contact banner now uses the same reference artwork.

The bottom navigation uses the original detailed Hugeicons outline family. Direct per-icon imports replace the 7,700,365-byte development barrel with five modules totaling 6,174 bytes, without changing SVG shapes. `src/lib/types/hugeicons.d.ts` supplies type-only declarations because the package exposes per-icon JavaScript but ships declarations only for its barrel.

## Verification

Additional owner-requested polish: the mobile PDP Info tab and desktop description now use white containers with darker copy and preserved paragraph breaks. The menu locale control is a full-width 64px white button with a globe, a 16px title, current language and a chevron; its existing route, selector event and focus handoff are retained. Browse by type's View all tile now uses three front-facing realistic cars on the same white surface as adjacent types. [Asset and exact prompt](../assets/ALL-CARS-TILE.md).

Fresh checks after these changes: Svelte zero errors/warnings, scoped ESLint passed, production build passed (`build-latest.log`), six commerce browser tests passed with one desktop-only case skipped. Seven additional checks passed: English/Bulgarian vehicle gallery, specs and inquiry journeys at 320px, 390px and 1440px, plus native locale dialog WCAG checks. In-app screenshots and DOM measurements confirm white PDP cards at 320px/390px/1440px, no horizontal overflow, a 292px-wide/64px-high menu locale button at 320px in both languages, opening of the existing locale selector, and the loaded three-car image on a white View all card. Evidence: `pdp-description-white-en-390.png`, `menu-language-button-en-320.png`, `menu-language-button-bg-320.png`, `types-all-cars-en-390.png`. The development listener was restarted after the build invalidated its live locale module; the real home route returns HTTP 200 again.

Menu containment correction: the compact banner's `aspect-ratio: 2.1` made its rendered height exceed the grid row reserved for it. At 390 x 568 the banner overlapped the contact buttons by 16.375px; at 320px it could also exceed the body width. The compact variant now uses automatic height with a 144px minimum, full available width and zero automatic minimum width. Fresh in-app measurements show a 144px banner and a 12px gap before Call/Message at both 320px and 390px. `menu-overlap-fixed-en-320.png` and `menu-overlap-fixed-en-390.png` show this correction. The added browser regression checks the contact gap and horizontal containment in eight English/Bulgarian width/height combinations, including 568px-tall phones.

- Svelte check: zero errors and warnings.
- Scoped ESLint and Prettier checks passed for the affected source and tests.
- Image signature checks: 854 local images passed. Architecture: 57 native route modules and 194 reachable modules passed.
- Production build passed. Existing compatibility CSS `@reference` warnings and plugin timing notices remain.
- Browser checks against the local dev server: 15 passed, 11 inapplicable cases skipped. Coverage includes English/Bulgarian at 320px/390px, desktop 1440px, all article cover loads, contact banner reflow, menu-to-Sell navigation, both valuation entry modes, menu accessibility, footer/navigation behavior, one-line Sell heading fit, no mobile Sell artwork download on the desktop Sell route, and no full Hugeicons barrel request. New commerce journeys captured no page errors.
- Saved screenshots were inspected for the Sell card, homepage campaigns, menu, contact banner and registration article. Current examples: `sell-commerce-en-390.png`, `home-commerce-en-390.png`, `home-commerce-en-1440.png`, `menu-commerce-bg-320.png`, `contact-commerce-en-320.png`, `article-commerce-en-390.png`.

## Runtime diagnosis

The original 5174 listener stopped earlier and was restarted with the retained Node 24 runtime. Current inventory HTTP responses were 59-115ms; the new Sell artwork returned HTTP 200 in 5ms. The previous oversized icon module was removed from current page requests. The in-app browser still intermittently times out on focus, scroll and screenshot commands; that is separate from the responsive HTTP server. A fresh in-app tab loaded the Sell card and opened its valuation dialog. Repository Chromium tests passed the affected journeys.

Port 3001 was initially absent, then the Cars App Node 22 listener became available. Its homepage and selling campaign were inspected in the in-app browser at 390px.

## Delivery state and preserved work

These are local source/build/browser results. No template release promotion or dealer deployment was performed. Existing staged/unstaged/untracked work and all superseded artwork were preserved. `ArticleCard.svelte` already had pending mobile title sizing and clamping; those edits remain intact.

Commit/push is blocked by the existing `L:/CODEX/cars/.git/index.lock`, zero bytes, timestamp 30 September 2026 07:24:30 Sofia. It was not deleted or bypassed. The original nine unrelated staged paths remain intact. Current task changes are uncommitted on the saved main folder.

An earlier temporary snapshot `e48752ddb447ba75d84eebc8025b848ff680518a` remains recoverable in the main reflog and as `runtime/banner-nav-20260930/reviewed-snapshot.patch`; it predates this commerce revision. Main was restored to the original `807e2d6ee76aaa26fc08ffab64221faece3a2fdb` without restoring/resetting working files. That earlier push was interrupted without confirmed remote completion. Do not use the old snapshot as the final change. Next action: reconcile the shared index lock with its owner, review the current changed files, then make a scoped commit and non-force push.

Current asset mappings and exact generation prompt: [Commerce artwork](../assets/COMMERCE-BANNERS.md). Sell details: [Sell provenance](../assets/SELL-MOBILE-BANNER.md). Icon provenance: [Navigation icons](../assets/MOBILE-NAV-ICONS.md).

The retained `sell-en-390.png` shows a superseded two-line draft and is not current acceptance evidence.
