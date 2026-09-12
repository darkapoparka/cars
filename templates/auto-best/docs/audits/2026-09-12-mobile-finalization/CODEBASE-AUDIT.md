# Codebase audit — Auto Best

Baseline and scope: see [README](README.md) and [QA coverage](QA-COVERAGE.md). Paths below are relative to `templates/auto-best`. This is an audit of the current dirty source, not the older committed version. Application files were not refactored during this pass.

## Keep the existing architecture

The useful foundation is already present: native Svelte 5 components, typed props, pure listing/editorial helpers, URL-backed filters, SvelteKit load functions, native dialogs, and a small dependency surface. Known-ID validation and confined return links in `src/lib/data/journeys.ts` protect navigation context. Finance is explicitly a principal illustration, not a fabricated loan quote. Enquiries honestly remain local until the user copies/shares them. Demo team/partners and search indexing are gated. These contracts should survive every visual change.

Do not introduce a global client store for URL state, a generic schema-driven form renderer, a CMS, an API adapter hierarchy, a new CSS framework, or a second component library to polish this template. Native HTML/CSS/Svelte is sufficient. Module-level immutable configuration is not the same as unsafe per-user shared server state.

## Confirmed defects

### C01 — Validation is red [P1]
`npm run validate` stops at `scripts/check-assets.mjs`: the fixed reference total expects 113 but finds 104, generated `.b64` files remain under public static assets, and generated image leftovers are unreferenced. Inventory the approved assets and provenance before deleting anything. Replace fragile global totals with contract checks: referenced assets exist, forbidden scratch files do not ship, approved manifests are complete, and dimensions/formats meet agreed budgets. Do not merely change 113 to 104 and declare the gate repaired. Evidence: `evidence/validate.log`.

### C02 — Homepage quick search does not lock page scrolling [P1]
At 390×844, open the homepage search and wheel over its lower area. The page scroll offset changes from 0 to 1200 while the dialog is open and remains at 1200 after Escape. `VehicleQuickSearch.svelte` has its own dialog lifecycle instead of the existing scroll-lock owner. Reuse `src/lib/ui/overlay.ts`, with release on close, cancel, destruction, and navigation. Preserve focus and original scroll offset; avoid a second overlay manager. Evidence: `edge-checks.json`, `quick-search-background-scroll`.

### C03 — Required enquiry fields accept whitespace [P1]
`VehicleEnquiry.svelte:84–90,184–185` uses native `required`/`reportValidity()` without trimming required make/model values. Filling both with spaces advances Sell to the photo/details step; later summary construction trims them away. Add a small shared normalization/validation function and field-specific feedback; run it before advancing and before constructing the final summary. Preserve optional make/model when a valid import listing supplies context. Evidence: `edge-checks.json`, `sell-whitespace-required`.

### C04 — Budget counts and filter destinations disagree [P1]
`MobileBudgetSection.svelte` counts the middle band with `price > 60000 && price <= 70000`, while its URL uses inclusive `price_min=60000`. Its upper band counts `price > 70000`, while its URL includes 70000. `listing.ts:150–151` applies inclusive bounds. Synthetic boundary fixtures reproduce both disagreements; the current stock has no exact boundary prices, so ordinary navigation tests miss them. Define budget presets once and compute counts through the same parsed filters used by their links. Decide whether overlapping boundary bands are intended; do not scatter off-by-one patches. Similar budgets are repeated in `SearchBox.svelte`.

### C05 — Body artwork leaks across breakpoints [P1]
`BodyTypes.svelte` emits both baked mobile artwork and desktop cutouts; the baked image's hide rule is scoped only inside the mobile media query. At 1440px, SUV/Комби/Купе render both versions, stretching the entire grid. At 320px, fixed 180×126 baked images crop within narrower tiles. Set explicit mutually exclusive responsive presentation and use a single artwork manifest. Evidence: `screenshots/edge-1440-dn-body-types.png`, `edge-320-dn-body-types.png`, and measured image geometry in `edge-checks.json`.

