> Historical source document. It does not override AGENTS.md or the current architecture/design contracts.

# Day Night Auto — Svelte 5 De-Templating Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the server-side HTML-template string pipeline and runtime DOM mutation with native Svelte 5 components for every desktop and mobile route, delete the ~11k lines of template machinery and the 28-file `.template-ref/` HTML kit, while keeping every page pixel-identical (or better) — verified by the existing `visual-parity` screenshot harness.

**Architecture:** The storefront is a jQuery-era Themesflat/"Aurexo" HTML template wrapped in SvelteKit. At request time, raw `.template-ref/*.html` files are run through a chain of `.replaceAll()` transforms (`daynight-template-content.ts`, 3,849 lines), have header/footer/nav generated as HTML strings (`daynight-template-chrome.ts`, 783 lines), get ~129 KB of CSS and ~600 lines of JS injected (`daynight-template-styles.ts` 4,986 lines, `daynight-template-renderer.ts` 810 lines), are split by HTML comments into header/main/footer (`rendered-template-page.ts`), injected via `{@html}` (`TrustedTemplateHtml`), then mutated again on the client (`TemplateLocalBehaviors.svelte`, 1,012 lines; `inventory-quick-filter-runtime.ts`, 756 lines of `display:none` DOM filtering). **Mobile is already fully native Svelte 5.** Desktop is a hybrid: native section components exist but are interleaved with injected template HTML. This plan finishes the desktop side, then deletes the pipeline.

**Tech Stack:** SvelteKit 2.57 · Svelte 5.55 (runes) · Vite 8 · Tailwind v4 (partial) · Neon Postgres · Drizzle · Better Auth · adapter-node · Vitest 4 · Playwright 1.59 (visual parity harness).

---

## Backend Launch Notes (2026-06-18)

This root file is historical for the de-templating migration, but the current launch backend is:
Neon Postgres + Drizzle + Better Auth with hand-written SQL migrations as the applied DDL.
`src/lib/server/db/schema.ts` is the typed mirror, guarded by `npm run check:schema-drift` in CI.

Production bootstrap order:

1. Configure `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
   `CHAT_COOKIE_SECRET`, and `DEFAULT_DEALER_SLUG=daynight-auto`.
2. Run `npm run db:migrate`.
3. Run `npm run neon:seed` to apply the dealer seed and import the real DayNight catalog, vehicle
   photos, and blog posts from `src/lib/data/daynight-vehicles.ts` / `src/lib/data/daynight-blog.ts`.
4. Set `ADMIN_EMAIL`, either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_FILE` (at least 12 chars),
   optional `ADMIN_AUTH_USER_ID`, optional `ADMIN_NAME`, and `ADMIN_ROLE=agency_admin`, then run
   `npm run neon:link-admin` to create/update the Better Auth user, credential account, and dealer
   profile.
5. Verify `/admin/login`, `/inventory`, one real PDP, `POST /api/auth/sign-up/email` rejection, and
   feed/assistant rate-limit behavior against the preview or production environment.

`profiles.auth_user_id` is constrained to Better Auth `user.id` by the `0003_profiles_auth_user_fk`
migration, so staff profiles cannot drift away from real auth users.

Vercel uses `vercel.json` to run `npm run build:deploy`, which executes `check:backend-env` before
`vite build`. A production deployment missing required backend secrets should fail before build.

## The 1:1 Guarantee — Read This First

The single most important rule of this migration: **never delete a template branch until a native component renders identically in its place, proven by screenshot diff.**

The repo already ships the exact tool for this:

```bash
npm run visual:baseline   # capture reference screenshots of every route, desktop + mobile
npm run visual:verify     # re-screenshot and diff against baseline
```

(`scripts/visual-parity.mjs` covers home, inventory, detail, about, services, contact, sell-your-car, financing, reviews, favorites at both viewports.)

**Workflow for every migration task in Phases 2–4:**

1. `npm run visual:baseline` must already reflect the _current_ (template) look. Capture it once at the start of Phase 0 and commit the baseline.
2. Build the native replacement behind a flag / parallel route.
3. Switch the route to the native component.
4. `npm run visual:verify` → **must pass with zero or sub-threshold diff.** If it regresses, the native component is wrong, not the baseline.
5. Only then delete the template branch for that route.
6. Commit.

If a route is not covered by `visual-parity.mjs`, **add it to the harness route list before migrating it** (see Task 0.2). No route gets migrated without a screenshot gate.

"Or better" changes (the optional polish in Phase 6) are made _after_ 1:1 is achieved and are screenshot-reviewed as deliberate, separate commits so the diff is auditable.

---

## Svelte 5 Best-Practices Conventions (binding rules for every component in this plan)

Every component created or touched by this migration MUST follow these. They reflect `svelte-core-bestpractices`. The current codebase already passes most (zero `export let` / `on:` / `$:` / `<slot>` / stores; every `{#each}` is keyed) — these rules keep new code at that bar and fix the few remaining gaps.

**Reactivity:**

