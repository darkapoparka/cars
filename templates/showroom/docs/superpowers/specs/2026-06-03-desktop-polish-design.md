# Desktop Final Polish — Design Spec

**Date:** 2026-06-03
**Scope:** Desktop (1920px primary) final polish to elevate Bohemcars to a premium, ship-ready bar.
**Strategy:** Hybrid — Phase 1 foundation → Phase 2 hero elevation → Phase 3 secondary pages, verifying ship-ready per phase.

## Goals & success criteria

- **Zero regressions (hard gate, top priority):** no existing desktop _or_ mobile behavior, layout, or styling may break. Every change is verified against a baseline before it is accepted. This overrides ambition — when a change can't be proven safe, we make it smaller, not riskier.
- **Elevate to a distinctive premium aesthetic** (not merely fix flaws) — the site is a showcase of what's possible.
- **Ship-ready:** visual polish + responsive (no desktop→mobile regressions) + accessibility + performance, all verified.
- **Consistency** across every in-scope page via one shared design system, so 8 pages read as one premium product.

## In scope (8 desktop pages)

Home `/`, Inventory `/inventory`, PDP `/inventory/[slug]`, About `/about`, Contact `/contact`, Agents `/agents`, Calculator `/calculator`, Compare `/compare`.

## Out of scope (this pass)

- **Mobile** polish (separate effort) — but desktop changes must not regress mobile.
- **Other routes** (blog, services, account, admin, sell-your-car, faqs, terms, reviews, offer, import) — they inherit foundation tokens/components automatically where shared, but are not individually elevated here.

## Decisions (confirmed with user)

1. **Design direction & foundation-first ordering:** approved.
2. **Localization copy:** assistant drafts idiomatic Bulgarian for all English strings; user reviews/approves before implementation.
3. **Listing images:** replace remote `focus.bg` hot-links with curated, optimized **local** demo images.
4. **Layout/structure changes** are permitted where they measurably improve the result **and** are verified not to regress existing behavior or visuals (see Regression safety). Default to the smallest change that achieves the elevation.
5. **No-regression is the top priority** (per user): the existing polished work — especially the QA-passed Inventory and the Home page — must be protected. The goal is a _finalized, perfect_ result without breaking anything that already works.

## Current-state evidence (what the QA found)

Captured via Chrome DevTools at 1920×1080 against the dev server, plus a full-route HTTP metrics sweep. Screenshots in `outputs/qa/desktop/`.

### Systemic / cross-cutting (root causes of the "not quite premium" feeling)

- **Incomplete localization — English leaking into a Bulgarian site.** Calculator page is almost entirely English (input labels, cost summary, budget cards, FAQ, subtitle); Contact has English headings + form labels ("Reach Out To Bohemcars", "Get In Touch", "Working Time", "Send Message", all fields); Agents role subtitles are English; PDP shows "Customer Reviews" / "Add a Review"; breadcrumb middle crumb renders "Pages"; Calculator has mixed "View Автомобили". **This is the single biggest hit to perceived quality.**
- **Two diverging vehicle-card components.** `src/lib/components/home/HomeFiveVehicleCard.svelte` and `src/lib/components/inventory/AuxeroInventoryVehicleCard.svelte` render nearly the same card but differ in spec-chip style (home = sage-green pills; inventory = plain), hover, photo/video counts (inventory only), broken-image fallback (inventory only), and badge source.
- **Off-brand purple mileage badges** on Home (alternating green/purple via per-vehicle `highlightClass`) — already neutralized on `/inventory`, so the two pages literally disagree.
- **Legacy jQuery/WOW.js debt** leaking through injected Auxero HTML blobs: a `code.jquery.com` `<script>` and `wow fadeIn` / `data-wow-delay` classes, only _guarded_ by `src/routes/auxero-guards.css`.
- **Remote `focus.bg` listing images** (Home 9, Inventory 68, Compare 4, PDP) — slow/unreliable from outside Bulgaria; they prevented the live pages from reaching network-idle during QA.
- **Accessibility:** heart/compare controls are `<p role="button" tabindex="0">` (Svelte a11y warnings suppressed) instead of real `<button>`s; each card exposes 3 redundant same-destination links.
- **SEO / document structure:** generic `<title>Bohemcars</title>` on 7 of 8 pages; missing `<h1>` on PDP, Agents, Calculator, Compare; Home has two `<h1>`.
- **No design-token scale:** ad-hoc px values (card radius 8px, hardcoded chip colors, 22px price, bespoke shadows) instead of a shared ramp.
- **Page weight:** Inventory SSR is **911 KB / 401 images**; Home **396 KB / 183 images** — heavy image counts, lazy-loading needed. (The Home featured grid is already correctly capped at 8 cards — verified by `project1.e2e.ts`; the earlier "24" was 3 duplicate PDP links per card, see a11y above.)

