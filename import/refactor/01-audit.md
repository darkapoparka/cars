# 01 — Repository audit

## Scope, baseline and confidence

The audit inspected the live Windows checkout of `cars-template-import`, not a hypothetical new application. The baseline includes the existing mobile changes in the working tree, including five untracked shared-mobile components. `git fetch origin` and status inspection showed `main` aligned with `origin/main` at the audited head.

Coverage consists of a repository-wide file/import/style inventory, inspection of the current ownership/reuse documents and package/configuration files, targeted deep review of the shell, desktop/mobile inventory, homepage, import, overlay, inquiry/authentication, CMS-persistence and formatting paths, plus automated checks and a bounded browser sample. This is not a claim that every source line or every production deployment was independently verified.

**Confirmed** means observed in source or a recorded command. **Risk** means a plausible failure mode requiring a named test. **Product decision** means a choice that cannot be resolved by static analysis. Priorities refer to the reusable template: **P0** blocks enabling/releasing live capability; **P1** is a core refactor requirement; **P2** is staged cleanup or follow-on hardening. P0 does not imply a production exploit was demonstrated.

## What is already worth keeping

Svelte 5 runes are already enabled for application source, TypeScript is already strict, and the project already uses Tailwind v4. The `--bc-*` tokens, `@theme inline` bridge, shared mobile sheets/actions/tabs, per-layout garage context, URL-backed inventory filters, centralized API authorization helpers and tested durable-inquiry error handling are useful foundations. Replace neither the stack nor all of these abstractions simply to make the repository look newly organized.

The inquiry tests specifically cover demo versus database storage, safe failure without a memory fallback, malformed sessions, role-elevation rejection in database mode and independent page/action authorization. Those protections must survive the refactor.

## Findings register

### F01 — Competing styling systems control the storefront

**P1 · Confirmed.** `src/routes/+layout.svelte` imports `daynight.css` and switches legacy stylesheets using route-derived state. `src/lib/styles/daynight.tailwind-entry.css`, `src/lib/components/account/dashlite-dashboard.css` and `src/routes/admin/shadcn.css` are separate Tailwind entry points. The storefront still consumes legacy class vocabulary such as `lg-grid-cols-1` and `gap-30`.

The same visual role can therefore be decided by unlayered vendor CSS, source tokens, route guards and component CSS. Navigation between route families changes stylesheet participation. **Action:** adopt the cascade and migration contract in [04](04-design-system.md), then remove competing owners per migrated route. Do not merely import Tailwind globally and hope its reset is harmless. **Acceptance:** hard reload and client navigation produce the same computed styles on migrated routes; one app-level Tailwind entry owns shared utilities.

### F02 — Desktop specificity debt is concentrated and measurable

**P1 · Confirmed.** The source CSS/Svelte scan found 2,130 `!important` and 1,323 `:global(` occurrences. `src/routes/auxero-guards.css` accounts for 527 important declarations; `AuxeroInventoryDesktopSurface.svelte` accounts for 248; `HomeFiveHeader.svelte` accounts for 159.

These counts include intentional exceptions, but the largest concentrations align with the user’s inconsistent desktop surfaces. **Action:** map each guard to its component or legacy owner and retire it with that owner. **Acceptance:** newly migrated components add no cross-component descendant overrides, and the migrated route does not require the old guard rules.

### F03 — Parent pages restyle child internals instead of composing contracts

**P1 · Confirmed.** `src/lib/components/home/HomeFiveTemplatePage.svelte` contains extensive body/route-qualified global selectors for child cards, headings, prices, media and CTAs. Its desktop rules include fixed container values, card-title minimum heights and `font-weight: 650`, while the token file documents 400/600/700 font assets.

A card cannot reliably own its own appearance while its parent rewrites those details. **Action:** move design decisions to component variants and layout primitives; let the page own spacing/order only. **Acceptance:** a card rendered in a test fixture has the same role styling as the card in a page, without route selectors.

### F04 — Tokens exist but have incomplete adoption and too many near-aliases