- Use `$state` **only** for values that drive the template/`$derived`/`$effect`. Plain data (props you don't mutate, constants) stays a normal `let`/`const`.
- Large arrays/objects that are **reassigned, not mutated** (e.g. the `vehicles` list from a load function, API responses) → `$state.raw` (or just a prop), **never** deep `$state`. Deep-proxying a 140-item vehicle array for fine-grained reactivity we don't need is wasted overhead.
- Compute with `$derived` / `$derived.by`, **never** `$effect` that assigns state. (`$derived` takes an expression; use `$derived.by(() => {...})` for multi-line.)
- `$effect` is an escape hatch — avoid it. Never wrap effect bodies in `if (browser)` (effects don't run on the server anyway).
- Props can change: anything computed from a prop uses `$derived`, not a one-time assignment.

**Events & lifecycle:**

- Native handlers only: `onclick={...}` (already the case — keep it). No `on:click`.
- `window`/`document` listeners → `<svelte:window onscroll={...}>` / `<svelte:document onvisibilitychange={...}>`, **not** `onMount`/`$effect` with `addEventListener`.
- Syncing to an external/imperative library (Swiper, a map SDK, the image-fallback helper) → **`{@attach ...}`**, not `onMount` and not `use:` actions.
- **Exception — keep `use:enhance`.** It is the official SvelteKit progressive-enhancement API for `<form>` actions, not a legacy action. Currently the **only** `use:enhance` is the admin login (`src/routes/admin/login/+page.svelte`); Phase 3.8/3.9 will add it to the new native contact/sell-your-car form actions. Do not "modernize" it away.

**Markup:**

- Every `{#each}` is keyed with a stable unique id: `{#each sortedVehicles as v (v.slug)}`, `{#each vehicle.features as f (f.id)}`. **Never** the index as key. Don't destructure the item if you need to `bind:` into it.
- Reusable markup chunks (mega-menu columns, repeated card layouts, table rows) → `{#snippet}` + `{@render}`, passed as props where a child needs them. No `<slot>`.
- Dynamic components → `<DynamicComponent>` (a capitalized variable rendered directly); `import Self from './X.svelte'` for recursion. No `svelte:component`/`svelte:self`.
- `class` attribute: prefer clsx-style arrays/objects — `class={['card', { 'is-active': active }]}` — over the `class:` directive for new code.

**State sharing & SSR safety (critical):**

- Shared reactive state = **a class with `$state` fields**, never Svelte stores (`writable`/`readable`).
- **Never export a module-level singleton instance of stateful class** (e.g. `export const store = new InventoryFilterState()`). On the server that instance is shared across all concurrent requests → **state leaks between users.** Provide per-request/per-page state via **`createContext`** (type-safe; the pattern `garage.svelte.ts` already uses) or a **factory** instantiated inside the component (`createInventoryFilterState(data.vehicles)`). The shared module exports the _class/factory and pure functions_, not a live instance.

**Styling:**

- Prefer scoped component `<style>`. During the 1:1 phases we deliberately reuse the template's global class names so existing CSS renders components identically — that's a temporary, intentional exception. Phase 6 migrates the still-needed rules into scoped `<style>` (or keeps them global only where justified, e.g. base reset).
- Parent→child styling via CSS custom properties (`<Child --color="red" />` + `var(--color)`), or `:global` only for library children. JS→CSS values via `style:--prop={value}`.

**Verification (enforced, not aspirational):** `npm run check` (svelte-check) and `npm run lint` (`eslint-plugin-svelte`) must be green at every commit. Use **ripgrep** (`rg`) — this is a Windows/PowerShell repo and the project standardizes on `rg`, not GNU `grep --include`. The legacy-syntax gate must return **zero** matches in `src`:

```bash
rg -n "export let |on:click|on:change|on:submit| \$: |<slot|svelte:component|svelte:self|from 'svelte/store'" src -g '*.svelte' -g '*.ts'
```

**`use:` allowlist gate** (`use:enhance` is the official SvelteKit API and stays; image-fallback `use:` exists until Task 6.4b): the only allowed matches are exactly **1× `use:enhance`** (admin login) **+ 7× `use:daynightImageFallback`** until 6.4b removes the latter. Any other `use:` is a violation:

```bash
rg -n "\buse:" src -g '*.svelte' | rg -v "use:enhance|use:daynightImageFallback"   # must be empty
```

---

## Current-State Inventory (what we are deleting)

| Concern                            | File(s)                                                                                        | Lines    | Fate                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------- |
| Content string transforms          | `src/lib/server/daynight-template-content.ts` (+ `.spec.ts`)                                   | 3,849    | **DELETE** (Phase 5)                               |
| Injected CSS generator             | `src/lib/server/daynight-template-styles.ts`                                                   | 4,986    | **DELETE** (Phase 5)                               |
| Header/footer/nav HTML strings     | `src/lib/server/daynight-template-chrome.ts`                                                   | 783      | **DELETE** → native chrome (Phase 2)               |
| Render orchestrator + JS injection | `src/lib/server/daynight-template-renderer.ts`                                                 | 810      | **DELETE** (Phase 5)                               |
| HTML split / parse                 | `src/lib/server/rendered-template-page.ts`, `template-route-page.ts`                           | 283      | **DELETE** (Phase 5)                               |
| Client DOM mutation runtime        | `src/lib/components/template/TemplateLocalBehaviors.svelte`                                    | 1,012    | **DELETE** (Phase 4/5)                             |
| Desktop inventory DOM filter       | `src/lib/components/inventory/desktop/inventory-quick-filter-runtime.ts` (+ state/dom helpers) | ~900     | **REPLACE** with shared reactive store (Phase 1/3) |
| `{@html}` injectors                | `TrustedTemplateHtml.svelte`, `TrustedMutableTemplateHtml.svelte`, `RawTemplatePage.svelte`    | 183      | **DELETE** (Phase 5)                               |
| Catch-all route                    | `src/routes/[...templatePath]/+page.svelte` + `+page.server.ts`                                | 87       | **DELETE** → real routes (Phase 3)                 |
| Reference HTML kit                 | `.template-ref/*.html`                                                                         | 28 files | **DELETE** (Phase 5)                               |
| Dead jQuery / vanilla JS           | `static/assets/js/*` (16 files, keep only swiper)                                              | ~13,300  | **DELETE** (Phase 0)                               |
| Heavy global CSS                   | `static/assets/app.css` (424 KB), `src/lib/styles/daynight-home-desktop.css` (196 KB)          | 27k      | **SPLIT / SLIM** (Phase 1 + 6)                     |

**Keep as-is (already good):** all `Mobile*.svelte` components, `src/lib/state/garage.svelte.ts`, `src/lib/data/*` data files, `src/lib/server/repositories/*`, `src/lib/server/cms/schemas.ts`, the admin app (`src/routes/admin/*`), API routes (`src/routes/api/*`), `src/lib/components/ui/*` (shadcn-svelte).

---

## Phasing Overview

- **Phase 0** — Safety net + zero-risk cleanup (baseline screenshots, delete dead JS, untrack artifacts). No visual change.
- **Phase 1** — Shared foundations (unified tokens, base-CSS extraction, shared inventory filter store, centralized site data).
- **Phase 2** — Native chrome (header/nav/footer as Svelte components, killing `daynight-template-chrome.ts`).
- **Phase 3** — Route-by-route: real SvelteKit routes with native desktop+mobile components, deleting catch-all branches one at a time.
- **Phase 4** — Inventory & detail de-templating (the hybrid desktop pages + DOM-runtime filter).
- **Phase 5** — Decommission the pipeline (delete all template machinery + `.template-ref/`).
- **Phase 6** — "Or better": CSS slimming, single-tree rendering, Svelte 5 hygiene (image-fallback `{@attach}`, optional `class:`→clsx), perf budgets, final best-practices gate.

Each phase ends green: `npm run check`, `npm run lint`, `npm run test:unit -- --run`, and `npm run visual:verify` all pass before moving on. New/touched components additionally satisfy the **Svelte 5 Conventions** section (enforced by the grep gate in Task 6.5).

---

## Phase 0 — Safety Net & Zero-Risk Cleanup

No visual change. Establishes the screenshot gate and removes provably-dead weight.

### Task 0.1: Branch and freeze the baseline

**Files:** none (git).

- [ ] **Step 1: Create the migration branch**

```bash
git checkout -b svelte5-detemplate
git status   # confirm clean-ish; stash unrelated WIP if needed
```

- [ ] **Step 2: Build once to confirm the app is green before touching anything**

Run: `npm run check && npm run build`
Expected: both succeed. If `check` already has errors, record them in this file under "Pre-existing errors" so we don't blame the migration for them later.

- [ ] **Step 3: Commit the starting point**

```bash
git add -A && git commit -m "chore: start svelte5 de-templating branch"
```

### Task 0.2: Make the visual-parity harness cover every route

**Files:**

- Modify: `scripts/visual-parity.mjs` (route list)

- [ ] **Step 1: Read the current route list**

Run: `grep -n "routePath\|pathname\|routes" scripts/visual-parity.mjs | head -40`
Identify the array of routes it screenshots.

- [ ] **Step 2: Add every storefront route that will be migrated**

Ensure the route list includes (desktop + mobile each): `/`, `/inventory`, `/inventory/map`, `/inventory/<a-real-slug>`, `/about`, `/about/daynight-auto-plovdiv`, `/contact`, `/services`, `/sell-your-car`, `/financing`, `/reviews`, `/team`, `/team/<a-real-slug>`, `/faq`, `/terms`, `/blog`, `/blog/<a-real-slug>`, `/calculator`, `/compare`, `/favorites`. Pull two real slugs from `src/lib/data/daynight-vehicles.ts` and `src/lib/data/daynight-team.ts` so the URLs resolve.

- [ ] **Step 3: Capture the canonical baseline against the CURRENT template build**

```bash
npm run build && npm run preview &   # or however the harness expects the server
npm run visual:baseline
```

Expected: baseline PNGs written for all routes × 2 viewports. **This is the source of truth for "1:1".**

- [ ] **Step 4: Commit the baseline**

```bash
git add scripts/visual-parity.mjs <baseline dir>
git commit -m "test: expand visual-parity coverage + freeze template baseline"
```

### Task 0.3: Delete dead jQuery / vanilla template JS

**Files:**

- Delete: `static/assets/js/{app,filterCar,shop,marker,maps,plugin,switcher,count-down,countto,gear-slider,simpleParallaxVanilla.umd,jquery.fancybox,jquery.min,jquery.cookie.min,wow.min,infobox.min}.js`
- Keep: `static/assets/js/swiper-bundle.min.js`, `static/assets/js/swiper.js`
- Check: `src/lib/server/template-asset-policy.ts` (the script allowlist)

- [ ] **Step 1: Confirm nothing references them**

Run: `grep -rn "filterCar\|fancybox\|wow.min\|simpleParallax\|infobox\|count-down\|countto\|gear-slider\|switcher\.js\|plugin\.js\|marker\.js\|maps\.js\|shop\.js\|app\.js" src static/assets/scss .template-ref | grep -v "swiper"`
Expected: only matches inside `.template-ref/*.html` (the dead kit, deleted later) and/or `template-asset-policy.ts` allowlist comments. No live `src/` references except the policy file.

- [ ] **Step 2: Delete the files**

```bash
cd static/assets/js
rm app.js filterCar.js shop.js marker.js maps.js plugin.js switcher.js \
   count-down.js countto.js gear-slider.js simpleParallaxVanilla.umd.js \
   jquery.fancybox.js jquery.min.js jquery.cookie.min.js wow.min.js infobox.min.js
cd -
```

- [ ] **Step 3: Verify build + screenshots unchanged**

Run: `npm run build && npm run visual:verify`
Expected: build passes; visual diff = 0 (these scripts were never loaded). If any route regresses, a script was live — restore it and investigate.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: delete dead jQuery/vanilla template scripts (~13k lines)"
```

### Task 0.4: Remove dead `wow`/`animated` CSS classes from components

**Files (remove `wow fadeIn*`, `animated`, `data-wow-delay` attributes only — leave layout classes):**

- `src/lib/components/inventory/desktop/InventoryMapPageShell.svelte`
- `src/lib/components/inventory/desktop/VehicleCard.svelte`
- `src/lib/components/template/DesktopDashboardFavorites.svelte`
- `src/lib/components/template/DesktopFinancingPage.svelte`
- `src/lib/server/daynight-inventory-template.ts`

- [ ] **Step 1: Find every occurrence**

Run: `grep -rn "wow fadeIn\|wow fadeInUp\|data-wow-delay\|class=\"animated\"\| animated\b" src`

- [ ] **Step 2: Strip the animation classes/attrs, keep functional classes**

For each: `class="card-box wow fadeIn" data-wow-delay="0.1s"` → `class="card-box"`. The WOW.js script is already deleted, so these are inert; removing them is cosmetic-neutral.

- [ ] **Step 3: Verify**

Run: `npm run visual:verify`
Expected: 0 diff.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove inert WOW animation classes"
```

### Task 0.5: Untrack build/audit artifacts and fix `.gitignore`

**Files:**

- Modify: `.gitignore`
- Untrack: `.audit-shots/`, `audit/`, `.sa-brands6.png`, any other generated screenshots

- [ ] **Step 1: Add ignores**

Append to `.gitignore`:

```
# generated audit/screenshot artifacts
.audit-shots/
audit/
*.audit.png
.sa-brands*.png
```

- [ ] **Step 2: Untrack already-committed artifacts (keep on disk)**

```bash
git rm -r --cached --ignore-unmatch .audit-shots audit .sa-brands6.png
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: untrack generated audit artifacts"
```

---

## Phase 1 — Shared Foundations

These unblock everything else and remove duplication. Each is screenshot-gated.

### Task 1.1: Unify design tokens into one stylesheet

**Problem:** Mobile uses `--sa-*` (in `src/lib/styles/daynight-mobile.css`); desktop uses a parallel `--sa-home-*` set (defined inside `daynight-home-desktop.css`); desktop CSS also hardcodes brand hex (`#B00000` ×49, `#e11c2a` ×36) instead of tokens.

**Files:**

- Create: `src/lib/styles/tokens.css`
- Modify: `src/lib/styles/daynight-mobile.css` (import tokens / move `:root`)
- Modify: `src/lib/styles/daynight-home-desktop.css` (reference tokens)
- Modify: `src/routes/+layout.svelte` (import order)

- [ ] **Step 1: Create `tokens.css` as the single source of truth**

Move the `:root { --sa-* }` block out of `daynight-mobile.css` into `tokens.css`. Add the brand palette as named tokens so both viewports share them:

```css
:root {
	/* brand */
	--sa-blue: #b00000;
	--sa-red: #e11c2a;
	--sa-red-strong: #d51024;
	--sa-ink: #111827;
	/* ...migrate the full existing --sa-* set here verbatim... */
}
```

Keep the desktop-only `--sa-home-*` aliases for now but point them at the shared tokens (`--sa-home-weight-regular: var(--sa-weight-regular);`) so nothing visually shifts yet.

- [ ] **Step 2: Import tokens first, everywhere**

In `src/routes/+layout.svelte`, ensure `import '$lib/styles/tokens.css';` precedes `import '$lib/styles/daynight-mobile.css';`.

- [ ] **Step 3: Verify nothing moved visually**

Run: `npm run visual:verify`
Expected: 0 diff (tokens resolve to the same values).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: unify design tokens into tokens.css"
```

> Replacing the 85 hardcoded desktop hex literals with `var(--sa-*)` is deferred to Phase 6 (pure cleanup, screenshot-gated), so it never blocks route migration.

### Task 1.2: Extract the base reset from `app.css` (CAREFULLY)

**Why this is dangerous:** project memory records this broke phones twice (Times New Roman / underlined links) because `app.css` holds the GLOBAL base reset that mobile depends on, fused with 400 KB of desktop/vendor CSS. **Do not gate `app.css` off mobile.** Instead, _extract_ the small base layer into its own always-loaded file, then the heavy remainder can be desktop-gated later.

**Files:**

- Create: `static/assets/base.css` (small: reset, base typography, form-control resets — the part mobile needs)
- Modify: `static/assets/app.css` (remove the extracted base rules)
- Modify: `src/routes/+layout.svelte` (load `base.css` unconditionally on all non-admin routes)
- Reference: `src/lib/data/template-route-asset-policy.ts` (asset gating)

- [ ] **Step 1: Identify the base layer**

Read the top of `static/assets/app.css`. The base layer = the `*`/`html`/`body`/`a`/`button`/`input`/heading reset and base font declarations (roughly the first reset block). Everything below (Swiper, FancyBox, `.listing-*`, `.dashboard-*` grid utilities) is desktop/template-only.

- [ ] **Step 2: Move the base layer into `base.css`**

Copy the reset + base typography rules into `static/assets/base.css` verbatim. Leave them in `app.css` for now (duplication is temporarily safe — same rules).

- [ ] **Step 3: Load `base.css` unconditionally**

In `+layout.svelte`'s `<svelte:head>`, add `<link rel="stylesheet" href="/assets/base.css">` for all non-admin routes (alongside the existing mobile CSS import). Now the base layer is guaranteed on mobile even when `app.css` is later gated off.

- [ ] **Step 4: Verify on BOTH viewports and a real device-width**

Run: `npm run visual:verify`
Then manually: load `/` and `/inventory` at 390px width in a browser and confirm fonts/links look right (not serif, not underlined). This is the exact regression memory warns about.
Expected: 0 diff; mobile typography intact.

- [ ] **Step 5: Now remove the base rules from `app.css` (dedupe)**

Delete the base block from `app.css` (it now lives in `base.css`). Re-run `npm run visual:verify`. Expected: 0 diff.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "refactor: extract base reset into always-loaded base.css"
```

> Actually desktop-gating the slimmed `app.css` happens in Phase 6 once the template pipeline (which assumes `app.css` is present) is gone.

### Task 1.3: Build a shared, reactive inventory filter store

**Problem:** desktop filters by mutating the DOM (`inventory-quick-filter-runtime.ts`, `style.display='none'`, 756 lines); mobile filters with reactive `$derived` state (`mobileInventoryFilters.svelte.ts`). `normalize()`, `priceMatches()`, `mileageMatches()`, brand→model scoping are duplicated with divergent implementations. This must be unified before the desktop inventory page can be native.

**Files:**

- Create: `src/lib/state/inventory-filters.svelte.ts` (shared store + pure matchers)
- Reference (to merge from — read these for the EXACT current behavior): `src/lib/components/inventory/mobile/MobileInventoryPage.svelte` (the canonical reactive impl), `src/lib/components/inventory/mobile/mobileInventoryFilters.svelte.ts` (helpers + `sortVehicles`), `src/lib/components/inventory/mobile/mobileInventoryTypes.ts` (`SortKey`), `src/lib/components/inventory/desktop/inventory-quick-filter-state.ts`, `daynight-quick-filter-dom.ts`
- Test: `src/lib/state/inventory-filters.spec.ts`

> **DO NOT invent band values, sort keys, or dimensions.** The store must be a byte-for-byte behavior port of what `MobileInventoryPage.svelte` does today. The verified ground truth (read from the source, 2026-06-14):

**Filter compatibility matrix — every dimension that exists today and MUST be preserved:**

| Dimension    | Field          | Type              | Init from URL           | Match rule                                                                                                                                                                                                                                                            |
| ------------ | -------------- | ----------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Free text    | `query`        | `string`          | `?q=`                   | **multi-term AND** (`needle.split(/\s+/).every(...)`) over a 12-field haystack: title, shortTitle, brand, model, body, fuel, transmission, year, mileage, color, `features.join(' ')`, `highlights.join(' ')` (normalized `bg-BG`). NOT a single contiguous substring |
| Brand        | `brand`        | `string[]`        | `?brand=` (comma-split) | `brand.length === 0 \|\| brand.includes(v.brand)`                                                                                                                                                                                                                     |
| Model        | `model`        | `string[]`        | `?model=`               | as brand; model options are scoped to selected brands                                                                                                                                                                                                                 |
| Body         | `body`         | `string[]`        | `?body=`                | `body.length === 0 \|\| body.includes(v.body)`                                                                                                                                                                                                                        |
| Fuel         | `fuel`         | `string` (single) | `?fuel=`                | `!fuel \|\| v.fuel === fuel`                                                                                                                                                                                                                                          |
| Transmission | `transmission` | `string` (single) | `?transmission=`        | `!transmission \|\| v.transmission === transmission`                                                                                                                                                                                                                  |
| Price band   | `price`        | `string`          | `?price=`               | see bands below; unknown/empty = pass                                                                                                                                                                                                                                 |
| Mileage band | `mileage`      | `string`          | `?mileage=`             | see bands below; unknown/empty = pass                                                                                                                                                                                                                                 |
| Sort         | `sort`         | `SortKey`         | (not URL)               | default `'price-asc'`; keys: `price-asc`,`price-desc`,`year-desc`,`mileage-asc`; **image-health tiebreak first**                                                                                                                                                      |

**Real price bands** (`limit` = `value <= limit`, `min` = `value > min`): `under-10000`(≤10000), `under-20000`(≤20000), `under-30000`(≤30000), `under-50000`(≤50000), `over-50000`(>50000). **Real mileage bands** (all `limit`): `under-50000`, `under-100000`, `under-150000`, `under-200000`. An unrecognized band value behaves as "no filter" (current behavior — preserve it).
`sortVehicles` already applies an **image-health priority tiebreaker** (`getImageHealthPriority`, placeholder images sink) BEFORE the sort key — port it verbatim, do not drop it.

- [ ] **Step 1: Write the failing test (REAL bands, REAL sort keys, every dimension)**

```ts
// src/lib/state/inventory-filters.spec.ts
import { describe, it, expect } from 'vitest';
import {
	normalize,
	priceMatches,
	mileageMatches,
	vehicleMatches,
	sortVehicles
} from './inventory-filters.svelte';

const v = (over: Partial<any> = {}) => ({
	slug: 'x',
	title: 'BMW i7 2023',
	shortTitle: 'BMW i7',
	brand: 'BMW',
	model: 'i7',
	body: 'Седан',
	fuel: 'Бензин',
	transmission: 'Автоматична',
	year: 2023,
	mileage: '40 000 км',
	mileageValue: 40000,
	color: 'Черен',
	price: 30000,
	features: [] as string[],
	highlights: [] as string[],
	...over
});

describe('inventory matchers (real bands)', () => {
	it('normalizes Bulgarian casing', () => expect(normalize('  МЕРцедес ')).toBe('мерцедес'));

	it('price bands match the real limit/min values', () => {
		expect(priceMatches(10000, 'under-10000')).toBe(true);
		expect(priceMatches(10001, 'under-10000')).toBe(false);
		expect(priceMatches(60000, 'over-50000')).toBe(true);
		expect(priceMatches(50000, 'over-50000')).toBe(false); // min is exclusive
		expect(priceMatches(99999, '')).toBe(true); // empty = no filter
		expect(priceMatches(99999, 'bogus-band')).toBe(true); // unknown = no filter (current behavior)
	});

	it('mileage bands', () => {
		expect(mileageMatches(50000, 'under-50000')).toBe(true);
		expect(mileageMatches(150001, 'under-150000')).toBe(false);
	});

	it('every dimension: brand[], model[], body[], fuel, transmission combine (AND)', () => {
		const crit = {
			query: '',
			brand: ['BMW'],
			model: ['i7'],
			body: ['Седан'],
			fuel: 'Бензин',
			transmission: 'Автоматична',
			price: 'under-50000',
			mileage: 'under-50000'
		};
		expect(vehicleMatches(v(), crit)).toBe(true);
		expect(vehicleMatches(v({ brand: 'Audi' }), crit)).toBe(false);
		expect(vehicleMatches(v({ fuel: 'Дизел' }), crit)).toBe(false);
		expect(vehicleMatches(v({ body: 'Купе' }), crit)).toBe(false);
	});

	it('free-text query searches features too', () => {
		const crit = {
			query: 'панорама',
			brand: [],
			model: [],
			body: [],
			fuel: '',
			transmission: '',
			price: '',
			mileage: ''
		};
		expect(vehicleMatches(v({ features: ['Панорама'] }), crit)).toBe(true);
		expect(vehicleMatches(v({ features: [] }), crit)).toBe(false);
	});

	it('query is multi-term AND across the whole haystack (not a contiguous substring)', () => {
		const crit = {
			query: 'bmw черен',
			brand: [],
			model: [],
			body: [],
			fuel: '',
			transmission: '',
			price: '',
			mileage: ''
		};
		expect(vehicleMatches(v(), crit)).toBe(true); // 'bmw' in title, 'черен' in color
		expect(vehicleMatches(v({ color: 'Бял' }), crit)).toBe(false); // 'черен' absent
	});

	it('sort default is price-asc with image-health tiebreak preserved', () => {
		const out = sortVehicles(
			[v({ slug: 'a', price: 50000 }), v({ slug: 'b', price: 20000 })],
			'price-asc'
		);
		expect(out[0].slug).toBe('b');
	});
});
```

- [ ] **Step 2: Run it — confirm it fails**

Run: `npm run test:unit -- --run src/lib/state/inventory-filters.spec.ts`
Expected: FAIL ("Cannot find module ./inventory-filters.svelte" / exports undefined).

- [ ] **Step 3: Implement the store + matchers (SSR-safe — factory, not singleton)**

Port the mobile implementation verbatim. Export **pure functions** (`normalize`, `priceMatches`, `mileageMatches`, `vehicleMatches`, `sortVehicles`) and **option lists** (`priceOptions`, `mileageOptions`) — stateless, safe to export directly. Export a **factory `createInventoryFilterState(getVehicles, initialSearch?)`** returning a class instance. **Do not export a module-level instance** (SSR leak).

Two correctness requirements from the review:

1. **Props can change** → the store consumes a **getter** `() => vehicles`, not a captured array, so client-side navigation that swaps the vehicle list updates results. `vehicles` is a `$derived` over the getter (reassign-only, so `$state.raw`-equivalent semantics — a `$derived` of an array is already not deep-reactive).
2. **All dimensions** (`query, brand[], model[], body[], fuel, transmission, price, mileage, sort`) with `sort` defaulting to `'price-asc'`, optionally hydrated from URL search params (matching `MobileInventoryPage` init).

```ts
// src/lib/state/inventory-filters.svelte.ts
import type { InventoryListVehicle } from '$lib/types/inventory';
import type { SortKey } from '$lib/components/inventory/mobile/mobileInventoryTypes';

export function normalize(v: unknown) {
	return String(v ?? '')
		.trim()
		.toLocaleLowerCase('bg-BG');
}

export const priceOptions = [
	{ value: 'under-10000', label: 'До 10 000 EUR', limit: 10000 },
	{ value: 'under-20000', label: 'До 20 000 EUR', limit: 20000 },
	{ value: 'under-30000', label: 'До 30 000 EUR', limit: 30000 },
	{ value: 'under-50000', label: 'До 50 000 EUR', limit: 50000 },
	{ value: 'over-50000', label: 'Над 50 000 EUR', min: 50000 }
] as const;
export const mileageOptions = [
	{ value: 'under-50000', label: 'До 50 000 км', limit: 50000 },
	{ value: 'under-100000', label: 'До 100 000 км', limit: 100000 },
	{ value: 'under-150000', label: 'До 150 000 км', limit: 150000 },
	{ value: 'under-200000', label: 'До 200 000 км', limit: 200000 }
] as const;

// pure matchers — unknown/empty band => pass (current behavior)
export function priceMatches(value: number, band: string) {
	const o = priceOptions.find((b) => b.value === band);
	if (!o) return true;
	if ('limit' in o) return value <= o.limit;
	if ('min' in o) return value > o.min;
	return true;
}
export function mileageMatches(value: number, band: string) {
	const o = mileageOptions.find((b) => b.value === band);
	if (!o) return true;
	return value <= o.limit;
}

export interface InventoryCriteria {
	query: string;
	brand: string[];
	model: string[];
	body: string[];
	fuel: string;
	transmission: string;
	price: string;
	mileage: string;
}
// Verbatim port of MobileInventoryPage filteredVehicles (lines ~194-222).
export function vehicleMatches(v: InventoryListVehicle, c: InventoryCriteria) {
	if (c.brand.length && !c.brand.includes(v.brand)) return false;
	if (c.model.length && !c.model.includes(v.model)) return false;
	if (c.body.length && !c.body.includes(v.body)) return false;
	if (c.fuel && v.fuel !== c.fuel) return false;
	if (c.transmission && v.transmission !== c.transmission) return false;
	if (!priceMatches(v.price, c.price)) return false;
	if (!mileageMatches(v.mileageValue, c.mileage)) return false;
	if (c.query) {
		// EXACT haystack: 12 fields (not a subset), normalized
		const haystack = normalize(
			[
				v.title,
				v.shortTitle,
				v.brand,
				v.model,
				v.body,
				v.fuel,
				v.transmission,
				v.year,
				v.mileage,
				v.color,
				v.features.join(' '),
				v.highlights.join(' ')
			].join(' ')
		);
		// multi-term AND: every whitespace-split term must appear (NOT a single substring)
		const needle = normalize(c.query);
		if (needle && !needle.split(/\s+/).every((term) => haystack.includes(term))) return false;
	}
	return true;
}

// re-export the EXISTING sortVehicles (image-health tiebreak + keys) — move it here unchanged
export { sortVehicles } from '$lib/components/inventory/mobile/mobileInventoryFilters.svelte';

export class InventoryFilterState {
	#getVehicles: () => InventoryListVehicle[];
	// reactive criteria
	query = $state('');
	brand = $state<string[]>([]);
	model = $state<string[]>([]);
	body = $state<string[]>([]);
	fuel = $state('');
	transmission = $state('');
	price = $state('');
	mileage = $state('');
	sort = $state<SortKey>('price-asc');

	constructor(getVehicles: () => InventoryListVehicle[], init?: URLSearchParams) {
		this.#getVehicles = getVehicles;
		if (init) {
			// hydrate from URL exactly like MobileInventoryPage does
			const split = (k: string) =>
				(init.get(k) ?? '')
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
			this.query = init.get('q') ?? '';
			this.brand = split('brand');
			this.model = split('model');
			this.body = split('body');
			this.fuel = init.get('fuel') ?? '';
			this.transmission = init.get('transmission') ?? '';
			this.price = init.get('price') ?? '';
			this.mileage = init.get('mileage') ?? '';
		}
	}

	get criteria(): InventoryCriteria {
		return {
			query: this.query,
			brand: this.brand,
			model: this.model,
			body: this.body,
			fuel: this.fuel,
			transmission: this.transmission,
			price: this.price,
			mileage: this.mileage
		};
	}
	filtered = $derived.by(() => this.#getVehicles().filter((v) => vehicleMatches(v, this.criteria)));
	sorted = $derived(sortVehicles(this.filtered, this.sort));
	resultCount = $derived(this.filtered.length);
}

export function createInventoryFilterState(
	getVehicles: () => InventoryListVehicle[],
	init?: URLSearchParams
) {
	return new InventoryFilterState(getVehicles, init);
}
```

Consumer passes a getter so prop changes flow through: `createInventoryFilterState(() => data.vehicles, page.url.searchParams)`. Note: a `$derived` of an array is returned as-is (not deep-reactive) — correct and intended here.

- [ ] **Step 4: Run the test — confirm pass**

Run: `npm run test:unit -- --run src/lib/state/inventory-filters.spec.ts`
Expected: PASS.

- [ ] **Step 5: Point the MOBILE page at the shared store first (low risk)**

Refactor `MobileInventoryPage.svelte` to consume `createInventoryFilterState(() => vehicles, appPage.url.searchParams)` instead of its local copy. Bind its filter sheet controls to the store's `$state` fields (`query`, `selectedBrands`→`brand`, `selectedBodies`→`body`, `fuel`, `transmission`, `price`, `mileage`, `sort`). Delete the now-duplicate logic from `mobileInventoryFilters.svelte.ts` (keep only mobile-specific UI helpers like `selectionSummary`, `countOptions`, `toggleValue`). Leave `sortVehicles` where the shared module re-exports it from.
Run: `npm run visual:verify` (mobile inventory) + `npm run test:unit -- --run`.
Expected: 0 diff, tests green. (Desktop still uses the DOM runtime — it's swapped in Phase 4.)

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: shared reactive inventory filter store (mobile adopts it)"
```

### Task 1.4: Route all hardcoded contact info through `daynight-site.ts`

**Files (replace inline literals with imports from `$lib/data/daynight-site`):**

- `src/lib/components/home/desktop/DesktopHomeFooter.svelte` (phone `0877 733 110`, address, email)
- `src/lib/components/template/DesktopDashboardChangePassword.svelte` (`demo@getrich.local`)
- `src/lib/components/template/DesktopDashboardProfile.svelte` (`0877733110`)
- Reference: `src/lib/data/daynight-site.ts` (already defines `phone`, `phoneLabel`, `email`, `location`)

- [ ] **Step 1: Grep for stray literals**

Run: `rg -n "0877 733 110|0877733110|office@daynightauto|Околовръстен" src/lib/components`

- [ ] **Step 2: Replace with `daynightSite.*`**

```svelte
<script lang="ts">
	import { daynightSite } from '$lib/data/daynight-site';
</script>

<a href="tel:{daynightSite.phone}">{daynightSite.phoneLabel}</a>
<address>{daynightSite.location}</address>
```

- [ ] **Step 3: Verify**

Run: `npm run visual:verify`
Expected: 0 diff (same values, now single-sourced).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: single-source contact info via daynight-site"
```

### Task 1.5: Move `daynight-seo` out of `$lib/server/` so native routes can use it

**Why:** native storefront routes (Phase 3) need `routeSeo()`/`vehicleSeo()` for `<title>`/meta, but it currently lives in `$lib/server/daynight-seo.ts` — SvelteKit forbids importing `$lib/server/*` into components or universal `+page.ts`, which blocks prerendering those pages via `+page.ts`. The module is pure (no secrets), so relocate it.

**Files:**

- Move: `src/lib/server/daynight-seo.ts` → `src/lib/seo/daynight-seo.ts`
- Update importers: `src/lib/server/daynight-template-content.spec.ts` (`import { routeSeo } from './daynight-seo'`) and any others.

- [ ] **Step 1: Find all importers**

Run: `rg -n "daynight-seo" src`

- [ ] **Step 2: Move the file and fix import paths**

```bash
git mv src/lib/server/daynight-seo.ts src/lib/seo/daynight-seo.ts
```

Update each importer to `$lib/seo/daynight-seo` (or the correct relative path). Exports are unchanged: `routeSeo(routePath)`, `vehicleSeo(vehicle)`, `PageSeo`, `DEFAULT_DESCRIPTION`.

- [ ] **Step 3: Verify**

Run: `npm run check && npm run test:unit -- --run`
Expected: green (the spec still passes against the new path).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: move daynight-seo out of server/ for universal use"
```

---

## Phase 2 — Native Chrome (Header / Nav / Footer)

`daynight-template-chrome.ts` (783 lines) generates the desktop header, mega-menu, footer, and 15+ inline SVG icons as **HTML strings** injected into every desktop page. Replace with Svelte components. The footer is already partly native (`TemplateFooter.svelte`, 386 lines) — finish the pattern.

### Task 2.1: Extract nav/footer data to a data file

**Files:**

- Create: `src/lib/data/site-navigation.ts`
- Reference (already exists, REUSE — do not duplicate): `src/lib/data/daynight-site.ts` exports `publicNavItems`, `publicNavGroups` (main nav + dropdown children), `footerNavItems`. `daynight-template-chrome.ts` already imports `publicNavGroups` from there.
- Extract (chrome-local, NOT yet in a data file): `daynight-template-chrome.ts` → `inventoryMegaMenuVehicles` (line ~34), `inventoryMegaMenuLinkColumns` (line ~61), `footerLinkGroups` (line ~100).

**Important:** the **main nav already lives in `daynight-site.ts`** as `publicNavGroups`/`publicNavItems`/`footerNavItems` — reuse those, do NOT re-copy them. Only the mega-menu vehicle tiles, mega-menu link columns, and the footer link groups are still hardcoded inside `chrome.ts` and need extracting.

- [ ] **Step 1: Extract only the chrome-local arrays into typed exports**

```ts
// src/lib/data/site-navigation.ts
export interface NavLink {
	label: string;
	href: string;
}
export interface MegaMenuColumn {
	title: string;
	links: NavLink[];
}
export interface MegaMenuVehicle {
	title: string;
	href: string;
	image: string;
	meta?: string;
}
// copy these THREE verbatim out of daynight-template-chrome.ts:
export const inventoryMegaMenuVehicles: MegaMenuVehicle[] = [
	/* from chrome.ts ~L34 */
];
export const inventoryMegaMenuLinkColumns: MegaMenuColumn[] = [
	/* from chrome.ts ~L61 */
];
export const footerLinkGroups: MegaMenuColumn[] = [
	/* from chrome.ts ~L100 */
];
// main nav is imported from $lib/data/daynight-site (publicNavGroups / footerNavItems) — not redefined here
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "refactor: extract chrome-local mega-menu/footer arrays to site-navigation.ts"
```

### Task 2.2: Build `SiteHeader.svelte` (desktop)

**Files:**

- Create: `src/lib/components/layout/SiteHeader.svelte`
- Create: `src/lib/components/layout/InventoryMegaMenu.svelte`
- Reference: the rendered header markup (inspect a live desktop page's `<header>` in DevTools to copy structure/classes exactly), `src/lib/components/icons/` (use existing `@lucide/svelte` or copy the inline SVGs)

- [ ] **Step 1: Recreate the header markup as a component**

Build `SiteHeader.svelte` reproducing the exact DOM the template emits (`renderSharedHomeHeader`): logo, main nav, mega-menu trigger, search affordance, account/favorites/compare actions with their existing class names so `daynight-home-desktop.css` styles it unchanged. Use `@lucide/svelte` icons matching the current SVGs. Render the mega-menu columns with a `{#snippet}` (one snippet rendered per column) rather than copy-pasted markup.

Wire the favorites/compare badge counts **reactively via `$derived` from the garage context** — this replaces the imperative `TemplateLocalBehaviors` header-badge-sync (which queried `.header-action-btn[href=...]` and wrote `textContent`). No `$effect`, no DOM querying:

```svelte
<script lang="ts">
	import { getGarageContext } from '$lib/state/garage.svelte';
	const garage = getGarageContext();
	const favCount = $derived(garage.favorites.length);
	const compareCount = $derived(garage.compare.length);
</script>

<a class="header-action-btn" href="/favorites">
	…{#if favCount}<span class="badge">{favCount}</span>{/if}
</a>
```

(The garage context is already provided in `+layout.svelte` via `setGarageContext`; confirm `SiteHeader` renders inside that provider.)

- [ ] **Step 2: Render it in parallel, hidden, to diff structure**

Temporarily mount `<SiteHeader />` on a scratch route (`src/routes/_scratch/header/+page.svelte`) and screenshot vs the live header. Adjust until pixel-identical.

- [ ] **Step 3: Verify**

Run: `npm run visual:verify` against the scratch route's baseline. Expected: header matches.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: native SiteHeader + InventoryMegaMenu components"
```

### Task 2.3: Finish `SiteFooter.svelte` (desktop)

**Files:**

- Modify/Promote: `src/lib/components/template/TemplateFooter.svelte` → `src/lib/components/layout/SiteFooter.svelte`
- Reference: `site-navigation.ts` (`footerLinkGroups`), `daynight-site.ts` (`footerNavItems`, `daynightSite`)

- [ ] **Step 1: Repoint the footer at `footerLinkGroups` / `footerNavItems` + `daynightSite`**

It's already native; just remove any remaining hardcoded links/contact and consume the data files (`footerLinkGroups` from `site-navigation.ts`, `footerNavItems`/contact from `daynight-site.ts`).

- [ ] **Step 2: Verify**

Run: `npm run visual:verify`. Expected: 0 diff.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: native SiteFooter from data files"
```

### Task 2.4: Swap chrome on the HOME page first (canary)

**Files:**

- Modify: `src/lib/components/home/desktop/DesktopHome.svelte` (replace injected `headerHtml`/`footerHtml` `{@html}` with `<SiteHeader/>` / `<SiteFooter/>`)
- Modify: `src/routes/+page.server.ts` (stop computing `homeChrome` HTML for desktop)

- [ ] **Step 1: Replace the `{@html homeChrome.headerHtml}` / footer with the components**

- [ ] **Step 2: Verify the home page is 1:1**

Run: `npm run visual:verify` (home desktop + mobile).
Expected: 0 diff. Mobile home is untouched (already native).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: home page uses native chrome (canary)"
```

> Other desktop pages keep injecting chrome until their Phase 3/4 migration, at which point they adopt `<SiteHeader/>`/`<SiteFooter/>` too. `daynight-template-chrome.ts` is deleted in Phase 5 once nothing imports it.

---

## Phase 3 — Route-by-Route Native Migration

Convert each catch-all template route into a real SvelteKit route with a native desktop+mobile component. **One route per task, each screenshot-gated and committed independently.** Order is easiest→hardest so the pattern is proven on low-risk static pages first.

Many desktop/mobile shells **already exist** (`DesktopAboutPage`, `MobileAboutPage`, `DesktopContactPage`, `MobileContactPage`, `MobileServicesPage`, `DesktopFinancingPage`/`MobileFinancingPage`, `DesktopSellYourCarPage`/`MobileSellYourCarPage`, `DesktopTeamPage`, `DesktopPublicReviewsPage`) — for those, the task is mostly "create the real route + wire data + delete the catch-all branch," not "build from scratch."

### Migration order & status

| #    | Route                                     | Real route to create               | Desktop component                      | Mobile component          | Status                                                      |
| ---- | ----------------------------------------- | ---------------------------------- | -------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| 3.1  | `/terms`                                  | `src/routes/terms/+page.svelte`    | **build** `TermsPage` (static content) | reuse, responsive         | from `.template-ref/terms.html`                             |
| 3.2  | `/faq`                                    | `src/routes/faq/+page.svelte`      | **build** `FaqPage` (accordion)        | reuse, responsive         | from `faqs.html`                                            |
| 3.3  | `/reviews`                                | `src/routes/reviews/+page.svelte`  | `DesktopPublicReviewsPage` ✓           | build/responsive          | data: `daynight-reviews.ts`                                 |
| 3.4  | `/team` + `/team/[slug]`                  | `src/routes/team/...`              | `DesktopTeamPage` ✓                    | build                     | data: `daynight-team.ts`                                    |
| 3.5  | `/blog` + `/blog/[slug]`                  | `src/routes/blog/...`              | **build**                              | **build**                 | data: server posts repository + `daynight-blog.ts` fallback |
| 3.6  | `/about` + `/about/daynight-auto-plovdiv` | `src/routes/about/...`             | `DesktopAboutPage` ✓                   | `MobileAboutPage` ✓       | wire only                                                   |
| 3.7  | `/services`                               | `src/routes/services/+page.svelte` | build/`DesktopServices`                | `MobileServicesPage` ✓    | wire                                                        |
| 3.8  | `/contact`                                | `src/routes/contact/+page.svelte`  | `DesktopContactPage` ✓                 | `MobileContactPage` ✓     | wire + form action                                          |
| 3.9  | `/sell-your-car` (+ `/request`)           | `src/routes/sell-your-car/...`     | `DesktopSellYourCarPage` ✓             | `MobileSellYourCarPage` ✓ | wire + form action                                          |
| 3.10 | `/financing` + `/calculator`              | `src/routes/financing/...`         | `DesktopFinancingPage` ✓               | `MobileFinancingPage` ✓   | wire                                                        |
| 3.11 | `/compare`                                | `src/routes/compare/+page.svelte`  | build (uses `garage` compare)          | build                     | reactive                                                    |
| 3.12 | `/dashboard/*` (storefront)               | —                                  | —                                      | —                         | **see Task 3.12 — likely DELETE, not migrate**              |

### Worked example — Task 3.1: `/terms` (the pattern every route follows)

**Files:**

- Create: `src/routes/terms/+page.ts` (or `+page.server.ts` if data needed) — set `export const prerender = true;` (static legal page)
- Create: `src/routes/terms/+page.svelte`
- Create: `src/lib/components/pages/TermsPage.svelte`
- Reference: `.template-ref/terms.html` (copy the visible copy/structure), `src/lib/components/layout/{SiteHeader,SiteFooter}.svelte`, `src/lib/hooks/is-mobile.svelte.ts`
- Modify: `src/routes/[...templatePath]/+page.server.ts` (remove `terms` from `prettyRouteToFile` once switched)

- [ ] **Step 1: Capture the current `/terms` baseline (if not already in 0.2)**

Run: `npm run visual:baseline -- --only=/terms` (or re-run full baseline). Confirm `/terms` desktop + mobile PNGs exist.

- [ ] **Step 2: Build the native page component**

```svelte
<!-- src/lib/components/pages/TermsPage.svelte -->
<script lang="ts">
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	// copy the section headings + body copy from .template-ref/terms.html (visible text only)
</script>

<SiteHeader />
<main class="inner-page terms-page">
	<section class="container">
		<h1>Общи условия</h1>
		<!-- paste the real terms copy, structured as semantic <section>/<h2>/<p> -->
	</section>
</main>
<SiteFooter />

<style>
	/* reuse existing .inner-page / .container styling; add only what's missing */
</style>
```

Reuse the existing class names (`inner-page`, `container`) so `app.css`/desktop CSS styles it identically. Mobile styling falls out of the responsive CSS + tokens; add `@media (max-width: 991px)` only where the template differed.

- [ ] **Step 3: Wire the route + SEO**

**SEO API (verified):** titles/descriptions come from `routeSeo(routePath): { title, description }` in `src/lib/server/daynight-seo.ts` (plus `vehicleSeo(vehicle)`). It lives under `$lib/server/`, so it **cannot** be imported into a component or a universal `+page.ts`. It has no secrets, so the clean fix is a **one-time move** of `daynight-seo.ts` from `$lib/server/` → `$lib/seo/` (do this once, in Phase 1; update the few importers incl. `daynight-template-content.spec.ts` which does `import { routeSeo } from './daynight-seo'`). Then it works in universal load and prerenders:

```ts
// src/routes/terms/+page.ts
import { routeSeo } from '$lib/seo/daynight-seo';
export const prerender = true;
export const load = () => ({ seo: routeSeo('terms') });
```

```svelte
<!-- src/routes/terms/+page.svelte -->
<script lang="ts">
	import TermsPage from '$lib/components/pages/TermsPage.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
</svelte:head>
<TermsPage />
```

(If you'd rather not move the file, use `+page.server.ts` instead of `+page.ts` — `routeSeo` can be imported there, and `prerender = true` still applies.)

- [ ] **Step 4: Verify 1:1**

Run: `npm run visual:verify -- --only=/terms`
Expected: diff under threshold on both viewports. If text reflows differently, match the template's container width/spacing until it passes.

- [ ] **Step 5: Remove `/terms` from the catch-all**

In `src/routes/[...templatePath]/+page.server.ts` (and the `prettyRouteToFile` map in `src/lib/data/template-routes.ts`), delete the `terms` entry so SvelteKit serves the real route. The real route wins over the catch-all automatically, but removing the mapping prevents the old code path from being reachable/tested.

- [ ] **Step 6: Re-verify + check SEO/links**

Run: `npm run visual:verify -- --only=/terms && npm run check`
Manually confirm `/terms` still linked correctly from the footer.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: native /terms route, drop template branch"
```

### Tasks 3.2 – 3.12: apply the identical 7-step pattern

For each row in the table, follow **exactly** the Task 3.1 steps with these per-route specifics:

- **3.2 `/faq`** — Build `FaqPage.svelte` with a native accordion (use `bits-ui` `Accordion` already in deps, or `<details>`). Extract Q&A pairs from `.template-ref/faqs.html` into `src/lib/data/daynight-faq.ts`. `prerender = true`.
- **3.3 `/reviews`** — Wire `DesktopPublicReviewsPage.svelte`; build a mobile reviews list (reuse review card from `MobileAboutPage`). Data: `src/lib/data/daynight-reviews.ts`. `prerender = true`.
- **3.4 `/team` & `/team/[slug]`** — `+page.server.ts` loads team from `src/lib/data/daynight-team.ts` and/or the server data layer. `DesktopTeamPage.svelte` for grid; build `DesktopTeamMemberPage` + mobile for the detail. `/team` prerender; `/team/[slug]` use `entries()` to prerender known slugs.
- **3.5 `/blog` & `/blog/[slug]`** — `+page.server.ts` calls `getPublishedPostArticles()` (`src/lib/server/repositories/posts.ts`) with `daynight-blog.ts` fallback. Build `BlogIndexPage` + `BlogArticlePage` (desktop + mobile). Cyrillic→Latin slug normalization already lives in `posts.ts`. **Cannot prerender** (CMS-driven) — leave SSR; add cache headers in Phase 6.
- **3.6 `/about` & `/about/daynight-auto-plovdiv`** — Wire existing `DesktopAboutPage`/`MobileAboutPage`. The dealer sub-page maps to `dealer-details.html`; data from `src/lib/data/dealers.ts`. `prerender = true`.
- **3.7 `/services`** — Wire `MobileServicesPage`; build/confirm desktop services. `prerender = true`.
- **3.8 `/contact`** — Wire `DesktopContactPage`/`MobileContactPage`. **Important:** the contact form currently posts via template behavior; convert to a SvelteKit `?/submit` form action in `+page.server.ts` that calls `createLeadWithConversation()` (`src/lib/server/repositories/intake.ts`) — reuse the same Zod schema and rate-limit as `src/routes/api/leads/+server.ts`. Keep honeypot field. SSR (form action).
- **3.9 `/sell-your-car` & `/sell-your-car/request`** — Wire `DesktopSellYourCarPage`/`MobileSellYourCarPage`. Convert submit to a form action calling `createImportRequestWithConversation()`. SSR.
- **3.10 `/financing` & `/calculator`** — Wire `DesktopFinancingPage`/`MobileFinancingPage`. The calculator is client-reactive; ensure it uses `$state`/`$derived` (not template JS). `prerender = true` for `/financing`.
- **3.11 `/compare`** — Build native `ComparePage` reading the `compare` list from `garage.svelte.ts`, rendering a spec-comparison table from `daynight-vehicles.ts`. Replaces the `TemplateLocalBehaviors` compare-badge logic. CSR/SSR fine.
- **3.12 `/dashboard/*` (storefront customer dashboard) — DECISION REQUIRED, default = DELETE.**
  **Important distinction:** the **admin CMS at `src/routes/admin/*` is already native Svelte 5 + shadcn-svelte** (`src/lib/components/ui/*`) — it is _not_ part of the template pipeline and needs **no migration**. Leave it alone.
  The thing under `/dashboard/*` is a _separate_ customer-account dashboard inherited from the Themesflat template (`dashboard.html`, `my-profile.html`, `my-listings.html`, `message.html`, `my-favorites.html`, `reviews.html`, `change-password.html`, `add-listings.html`), routed through the catch-all and rendered via `DesktopDashboard*.svelte` with `{@html}` injection. It has **no auth guard and no customer-auth system behind it** — it's unguarded demo cruft fed by static data. DayNight has no end-customer login feature; favorites/compare live in `localStorage` via `garage.svelte.ts`, not an account.
  **Recommended path (delete):** remove the `dashboard*` keys from `prettyRouteToFile`/`template-routes.ts`, delete `src/lib/components/template/DesktopDashboard*.svelte` (9 files) + `template-dashboard-export.ts`, and ensure no nav/footer links point at `/dashboard/*` (repoint "favorites" to the real `/favorites` route, "compare" to `/compare`). This removes a whole class of template complexity for free.
  **Only if** the user actually wants a customer portal: that is a NEW feature (needs customer auth, row-level permissions, and real data) and belongs in its own plan — not this 1:1 de-templating pass.
  Either way: screenshot-gate by confirming the routes 404/redirect cleanly after removal, and that the admin CMS is untouched.

For each: **Step 4 (`visual:verify`) must pass before Step 5 (drop the catch-all branch).**

- [ ] After 3.12, confirm: `grep -rn "TrustedTemplateHtml\|RawTemplatePage" src/routes` returns **nothing** in storefront routes (only inventory/detail remain, handled in Phase 4).

---

## Phase 4 — Inventory & Detail De-Templating

These are the hybrid desktop pages: native section components **plus** injected template HTML **plus** DOM-runtime filtering. Highest-value, highest-risk — do after the pattern is proven on Phase 3.

### Task 4.1: Native desktop inventory grid + adopt shared filter store

**Files:**

- Modify: `src/lib/components/inventory/desktop/InventoryPageShell.svelte` (remove `{@html}` template block + `<TemplateLocalBehaviors variant="inventory"/>`)
- Create: `src/lib/components/inventory/desktop/DesktopInventoryGrid.svelte`, `DesktopInventoryFilters.svelte`, `DesktopInventoryToolbar.svelte`
- Delete (after switch): `inventory-quick-filter-runtime.ts`, `inventory-quick-filter-state.ts`, `daynight-quick-filter-dom.ts`
- Reuse: `src/lib/state/inventory-filters.svelte.ts` (from Task 1.3), existing `VehicleCard.svelte`
- Reference: `src/lib/server/daynight-inventory-template.ts`, `daynight-inventory-page.ts`

- [ ] **Step 1: Build the native filter + grid using the shared store**

Instantiate `const filters = createInventoryFilterState(() => page.vehicles, page.url.searchParams)` in the component (per-instance getter — never a module singleton); render `{#each filters.sorted as v (v.slug)}<VehicleCard {v}/>{/each}` (keyed). Filters/toolbar `bind:`/assign to `filters.brand`, `filters.body`, `filters.fuel`, `filters.transmission`, `filters.price`, `filters.mileage`, `filters.sort` ($state fields). This makes desktop reactive like mobile — no `display:none` DOM mutation, no DOM querying.

- [ ] **Step 2: Match the template grid's markup/classes**

Reuse the existing `.listing-*`/grid classes so `daynight-home-desktop.css`/`app.css` style it identically. Replicate the quick-filter pills, active-tag chips, and result count ("Показани N автомобила") as reactive bindings to `store.resultCount` / `store.activeTags`.

- [ ] **Step 3: Swap the shell to native, remove template injection**

Replace the `{@html page.mainHtml}` desktop branch in `InventoryPageShell.svelte` with `<DesktopInventoryFilters/> <DesktopInventoryToolbar/> <DesktopInventoryGrid/>`. Remove `<TemplateLocalBehaviors variant="inventory"/>`.

- [ ] **Step 4: Verify 1:1 AND behavior**

Run: `npm run visual:verify -- --only=/inventory`
Then manually: apply a brand filter, a price filter, sort — confirm the grid filters/sorts and the count updates, matching old behavior. Compare against the template build's behavior.
Expected: 0 visual diff at default state; filtering works reactively.

- [ ] **Step 5: Delete the DOM-runtime filter files**

```bash
git rm src/lib/components/inventory/desktop/inventory-quick-filter-runtime.ts \
       src/lib/components/inventory/desktop/inventory-quick-filter-state.ts \
       src/lib/components/inventory/desktop/daynight-quick-filter-dom.ts
```

Run: `npm run check && npm run test:unit -- --run`. Fix any imports.

- [ ] **Step 6: Convert `/inventory` to a real route data load**

`src/routes/inventory/+page.server.ts` already exists — strip the template-rendering call (`loadInventoryTemplatePage`) down to just returning `vehicles` + filter option lists from `daynight-vehicles.ts`/repo. Remove the `inventory` catch-all coupling.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: native desktop inventory grid + reactive filters; delete DOM runtime"
```

### Task 4.2: Inventory map view

**Files:**

- Modify: `src/lib/components/inventory/desktop/InventoryMapPageShell.svelte` (de-template)
- Modify: `src/routes/inventory/map` handling (currently in catch-all `inventory/map` special-case) → real `src/routes/inventory/map/+page.svelte`
- Reuse: `src/lib/components/map/*`, `LazyMapEmbed.svelte`

- [ ] **Step 1: Create a real `/inventory/map` route** rendering the native map shell (desktop) + `MobileInventoryPage mode="map"` (mobile), reusing the shared filter store.
- [ ] **Step 2:** `npm run visual:verify -- --only=/inventory/map`. Expected 1:1.
- [ ] **Step 3: Remove the `inventory/map` special case** from `[...templatePath]/+page.server.ts`.
- [ ] **Step 4: Commit** `feat: native /inventory/map route`.

### Task 4.3: Native desktop detail (PDP)

**Files:**

- Modify: `src/lib/components/detail/desktop/DetailPageShell.svelte`, `DesktopDetailPrimarySection.svelte` (remove `{@html contentHtml}`/`sidebarHtml`/`featureTabs` injection + `<TemplateLocalBehaviors variant="detail"/>`)
- The PDP gallery swiper is the **one** legitimate remaining JS dependency — keep `swiper-bundle.min.js`/`swiper.js`, but initialize it from within the Svelte component (`onMount`) rather than template-injected script.
- Reference: `src/lib/server/daynight-detail-page.ts`, existing `DesktopDetail*` section components (Gallery, Description, FeatureTabs, FinanceCalculator, LocationMap, Reviews, Sidebar — all already native)

- [ ] **Step 1: Compose the PDP from existing native sections**

`DesktopDetailPrimarySection` already renders native sections; the remaining `{@html}` fragments are description/spec/feature-tab HTML extracted from the template. Move that content to come from the `vehicle` object (`features[]`, `highlights[]`, `description`) in `daynight-vehicles.ts` and render natively with a **keyed** each: `{#each vehicle.features as f (f.id)}`.

- [ ] **Step 2: Decide the Swiper source, then initialize via an attachment (NOT `onMount`)**

**Verified:** there is **no `swiper` npm dependency.** Today Swiper is the static bundle `/assets/js/swiper-bundle.min.js` (+ `swiper.js`), injected after hydration by `DetailPageShell.svelte` using a **local inline script-loader** (currently a function literally named `n(src)` inside that component — there is _no_ importable `loadTemplateScriptAfterHydration` helper, despite earlier notes). It puts `Swiper` on `window`. CSS is `/assets/scss/swiper/swiper-bundle.min.css`. So `import Swiper from 'swiper'` would NOT compile against the current deps.

Choose one (recommended: **A**):

- **Option A — add the npm dep (cleaner, versioned, tree-shakeable):** `npm i swiper`, import the modules you use, import `swiper/css`, drop the three static files + `loadTemplateScriptAfterHydration` machinery.

  ```text
  <script lang="ts">
    import Swiper from 'swiper';
    import { Navigation, Thumbs } from 'swiper/modules';
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/thumbs';
    function gallery(node: HTMLElement) {
      const s = new Swiper(node, {
        modules: [Navigation, Thumbs] /* same opts the template used */
      });
      return () => s.destroy();
    }
  </script>

  <div class="swiper" {@attach gallery}>…</div>
  ```

- **Option B — keep the static bundle, wrap `window.Swiper`:** keep the three `/assets/...` files. First **extract the inline `n(src)` script-loader** from `DetailPageShell.svelte` into a real util (e.g. `src/lib/utils/load-script.ts` — it's ~10 lines: create a `<script>`, resolve on `load`, dedupe by src), since `DetailPageShell` is being gutted. Then init in the attachment:
  ```text
  <script lang="ts">
    import { loadScript } from '$lib/utils/load-script';
    function gallery(node: HTMLElement) {
      let s: any;
      void loadScript('/assets/js/swiper-bundle.min.js')
        .then(() => loadScript('/assets/js/swiper.js'))
        .then(() => {
          s = new (window as any).Swiper(node, {
            /* opts */
          });
        });
      return () => s?.destroy();
    }
  </script>
  ```
  (Keep `/assets/scss/swiper/swiper-bundle.min.css` linked.)

Either way the gallery self-initializes from a `{@attach}` and no longer depends on `DetailPageShell` injecting the script. Remove the swiper bits from `DetailPageShell.svelte`.

- [ ] **Step 3: Remove template injection from the shell**

Delete the `{@html}` branches and `<TemplateLocalBehaviors variant="detail"/>` from `DetailPageShell.svelte`.

- [ ] **Step 4: Verify 1:1 + gallery works**

Run: `npm run visual:verify -- --only=/inventory/<slug>`
Manually: swipe the gallery, open the finance calculator, check the map. Expected: 1:1 + interactive.

- [ ] **Step 5: Convert `/inventory/[slug]` to clean data load**

`src/routes/inventory/[slug]/+page.server.ts` returns the `vehicle` + related list from data/repo, no template rendering (`loadDetailTemplatePage` stripped to data only). Optionally `entries()` to prerender known slugs.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: native desktop PDP; swiper self-initialized; drop detail template"
```

### Task 4.4: Retire `TemplateLocalBehaviors.svelte`

**Files:**

- Delete: `src/lib/components/template/TemplateLocalBehaviors.svelte`
- Delete: `src/lib/components/template/TemplateImageBehavior.svelte` (replaced by native `loading="lazy"`)

- [ ] **Step 1: Confirm no remaining importers**

Run: `grep -rn "TemplateLocalBehaviors\|TemplateImageBehavior" src`
Expected: no live imports (label translation, badge sync, filter setup, lazy-load all now native). If any remain, finish migrating that consumer first.

- [ ] **Step 2: Ensure image lazy-loading is native**

Any `<img>` that relied on `TemplateImageBehavior` gets `loading="lazy" decoding="async"` directly.

- [ ] **Step 3: Delete + verify**

```bash
git rm src/lib/components/template/TemplateLocalBehaviors.svelte \
       src/lib/components/template/TemplateImageBehavior.svelte
```

Run: `npm run check && npm run visual:verify`. Expected: green, 0 diff.

- [ ] **Step 4: Commit** `chore: delete client-side template DOM mutation runtime`.

---

## Phase 5 — Decommission the Template Pipeline

Now nothing renders template HTML. Delete the machinery in dependency order. Each deletion is followed by `npm run check && npm run build && npm run visual:verify`.

### Task 5.1: Delete the catch-all route

**Files:**

- Delete: `src/routes/[...templatePath]/+page.svelte`, `src/routes/[...templatePath]/+page.server.ts`
- Add: a proper `src/routes/+error.svelte` (native 404) if not present, since the catch-all previously served `/404`.

- [ ] **Step 1: Confirm every former catch-all route now has a real route** (cross-check the old `prettyRouteToFile` keys against `src/routes/`).
- [ ] **Step 2: Build a native `+error.svelte`** matching the old `404.html` look (screenshot-gate it).
- [ ] **Step 3:** `git rm -r src/routes/[...templatePath]`.
- [ ] **Step 4:** `npm run build && npm run visual:verify`. Expected: all routes still served by real routes, 0 diff.
- [ ] **Step 5: Commit** `feat: remove [...templatePath] catch-all; native 404`.

### Task 5.2: Delete server-side template modules

**Files (delete in this order, fixing imports after each):**

- `src/lib/server/daynight-template-renderer.ts`
- `src/lib/server/daynight-template-content.ts` + `daynight-template-content.spec.ts`
- `src/lib/server/daynight-template-chrome.ts`
- `src/lib/server/daynight-template-styles.ts`
- `src/lib/server/rendered-template-page.ts`
- `src/lib/server/template-route-page.ts`
- `src/lib/server/daynight-inventory-template.ts`, `daynight-inventory-page.ts` (if now unused after 4.1)
- `src/lib/server/daynight-detail-page.ts` (if now unused after 4.3)
- `src/lib/server/template-asset-policy.ts` (script allowlist — only needed for template scripts)
- `src/lib/data/template-routes.ts`, `template-route-asset-policy.ts` (route→file maps)
- `src/lib/types/template-page.ts`

- [ ] **Step 1: For each file, grep importers first**

Run (per file): `grep -rn "<basename without ext>" src` → expect only its own references / already-dead ones.

- [ ] **Step 2: Delete one, run `npm run check`, fix fallout, repeat.**

Work leaf-first (renderer → content/chrome/styles → parsers → maps). The `check` step surfaces any remaining importer.

- [ ] **Step 3: After all deletions**

Run: `npm run check && npm run build && npm run test:unit -- --run && npm run visual:verify`
Expected: green; 0 visual diff. The injected `<head>` CSS from `daynight-template-styles.ts` is gone — confirm pages still styled (their CSS now comes from `app.css`/component `<style>`/tokens). **If a route loses styling, that route still depended on injected CSS — port the needed rules into the component's `<style>` before continuing.**

- [ ] **Step 4: Commit** `chore: delete server-side template rendering pipeline (~11k lines)`.

### Task 5.3: Delete the template components + reference HTML

**Files:**

- Delete: `src/lib/components/template/RawTemplatePage.svelte`, `TrustedTemplateHtml.svelte`, `TrustedMutableTemplateHtml.svelte`, `TemplateAssets.svelte` (if unused), `LazyMapEmbed.svelte` (if replaced)
- Delete: `.template-ref/` (all 28 HTML files)
- Audit: `src/lib/components/template/` — keep only components still imported (the promoted page shells may have moved to `pages/`).

- [ ] **Step 1: Confirm `{@html}` is gone except legitimate JSON-LD**

Run: `grep -rn "@html" src`
Expected: only `DetailPageShell`/`+layout.svelte` JSON-LD `<script>` injections remain (those are fine — structured data, not template HTML).

- [ ] **Step 2: Delete components + `.template-ref/`**

```bash
git rm src/lib/components/template/RawTemplatePage.svelte \
       src/lib/components/template/TrustedTemplateHtml.svelte \
       src/lib/components/template/TrustedMutableTemplateHtml.svelte
git rm -r .template-ref
```

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build && npm run visual:verify`. Expected: green, 0 diff.

- [ ] **Step 4: Commit** `chore: delete template components and .template-ref HTML kit`.

---

## Phase 6 — "Or Better": Slimming, Single-Tree Rendering, Perf

Pure improvements, each its own screenshot-reviewed commit. These are where "1:1 or **better**" is delivered.

### Task 6.1: Desktop-gate the slimmed `app.css`

Now that the template pipeline (which assumed `app.css` global presence) is gone and `base.css` carries the mobile-critical reset (Task 1.2), gate the heavy remainder of `app.css` + Swiper CSS to desktop / PDP only.

**Files:** `src/routes/+layout.svelte`, `src/lib/data/template-route-asset-policy.ts` (or its successor).

- [ ] **Step 1:** Load `app.css` only when `isDesktopOrServerViewport()` (or via media-attribute `<link media="(min-width: 992px)">` so it's non-blocking on mobile).
- [ ] **Step 2:** `npm run visual:verify` (mobile must stay 1:1 thanks to `base.css`) + manual 390px check (the memory-flagged regression).
- [ ] **Step 3:** `npm run audit:mobile-weight` → confirm mobile CSS payload dropped by ~400 KB.
- [ ] **Step 4: Commit** `perf: desktop-gate heavy app.css; mobile keeps base.css only`.

### Task 6.2: PurgeCSS the desktop stylesheet

**Files:** `scripts/purge-app-css.mjs` (exists), `static/assets/app.css`, `src/lib/styles/daynight-home-desktop.css`.

- [ ] **Step 1:** Run PurgeCSS against the native components (no more template HTML to keep selectors alive for). Many `.listing-*`/`.dashboard-*` rules tied to deleted template markup are now dead.
- [ ] **Step 2:** `npm run visual:verify` across ALL routes (purge is risky — full sweep). Expected 0 diff.
- [ ] **Step 3:** `npm run audit:desktop-weight`. Confirm reduction.
- [ ] **Step 4: Commit** `perf: purge dead CSS after de-templating`.

### Task 6.3: Replace hardcoded desktop hex with tokens

**Files:** `src/lib/styles/daynight-home-desktop.css` + component `<style>` blocks.

- [ ] **Step 1:** Replace `#B00000`→`var(--sa-blue)`, `#e11c2a`→`var(--sa-red)`, etc. (the ~85 literals from the audit).
- [ ] **Step 2:** `npm run visual:verify`. Expected 0 diff.
- [ ] **Step 3:** Drop the `--sa-home-*` aliases; point components straight at `--sa-*`.
- [ ] **Step 4: Commit** `refactor: desktop CSS uses shared tokens`.

### Task 6.4: Single-tree viewport rendering (optional, removes double payload)

**Problem:** every page renders BOTH desktop and mobile trees, then hides one via CSS — doubling SSR HTML. Replace with server-side UA detection → render one tree.

**Files:** `src/hooks.server.ts` (add UA-based `isMobile` to `event.locals`), pass through `+layout.server.ts` → components; switch `{#if showDesktop}...{/if}{#if showMobile}...{/if}` to `{#if isMobile}<Mobile/>{:else}<Desktop/>{/if}`.

- [ ] **Step 1:** Detect mobile by user-agent in `hooks.server.ts`, expose `locals.isMobileUA`. Hydrate-correct: client re-checks `innerWidth` and swaps only if UA guess was wrong (rare).
- [ ] **Step 2:** Convert `HomePage`, `InventoryPageShell`, `DetailPageShell`, and the new Phase-3 pages to `{#if}{:else}`.
- [ ] **Step 3:** `npm run visual:verify` (both viewports) + check no hydration warnings in console.
- [ ] **Step 4:** `npm run audit:mobile-weight` / `audit:desktop-weight` → confirm HTML payload roughly halved.
- [ ] **Step 5: Commit** `perf: single-tree viewport rendering via UA detection`.

> This is marked optional/last because it touches hydration. If it introduces flicker on resize or hydration mismatches, revert — the double-tree approach is correct, just heavier.

### Task 6.4b: Converge image-fallback onto a single `{@attach}` (Svelte 5 hygiene)

**Problem:** the same image-fallback concern is implemented two legacy-ish ways across the codebase — `use:daynightImageFallback` (action, 7×) and `onMount(() => enhanceDayNightImageFallbacks(...))` (6×). The conventions say external/imperative DOM sync should be a single `{@attach}`.

**Files:** create `src/lib/attachments/image-fallback.ts` (or `.svelte.ts`); update the 7 `use:` sites + 6 `onMount` sites; remove the old action + `enhanceDayNightImageFallbacks` once unused.

- `src/lib/components/detail/mobile/MobileDetailPage.svelte`, `favorites/mobile/MobileFavoritesPage.svelte`, `home/mobile/MobileHome.svelte`, `home/desktop/DesktopHomeInventoryPreview.svelte`, `inventory/desktop/VehicleCard.svelte`, `inventory/mobile/MobileInventoryVehicleCard.svelte`, `inventory/mobile/MobileInventoryPage.svelte`.

**Preserve the full existing behavior** — the helper in `src/lib/utils/daynight-image-fallback.ts` does more than an error listener: it removes `srcset`, guards against duplicate installs (`dataset` flags), listens for **both** `error` and `load`, polls with timers `[0, 250, 1000, 2500]`, uses `requestAnimationFrame`, calls `img.decode()`, and adds the `daynight-img-fallback` class with the branded SVG placeholder. **Do not reimplement** — reuse `installFallback`. `daynightImageFallback` is already action-shaped (`{ destroy }`); an attachment just returns the cleanup directly.

- [ ] **Step 1: Add the attachment to the EXISTING util (reuse `installFallback`)**

```ts
// append to src/lib/utils/daynight-image-fallback.ts — installFallback already returns a cleanup fn
export function imageFallback(node: HTMLImageElement) {
	return installFallback(node); // {@attach} contract: return teardown
}
```

- [ ] **Step 2:** Replace `<img use:daynightImageFallback>` → `<img {@attach imageFallback}>` at all 7 sites, and delete the `onMount(() => enhanceDayNightImageFallbacks(...))` calls (the attachment now covers each `<img>` directly — no DOM scan needed). Once unused, remove the old `daynightImageFallback` action wrapper and `enhanceDayNightImageFallbacks` scanner (keep `installFallback`, `applyFallback`, `DAY_IMAGE_FALLBACK`).
- [ ] **Step 3:** Verify — `npm run check && npm run visual:verify`. Expected: 0 diff (broken images still fall back). Grep confirms `daynightImageFallback`/`enhanceDayNightImageFallbacks` are gone.
- [ ] **Step 4: Commit** `refactor: image fallback via {@attach}, drop action + onMount`.

> **Do NOT touch `use:enhance`** in the form pages — it stays.

### Task 6.4c (optional): `class:` directive → clsx arrays

**16** actual `class:` directives remain (verified with `rg "class:[a-zA-Z][\w-]*" -g '*.svelte'`, excluding `{ class: x }` object keys — an earlier draft's "103" counted files/object-keys and was wrong). Per conventions, new code prefers `class={['x', { active }]}`. With only 16, this is a quick low-value cosmetic sweep — do it file-by-file, each screenshot-gated (`visual:verify` = 0 diff). Skip if it risks the pitch timeline.

### Task 6.5: Final full verification

- [ ] `npm run check` — 0 errors.
- [ ] `npm run lint` — clean (`eslint-plugin-svelte` catches reactivity/a11y issues).
- [ ] `npm run test:unit -- --run` — green.
- [ ] `npm run test:e2e` — green (or document known-flaky).
- [ ] `npm run visual:verify` — **all routes, both viewports, under threshold.**
- [ ] `npm run audit:assets` / `audit:mobile-weight` / `audit:desktop-weight` — within budget; record before/after.
- [ ] **Best-practices gate (rg)** — zero matches: `rg -n "export let |on:click|on:change|on:submit| \$: |<slot|svelte:component|svelte:self|from 'svelte/store'|use:daynightImageFallback|enhanceDayNightImageFallbacks" src -g '*.svelte' -g '*.ts'` (`use:enhance` is allowed and not matched).
- [ ] **`use:` allowlist** — `rg -n "\buse:" src -g '*.svelte' | rg -v "use:enhance"` is empty (after 6.4b, only `use:enhance` remains).
- [ ] **`$effect` audit** — `rg -n "\\\$effect" src` reviewed: each remaining one is justified (external sync that can't be `{@attach}`/`$derived`), none assigns state that should be `$derived`.
- [ ] `rg -n "@html" src` — only JSON-LD remains.
- [ ] `rg -n "daynight-template|TemplateLocalBehaviors|TrustedTemplate|RawTemplatePage|\[\.\.\.templatePath\]" src` — **zero matches.**
- [ ] `ls .template-ref 2>/dev/null` — gone.
- [ ] Commit final + open PR.

---

## Self-Review (spec coverage check)

- **"Fully write Svelte 5 desktop/mobile"** → Phases 2–4 replace every injected-HTML desktop surface with native Svelte 5 components; mobile already native and is hoisted onto the shared filter store (Task 1.3). ✓
- **"Clean up over-engineering"** → Phase 5 deletes ~11k lines of server string-pipeline + 28 reference HTML files + catch-all routing; Task 1.3 collapses duplicated filter logic; Task 4.4 removes 1,012-line DOM mutation runtime. ✓
- **"Hardcoding"** → Task 1.4 (contact info → `daynight-site`), Task 2.1 (nav → data file), Task 3.x (page copy → data files / `vehicle` objects). ✓
- **"Template shit"** → Phase 5 + Task 0.3 (dead JS) + `.template-ref/` deletion. ✓
- **"Keep the look 1:1 or better"** → the visual-parity baseline/verify gate on every task (Phase 0 freeze + per-task `visual:verify`), with Phase 6 as the deliberate "better." ✓
- **"Ultimate Svelte 5 best practices"** → the binding **Svelte 5 Conventions** section governs all new/touched components (`$state.raw` for reassign-only data, `$derived` over `$effect`, keyed `{#each}`, `{@attach}` over `onMount`/`use:` for lib sync, snippets over slots, clsx over `class:`); **SSR-safe state** via `createContext`/factory — never a module singleton (Task 1.3); swiper via `{@attach}` (4.3); reactive badges via `$derived` (2.2); image-fallback converged to one `{@attach}` (6.4b); enforced by the grep gate + `$effect` audit + `eslint-plugin-svelte` in Task 6.5. `use:enhance` explicitly preserved. ✓

**Decisions — RESOLVED with the user (2026-06-14):**

1. **Admin CMS (`/admin/*`)** → already native Svelte 5 + shadcn-svelte; **no migration**, leave untouched. ✓
2. **Storefront `/dashboard/*`** → **DELETE** (unguarded Themesflat demo cruft, no customer-auth feature exists). See Task 3.12. A real customer portal, if ever wanted, is a separate new-feature project. ✓
3. **Storefront data source** → **keep static `daynight-vehicles.ts`** for this pass; live backend storefront swap is a separate project. ✓
4. **Single-tree viewport rendering (6.4)** → **follow-up, not this pass** (avoid hydration risk near the pitch); keep the both-trees-render-then-CSS-hide approach. ✓

**Status: plan only — not yet executed (user: "just the plan for now").**

---

## Pre-existing errors (fill during Task 0.1)

_Record any `npm run check` errors that exist BEFORE the migration so they aren't attributed to it._

**Recorded 2026-06-14 (branch `svelte5-detemplate`, commit base `4266c3f7`):**

- `npm run check` (`svelte-kit sync && svelte-check`): **0 errors, 0 warnings, 0 files with problems** across 5116 files. Clean.
- `npm run build` (`vite build`): **success** in ~56s. Adapter: `@sveltejs/adapter-node` (the historical adapter-auto deploy P0 is already resolved). No build errors.
- Working tree at start: one pre-existing uncommitted edit to `src/lib/components/detail/mobile/MobileDetailPage.svelte` (31 insertions / 19 deletions), carried onto the migration branch. Unrelated to this migration.

**Conclusion:** No pre-existing `check`/`build` errors. Any failure that appears later is attributable to the migration.

### Plan-vs-source discrepancies found during Task 0.1 (guardrail #3 verification)

These were verified against the actual source on 2026-06-14 and contradict the plan's current-state model. Recorded so the plan is corrected before execution, not mid-flight:

1. **`npm run visual:verify` is NOT a pixel-diff tool.** `scripts/visual-parity.mjs` captures full-page screenshots but performs **no comparison** between the `baseline` and `verify` output dirs (no `pixelmatch`/`toHaveScreenshot`/diff anywhere in the repo — confirmed by grep). Pass/fail is purely: required selectors present+visible, no console errors/warnings, no `app.css` leak on mobile. So guardrail #1's "passes `visual:verify` with zero/sub-threshold **diff**" is **not achievable with current tooling** — the diff does not exist.
2. **The harness's required selectors are template-specific** (`body.daynight-template-*-html`, `.inventory-template-shell`, `.inventory-map-template-shell`, `.listing-halfmap`, etc.) — i.e. the exact markers de-templating **removes**. As written, the smoke test will report "missing selectors" = fail on every migrated route **by design**, unless each route's selector list is rewritten to native equivalents.
3. **Baselines cannot be committed as the plan requires.** Screenshots are written to `.tmp/visual-parity/{baseline,verify}/`, and `.tmp/` is gitignored. Guardrail #1 / Task 0.2 Step 4 ("commit the baseline") is impossible without relocating the output dir or amending `.gitignore`.
4. **Phase 2 (native chrome) is already largely DONE.** `+layout.svelte` already renders native `<SiteHeader>`, `<SiteFooter>`, `<ScrollTop>`, plus `Breadcrumbs`/`RouteBodyClassRuntime`, all from `$lib/components/layout/`. `daynight-template-chrome.ts` still exists but its only live importers are the remaining render pipeline (`daynight-template-renderer.ts`, `daynight-template-content.ts` + spec) — not chrome rendering. The plan's "Task 2.2 Build SiteHeader / Task 2.3 Finish SiteFooter / Task 2.4 swap home chrome" are mostly complete.
5. **Path/name drift vs the plan:** storefront customer dashboard route is `src/routes/dashboard-01` (plan says `/dashboard/*`); `home2`, `home3`, `presentation` routes exist and are intentional (not dead). The catch-all `[...templatePath]` still serves storefront content pages (terms, faq, about, services, contact, sell-your-car, financing, calculator, reviews, blog, dealer-details, inventory/map) — confirmed by the `rendered-template-page.js` (435 KB) + per-page template chunks in the build output. Phases 3/4/5 are still real work.
6. **Pre-existing lint debt:** `npm run lint` exits 1 with **110 files** flagged by prettier (proven pre-existing — unrelated to migration). Per-task gate therefore uses **scoped** lint (changed files prettier+eslint clean), not a repo-wide `npm run lint` pass. A repo-wide `npm run format` is a separate, user-decided cleanup (not run, to avoid churning unrelated/parallel-session files).

## Execution log — deviations from plan (all source-verified, guardrail #3)

The 1:1 safety net was rebuilt and the plan adapted where source contradicted it. All commits are LOCAL (no push until user approves 1:1).

- **Visual gate rebuilt:** replaced the no-op smoke harness with a real Playwright `toHaveScreenshot` gate (`playwright.visual.config.ts` + `tests/visual/parity.visual.ts`, baselines in `tests/visual/__screenshots__/`, 20 routes × desktop/mobile). Validated: identical code → 0 diff at 0.2%; negative control fails. `npm run visual:baseline|verify` repointed; old smoke kept as `visual:smoke`.
- **Phase 0.4 (WOW classes): deferred** into the Phase 3/4 component rewrites (classes are inert — `wow.min.js` deleted in 0.3 and was never served; the carrying files get rewritten anyway).
- **Phase 0.5 (untrack artifacts): already satisfied** (`.gitignore` covers them; nothing tracked).
- **Phase 1.5 (move daynight-seo): SKIPPED** — no component imports it (only load fns do), so native routes use `+page.server.ts` (prerenders fine). Moving it would drag `$lib/server/public-routes` into client code. Plan's own offered alternative.
- **Phase 1.1 (tokens): corrected scope** — relocated mobile `:root` → `tokens.css` (pixel-neutral). The plan's brand-token values (`--sa-blue:#B00000`) CONFLICT with existing mobile tokens (`--sa-blue:#8A0000`); the two viewports use genuinely different brand hex, so cross-viewport unification is an "or better" colour decision → deferred to Phase 6 (with `--sa-home-*` aliasing).
- **Phase 1.2 (base.css): deferred to Phase 6** (extraction is coupled to 6.1's app.css desktop-gating; risky with no benefit until the pipeline is gone).
- **Phase 1.3: split** — built+tested the shared store NOW (`src/lib/state/inventory-filters.svelte.ts`, the piece Phase 4 needs); mobile/desktop ADOPTION moved to Phase 4 (gated with the e2e). **Plan bug fixed:** the plan's `priceMatches`/`mileageMatches` were `value <= limit`, but source is `value > 0 && value <= limit` (excludes price-on-request 0 / unknown mileage) — ported the source-correct version + edge-case tests.
- **Concurrent session:** a parallel session edited source mid-run (twice). Its settled finalize work (template-styles mega-menu; home hero v3 cutouts; PDP underline tweaks) was committed as base updates; affected baselines (home, detail) re-frozen. ~165MB of unreferenced `static/assets/daynight-auto-v3/` left UNTRACKED pending a keep/prune decision.

### Session 2026-06-15 — chrome convergence onto native SiteChrome (4 commits, ALL 1:1-gated 0-diff, NOT pushed)

- **Interactive audit FIRST (per the controller mandate):** e2e baseline = 8/9 (the single fail is the documented dashboard-logo `srcset` row inside `project1.e2e.ts` test #7 — a `/dashboard*` row whose header logo `<img>` has `src` but no `srcset`; fixed when the dashboard rows are removed). Manual Playwright drive using the **project's own chromium** (`.tmp/audit*.mjs`, collision-free vs the SHARED chrome-devtools MCP browser, which was locked by a parallel session) at **1440 AND 1920**: inventory (4 view modes Лента/Странично/Меню/Прозорец = 2 toggles `layoutMode` grid/sidebar + `filterUxMode` popover/modal; density 2/3/4/5; all 8 filter fields in popover + per-field modal incl. **portal-to-`<body>` confirmed**; sort; type-pills; clear-all; search; price/brand/feature count changes), header sticky/lang-dropdown/search-modal on `/about`, hero buy-box (brand sheet → `/inventory?brand=BMW`), PDP (gallery swiper advances `_Ak.webp`→`_IP.webp`; inquiry form present). **0 console errors. NO app bugs.** NOTE: the `/calculator` page AND the PDP `DesktopDetailFinanceCalculator` are **static/template-faithful** (changing the term `<select>` does NOT recompute the monthly payment) — that is the current 1:1 baseline, NOT a regression. (Plan 3.10's "make the calculator reactive" is an optional or-better, deferred.)
- **e33cfb55** `home → <SiteChrome/>`: replaced `{@html homeChrome.headerHtml}` and removed the **duplicate** head-CSS injection (home was loading the template head CSS **twice** — static `/assets/daynight-template-head.css` link in the layout + an injected `headStyles` block). Deleted `loadHomeChrome` / `SHARED_HEADER_TEMPLATE_FILE` / the home `loadRenderedTemplatePage` call / `HomeChromeData` / the dead `HomePageHead` `styles`+`scriptSrcs` props. SiteChrome is the verbatim `renderSharedHomeHeader` replica → 0-diff.
- **5706c57a** inventory grid + map headers → `<SiteChrome/>` (drop injected `page.headerHtml`; keep `TrustedTemplateHtml` for the trailing chunk).
- **8b87dae6** detail/PDP header → `<SiteChrome/>` (drop injected `page.headerHtml`).
- **b2eb3a67** dropped inert injected chunks: detail `page.headStyles` (the static link covers it 0-diff — no detail-specific CSS delta) + inventory/map's CSS-hidden `#filterSidebar` overlay (`page.filterSidebarHtml`, dead — replaced by the native sidebar layout long ago).
- All **17 TLB mounts remain**; SiteChrome still delegates header interactivity to `TemplateLocalBehaviors` (made self-sufficient later — see corrected ordering). `daynight-template-content.spec.ts` home assertions updated to the new reality. The **4 pre-existing vitest failures** in that spec (3 CSS-hex assertions over `renderDayNightTemplateHeadStyles` + 1 `SearchBar` `missing_context`) are CONCURRENT-SESSION pre-existing — **verified** by stashing only my 7 files → the same 4 fail at HEAD. They die with the spec in Phase 5.

#### CORRECTED ORDERING (source-verified — important for whoever resumes)

"Make SiteChrome self-sufficient (native sticky B11 / language dropdown B12 / search modal B13–B14 / reactive garage badges B1) + drop `<TemplateLocalBehaviors>`" **cannot** be done while injected-header routes still exist, because:

1. SiteChrome-native + TLB on the **same** route **double-binds** (two `#searchToggle` handlers, two `.core-dropdown` toggles → conflict). They must not coexist; the TLB _mount_ must be removed from a route in the same change that gives SiteChrome native behaviour.
2. TLB is still the **only** header driver for the **injected-header** surfaces: the 4 `RawTemplatePage` routes (`about/daynight-auto-plovdiv`, `team/[slug]`, `blog`, `blog/[slug]`) + the catch-all **dashboard**.
3. The favourites-badge repoint `/dashboard/favorites`→`/favorites` is coupled to TLB B1's `.header-action-btn[href="/dashboard/favorites"]` selector (repoint breaks the badge unless the selector is updated in lockstep).

So the correct **remaining** order is: **(Step 3b)** build the 4 native `RawTemplatePage` routes (each uses `<SiteChrome/>` + keeps its own `<TemplateLocalBehaviors>` mount, exactly like the 12 content routes) + finish de-templating the inventory/detail bodies → **(Step 4)** delete dashboard cruft + catch-all + `RawTemplatePage` → **(Step 4b)** make SiteChrome self-sufficient + native page behaviours (accordion B6, image-fallback `{@attach}`, main-landmark I3) + remove ALL TLB mounts + delete `TemplateLocalBehaviors`/`TemplateImageBehavior` → **(Step 5)** delete the rest of the pipeline leaf-first → **(Step 6)** Phase 6.

NOTE: the catch-all `[...templatePath]` and the 4 explicit `RawTemplatePage` routes are **independent** — the catch-all uniquely serves only the dashboard family + `sell-car`/`sell-car/request` aliases + the `/404` key (native `src/+error.svelte` already exists). So the catch-all can be deleted as soon as the dashboard is removed and the `sell-car` aliases are dropped/redirected, WITHOUT waiting on the 4 native routes; but `RawTemplatePage` itself stays until those 4 are native.

#### Remaining residual de-template still owed

inventory `page.trailingHtml` + detail `page.trailingHtml`/`detailFeatureTabs`/`afterPrimaryHtml` are still injected (block `daynight-inventory-page.ts` / `daynight-detail-page.ts` deletion); 4 native RawTemplatePage routes; dashboard; catch-all; SiteChrome self-sufficiency; TLB deletion; pipeline deletion; Phase 6.

#### Storefront customer dashboard DELETED — **56243665** (check 0 err · full visual 40/40 0-diff · e2e **9/9** · prettier+eslint clean)

Unguarded Themesflat `/dashboard*` demo cruft (no customer-auth; favourites live in `garage.svelte.ts`; real `/favorites` exists). Deleted 9 `DesktopDashboard*.svelte` + `template-dashboard-export.ts`; removed dashboard route maps/transforms/`dashboardContentInnerHtml` extraction/TLB-B9 export-panel/5 dashboard `.template-ref` reads (~3,400 deletions). `/dashboard*` now 404s. Repointed every live `/dashboard`+`/dashboard/favorites` link → `/favorites` (SiteChrome, SiteHeader, injected header, presentation/home2|home3) + updated TLB B1 badge selector & modal redirects in lockstep (driven-verified: forced count=3 → badge "3", compare badge OK, link navigates). KEPT `renderDashboardAccountHeader`/account helpers — `/sell-your-car/request` (add-listings-2) reuses that chrome; its links were repointed not deleted. Removing the 4 dashboard rows from e2e #7 fixed the documented dashboard-logo `srcset` failure → **e2e 9/9**. admin CMS untouched.

**LESSON:** the visual gate is screenshot-only and does NOT catch removal of HIDDEN DOM text. b2eb3a67 (dropping the `visibility:hidden` `#filterSidebar` overlay) passed visual 0-diff but silently broke e2e #7's `toContainText('Цена и плащане')` for `/inventory/map` (that string lived only in the hidden overlay). Fixed here → assert the real visible heading `'Карта на наличните автомобили'`. **Run e2e — not just the visual gate — after any de-template step that removes hidden elements / DOM text.**

#### BLOCKER found — the `[...templatePath]` catch-all canNOT be deleted yet (typing dependency)

Attempted to delete `src/routes/[...templatePath]` (now that the dashboard is gone it only serves dead `sell-car` aliases + the `/404` key; `+error.svelte` handles real 404s). `npm run check` then exploded with **36 type errors across 24 files** — every `resolve('/admin/leads/${id}')`, `resolve('/assets/images/card/card-1.jpg')`, `resolve('/admin/posts/${id}')`, etc. The `[...templatePath]` rest route makes SvelteKit's generated route union **permissive** (`${string}`), and many `resolve()`/route-typed calls in **`/admin/*`** (and elsewhere) silently rely on that to type-check dynamic/asset paths. Removing the catch-all narrows the union and breaks them — including admin pages that are OUT OF SCOPE. **Reverted** (`git checkout HEAD -- "src/routes/[...templatePath]"`, back to 0 errors). PREREQUISITE before the catch-all can go: fix those ~36 `resolve()` call sites (cast non-route strings, or stop using `resolve()` for asset paths) — a separate, admin-touching task. The catch-all is inert for 1:1 (serves only dead aliases), so leaving it costs nothing visually meanwhile.

### Session 2026-06-15b — state verified + dashboard reconciliation + scope pivot (NOTHING changed in src; docs/memory only)

- **CORRECTION — the "dashboard DELETED (56243665)" milestone above is STALE.** The user **reverted** it (`f1713350`, 2026-06-15 13:34) — so `/dashboard*` + the 9 `DesktopDashboard*.svelte` are PRESENT again. The deletion was clean (e2e 9/9, 0-diff); the revert is NOT "we couldn't make it work." Per `[[project_daynight_desktop_finalize]]` the **mobile.bg/cars.bg feed-export inside /dashboard is a deliberate PITCH ASSET** (polished 2026-06-13 with real `daynightVehicles`). So before deleting dashboard again, get an explicit user decision: keep the whole portal as a pitch mockup / extract just the feed-export to a clean native page / delete. (The portal itself is unguarded Themesflat demo; the feed-export also exists in `/admin`.)
- **State verified (build green; `visual:verify` 40/40 0-diff; interactive audit 22/22, 0 console errors).** Drove every inventory control (4 view modes, 4 densities, popover+modal filters incl. portal-to-`<body>`, sort, type-pills, clear-all, search), PDP gallery+inquiry, contact form (+honeypot), financing FAQ, header sticky/search-modal — all native, all working. The **calculator (/calculator + PDP) is STATIC** (no recompute on input change) — that is the 1:1 baseline, NOT a regression.
- **`resolve()` catch-all blocker is tractable, in this order:** delete dashboard (removes 7 of the dynamic `resolve(\`/dashboard…\`)`calls) → convert remaining dynamic`resolve(\`/admin/listings/${id}\`)` / `/inventory/${slug}`/`/blog/${slug}`to typed`resolve('/route/[id]', { id })`→ THEN`[...templatePath]` type-checks and deletes.
- **SCOPE PIVOT (user, 2026-06-15):** next is a NEW session to "finalize the desktop with **real improvements** + svelte cleanup" — i.e. 1:1 stays the regression NET, but deliberate improvements (reactive calculator; perf: single-tree UA render [user already mid-flight via uncommitted `device.ts`], PurgeCSS, prerender, WebP; a11y: swapped PDP gallery aria-labels) are now in scope as reviewed re-baselines, alongside the de-template cleanup (4 native routes → catch-all → TLB retire → pipeline delete). No grand redesign; per-element confirmed; blue banner untouched.
