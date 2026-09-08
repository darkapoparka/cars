# Template shortlist — fresh source-preview audit

Reviewed 2026-09-06 at 1440 × 900 and 390 × 844. This is an audit and refresh inventory; no template or client application files were changed.

## Recommendation

Use **Auto Best as the default**, **Modern for compact stock browsing**, and **Carwow as the third general dealer direction**. Keep Import as a specialist reserve. Carwow wins the desktop comparison against Import and narrowly wins the complete mobile dealer experience. Import wins the mobile homepage's speed of reaching actual stock and has useful direct enquiry and import-request patterns.

| Source preview | Exact J: key | Recommended role |
|---|---|---|
| http://127.0.0.1:5173/ | `auto-best` | Main template; strongest overall dealer presentation |
| http://127.0.0.1:6212/ | `modern` | Compact stock-first alternative; desktop polish still needed |
| http://127.0.0.1:6517/ | `carwow` | Third general dealer template; distinct desktop direction |
| http://127.0.0.1:6518/ | `import` | Reserve for import-focused leads and useful service-flow patterns |

These are visual/product judgments, not conversion measurements or production certification.

## Carwow versus Import

| Area | Winner | Evidence and tradeoff |
|---|---|---|
| Desktop home | Carwow | Stronger typography, centered search hierarchy and consistent inventory presentation. Import's broad dark filter container dominates the hero and its heading/body typography feels less consistent. |
| Desktop inventory | Carwow, narrowly | Clear prices and compact specifications; search and shortcuts work. Import has a shorter banner and reaches stock sooner, but repeated large red detail buttons add weight to every card. |
| Desktop detail/contact actions | Import | The inspected detail puts viewing and call actions in the visible price panel. Its contact form appears sooner because its hero is shorter. Carwow's detail spends more of the first viewport on the title, gallery and finance information. |
| Mobile home | Import | Actual stock appears around 300px down. Carwow first shows repetitive budget artwork, including two zero-stock budget categories, before actual vehicle listings. |
| Mobile inventory | Carwow | Roughly four complete rows fit above the dock, compared with about three on Import. Consistent image/info geometry, clearer compact specifications and a more coherent outlined navigation family. |
| Mobile detail | Close | Both expose price and contact actions quickly. Carwow has direct call/Viber; Import has an in-page enquiry sheet and call. Import's large image crop hides more of the car in the initial viewport. |
| Mobile contact/sell | Carwow for presentation | Contact puts a short form directly on the page. Sell has a clear registration-number start and explanatory cards. Import's manual make/model/year/mileage start is practical and less decorative. |
| Import-specific browsing | Import for scope | Country controls, link/VIN entry and a sourcing-request entry exist. The page explicitly has no published import offers; its domestic inventory is a separate section. Carwow also has a real tailored import journey at `/contact?intent=import`. |

## Fixes before broad reuse

1. **Carwow mobile homepage:** remove or replace zero-stock budget destinations in each personalized copy; repeated identical car artwork makes the first screen feel unfinished. Screenshot: `screenshots/shortlist-carwow-home-390.png`.
2. **Carwow overlay focus:** Escape closes the mobile inventory filter dialog but focus falls to the page body instead of returning to the filter trigger. Auto Best, Modern and Import returned focus to their triggers in the same check. Evidence: `shortlist-interactions.json`.
3. **Carwow floating chat:** the large helmet mascot covers card/detail content on mobile and adds noise to desktop. Its inclusion and identity need a deliberate template decision.
4. **Import menu dismissal:** Escape left the mobile menu open. Its explicit close control worked. This is separate from the filter sheet, which did close with Escape and restore focus.
5. **Import presentation consistency:** normalize typography and card/navigation icon treatment in a future shared polish task. Mobile home truncates a long car title awkwardly; desktop repeats visually heavy detail buttons.
6. **Import image loading:** initial home screenshots showed blank vehicle-image slots. Fresh settled captures showed the images loaded. Do not classify those as permanently broken assets or infer public-network performance from this local test.
7. **Modern desktop:** useful stock density, but the heavy rounded dark header, long filter rail, weak dealer-story hierarchy and inconsistent image crops make it a weaker pitch surface. Mobile is much stronger: compact rows, clear price hierarchy and immediately accessible stock.