**P1 · Confirmed.** `daynight.css` already defines colours, roles, controls, spacing, radii and motion. It also repeats similar popover/filter/accent literals. Meanwhile source CSS/Svelte contains 1,545 hex and 6,545 pixel occurrences. `daynight.tailwind.css` maps many of the existing variables but does not make consumers use them.

**Action:** distinguish brand inputs, semantic roles and a small set of component measurements. Migrate repeated decisions, not every literal. **Acceptance:** a second brand can change brand inputs without editing component selectors; sanctioned geometry and accessibility exceptions remain documented rather than disguised as hundreds of new tokens.

### F05 — Undefined brand-token references remain in base styling

**P1 · Confirmed static finding.** `daynight.css` uses `--bc-brand` and `--bc-brand-hover` for scrollbar colours. The audit found no definitions for either in source or static CSS. The main accent token is named differently.

**Action:** remove the stale references or deliberately bridge them to the canonical semantic token; add a token-reference check that understands fallbacks and inherited/runtime tokens. **Acceptance:** no unresolved required tokens in the tested root, inverse-header, admin or overlay scopes. Do not classify every fallback-only custom property as an error.

### F06 — Shared controls do not yet represent one design contract

**P1 · Confirmed.** The generated `src/lib/components/ui/button/button.svelte`, custom storefront buttons, the inventory load-more button and the newer mobile actions all contain separate size/style definitions. The UI button’s default size is `h-10`; other roles deliberately use 36/40/44/48/56px. The problem is uncontrolled ownership, not that every control must become 48px.

**Action:** retain one primitive family with explicit role/size semantics and a temporary theme bridge for admin aliases. Separate visual icon size from touch target. **Acceptance:** equivalent header actions match across routes; metadata badges remain visibly smaller than filter controls; external/tel/internal links work through a correctly typed link contract.

### F07 — Oversized mixed-responsibility components impede safe changes

**P1 · Confirmed.** Desktop inventory is 2,958 lines, comparison 3,186, homepage hero 2,278 and the imported-template server module 3,351. These sizes locate candidates; line count is not an automatic split threshold.

**Action:** extract by ownership: query model, toolbar, facet trigger/content, grid, card, desktop composition and overlay behaviour. Keep small single-use markup local where extraction would only add indirection. **Acceptance:** feature changes have a predictable owner and can be tested without mounting the entire legacy application.

### F08 — Native Svelte and rewritten HTML remain two rendering engines

**P1 · Confirmed.** `src/lib/server/auxero-template.ts:31–65` eagerly imports selected `.template-ref/*.html` files. Its render pipeline at approximately 3268–3289 performs a sequence of branding, navigation, form, data and accessibility rewrites. Native route components then carry `pageDocument`, shell props and runtime HTML extracted from this machinery.

**Action:** migrate current public routes to typed load data and native layouts. Keep a narrowly scoped legacy adapter until its last real consumer is gone. **Acceptance:** migrated route data contains no imported HTML document or script payload; runtime rendering does not depend on source-template selectors.

### F09 — Body state and script replay have several competing owners

**P1 · Confirmed; navigation failures require regression tests.** `AuxeroPublicShell.svelte` and `InventoryTemplatePage.svelte` emit a body-class script and also set classes/title in effects. Root layout resets modal classes and body overflow after navigation. `AuxeroRuntimeScripts.svelte:35–77` parses and appends script tags; lines 86–131 poll readiness, while external script errors resolve without an explicit failure signal.

**Action:** remove script replay per migrated feature, use declarative head/layout ownership and let overlay primitives own their lifecycle. **Acceptance:** repeated route changes do not duplicate listeners, leave stale body classes, unlock a different open overlay or require timeout-based reinitialization.

### F10 — Inventory primary content is gated on client viewport detection

**P1 · Confirmed source behaviour.** `InventoryTemplatePage.svelte` starts `mobileRouteVisible` at `false` and changes it from `matchMedia` in `onMount`. The server emits the desktop branch; CSS hides that branch on mobile before the mobile branch exists.