### C06 — Broken hidden-label class and dead CSS [P2]
The body-type expansion button uses `class="sr-only"`, but the application defines `.dn-sr-only`. Its supposedly hidden strong label measures about 109.5×20px on mobile. Use the existing utility and ensure a single accessible name, correct expanded state, and readable expanded/collapsed labels. Four unused selectors at `BodyTypes.svelte:101–104` generate the current Svelte warnings. Remove obsolete rules after deciding the final tile implementation, then make warnings fail the check. Evidence: `svelte-warnings.log` and `edge-checks.json`.

### C07 — Text contrast is below the normal-text threshold [P1]
Axe identified the listing keyword placeholder-like text at 4.37:1 (`#737984` on white); PDP overview labels at 3.97:1 (`#7a8089` on white); finance result labels at 4.22:1 (`#707680` on `#f4f6fa`); and its disclaimer at 4.32:1 (`#747a83` on white). Every one of the eight PDPs has the same 11 affected nodes. Fix semantic muted-text tokens and their owning selectors, not one vehicle page. Recheck hover, disabled, and image-background variants. Evidence: `accessibility.json`; rule: WCAG 2.2 SC 1.4.3.

### C08 — Artwork is eagerly over-fetched [P1]
A fresh 390px Chromium context with cache disabled fetched 12,203,050 bytes of `/assets/` image resources before any scroll; the full-page scroll reached 12,894,356 bytes. This measurement excludes JavaScript/font requests and is from local development, not a production Core Web Vitals score. Six large service/menu PNGs account for most of the bytes, including 1.5–2.25 MB originals. `FeatureArtwork`/`ArtworkRegion` do not provide a loading policy or width-based responsive derivatives, and the first four inventory cards all receive eager/high priority. Export approved artwork to appropriate responsive formats, preserve transparency and baked text quality, reserve dimensions, and lazy-load genuinely below-fold content. Do not replace the art direction or run a blind lossy conversion. Evidence: `edge-checks.json`, `cold-home-media`; `source-assets.json`.

### C09 — Test contract no longer matches the homepage [P1 gate / P2 UI decision]
`home-hierarchy-smoke.mjs:15` expects four visible body anchors, but mobile intentionally renders three stocked categories plus a button. Current measured expansion is 3→8 body anchors and 3→12 brand anchors. The suite stops on `3 !== 4` before its later assertions, and is not part of the normal smoke gate. Approve the collapse/expand design, then assert semantic links plus the expansion control and actual configured datasets. Keep DOM counts only where they express an approved layout contract. Evidence: `home-hierarchy-smoke.log`, `smoke-stages.json`, `edge-checks.json`.

## Maintainability and data ownership

The scan found 784 literal hex-color occurrences, 2,808 px occurrences, 152 media queries, and 13 `!important` occurrences across source. These are search indicators, not 3,747 bugs. In particular, the existing accessible visually-hidden utility legitimately uses `!important`; artwork dimensions and breakpoints are legitimate constants. The real problem is duplicated ownership: `composition.css`, `navigation.css`, scoped `Header.svelte` rules, and route CSS all alter the same visual systems. The mobile body-art desktop regression is a concrete consequence of patch-style responsive ownership.

Keep global CSS for reset, shared tokens, typography, container rules, and genuinely shared primitives. Put component internals in that component; put route composition in that route. Move rules while preserving computed appearance, one owner at a time. Consolidate repeated media blocks only after removing superseded declarations. Avoid a blanket formatting/tokenization change mixed with behavioral fixes.

`VehicleQuickSearch.svelte` (780 lines) and `VehicleSearchDialog.svelte` (796 lines) duplicate substantial query draft/field/serialization behavior. They need a shared typed filter contract and small reusable field/picker pieces, not one gigantic configurable form. `VehicleDiscoveryForm` and `QuickFilterSheet` already provide useful reuse. Share behavior first; leave deliberate homepage/listing presentation differences explicit. Keep URL state canonical and dialog drafts local until Apply.

### Practical zero-hardcoding contract

