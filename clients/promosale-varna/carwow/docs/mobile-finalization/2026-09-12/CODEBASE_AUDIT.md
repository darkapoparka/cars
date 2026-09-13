# Codebase audit

Evidence: `.audit/mobile-2026-09-12/source-audit.json`, `static-metrics.json`, `checks.json`, test logs, browser/engine results, and the source paths below. Priority P1 means resolve before mobile sign-off; P2 means resolve during finalization. A source-traced risk is not presented as a reproduced live-data failure.

## Architecture to retain

Keep SvelteKit route loaders and request-local server boundaries, Svelte 5 typed props/derived state, the existing garage context, pure inventory/finance helpers, and the shared mobile overlay primitives. The repository already has these foundations. No new global state library, UI framework, form-engine abstraction, or generic component factory is justified by this audit.
The root layout creates a garage instance and supplies context rather than sharing mutable user state on the server. Published inventory and posts are loaded through repositories. Intake endpoints validate payloads and fail closed without their database. These are useful boundaries, not candidates for wholesale replacement.

## C01 — P1: make viewport selection and SSR consistent

`src/lib/hooks/is-mobile.svelte.ts`, `src/lib/components/layout/PublicStorefrontRoute.svelte`, the contact/favorites/compare routes, and several mobile page wrappers choose their initial composition differently. `HomePage.svelte` already has an initial-viewport contract; other routes rely on client media queries or mount-time content.
In JavaScript-disabled Chromium at 390px, eight of 20 sampled routes displayed only the skip link: a vehicle detail, contact, import intent, services, about, financing, favorites, and comparison. This proves a resilience/initial-render gap, not that hydrated versions never render or that search engines necessarily cannot index them. The vehicle drawer is opened on mount; the import intent's SEO selection also depends on a browser-only condition in `src/routes/contact/+page.svelte`.
Use one documented initial-render strategy. Render useful page text and actions on the server, keep the first client render consistent with that output, and enhance client-only interaction afterward. Do not solve this by rendering two complete interactive copies of every page and hiding one. Test phone and desktop user agents, direct navigation, internal navigation, refresh, and breakpoint crossing.

## C02 — P1: one real main landmark and one skip target

The crawl found duplicate `#main-content` IDs on `/financing` and `/sell-your-car/request`. Separate axe scans found no main landmark on the blog article, FAQ, and reviews routes. An ID on a span is not a substitute for a semantic main region. Experimental routes and login have separate skip-target gaps.
Assign ownership explicitly in `PublicStorefrontRoute.svelte`, `StorefrontShell`, route wrappers, and pages that own their shell. Acceptance: one visible `<main>`, one unique target reached by the skip link, one meaningful page heading, and no nested main regions. Include open modal states without interpreting intentionally inert background landmarks as missing content.

## C03 — P1: reduce cascade conflict at its source

The full source survey counted 4,678 `!important` occurrences and 3,084 hexadecimal-color-like literals. These counts include legacy/generated and potentially unused source; they are not a measurement of CSS shipped to mobile. The main hotspots include `daynight-home-desktop.css` (9,281 lines), `MobileHome.svelte` (3,135), `MobileContactPage.svelte` (1,586), `MobileDetailPage.svelte` (1,271), and the 1,198-line mobile inventory stylesheet.
The blog's active mobile category uses `var(--desktop-action)` and white text in `BlogIndexPage.svelte` around lines 935–937. The measured mobile background is transparent, making the selected label disappear against white. `MobileBottomDock.svelte` also overrides menu drawer height/overflow globally, causing the short-landscape clipping documented in the visual report. These are concrete consequences of competing style ownership.
Keep semantic tokens in the existing token layer; keep component layout styles with their owner. Fold corrections into the original selectors instead of appending another override block. Remove obsolete rules only after checking their callers and screenshots. Do not run an indiscriminate replacement of every literal or `!important`.

## C04 — P1: repair test contracts before using them as a release gate

All 23 unit tests pass, and Svelte reports no errors/warnings. Existing browser tests are not green: two tests in `tests/final-polish.e2e.ts` require mobile card action buttons, while `tests/mobile-inventory-cards.e2e.ts` requires those buttons to be absent. The latter also expects an `h3` that current card markup does not provide, failing at 320, 390, and 428px.
Preserve the current uncluttered-card decision. Test saving/comparing from actual available controls, and add independent semantic/accessible-name assertions rather than selectors tied to a removed heading. Existing passing tests must remain meaningful; do not replace assertions with broad waits or update visual baselines simply to make failures disappear. Run ESLint separately from formatting until both gates are clean: the current combined lint command can stop before ESLint runs.

## C05 — P1: page weight is measurable, not a reason for a framework rewrite

The production-preview audit was repeated with a real iPhone user-agent string because the repository's existing script uses a mobile viewport with a desktop user agent. With iPhone UA, decoded response-body totals were: home 2.39 MB; inventory 1.52; representative detail 0.83; sell 1.80; services 1.80; contact 1.68; about 1.96; favorites 1.90. Inventory/detail pass their 2 MB budgets; the other six exceed their 1.5 MB budgets. These are the script's MiB-style calculations, not compressed network transfer, LCP, INP, or real-user performance.
The shared root CSS is about 280 KB decoded. The approximately 720 KB PNG logo is a repeated cost on several routes. Desktop hero cutout assets are also requested on several phone routes that do not display those desktop heroes. Start with correctly sized logo assets, accurate branch rendering, route-level CSS ownership, and removing unnecessary chrome imports. Verify request initiators and production requests before deciding what to split.
`src/lib/styles/tokens.css` uses `font-display: block`; evaluate text visibility under slow font loading. Do not assert that changing this alone improves field Web Vitals without measuring layout stability and font fallback behavior. Keep Cyrillic support intact.

