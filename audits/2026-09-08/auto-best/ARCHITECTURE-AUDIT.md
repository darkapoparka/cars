# Auto Best — architecture, code quality and reuse audit

8 September 2026 · `J:/cars/templates/auto-best` · SvelteKit master `2026.09.06-refresh-1`.

## Recommendation

**Refactor this master in measured component-family batches. Keep SvelteKit, Svelte 5, TypeScript and the existing CSS approach.** This is already a native application with useful module boundaries. A full rewrite, new component library, Tailwind migration, CMS, backend, state framework or monorepo would add scope without addressing the observed problems.

“Modular” should mean that each behavior and styling family has a clear owner. It should not mean splitting every 30 lines into a component. The changes below are justified by actual duplicated state, cross-file style ownership, data drift or failed qualification—not by a file-length target.

## Baseline and evidence

The physical J: template folder is independent of the old M: source and has no `.git`. Its metadata records ancestor `ab92ce9671fb1b56afa38f693755b41aee9c28b0` plus dirty source files. This is not an exact source-SHA checkout. The current [hash manifest](evidence/source-manifest.json) is the audit baseline; do not infer cleanliness from the absence of Git status.

The manifest contains **76 source files, 50 Svelte files and 13,704 source lines**. These include markup and CSS, so line count is not a complexity score. Key files:

| Owner | Lines | Why inspect it |
|---|---:|---|
| `Header.svelte` | 802 | Desktop mega-menu, mobile menu, route matching, bottom bars, focus/scroll lifecycle and styles |
| `VehicleSearchDialog.svelte` | 794 | Draft fields, normalization, desktop controls, nested mobile picker composition and styles |
| `VehicleQuickSearch.svelte` | 779 | Separate home-mobile discovery state, picker views, form serialization and styles |
| `contact/contact.css` | 726 | Route geometry plus descendant styling for imported components |
| `app.css` | 588 | Tokens/reset, shell styles, cross-route rules and late overrides |
| `listing-detail-v1/[id]/detail.css` | 586 | Vehicle detail family |
| `scripts/sveltekit-smoke.mjs` | 2,019 | Broad route checks, geometry assertions, interactions and reporting in one sequential script |

`npm run validate` passed: 77 application/config files checked; 98 inventoried/guarded/referenced assets; 0 Svelte errors and warnings; successful production build. Header's Svelte autofixer returned no issues or suggestions. That is a useful narrow diagnostic, not whole-application architectural certification.

Dedicated existing smoke scripts passed: mobile filters at four sizes, enquiry at four widths, desktop discovery across six route/width combinations. Only audit runner copies were adapted for the known base URL, installed Chrome and output directory; application scripts were preserved. See [runner](run-existing.mjs) and [log](evidence/existing-smokes.log).

The general smoke suite logged 28 desktop PASS results, then a mobile home baseline failure, then timed out in a brand picker before producing its aggregate report. It remains an incomplete failing gate. An independent equivalent brand-change probe passed. See A02.

## Existing architecture worth preserving

- Normal SvelteKit routes and typed load functions; shared layout/header/footer; data under `src/lib/data`; useful aliases.
- Native Svelte components instead of HTML snapshots, DOM mutation composition or a compatibility runtime. The existing architecture guard explicitly protects this boundary.
- `$state`/`$derived` for local state and computation, typed snippets, keyed content where useful, attachments with cleanup in several components.
- Native GET forms and URL-backed filters. The small eight-car dataset does not need a remote search service or client state package.
- Shared `VehicleCard`, `BlogCard`, `VehicleDiscoveryForm`, `ShowroomMap` and `ContactIntent` already provide real reuse.
- Existing local enquiry semantics are honest: validation and review precede sharing, files stay local, and no fake server success is shown.

