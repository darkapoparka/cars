# EAI-203 — Contact alignment and official About photo

The rectangular About-photo treatment was rejected by the owner and superseded by `EAI-106-MEDIA.md`. The Contact alignment correction remains preserved. The report below records the earlier result.

Owner-requested correction, 2026-09-05. READY FOR OWNER REVIEW.

## Scope

- `ContactCleanPage.svelte`: add bottom object alignment to the two desktop vehicle images. Their image boxes already matched the other banners; centered fitting put the visible cars higher.
- `AboutContent.svelte`: replace the unrelated Kristian portrait with an original photo published by ELIQ AUTO, using descriptive alt text without asserting the presenter's name or employment.
- `PageBanner.svelte`: add an opt-in photo variant with a CSS crop, 8px corners, and the existing right-hand image lane. Existing variants are unchanged.
- New asset: `static/assets/eliqauto/hero/about-eliq-gls-official-v1.jpg`.
- Status/evidence documentation only otherwise. No sections, flows, routes, dependencies, or mobile design changes.

## Asset provenance

- Official website: https://eliqauto.com/
- Official media feed: https://eliqauto.com/data/media.json
- Feed item: `7669939643659357442`, caption `GLS отблизо`.
- Original image: https://eliqauto.com/assets/video/7669939643659357442.jpg
- Corresponding TikTok: https://www.tiktok.com/@eliqautopremium/video/7669939643659357442
- Retrieved 2026-09-05. The local JPG is an unchanged copy of the official 304×540 poster. Display cropping is CSS only. Its source resolution limits enlargement.
- A built-in image-tool background extraction was evaluated and rejected: it returned an opaque checkerboard and reconstructed details. No generated image is referenced by the application. Prompt: remove the showroom background only, retaining the exact presenter and white GLS, with true transparent RGBA and no subject changes.

## Evidence and checks

Evidence root: `C:/Users/radev/.codex-artifacts/eliq-banner-assets-20260905/`.

- Before and after screenshots: `before-{route}-{width}.png`, `after-{route}-{width}.png`; final post-build verification: `final-{route}-{width}.png`.
- Viewports: 390×844, 1024×900, 1280×900, 1440×900, 1920×900. Routes: `/about`, `/contact`, `/services`, and final `/inventory`.
- Initial `/cars` captures resolved to the fallback route and are excluded from inventory evidence. Inventory source was untouched; final renders are preservation checks, not a before/after comparison.
- The Services screenshots are byte-identical before/after at all five widths. About and Contact mobile screenshots are byte-identical. All captured action hrefs and labels are unchanged.
- At 1440px, Contact and Services vehicle boxes both run from y=174 to y=364 with bottom object alignment. Both banners remain 300px tall. About retains the same left vehicle and title/actions.
- `npm run check`: 0 errors, 0 warnings.
- `npm run build`: passed from the physical checkout.
- Focused Prettier on the three changed components: passed. Focused ESLint aborted with a Node out-of-memory error, so it is not a passing check. Final post-build matrix: all 20 route/viewport renders returned successful pages, with no page errors or horizontal overflow. All visible banner assets loaded.
- Keyboard focus on all About/Contact banner links passed; Enter on About's vehicle action reached `/inventory`. About and Contact at CSS 200% zoom had no horizontal overflow. External phone, email, and map destinations were inspected without activating them.
- `npm run lint`: blocked by repository-wide formatting/parser issues; 40 files reported. No broad formatting changes made.
- `npm run test:unit -- --run`: 186 passed, 38 failed across data/server/API/CMS suites. No banner logic is involved in those failures. The existing ledger already records failures in those areas; this run does not establish an exact pre-change count.
- Svelte autofixer: About and PageBanner clean; Contact reports existing dynamic external hrefs, which already pass through `linkHref` and resolve internal URLs. UI scan flags the existing form focus ring, outside this edit.
- No browser flow changed, so no full e2e suite. Browser verification covers image loading, banner geometry, overflow, existing action destinations, and mobile preservation.
- Existing duplicate header branding at 1024px is visible in before and after evidence and remains outside this banner correction.

## Worktree and delivery

Checkout: physical `M:/codex/agency-os-projects/leads/automotive/eliq-auto/bohemcars`, accessed through the supplied workspace junction. Branch `codex/home-desktop-polish-0904`, starting HEAD `f5f9d924171c347345b39781f8fb034e15ed6aa9`. Existing listener 6404 served the expected ELIQ routes. Running Svelte sync through the junction briefly produced invalid generated import paths; regenerating through the physical checkout restored them.

The three changed components already contained substantial uncommitted owner work. This correction depends on that work, so it remains uncommitted rather than recording an incomplete commit or including unrelated changes. Nothing pushed. Existing portrait files were preserved.

Incremental application diff against saved start-of-turn files: About 3 lines added/3 removed; Contact 2 lines added; PageBanner 11 lines added/1 removed; one 28,766-byte original JPG. Within the three-component, no-new-flow budget.