## C06 — P1 source-traced risk: garage state assumes the static catalog

`src/lib/state/garage.svelte.ts` validates persisted slugs against imported static `daynightVehicles`. Public inventory can instead come from published database rows. A newly published vehicle absent from the static fixture can therefore be discarded during garage hydration. This was not tested against a newly created live database vehicle; creating one was outside this audit's read-only scope.
The current fixture-based browser flow works: a saved car survives reload, the first three compare actions succeed, and the fourth is refused. Preserve that behavior. Move catalog validation to the actual current inventory source or resolve persisted identifiers server-side. Keep stable identifiers, handle sold/removed cars explicitly, and avoid persisting full stale vehicle objects. The comparison limit needs one named domain constant, reused by state, UI, and tests.

## C07 — P2: share form presentation, not unrelated business workflows

`MobileSellYourCarPage.svelte` and `MobileImportPage.svelte` duplicate step headers, progress, fields, action footers, errors, summaries, and much CSS. They already share `MobileLeadHero`, `MobileLeadContactCard`, and `MobileFullSheet`. Extract a small presentational step frame only where reuse is real; keep sell and import payload mapping/validation in separate typed functions.
A confirmed rule/copy mismatch exists in sell: the empty-state message asks for at least make and model, but filling make alone advances. Decide the actual rule and make validation and copy agree. Numeric-looking year/mileage/budget fields and phone text need bounded, understandable validation; do not infer business eligibility or manufacture guarantees. Import origin codes and defaults should come from one documented policy rather than unrelated literals in the mobile UI and server schema.
Both submit clients accept server error text directly. Mocking the actual server's English 503 message displayed that English sentence in the Bulgarian interface. Map stable error codes to local copy; retain input, distinguish validation/network/service errors, prevent double submits, and add an abort/timeout strategy. Successful mocked responses required the expected identifiers; actual storage and notification delivery remain unverified.
The import manual-entry banner contains visual copy in a raster image. It does have an accessible button label, so this is not an unnamed-button defect. Move visible wording into HTML and leave illustration decorative for resizing, localization, and future dealer changes.

## C08 — P2: reuse real configuration, not scattered dealer assumptions

`daynight-site.ts` centralizes some identity, but consumers still construct Bulgarian phone/Viber links repeatedly, duplicate route titles and regional information, and retain a fixed inventory-count field. Root JSON-LD also contains identity literals. `/about/daynight-auto-plovdiv` displays Sofia content. The sample master may contain sample identity, but changing a dealer must not require editing unrelated components.
Use one typed site/dealer configuration for approved identity, E.164 phone, display phone, contact URLs, logos, locale, currency, location, and verified business copy. Derive counts from the loaded inventory and monetary display from typed values/formatters. Give redirects and canonical paths one authoritative registry. `/sell-car` and `/sell-car/request` currently return 404 despite being declared aliases; either implement deliberate redirects or remove obsolete references. Do not silently rename published routes without a redirect plan.

## C09 — P2: server boundaries are sound in places, but not fully certified

Reviewed intake endpoints use Zod validation, database-backed rate limits, honeypots, and server-selected dealer configuration. `rate-limit.ts` uses an atomic database upsert; memory fallback is explicit for local/unit use, not the production default. Admin guards check authenticated user, staff profile, dealer membership, and active dealer status. The public inventory repository scopes published rows and photos by dealer. Do not misreport these as absent controls.
Four raw-HTML render sites exist, including trusted legacy fragments and serialized JSON-LD. Their existence alone does not prove XSS. Keep their trusted-input boundaries explicit and add escaping/unsafe-URL tests before expanding their inputs. Authentication flows, cross-dealer authorization tests, provider delivery, production secrets, and hostile-input testing were not exhaustively exercised. A passing secret-boundary build check is not a complete security audit.

## C10 — P2: prune only proven dead code

The AST survey found 171 modules not reached from the selected source entry points, many from unused starter UI and old dashboard/inventory exports. This is a review list, not permission to delete 171 files: type-only imports, implicit references, scripts, generated templates, and dynamic resolution complicate reachability. The scan read every source file, found 54 DOM-query calls, two explicit `any`-type patterns, and no `@ts-ignore`/`@ts-nocheck` patterns. Metrics guide review; they are not quality scores.
Delete one demonstrably unused family at a time after checking runtime imports, generation scripts, and build output. Do not split a large component merely to hit an arbitrary line count. Split around stable responsibilities with meaningful props and a clear state owner.

## Practical zero-hardcoding contract

Zero hardcoding here means zero duplicated business facts, environment assumptions, catalog counts, route mappings, and recurring design decisions in presentation components. It does not mean eliminating legitimate CSS geometry, structural zero/one values, percentages, or readable static interface labels by building a configuration framework.
A dealer change should be one configuration/content change. A catalog change should update derived views automatically. A repeated spacing/color/height decision should have one semantic token. A business cap should have one named domain constant. Page-specific geometry can remain local when it is intentional, documented, and verified across the supported sizes.
Prefer `$derived` for derived values, event handlers for user actions, scoped CSS for component layout, and small pure functions for validation/serialization. Effects and DOM attachments should own external synchronization and clean it up. Do not replace ordinary markup with a schema-driven page builder merely to avoid strings in components.

## Verification references

For framework behavior, consult the current primary documentation: Svelte reactive media queries (`https://svelte.dev/docs/svelte/svelte-reactivity`), SvelteKit state/context (`https://svelte.dev/docs/kit/state-management`), and progressive form actions (`https://svelte.dev/docs/kit/form-actions`). Accessibility acceptance should distinguish WCAG 2.2 target-size minimums and exceptions from this project's larger 44px comfort target (`https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum`). The measured defects in this report come from this working tree and its browser evidence, not from generic rules.