### Per-page metrics (HTTP sweep)

| Route               | KB  | Title         | H1  | Remote imgs |
| ------------------- | --- | ------------- | --- | ----------- |
| `/`                 | 396 | descriptive ✓ | 2   | 9           |
| `/inventory`        | 911 | generic       | 1   | 68          |
| `/inventory/[slug]` | 591 | generic       | 0   | 2+client    |
| `/about`            | 199 | generic       | 1   | 0           |
| `/contact`          | 175 | generic       | 1   | 0           |
| `/agents`           | 164 | generic       | 0   | 0           |
| `/calculator`       | 169 | generic       | 0   | 0           |
| `/compare`          | 173 | generic       | 0   | 4           |

## Design language (the premium target)

A small token system every page inherits:

- **Type scale** — one ramp: display (hero) → h1 → h2 → h3 → body → small, with locked line-heights. Keep the strong Cyrillic display weight; tighten everything below so headings stop varying per page.
- **Color tokens** — keep lime `#c5f04a` / near-black `#1c1c1c` / white / soft greys / dark-green hero gradient. Lime is a disciplined accent (CTAs, active states only). **Purple removed.**
- **Space & rhythm** — 8px spacing grid, one container width, consistent section padding (existing `py-100`), identical vertical rhythm across pages.
- **Depth** — two elevation levels (rest / hover) via subtle shadow + hairline border; no heavy borders. Standardize the existing soft-hover (bg lift + faint shadow, no image zoom).
- **Imagery** — fixed 4:3 car frames, subtle gradient scrim under overlays, consistent treatment so mixed listing photos read as curated.
- **Motion** — replace WOW.js with a tiny IntersectionObserver fade/rise reveal; fast; `prefers-reduced-motion`-aware.
- **Components** — one `VehicleCard`, one button system, one chip/badge, one section-header pattern (eyebrow + title + optional action), one form-field style.

## Regression safety (hard requirement)

No-regression is the #1 success criterion. We protect the existing work — especially the QA-passed Inventory and the polished Home — with these guardrails:

1. **Baseline first.** Before touching code: capture _before_ screenshots of all in-scope pages at desktop (1920) and mobile (~390px), and record the current test state — `npm run check`, `npm run lint`, `npm run test:unit -- --run`, `npm run test:e2e`, `npm run build`. That is the reference every change is diffed against.
2. **Pin behavior before refactoring shared code.** The repo already has fidelity guards and specs (`home-five.spec.ts`, `vehicles.spec.ts`, `auxero-page.spec.ts`, `auxero-template.spec.ts`, `project1.e2e.ts`). Extend characterization tests around anything shared we touch — above all the unified `VehicleCard` — so its output/behavior is locked before the swap.
3. **Smallest safe step, then verify.** No big-bang rewrites. Introduce new shared components behind the existing props so call sites are unchanged; migrate one call site at a time; re-run checks + visual diff after each.
4. **High-risk areas — handle explicitly:**
   - **jQuery/WOW removal vs the Compare modal.** Compare/favorite use `open-modal` + `data-modal-id="#CompareModal"` (legacy jQuery). Replace with a native Svelte interaction and verify the modal + compare flow work _before_ removing jQuery — never drop the dependency while anything still relies on it.
   - **Card unification** (Home, Inventory, Compare, related, favorites) — baseline + visual-diff each surface. _Lower-risk fallback:_ if a full structural merge proves risky, first align the two existing cards to identical tokens/styling (visual consistency now) and defer the merge.
   - **Global tokens** — apply incrementally; diff after each step.