**Action:** make essential content SSR-visible and responsive without a client-only device gate. Separate only genuinely different interactive affordances. **Acceptance:** mobile inventory still has meaningful content and navigation with JavaScript disabled or delayed; hydration does not replace the primary page with a blank frame. The precise browser observations are in [verification](evidence/verification.md).

### F11 — Other routes mount both viewport-specific trees

**P1 · Confirmed.** `ImportRequestTemplatePage.svelte` renders both desktop and mobile wrappers and hides one through CSS. The desktop wrapper includes the legacy public shell/runtime even on a mobile screen. Similar families must be inventoried before consolidating them.

**Action:** share content/state/form logic and avoid mounting inactive controllers, while allowing different layouts. **Acceptance:** no duplicate active form IDs, duplicate analytics events, hidden focusable controls or unnecessary desktop runtime on mobile. CSS-hidden images are not assumed to be free; verify actual requests.

### F12 — Overlay abstraction is valuable, but ownership is still duplicated

**P1 · Confirmed implementation; behavioural risk.** The new `MobileSheet.svelte` uses Vaul while manually saving/restoring focus, changing body overflow, pushing browser history and handling `popstate`. It also has literal stacking values 1400/1401. Bits/Vaul already supply substantial dialog behaviour.

**Action:** test the existing contract before simplifying it. Keep the gesture library until parity is demonstrated. Use one documented overlay stacking policy and a SvelteKit-compatible shallow-history integration. **Acceptance:** back closes the intended sheet once, nested sheets retain scroll lock, focus returns to a valid trigger, and a route change with a sheet open does not replay obsolete history.

### F13 — Language and number formatting depend on presentation text

**P1 · Confirmed.** Homepage locale detection compares an English title string; inventory uses `showingText.startsWith('Showing')`. `src/lib/utils/format.ts` mixes `fr-FR` and `en-US`; several route compositions hardcode Bulgarian copy and sample-brand titles.

**Action:** pass an explicit locale, use domain values independently of labels and centralize approved number/currency formatting. **Acceptance:** Bulgarian and English retain filters and produce consistent labels, metadata, form errors and formatted values without matching against translated sentences.

### F14 — Data sources and finance presentation have drifted

**P1 · Confirmed.** Homepage page data reads static `vehicles`, while public inventory uses `listPublicVehicles()` to merge fixture and published CMS records. `public-vehicles.ts` invents default dealer/agent slugs, `rating: 4.9`, a generic image and `monthly: Math.round(price / 72)`. A separate amortization function exists in `utils/format.ts`.

**Action:** define a public vehicle contract and one finance-estimate policy. Make missing facts explicit rather than manufacturing ratings or plausible vehicle photography. **Acceptance:** homepage/detail/inventory/compare agree on the same vehicle; financial estimates share inputs and assumptions; unavailable images are honest placeholders, not another model presented as evidence.

### F15 — Query parsing is centralized, but legacy option surface remains large

**P1 · Confirmed.** `server/inventory-state.ts` already owns aliases, sorting and filters. It also supports several views/layouts/filter presentations and historical field aliases. Its query parser maps `q`, `query` and `model` together. Separate desktop/mobile transformation modules remain substantial.

**Action:** retain the tested parser as the migration boundary, specify canonical serialization and validate facet dependencies. Retire options only after a product/compatibility decision. **Acceptance:** URL round trips, shared links, back/forward, reset, zero results and details-return preserve state across both viewports.

### F16 — Demo versus live behaviour is inferred from database presence

**P0 for live reuse · Confirmed.** `inquiry-config.ts` uses the presence of `DATABASE_URL` as its mode switch. `auth.ts` deliberately supports prototype roles and permissive demo credentials when no inquiry database is configured. Database-mode inquiry protection is stronger and is covered by tests.

**Action:** introduce an explicit validated preview/live mode and independently gated capabilities. Missing required live configuration must stop or disable the feature, not reactivate prototype access. **Acceptance:** configuration-matrix tests prove that production capability cannot be enabled through a role query/header or an accidental missing environment variable. This is not a claim that the currently deployed site has been exploited.

