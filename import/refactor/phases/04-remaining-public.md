# 04 — Remaining public pages

**Status:** Planned — not implemented by this audit.  
**Findings:** F08–F15, F22–F27.  
**Shared gate:** [Testing and quality](../10-testing-and-quality-gates.md).

**Goal:** make the remaining supported public site use the same coherent native contracts. Depends on the established shell and shared domain/controls.

### P04-1 — Homepage composition

Migrate `HomeFiveTemplatePage`, hero, featured vehicles, browse sections, action bands, reviews and news to explicit native data/composition. Remove parent selectors that restyle cards and CSS order rules that conceal reading-order problems. Preserve approved imagery and mode-tab behaviour. Make editorial featured selection explicit rather than an accidental static-only data path.

### P04-2 — Comparison and saved vehicles

Migrate `AuxeroCompareTable.svelte` by table/row/action responsibility and shared facts. Keep purposeful mobile composition, stable columns, readable horizontal behaviour and accessible comparison semantics. Reuse the garage context and card contracts for favourites/compare entry points.

### P04-3 — Supporting content

Migrate contact, about, services, FAQs, reviews, blog/list/detail, calculator and legal page families in reviewable groups. Adopt consistent reading widths, heading rhythm, controls and empty/error states. Avoid a new component for each trivial paragraph, and avoid a separate style system per page.

### P04-4 — Locale and metadata

Replace label-string locale detection and hardcoded dealer head text with explicit locale/site/page data. Align canonical URLs, published routes, sitemap and structured data with approved configuration. Review duplicates in rendered/accessibility output, including repeated carousel items and headings.

### P04-5 — Route disposition

Classify `/home-clean`, `/home1`, `/home1-tabs`, `/home2`, `/compare-clean`, `/offer` and catch-all/raw aliases. Implement only approved removals/redirects. Update navigation/sitemap and tests together; unadvertised does not mean unreachable.

### Exit and handoff

Every retained public route is listed with its shell, data source, stylesheet/runtime dependencies and QA evidence. Migrated routes have no imported HTML/script payload. Mobile appearance is preserved. Any route still in compatibility mode has a concrete next owner/removal task, not an indefinite flag. Roll back by page family when a shared reset or metadata change affects unrelated routes.