| Concern | One owner / rule | Current correction |
|---|---|---|
| Brand and showroom facts | Typed `config/brand.ts` | Move showroom coordinates beside the address; remove the literal district in `home/Hero.svelte`; centralize optional social profiles. |
| Inventory facts | Typed inventory records, derived labels/counts | Add explicit model/variant fields when real data is introduced; stop deriving model vocabulary by stripping display titles. Keep sample status until verified. |
| Filters and budgets | `data/listing.ts` plus small typed preset data | Derive supported options or document configured business limits; remove stale 2019–2024-only year options and inconsistent year policies; reuse budget predicates. |
| Services and journeys | `data/company.ts` / `data/journeys.ts` | Reference stable service IDs from home, navigation, footer, and contact instead of duplicating route/topic strings and positional slices. |
| Artwork | Typed asset manifest with source, dimensions, variants, crop, and semantic label | Move per-component baked asset maps into the existing artwork/data area; do not put arbitrary CSS coordinates into business configuration. |
| Finance policy | Small typed finance configuration and pure calculation helper | Own terms/defaults/step in one place; preserve principal-only disclaimer; no invented APR or lender claims. |
| Repeated UI styling | A small semantic token set and clear component owners | Reuse ink/muted/surface/action/radius/spacing roles; do not create one token for every isolated pixel. |

Static editorial copy, campaign artwork, SVG geometry, explicit layout limits, and fixtures are not inherently bad hardcoding. The acceptance criterion is that a business fact, dataset, or policy can change in its owner without editing unrelated components. Do not replace straightforward data files with environment variables, a database, or a generic configuration engine merely to eliminate literals.

## Journey continuity and production boundaries

**Finance handoff [P2]:** the calculator correctly preserves the vehicle, but not the selected down payment or term. The edge check changed these to EUR 10,000 / 24 months; the next URL remained `/contact?topic=leasing&vehicle=1`, with no selected finance values in the contact view. Decide whether the calculator is only an illustration or prepares an enquiry. For the latter, pass validated finance context through the existing journey helper and show it in the summary. Never present principal/month as an actual lender payment.

**Dependency hygiene [P2, before public release]:** the live `npm audit` returned three low-severity affected package entries and no moderate/high/critical entries. These trace to one `cookie <0.7.0` advisory through SvelteKit and its adapter, not three independent demonstrated application exploits. No exploitability assessment was performed. The maintainer advisory identifies 0.7.0 as the patched cookie version. The audit's suggested Kit/adapter versions are old major-version downgrades; do not run `npm audit fix --force`. Select a supported compatible remediation, update the lockfile deliberately, then rerun build and browser checks. Evidence: `dependency-audit.json`, `dependencies.log`; advisory: https://github.com/advisories/GHSA-pxg6-pf52-xh8x.

**Security/preview behavior:** local responses include CSP, `nosniff`, and a strict referrer policy. Development CSP allows inline script/style and websocket connections; inspect actual production headers before tightening them. No raw HTML rendering, source TypeScript `any`, or persisted user draft storage was found by the scan. These facts are not a penetration test or proof of absence of vulnerabilities. Preview robots disallow indexing; preserve this until domain, stock, identity, and editorial content are approved.

**Real stock and identity:** all eight vehicles remain sample records; repeated photos and source-dealer imagery must not be silently promoted to verified inventory. Auto Best branding and retained Day & Night source contact details need one explicit owner-approved production identity. The local enquiry UI has no delivery backend: do not add a fake success state or promise that photos were uploaded. Backend integration is a separate delivery decision, not a prerequisite for polishing the local template.

## Review coverage and references

All 92 source files were inventoried and fingerprinted; component-family review bundles cover script/markup, data and config modules, route/load contracts, and a cross-file CSS ownership/risk scan. Critical interaction owners and shared/global styles were inspected directly. SVG geometry was indexed rather than manually authenticated path by path. Dormant demo sections were reviewed in source, not represented as visually approved live pages. Browser coverage and the incomplete supplementary dialog accessibility sweep are recorded separately in [QA-COVERAGE.md](QA-COVERAGE.md).

Use the existing URL-based state model in line with SvelteKit's state guidance: https://svelte.dev/docs/kit/state-management. Normal-text contrast requirements and exceptions: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html. Touch-target AA requirements are not a blanket 44px rule: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html. The proposed 44px ordinary mobile control size is a project design target, not a claim that all smaller targets automatically fail WCAG.