### F17 — Sessions and non-inquiry persistence are not a production storage design

**P0 for live accounts/CMS · Confirmed.** `db.ts:87` stores sessions in a module-level array. `cms-persistence.ts` writes JSON under `.daynight-cms` and files under `static/uploads/cms`; atomic rename does not make a read-modify-write collection safe across multiple processes. Session-cookie string construction in `auth.ts` lacks a `Secure` attribute.

**Action:** keep local fixture persistence explicitly demo-only; define durable live session/content storage, per-operation authorization and safe cookie settings. **Acceptance:** restart/multiple-instance tests and live configuration checks pass, or the unsupported capability remains disabled. Do not require a full new CMS just to polish the storefront.

### F18 — Upload and request boundaries need a live-use threat review

**P0 for live uploads; P1 otherwise · Confirmed code; exposure unverified.** `cms-persistence.ts` accepts an extension **or** a declared MIME type, preserves the resulting extension, and makes document URLs public. It limits per-file size/count, but request parsing happens before those checks. `api.ts` safely handles malformed JSON, but its form-data path and endpoint-specific total-body limits require further tests.

**Action:** validate actual bytes and a consistent MIME/extension pair, bound total request consumption, separate private documents from public image assets, and apply authorization before expensive work. **Acceptance:** malformed/mismatched/oversized uploads fail safely in synthetic tests and private documents are not published by default. Do not infer deployed exploitability from this static finding alone.

### F19 — Optional AI capability inherits the demo-auth boundary

**P0 for enabling a paid provider · Confirmed conditional risk.** `admin/copilot/chat/+server.ts` calls the page-session guard, then calls a real provider whenever its API key exists. Under the current demo mode, page sessions may be synthesized by route. The endpoint has request-schema checks, but independent capability/permission/cost limits must not be inferred from the presence of the key.

**Action:** require explicit live capability plus real authorization; bound messages, context, execution and spend. Keep synthetic fallback labelled and isolated. **Acceptance:** a provider key alone cannot enable a paid endpoint in preview mode, and tests never call the provider.

### F20 — Dependency health requires deliberate remediation

**P0/P1 depending on reachable capability · Confirmed scanner output.** The full npm audit reported 20 affected packages: 5 high, 8 moderate, 7 low, 0 critical. The production-dependency filter reported 11. These counts include transitive/effect entries and are not counts of distinct exploitable application defects. Development dependencies can still participate in the built runtime, so `--omit=dev` is not a deployment threat model.

**Action:** review advisory reachability, update compatible families and re-run the audit. Do not run `npm audit fix --force`: the scanner suggested a major-changing Drizzle Kit downgrade, and some relevant patches require explicit review. **Acceptance:** every remaining advisory has a scoped exposure decision, owner and expiry/recheck condition; release blockers are actually resolved or the capability is disabled.

### F21 — Automated quality gates are incomplete

**P1 · Confirmed.** There are three tracked test files and no tracked E2E tests or `.github/workflows` files. `verify` omits build and E2E. `lint` chains Prettier before ESLint, so a formatting failure prevents the second check from running.

**Action:** separate format/lint reporting, add component and browser tests, and introduce CI with immutable lockfile installation and visual artifacts. **Acceptance:** the gates in [10](10-testing-and-quality-gates.md) run automatically and fail on actual regressions rather than silently skipping a stage.

### F22 — Asset volume and ownership need analysis, not blind conversion

**P2 · Confirmed inventory.** `static/` contains about 168.7 MiB across 828 files, including 225 JPG, 190 PNG and 275 WebP files. Several PNG cutouts exceed 2 MiB. `static/assets/app.css` alone is 397,415 bytes before transfer compression. These are repository sizes, not proof that each file is requested on each page.

**Action:** trace rendered requests and source references; produce size variants for active raster images; archive source masters outside runtime assets when safe. **Acceptance:** active images have appropriate dimensions/loading policy, and deletion candidates have no source/template/CSS/packaging consumers. Retain SVG logos and provenance.