5. **Per-change definition of done:** existing tests still green (no _new_ failures vs baseline), build passes, lint/check clean, and the page's visual diff shows only the intended change — at both desktop _and_ mobile.
6. **Branch + reversible commits.** Work on a feature branch (not `main`); small, focused, revertible commits; integrate via PR.

## Phase 1 — Foundation (root-cause fixes)

1. **Localization sweep** — route all copy through the messages layer (`src/lib/i18n/messages.ts`); translate Calculator (full page), Contact headings/labels, Agents role subtitles, PDP "Customer Reviews"/"Add a Review", and the "Pages" breadcrumb. Assistant drafts Bulgarian; user reviews.
2. **Unify the vehicle card** — collapse the two card components into one `VehicleCard` with `grid` / `list` / `featured` variants. Eliminates badge/chip/hover/fallback divergence.
3. **Design tokens** — establish the type/color/space/depth/motion ramp in the Tailwind/CSS theme; replace ad-hoc values.
4. **Modernize** — remove the `code.jquery.com` script; replace `wow fadeIn` with the IO reveal; retire raw-HTML injection where a native component already exists.
5. **Images** — migrate listing images to curated local assets; add explicit width/height, `loading="lazy"`, `decoding="async"`.
6. **A11y + SEO** — real `<button>`s for heart/compare; add `<h1>` to PDP/Agents/Calculator/Compare; fix Home's double-h1; unique `<title>` + meta description per page; verify focus states + contrast.
7. **Perf** — lazy-load below-fold images; trim the Inventory payload (911 KB / 401 imgs); optimize image dimensions. (Home featured grid is already capped at 8.)

## Phase 2 — Hero elevation

**Home** — rebalance hero composition (cutouts ↔ whitespace ↔ title weight); fix the orphaned filter-icon button in the search bar; apply the section-header pattern to every band (Най-нови, Разгледай по марка, budget, reviews, news); stop reusing the same two cutouts in the hero + "Най-нови" banner; render the featured grid with the unified card + lazy-load; remove purple badges; spacing/depth consistency on brand strip, type gallery, budget tabs, action band.

**PDP** — add car-name `<h1>` + descriptive title/meta; localize reviews headings; **enlarge gallery + add lightbox**, refine thumbnail strip + aspect ratio; tighten price box (conversion focal point), spec list ("Основни данни"), seller card, inquiry form; unify section headers/spacing across description, feature tabs, calculator, location, reviews; related vehicles use the unified `VehicleCard`.

**Inventory** — adopt the unified card (grid + list variants); local images; consistency-only otherwise (passed QA).

## Phase 3 — Secondary pages

- **About** — refine stats panel, process row, why-us box, consultant cards; consistent section headers + rhythm.
- **Contact** — localize headings + form labels; fix the broken "Пълен Bull Viber" button; polish form fields, contact-info card, map hero.
- **Agents** — add a page header/`<h1>` (removes the large empty top gap); localize role subtitles; header + grid layout; reconsider pagination for a small team.
- **Calculator** — full localization; add `<h1>`; refine input card, result card, budget cards, FAQ accordion.
- **Compare** — add `<h1>` + page title; localize the "Pages" crumb; elevate the table (sticky first column, highlight differences, remove out-of-place payment-card icons); add an empty-state.

## Verification (ship-ready — run per phase)

- `npm run check` (svelte-check) · `npm run lint` · `npm run test:unit -- --run` · `npm run test:e2e` (Playwright) · `npm run build` — with **no new failures vs the recorded baseline**.
- **Lighthouse** (perf / SEO / a11y / best-practices) on Home, Inventory, PDP.
- **Accessibility:** axe/contrast, keyboard navigation, visible focus states.
- **Consistency sweep:** cards, section headers, spacing, type identical across pages.
- **Mobile guard:** confirm desktop changes did not regress mobile.
- **Before/after** 1920 screenshots of each page in `outputs/qa/desktop/`.

## Risks / notes

- Dev-mode browser tooling cannot load remote `focus.bg` images (they hang and block network-idle); the local-image migration resolves this for QA **and** production reliability/privacy/perf.
- Raw-HTML injection via the Auxero server adapters should be reduced incrementally, not big-bang rewritten — replace a section with a native component only when it's being elevated anyway.
- The unified `VehicleCard` is the linchpin: it appears on Home, Inventory, Compare, PDP-related, and favorites — landing it first de-risks every later page.