All retained dealer facts, inventory, reviews, response-time promises and media still require the existing personalization checks. None of these source-branded previews is a generic or sendable new-lead demo.

## Rendered coverage

- All four: entry, inventory, one vehicle detail and contact at both widths; mobile filter open/close and focus return.
- Carwow and Import: sell and actual import-entry routes at both widths; desktop and mobile keyword search; mobile menu opening/dismissal. Import's detail enquiry sheet was opened without submitting.
- Carwow desktop search returned eight BMW vehicles at `/inventory?q=BMW`. Import desktop search returned BMW inventory at `/inventory?layout=classic&keyword=BMW`; mobile search used `/inventory?q=BMW` and reported 15 results. The different inventories are source data, not comparative coverage claims.
- Carwow mobile keyword search filtered to BMW while leaving `/inventory` unchanged in the address bar. Its filter state is therefore not represented by that URL; persistence across reload/history was not qualified.
- Actual offered routes checked returned 200, with no positive document overflow or captured console/page errors in the route sweep. All four had no completed-but-broken images at the point measured; pending images needed the separate settled check above.
- A guessed `/import` path on Carwow returned 404. The actual navigation links to `/contact?intent=import`, which rendered the correct tailored import page at both widths. The guessed path is not an identified broken navigation link.
- This was local Chromium viewport QA, not physical-device, public-preview, backend or message-delivery acceptance. No forms, calls or external messages were submitted. No framework build was needed for an audit with no application changes.

Evidence: `results-shortlist-refresh.json`, `results-shortlist-followup.json`, `shortlist-interactions.json`, `shortlist-desktop-search.json`, and fresh `screenshots/shortlist-*` / `screenshots/*-shortlist-interaction-*` captures.

## Confirmed runtime and source identity

J:/cars is not a Git repository. Each listener's working directory and command were inspected; all four are the original M: source projects, not the J: library previews.

| Key | PID | Physical source folder | Branch | HEAD | Dirty entries |
|---|---|---|---|---|---:|
| auto-best | 51708 | M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/autodeal-best-day-night | main | ab92ce9671fb1b56afa38f693755b41aee9c28b0 | 56 |
| modern | 57312 | M:/leads-cars/projects/bulgaria/day-night-auto-group (runtime: apps/web) | codex/mobile-header-contact-refinement | 7c635fee1c8fadca317a8a65d5887c0c455b021d | 53 |
| carwow | 54884 | M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/spartak-style | codex/6517-canonical | 9f05da01000d9177226b19f6d5dd8e5531964948 | 121 |
| import | 64552 | M:/codex/agency-os-projects/leads/automotive/day-night-auto-group/bohemcars-style | codex/about-contact-hero-refinement | 48facd336a99647988bc55419eef2f4bbdfa362e | 111 |

Exact remotes and dirty-file lists are retained in `shortlist-drift.json`. Existing processes and dirty work were preserved.

## Concrete refresh inventory

SHA-256 comparison used each J: `.template/source-manifest.json` as the baseline, then compared the current source and library files. The existing copy helper's exclusions were retained. Counts include source, assets, documentation and relevant scripts; they are not counts of UI components.

| Existing master | Changed/new source files missing from saved snapshot | Independent library differences |
|---|---:|---|
| templates/auto-best | 57 | README.md |
| templates/modern | 43 | README.md; generated apps/web/next-env.d.ts |
| templates/carwow | 32 | README.md |
| templates/import | 27 | README.md |

The identified differing source files do not overlap these independent library differences. The complete path-level inventory is in `shortlist-drift.json`. No missing destination-only files beyond the baseline were claimed to have been exhaustively inventoried by this script.

Recommended next implementation: refresh Auto Best first, Modern second, Carwow third; keep Import as a reserve refresh. Preserve a recoverable baseline, apply only reviewed reusable source deltas, retain J: docs/runtime adaptations, version the masters and update provenance. Do not blindly overwrite a destination with an entire source folder. Install only if the retained dependency/lockfile changes require it, run the documented framework checks, then verify the refreshed J: masters on explicitly free library ports. Existing client copies remain independent.

The comparison and delta inventory are complete. Template synchronization, shared UI fixes and catalog/version changes have not been applied.