### F23 — Metadata and reusable identity are coupled to sample content

**P1 · Confirmed.** Sitemap origin comes from `daynightBrand.domain`, all `lastmod` values use one fetched timestamp, several route titles are literal sample-brand strings and headers are extracted from template HTML. This is easy to miss during a dealer clone.

**Action:** use a safe site configuration and explicit page metadata; distinguish preview indexing policy from live release. **Acceptance:** the second-brand suite finds no unintended sample names/domains in rendered head, JSON data, API messages, images or sitemap output; mounted URLs are separately verified in Cars.

### F24 — Experimental routes and template assets need explicit disposition

**P2 · Confirmed reachability candidates, not proven dead code.** Native routes include `/home-clean`, `/home1`, `/home1-tabs`, `/home2`, `/compare-clean` and `/offer`. The catch-all adapter and selected template globs make some legacy files real consumers even when no ordinary component import exists.

**Action:** classify every route as supported, compatibility redirect, deliberate preview or removal candidate. **Acceptance:** an approved route manifest and redirect tests replace guesswork. Do not remove `.template-ref` while `auxero-template.ts` still imports it.

### F25 — Icon and primitive-library cleanup should be evidence-driven

**P2 · Confirmed import scan.** Lucide has 88 source importers; the Hugeicons pair has one source importer; Tabler has none in the source scan. There are many generated UI primitives and multiple design families.

**Action:** keep useful existing primitives, consolidate the icon policy and prove dependency reachability before removal. **Acceptance:** removal passes source/config/script/glob checks, build and representative UI screenshots. Zero source importers is only a candidate signal, particularly for build-time packages.

### F26 — Architecture/reuse ownership is broader than this repository

**P1 · Confirmed documented contract.** `docs/CARS-INTEGRATION.md` states that Cars owns dealer source, immutable template promotion and mounted packaging, including `/variant-2/`. Standalone root-path success is not mounted QA.

**Action:** include a packaging compatibility checkpoint before changing source shapes or removing adapters. **Acceptance:** an approved immutable release is tested in both environments; existing dealers are not automatically rewritten. This task neither accessed nor modified the Cars repository.

### F27 — Typography and desktop composition need visual decisions, not just clean code

**P1 · Confirmed implementation inconsistency; product judgement remains.** Desktop pages override type sizes, line heights, card internals, section rhythm and surfaces independently. The existence of a shared scale does not make those values correctly applied. Source order is also changed by broad mobile CSS ordering in `HomeFiveTemplatePage.svelte`.

**Action:** review a compact set of role specifications and reference pages, then encode approved choices once. **Acceptance:** desktop has consistent container alignment, readable hierarchy, stable tab geometry and contextual density; the approved mobile design remains recognizable. No promise is made that moving files alone improves the UI.

### F28 — Baseline reproducibility needs an explicit environment contract

**P1 · Confirmed.** The audit ran on Node 24.21.0/npm 11.19.0, but the manifest does not encode a matching runtime/package-manager contract. The application uses adapter-auto and a symlink-preservation setting. An initial cross-drive audit build with shared dependency junctions failed on a generated Vite entry name. A subsequent independent copy with its own `npm ci` dependencies built successfully. This isolates the first failure to the audit environment; it is not an outstanding source-build failure. Adapter-auto did not detect a deployment target in the local environment, so deployment qualification remains separate.

**Action:** codify the successful clean-install/build procedure for supported Windows and CI environments; document why symlink handling is needed. **Acceptance:** an ordinary clean checkout with retained lockfile can build without an existing local dependency tree or local generated cache.

## Coverage still required before release

A full keyboard/screen-reader review, production-like delivery/storage tests, all admin permissions, all legacy raw-template routes, image-byte/performance baselines, all browser engines and mounted Cars behaviour remain explicit phase work. Current-source browser samples and their limits are recorded separately. The audit did not read `.env` secrets, inspect private CMS records, send inquiries, call AI providers or test a live deployment.