SvelteKit supports shared code in `src/lib` and route-local components alongside routes. Use those existing boundaries rather than an invented universal folder hierarchy. [Official project structure](https://svelte.dev/docs/kit/project-structure).

## Findings and bounded improvements

### A01 · P1 — Token references are not validated, and a live focus token is missing

Four focus declarations reference undefined `--dn-focus`; computed keyboard outline style becomes `none`. This is a user-visible consequence of a styling governance gap, not merely a preference for fewer hex values.

The source contains 777 hex-color occurrences and 13 `!important` occurrences, including ordinary white/black and accessibility utilities. **These counts are inventory, not 790 defects.** Centralize repeated semantic roles such as foreground, muted text, field surface, border, danger/brand action and focus. Keep deliberate artwork geometry and one-off values near their owner.

**Change:** Document a small token/variant contract; define the missing focus role; add a check for unresolved custom-property references, allowing explicit fallbacks and intentionally external variables. Review the few `!important` rules by purpose rather than banning them.

**Acceptance:** M07/D03 passes in the browser; every shared token resolves; a fixture with an unknown variable causes the guard to fail. No blanket visual recoloring.

Sources: [app.css](J:/cars/templates/auto-best/src/app.css:1), [calculator](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:137).

### A02 · P1 — The advertised quality gate does not run browser qualification

`quality` is just `validate`; `validate` stops after checks/build. `smoke` is separate. Consequently, the build can pass while keyboard focus is broken, selected-vehicle handoff is lost and the general browser suite fails.

The large smoke script has stale shape assumptions: icon width exactly 28px and anchor height at least 44px. The current icon is 32px; a 20px text anchor has a 178×144px stretched hit area. It then times out at line 1549 selecting BMW after a navigation. The isolated sequence passed with an explicit ready state; root cause of the full-suite timeout is not conclusively established.

**Change:** Split by behavior family: navigation, discovery, detail, editorial, enquiry and responsive visual checks. Keep a small common runner for URL, readiness, Chrome selection, errors and per-case output. Write results incrementally and in `finally`, so a timeout cannot discard the audit. Separate behavioral assertions from intentionally approved visual baselines. Add a documented presentation qualification command combining relevant gates.

**Acceptance:** One failed case still leaves a useful report; the failing picker sequence is reproduced/resolved; the intended card hit area is tested, not the text box alone; no test is deleted or loosened simply to get green output. Add targeted tests for the actual handoff/focus/return-state bugs.

Sources: [package scripts](J:/cars/templates/auto-best/package.json:11), [general smoke](J:/cars/templates/auto-best/scripts/sveltekit-smoke.mjs:1549), [hit-area evidence](evidence/final-probes.json).

### A03 · P1 — Vehicle context is absent from the contact-intent model

Detail CTAs construct topic URLs independently. Finance sends a title under `vehicle`; the contact loader only reads `topic` and, for import, `vehicle_url`. The renderer therefore has no selected-stock concept. The mobile dock also chooses a detail action from the pathname even for 404s.

**Change:** Add one typed internal contact-link builder and a validated optional vehicle ID in route data. Derive title/price from inventory rather than accepting arbitrary query text as authoritative stock. Decide shell actions from resolved route status/content as well as path. Preserve generic contact and external-import-link intents.

**Acceptance:** M02/M08/D02 pass across all eight cars, malformed IDs and direct links. Displaying a draft must remain distinct from actual delivery.

Sources: [contact loader](J:/cars/templates/auto-best/src/routes/contact/+page.ts:4), [finance link](J:/cars/templates/auto-best/src/lib/components/vehicles/VehicleFinanceCalculator.svelte:68), [Header](J:/cars/templates/auto-best/src/lib/components/layout/Header.svelte:31).

### A04 · P2 — Shared filter logic exists, but serialization and draft rules are still repeated

`listing.ts` owns parsing/matching, which is good. However, `VehicleQuickSearch`, `VehicleSearchDialog`, `QuickFilterSheet`, `ListingFilters`, `ListingResults` and `VehicleDiscoveryForm` each reconstruct portions of filter state, hidden fields, counts or URL parameters. `QuickFilterSheet` infers snake_case names from property names, while other components enumerate them manually. Adding a facet requires coordinated edits across these representations.

**Change:** Centralize `serializeListingFilters`, a canonical empty state, applied-filter counts, dependent-field reset and code-to-display-label mapping beside existing parsing/matching. Keep home-mobile and inventory-mobile layouts separate if they serve different tasks. Reuse the domain model before trying to merge entire dialogs.

**Acceptance:** Parse/serialize round trips preserve every facet, repeated equipment values and sort; unknown/invalid input has defined behavior; make changes clear incompatible models. All existing GET links remain valid. M05/M13/D06/D10 are addressed from data rather than repeated label patches.

Source: [listing domain](J:/cars/templates/auto-best/src/lib/data/listing.ts:1), [quick sheet](J:/cars/templates/auto-best/src/lib/components/listing/QuickFilterSheet.svelte:10).

### A05 · P2 — Overlay lifecycle has several independent implementations

Header, home quick search, full search, quick sheets and vehicle enquiry each manage focus return and scrolling in different ways. Some lock overflow; others fix the body using stored scroll offsets; native dialogs coexist with a custom `aria-modal` menu. Several attachments clean up on unmount, while quick-sheet restoration largely depends on its close event.

**Change:** Extract only the shared lifecycle responsibilities that need consistency: open/close, scroll restoration, trigger return, nested overlay ownership and unmount cleanup. Keep each overlay's content and layout local. Make the custom menu actually isolate background content.

**Acceptance:** Open → nested picker → Escape → Escape, navigation while open, viewport changes and unmount do not leak scroll locks or focus. No module-level mutable singleton should share user-specific state across SSR requests.

Sources: [Header lifecycle](J:/cars/templates/auto-best/src/lib/components/layout/Header.svelte:151), [QuickFilterSheet](J:/cars/templates/auto-best/src/lib/components/listing/QuickFilterSheet.svelte:59), [VehicleEnquiry](J:/cars/templates/auto-best/src/lib/components/company/VehicleEnquiry.svelte:47).

### A06 · P2 — CSS ownership crosses route, global and component boundaries

`app.css` defines shell and route rules, then overrides imported component families with selectors such as `.dn-app-shell .dn-blog-hero`, `.dn-contact-intent` and `.dn-discovery`. Contact and detail route CSS also style imported component internals. `ContactIntent.svelte` carries further responsive rules. This makes it harder to know which file should own a spacing/color repair, and encourages more specific late overrides.

**Change:** Assign ownership before moving declarations: global reset/tokens/utilities in global CSS; shell in layout components or a dedicated shell stylesheet; route composition in route CSS; reusable component appearance in its component. Replace cross-component descendant overrides with a small explicit prop/class/custom-property contract where needed. Move and verify one family at a time.

Svelte scopes component styles and adds specificity. Preserve computed behavior while moving rules; a mechanically moved selector can change the cascade. [Official scoped-style behavior](https://svelte.dev/docs/svelte/scoped-styles).

**Acceptance:** A component's normal/compact/error variants have one documented owner; route navigation in both orders produces the same styling; screenshots and keyboard states remain equivalent except for the intended repair. Do not impose a “zero px values” rule.

Sources: [global overrides](J:/cars/templates/auto-best/src/app.css:530), [contact CSS](J:/cars/templates/auto-best/src/routes/contact/contact.css:1), [ContactIntent](J:/cars/templates/auto-best/src/lib/components/company/ContactIntent.svelte:171).

### A07 · P2 — Header is a useful candidate for responsibility-based decomposition

The 802-line Header combines desktop navigation/mega-menu, mobile menu, mobile bottom navigation, vehicle dock, active-route logic and responsive style families. The code is already readable enough to audit and has cleanup; file length alone does not make it defective. The status-blind dock and bespoke modal behavior show where boundaries would help.

**Change:** A thin Header/SiteNavigation owner can compose `DesktopNavigation`, `MobileMenu`, and `MobileNavigation`/detail actions. Keep route-state decisions in one place and pass explicit data. Use snippets for tiny repeated markup; do not create a component for every icon row.

**Acceptance:** Keyboard navigation, dismissal, active states, route transitions, 991/992 breakpoint behavior and the selected-car/error dock tests pass. Preserve the exact current visual compositions.

Source: [Header](J:/cars/templates/auto-best/src/lib/components/layout/Header.svelte:1).

### A08 · P1 for reuse — The inventory model permits contradictory presentation data

Each vehicle stores year and yearNumber, mileage and mileageKm, category and body, plus an independently maintained href. Image reuse and item-level provenance are not expressed. Those pairs can drift; record 8 already has conflicting body/category values. Home brand/body choices and filter options are separately hardcoded.

**Change:** Use canonical numeric facts and stable enum-like codes, derive display strings/paths, and support source reference, checked date, availability and optional confirmed equipment. Keep hand-authored display titles where needed; not every model name can be reconstructed safely. Derive stock-facing discovery options from the active records, with explicit overrides for genuinely supported sourcing services.

**Acceptance:** Duplicate IDs, conflicting category mappings, missing required media and malformed stock records fail validation. Unknown facts remain absent instead of acquiring defaults that look verified. This is a data-quality boundary, not a request to add a database.

Sources: [inventory](J:/cars/templates/auto-best/src/lib/data/inventory.ts:12), [home](J:/cars/templates/auto-best/src/lib/data/home.ts:3), [listing](J:/cars/templates/auto-best/src/lib/data/listing.ts:25).

### A09 · P2 — Personalization is partly centralized but not a complete contract

`brand.ts` is a good start. Coordinates live in `company.ts`; video identity/copy, service claims, image paths, demo people, partner logos and editorial teasers live elsewhere. A brand-name edit cannot fully personalize the site. TEMPLATE.md correctly cautions about this, but the application cannot validate a complete lead identity pack.

**Change:** Define typed configuration boundaries for dealer identity/contact/location, enabled services, optional team/partners, featured media and stock/editorial sources. Keep domain datasets separate instead of making one enormous JSON file. Add a qualification scan for source identity and unsupported sample content across metadata and retained pages. Existing icon-family differences can remain intentional.

**Acceptance:** A new clone can be personalized through documented files; all retained routes consume the same contact/location facts; optional sections vanish cleanly when unsupported. The parent master does not silently sync into older client copies.

Sources: [brand](J:/cars/templates/auto-best/src/lib/config/brand.ts:1), [company coordinates](J:/cars/templates/auto-best/src/lib/data/company.ts:130), [video section](J:/cars/templates/auto-best/src/lib/components/home/VideoSection.svelte:32), [TEMPLATE.md](J:/cars/templates/auto-best/TEMPLATE.md:1).

### A10 · P2 — Route metadata contains independent hardcoded inventory/article counts

Sitemap generation assumes sequential vehicle IDs 1–8 and article IDs 1–9. Legacy detail redirects accept only 1–8. Several links use literal route casts to satisfy typing. They work for this dataset but make a changed client catalog easier to misconfigure.

**Change:** Generate canonical sitemap entries from retained records and use SvelteKit's typed dynamic-route resolution. Keep a deliberate legacy redirect policy; do not fabricate redirects to missing entities. Add a safe return-state helper for list/detail navigation.

**Acceptance:** Adding/removing a record changes the sitemap correctly; invalid IDs return 404; all links and retained aliases resolve; queries used for filters survive intended redirects. M03/D04 round trips pass.

Sources: [sitemap](J:/cars/templates/auto-best/src/routes/sitemap.xml/+server.ts:3), [legacy hook](J:/cars/templates/auto-best/src/hooks.server.ts:26), [detail link casts](J:/cars/templates/auto-best/src/routes/listing-detail-v1/[id]/+page.svelte:213).

### A11 · P2 — Retired and alternate hero markup still consumes requests

CSS hides old hero media globally, but the home still requests the old 41,178-byte high-priority hero. The mobile home requests the two hidden desktop side-car assets as well. See D11 for measured values. Merely hiding an image does not undo an already scheduled request.

**Change:** Remove confirmed retired markup and use media-aware sources for the retained responsive art. Keep a visual reference while doing this; it is asset-delivery cleanup, not a license to redesign the hero. Remove associated dead styles only after reachability/variant checks.

**Acceptance:** Intended mobile/desktop artwork is unchanged, obsolete high-priority downloads disappear, and actual production request measurements are taken before claiming a performance improvement. Local dev timings are not production benchmarks.

Sources: [Hero](J:/cars/templates/auto-best/src/lib/components/home/Hero.svelte:1), [HeroVehicles](J:/cars/templates/auto-best/src/lib/components/ui/HeroVehicles.svelte:1), [request evidence](evidence/final-probes.json).

### A12 · P2 — Template release identity and preview publication mode need explicit ownership

TEMPLATE.md still cites 73 files/85 assets from a previous validation; current checks see 77/98. The version is a label and the recorded source includes dirty files. This audit does not infer how those files changed. A later improvement thread needs a stable baseline and a release record that describes the actual tested source.

The app also always emits `Allow: /` in robots.txt and canonical URLs from the request origin. That is not a problem on localhost, but a public template/demo should have a deliberate indexing mode and canonical origin before publication. No legal/privacy conclusion is drawn here.

**Change:** On completion of authorized work, record a new template version, current validation/evidence, manifest or repository identity, and precise personalization boundaries. Add an explicit preview/published mode when public hosting is requested. Follow the workspace promotion process; do not automatically update independent clients or deploy.

**Acceptance:** A reviewer can identify exactly which master version produced a client; documentation agrees with current checks; a public sample cannot accidentally claim the production canonical identity. Release work stays separate from local audit claims.

Sources: [TEMPLATE.md](J:/cars/templates/auto-best/TEMPLATE.md:1), [template metadata](J:/cars/templates/auto-best/.template/template.json), [robots](J:/cars/templates/auto-best/src/routes/robots.txt/+server.ts:4), [canonical](J:/cars/templates/auto-best/src/routes/+layout.svelte:11).

## Suggested module shape

Use this as an ownership sketch, not a requirement to create every listed file immediately:

```text
src/lib/
  config/       dealer identity, enabled services, publication mode
  data/         inventory, editorial and verified content
  listing/      parsing, serialization, labels, counts, dependent resets
  navigation/   contact destinations and safe internal return paths
  components/
    layout/     shell, desktop navigation, mobile menu/navigation
    listing/    existing distinct discovery and filter presentations
    vehicles/   card, detail sections when useful, principal calculator
    company/    contact intent and enquiry presentation
    ui/         proven common overlay lifecycle/controls only
```

Do not duplicate route data in a global client store. Do not turn a simple calculated value into an effect. Do not consolidate all icon families just for numerical uniformity. Do not extract the already focused finance calculator further unless meaningful business logic is introduced.

## Execution order

1. Preserve the hash/screenshot baseline and make the qualification runner report reliably.
2. Fix focus tokens, selected-car context and error-state shell actions. Add narrow behavior regressions.
3. Centralize filter/route serialization and display labels, preserving separate UI presentations.
4. Consolidate overlay lifecycle and decompose Header only along those established responsibilities.
5. Move CSS ownership one component family at a time; remove confirmed retired hero requests.
6. Complete the template's typed personalization/data validation boundary; version and document the result after all checks.

The separate [handoff](REFACTOR-HANDOFF.md) gives the next thread a bounded task and acceptance gates. This audit authorizes no implementation by itself; the owner's next instruction determines which repair batches to execute.
