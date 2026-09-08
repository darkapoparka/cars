# Blog navigation and publication follow-up — 8 September 2026

## Owner correction: populated template blog

The owner rejected the empty local blog. It is superseded by six complete authored guides in `src/lib/data/editorial-guides.ts`, covering inspection, pre-viewing questions, comparing listings, test drives, sale preparation and listing photos. The standalone template serves these files; a configured CMS remains authoritative, including when empty or failing. No CMS writes occurred. Dates reflect this content's creation on 8 September 2026; no fabricated author bylines are displayed.

Removed the article's repeated intro/summary text, generic quote and unrelated image pair. The index retains the desktop feature/grid/sidebar and compact mobile cards, with two useful categories and search.

Current evidence: `guides-viewport-1440.png`, `guides-viewport-390.png`, `guides-article-1440.png`, `guides-article-390.png`, and `guides-verification.json`. Both widths show six cards, working sale-category filtering and search; all six article routes return 200 with three substantive sections and no broken images. Earlier empty-state screenshots and results below are historical.

Scope: `J:/cars/templates/carwow`, preview `http://127.0.0.1:6463/`. Independent template directory without Git metadata; existing source changes retained. Listener PID 77972 was verified before this change. No commit, deployment, database mutation or client-copy update.

Carwow's current primary navigation includes News and Reviews. News links to https://www.carwow.co.uk/editorial/news; its menu also exposes car news and advice. Source inspected on 8 September 2026: https://www.carwow.co.uk/.

## Result

- Shared primary navigation adds “Блог” after “За нас”; the mobile menu gets the same route with a newspaper icon. Desktop active routes expose `aria-current` and an underline.
- Blog footer labels are consistent. The index breadcrumb strip is removed, with a compact title and honest empty state when nothing is published.
- Index, article routes and sitemap use the existing dealer-scoped published-post loader. Unconfigured local CMS and empty published collections no longer trigger sample article fallback. CMS errors return 503; unpublished or unknown article URLs return 404. Blog routes render dynamically.
- Static article examples remain in template source. The fixed sample article is excluded from the sitemap. Financing resource cards now link to real FAQ, calculator and Sell routes without invented article dates/bylines; the presentation guide links to the blog index.

## Verification

- Framework check: 0 errors, 0 warnings; production build passes.
- Four focused source-loader tests pass: no database, empty published collection, published records and CMS error.
- Svelte autofixer reports no issues for changed components. The UI scanner's one focus-ring finding was reviewed and retained as keyboard feedback.
- Browser navigation from home to blog passes at 320, 390, 430, 1024, 1280 and 1440px. No page errors, horizontal page overflow or index breadcrumbs.
- Sample article returns 404; sitemap returns 200 and excludes that sample.
- Screenshots: `blog-current-1440.png`, `blog-current-390.png`, `blog-mobile-menu.png`. Raw browser checks: `blog-verification.json`.

The earlier `before-after.html` records the preceding repair with sample content. These newer captures supersede its blog route's final appearance. Actual CMS login, creating an approved article and verifying public publication remain untested without a configured CMS. No articles were created or published.
