# Desktop section layouts — 2026-10-02

The desktop layouts mixed a featured-video grid, a featured-article layout, large dark service cards and an oversized photo/text About introduction. Home and Inventory also used different task-panel widths and nested field surfaces. These choices made sections disproportionately large and inconsistent with the compact vehicle grid.

## Implemented contract

- Home videos: three equal 16:9 official thumbnails in a white panel, clipped on all four corners. Titles remain accessible; no captions below. Players are created on activation.
- Home discovery: centered tabs that fit their labels, with a white search input and the existing mode drafts, filters and search actions.
- Inventory: a contained 1040px hero task panel, full-width search and wrapping shortcuts aligned with its filters. The shared 1320px vehicle frame and four/five-column card density remain intact.
- Services: five white cards per desktop row, 16:9 photography, 18px headings and two-line 14px description previews. All six services and request preselection remain available. Hero shortcuts are compact links.
- About: a centered white introduction below the hero, with a 28px heading and existing copy/contact action. The oversized first-section photo split is removed; other content and functional map/contact layouts remain.
- Blog: a regular four-column article grid, with three columns at 992–1199px. Category/topic pills, search and clear actions preserve URL state and Back behavior. Featured-post and sidebar layout code is removed.
- Services, About and Blog use the existing 1320px desktop content frame and matching gutters.

Mobile components, data, assets and base tokens are preserved. The mobile branch in `BlogIndexPage.svelte` matches its pre-edit source exactly. These changes do not promote a template release or update dealer copies.

## Verification

- Pinned runtime: Node 24.21.0, retained npm lockfile.
- `npm run check`: zero errors and zero warnings.
- Scoped ESLint and typography checks: passed.
- `npm run test:unit -- --run`: 187 tests across 22 files passed.
- Protected mobile/data/assets/base-style source comparison: 125 files checked; zero changes.
- `npm run build`: passed with the pinned runtime.
- Chromium desktop suite: 28 tests passed (`desktop-loading`, `desktop-discovery`, `desktop-sections`). Home/Inventory cards and controls remain functional; new section checks cover English/Bulgarian at 992, 1280, 1440 and 1920px, service request preselection, Blog category/topic/search combinations, empty results, Back and reset.
- Existing mobile Services and Blog functional tests: both passed, including 320px overflow checks, filter combinations, article navigation/history and a mocked service request.
- Mobile before/after render signatures: all nine valid baseline views match exactly at 320/390px across Home, Inventory, Services, About and Blog. The original 320px Services capture was blank before its mobile composition loaded; the failed comparison and blank screenshot are preserved. Its current populated view and existing functional test were verified separately. This is not a claim of ten valid paired comparisons.
- Native in-app browser review: three equal decoded YouTube thumbnails, five white service cards per row, the compact About intro, regular Blog cards and filter pills. Home and Inventory screenshots also confirm the tighter controls and preserved vehicle-card hierarchy.
- Preview: pinned Node process on `127.0.0.1:6464`; Home, Inventory, Services, About and Blog return HTTP 200.

Screenshots are in the audit folder's `before/`, `after/` and `final-visuals-settled/` directories. The final set waits for visible images to decode before capture. `mobile-baseline-review.json` records the invalid baseline separately from actual changes. Chromium is verified; WebKit and hosted pages were not rerun for this task.

Local evidence is retained in `.audit/desktop-section-layouts-2026-10-01/`. The folder records the start date; verification completed after midnight on 2 October in Europe/Sofia.

This is local source/build verification. Public aliases, dealer refreshes and owner visual acceptance remain separate facts.
