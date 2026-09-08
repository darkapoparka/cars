# Bohemcars → Clean Svelte 5 + Tailwind v4 Migration Plan

> **Goal:** Retire the legacy Auxero HTML-template engine entirely. Every page becomes a
> pure Svelte 5 + Tailwind v4 component that composes shared, token-bound primitives.
> The look stays **1:1 or better**. Mobile (currently Lighthouse 100) must never regress.
>
> **Status of this doc:** Plan of record. Engineering decisions are made, not deferred.
> **Owner:** _you_ · **Last updated:** 2026-06-14

---

## 0. TL;DR

The app already lives in **two worlds**:

| World | Routes | How it renders | Verdict |
|---|---|---|---|
| **Clean** (done) | ~20 — all of `/admin/*`, `/offer`, `/compare-clean`, `/account/vehicles/[slug]` | Svelte 5 + Tailwind v4 / shadcn, `bc-*` tokens, **no `pageDocument`, no `app.css`** | Keep |
| **Auxero shell** (to migrate) | **28** — 19 public + 9 account | Server builds an HTML string → `{@html}` → splice Svelte children inside it → load 397 KB `app.css` + 2,553-line override sheet | **Replace** |

**The single most important finding:** the **data layer is already clean.** Every
[`$lib/auxero/*.ts`](src/lib/auxero/) module is *typed view-model data with zero HTML strings*
(`home-five.ts` = 1,566 lines of typed exports, `compare.ts`, `inventory-desktop.ts`, etc.).
They already feed real Svelte components. **This is a view-layer rebuild, not a rewrite.**

The migration is therefore mechanical and low-risk per route: stop calling the server
HTML pipeline, render the existing typed data through clean primitives, verify 1:1, ship.
When the **last** route leaves the shell, ~15 MB of cruft and **1,840 `!important`** delete in one commit.

**Proven:** [`/compare-clean`](src/routes/compare-clean/+page.svelte) already does exactly this — renders 1:1 with the
themed compare page while loading **zero theme CSS and zero `!important`**. It is the template for all 28.

---

## 1. Why this migration (the problem, quantified)

The Auxero theme is a vendored HTML template product wedged into SvelteKit by a
server-side string pipeline. The cost, measured:

| Cruft | Size / count | File |
|---|---|---|
| Vendored theme stylesheet | **397 KB · 18,758 lines · 149 `!important`** | [static/assets/app.css](static/assets/app.css) |
| Theme-override sheet (specificity war) | **2,553 lines · 542 `!important`** | [src/routes/auxero-guards.css](src/routes/auxero-guards.css) |
| Server HTML mutator | **3,350 lines · 14 regex passes · ~80 `.replaceAll` brand swaps** | [src/lib/server/auxero-template.ts](src/lib/server/auxero-template.ts) |
| Raw theme HTML source | **8.1 MB · 61 files** | [.template-ref/](.template-ref) |
| Legacy carousel bundle | **146 KB** | [static/assets/js/swiper-bundle.min.js](static/assets/js/swiper-bundle.min.js) |
| `!important` total in `src/` | **1,840** | (component `<style>` blocks fighting `app.css`) |
| `{@html}` server-blob injections | **17 across 9 files** | shells + 6 account/home2 pages |
| Regex HTML→Bulgarian translation pairs | **210** | `auxeroBgReplacements` in [messages.ts](src/lib/i18n/messages.ts) |
| Scattered inline `locale==='bg'?…` ternaries | **143 across 12 files** | builders + components |

### The two cruft mechanisms (what we are deleting)

1. **Server string surgery** — [`auxero-template.ts`](src/lib/server/auxero-template.ts) loads a raw
   `.template-ref/*.html`, runs it through 14 sequential regex passes (asset rewrite, ~80 brand
   `replaceAll`s, nav rewrite, aria injection, BG translation…), and emits an opaque HTML blob.

2. **Client string splicing** — [`AuxeroPageShell.svelte`](src/lib/components/layout/AuxeroPageShell.svelte) and
   [`AuxeroDashboardSlotShell.svelte`](src/lib/components/layout/AuxeroDashboardSlotShell.svelte) take that blob plus a Svelte
   `children` snippet and **count `<div>` depth with a regex to find where to slice** so Svelte renders
   *inside* the theme's `<div id="wrapper">`. This is the literal "template shit" — it is fragile,
   unobservable, and forces every real component to use `!important` to out-specify `app.css`.

Neither survives the migration.

---

## 2. The unlock (how a route goes clean)

A route becomes clean the moment **its `+page.server.ts` stops producing a `pageDocument`.**

- No `pageDocument` → the layout's `isAuxeroTemplatePage` derived is `false` →
  `app.css` / swiper / head-asset parsing are **never emitted** ([+layout.svelte](src/routes/+layout.svelte)).
- The `auxeroFullPage` flag is a **chrome switch, not a theme switch** — it only tells the layout
  "this route owns its own header/footer, skip the global ones." Treat theme and chrome separately.
- **Caveat — `auxero-guards.css` is NOT conditional.** Only `app.css` + swiper are gated by `pageDocument`
  ([+layout.svelte:83-85](src/routes/+layout.svelte#L83)). The 2,553-line / 542-`!important` guard sheet is
  imported **unconditionally** at [+layout.svelte:3](src/routes/+layout.svelte#L3), so it ships on *every*
  route — including converted clean ones — until its import is scoped or deleted. "Clean" therefore means a
  route **does not _depend_ on** guards, not "guards no longer load." Phase 0a isolates the import (move it
  behind the Auxero path); Phase 6 deletes the file.

This is precisely what [`/compare-clean/+page.server.ts`](src/routes/compare-clean/+page.server.ts) proves:
> `// POC route: NO pageDocument → the theme app.css never loads → clean slate.`

**Architecture decision — global clean chrome.** Converted public pages will **drop `auxeroFullPage`**
(set it falsy) so the global layout supplies the clean [`SiteHeader`](src/lib/components/layout/SiteHeader.svelte) +
[`SiteFooter`](src/lib/components/layout/SiteFooter.svelte) + `ScrollTop` + `MobileBottomNav`. One nav, one footer,
defined once — not re-hosted per page. (The POC inlined its own header only because it predates this decision.)
The clean global chrome path already exists and is exercised today by `/account/vehicles/[slug]`.

---

## 3. Goals & non-negotiables

1. **1:1 or better.** Pixel-faithful to the current look on desktop **and** mobile, per page, verified
   with side-by-side screenshots before merge. "Better" is allowed only where it is strictly additive
   (sharper type rendering, fewer layout shifts) — never a restyle.
2. **No regression — ever.** This is the prime directive. Mobile is currently Lighthouse 100; it stays 100.
   Every route ships only after passing the verification gate (§9). One route per PR, each independently revertable.
3. **Delete the engine, not piecemeal.** `app.css`, the shells, and the template pipeline stay until the
   **last** route is off them, then delete in one Phase-6 commit — a half-migrated page still on `pageDocument`
   still needs `app.css`, so don't pull it early. **Exception:** `auxero-guards.css` loads *globally* today
   ([+layout.svelte:3](src/routes/+layout.svelte#L3)), so Phase 0a may *scope* its import behind the Auxero path
   early (clean routes stop receiving it); final deletion is still Phase 6.
4. **Compose, never re-inline.** Pages compose primitives from a shared `bc/` library. No page re-authors
   the same button/card/pill utility string. A token change propagates everywhere.
5. **Keep the typed data.** The `$lib/auxero/*.ts` view-model builders are the asset, not the cruft.
   Rebuild only the view layer that consumes them.
6. **Tokens are the contract.** Components reference only `bc-*` utilities (`bg-bc-accent`, `rounded-bc-pill`,
   `text-bc-h2`…). No raw hex except the two sanctioned one-offs already in the POC (`#3a540e`, `#9fa1a4`).

### Definition of "done / clean / perfect"

A route is **done** when: no `pageDocument`; **does not _depend_ on** `app.css` or `auxero-guards.css` (guards
still *loads* globally until Phase 0a scopes it / Phase 6 deletes it — see §2 caveat); zero `!important` in its
own styles; composed from `bc/` primitives; copy via the typed catalog or `t()`; desktop+mobile 1:1;
`svelte-check` clean; Lighthouse ≥ current. The **app** is **perfect** when all 28 are done and Phase 6 has
deleted the engine.

> **Scope note (your "entire app clean and perfect").** `/admin/*` and `/offer` are *already* clean
> (shadcn + tokens). "Perfect" for them means they're done — rebuilding working admin would violate
> no-regression for zero gain. They participate only in the final low-risk token-harmonization pass (Phase 7).
> "Entire app" therefore = **migrate the 28 Auxero routes**, after which 100% of routes are clean.

---

## 4. End-state architecture (target)

```
src/
├─ lib/
│  ├─ components/
│  │  ├─ bc/                 ← NEW shared primitive library (token-bound, tailwind-variants)
│  │  │   Button, Pill, Card, Container, SectionHero, AppBar, IconDisc,
│  │  │   VehicleCard, CompareTable, Accordion, FormField, Carousel, Seo
│  │  ├─ layout/            SiteHeader, SiteFooter, MobileAppbar, MobileBottomNav, ScrollTop  (clean chrome)
│  │  ├─ home/ inventory/ compare/ detail/ …  ← page sections, rebuilt clean (no !important)
│  │  └─ ui/                shadcn primitives (admin only — unchanged)
│  ├─ content/ (was auxero/)  ← typed view-model builders (KEPT; optional rename in Phase 7)
│  ├─ i18n/
│  │   messages.ts          ← typed catalog = source of truth for shared copy
│  │   t.ts                 ← colocated t(bg,en) helper for page-local copy
│  └─ styles/
│      bohemcars.css            ← tokens (--bc-*) + .bc-card/.bc-focus-ring  (already clean)
│      bohemcars.tailwind.css   ← @theme map → bc-* utilities
│      bohemcars.tailwind-entry.css  ← clean Tailwind entry
├─ routes/
│  ├─ +layout.svelte        clean: SiteHeader + children + SiteFooter (+ admin nested layout)
│  └─ <route>/+page.svelte  thin composition of bc/ primitives fed by content/ data
└─ (DELETED) static/assets/app.css, .template-ref/, auxero-guards.css, swiper bundle, shells, template pipeline
```

**Net result after Phase 6:** ~15 MB removed from the repo, **1,840 `!important` → ~0**, a single CSS
system (Tailwind v4 + `bc-*` tokens), and every page observable/testable as ordinary Svelte.

---

## 5. The design-system contract (what guarantees 1:1)

The look is already fully captured in tokens — this is why 1:1 is achievable mechanically. Components must
reference these and nothing else.

### Tokens (from [bohemcars.css](src/lib/styles/bohemcars.css) → [bohemcars.tailwind.css](src/lib/styles/bohemcars.tailwind.css))

| Concern | Token(s) | Value | Rule |
|---|---|---|---|
| Brand green | `bc-accent` | `#98bc2a` | CTAs, pills |
| Green text/contrast | `bc-accent-contrast` | `#14210f` | text on green; dark hero base |
| Pale green wash | `bc-accent-soft` | `#f0f7dd` | best-cell highlight, chips |
| Page bg | `bc-bg` | `#fbfcfa` | off-white |
| Ink / soft ink | `bc-ink` / `bc-ink-soft` | `#1c1c1c` / `#2d3429` | text, dark footer surface |
| Border | `bc-border` | `#dde5d8` | the 1px flat-card border |
| Muted / footer muted | `bc-muted` / `bc-muted-light` | `#696665` / `#9fa1a4` | secondary text |
| Radius (default) | `rounded-bc-md` | 8px | cards, buttons |
| Radius (pill) | `rounded-bc-pill` | 999px | pills, discs, nav buttons |
| Radius (hero/section) | `rounded-bc-section` | 28px | big containers |
| Type scale | `text-bc-h1…h7`, `text-bc-body` | 68→18px, body 16/26 | **headings are 600 (semibold), not bold** |
| Font | `font-bc-body` | Manrope | **weight caps at 800** (900 silently clamps) |
| Focus | `.bc-focus-ring` | green `rgb(152 188 42 / .5)` | all interactive |

### Visual grammar (the non-negotiable "look")

- **Flat cards:** 1px `bc-border` + white/`bc-surface` fill + **`box-shadow: none`** + **no hover `transform`**
  (hover changes only color/bg/border, per `.bc-calm-hover`). Shadows reserved for popovers/modals.
- **Dark-green chrome heroes:** `linear-gradient(135deg,#14210f,#1f3318,#0f190c)` + `ring-white/10`.
- **Green mobile app bar:** transparent over green hero, logo forced `filter:brightness(0)`, 44px white discs
  (`inset 0 0 0 1px rgba(20,33,15,.14)`), primary disc `bc-accent-bright-soft`.
- **Pills:** brand chip `bg-bc-accent-soft text-[#3a540e]`; solid "best" `bg-bc-accent text-bc-accent-contrast`;
  eyebrow `uppercase tracking-wide text-bc-muted`.
- **Touch:** 44px minimum interactive height everywhere.
- **Icons must inherit color** (`svg{color:inherit}`) so lucide icons survive on green/dark surfaces.

> These are already encoded in [`CompareCleanPage.svelte`](src/lib/components/compare/CompareCleanPage.svelte)
> and [`CleanSiteFooter.svelte`](src/lib/components/layout/CleanSiteFooter.svelte) — the de-facto pattern library
> the `bc/` primitives are extracted from.

---

## 5a. Tailwind v4 CSS architecture (and the `app.css` naming trap)

> Grounded in the official v4 docs (CSS-first config: `@import "tailwindcss"` + `@theme`). The project is
> **already idiomatic v4** — this section exists so the migration *consumes* it correctly, not re-invents it.

**Naming trap — two unrelated "app.css" files; never confuse them:**

| File | What it is | Fate |
|---|---|---|
| [static/assets/app.css](static/assets/app.css) | The **Auxero theme** (397 KB vendored framework). **Not Tailwind.** | Deleted (Phase 6) |
| [bohemcars.tailwind-entry.css](src/lib/styles/bohemcars.tailwind-entry.css) | The **Tailwind v4 entry** (`@import 'tailwindcss'`) | Kept, extended to every page |

"Drop app.css" **always** means the Auxero one. The Tailwind entry is what we standardize on.

**The token stack is already correct v4 — keep it, don't "modernize" it.** It mirrors Tailwind Labs' own
`globals.css` (`@theme inline` pointing at `:root` vars). No `tailwind.config.js`; config lives in CSS:
- [bohemcars.css](src/lib/styles/bohemcars.css) — raw `--bc-*` token **values** on `:root` (themeable layer).
- [bohemcars.tailwind.css](src/lib/styles/bohemcars.tailwind.css) — `@theme inline { --color-bc-accent: var(--bc-accent); … }`
  maps tokens → utilities (`bg-bc-accent`, `rounded-bc-pill`, `text-bc-h2`).
- [bohemcars.tailwind-entry.css](src/lib/styles/bohemcars.tailwind-entry.css) — `@import 'tailwindcss'` + the map = the entry.

**Entry-import strategy — transitional vs end-state (this is the one real decision):**
- **During migration (Auxero still coexists):** keep importing the Tailwind entry **per clean route** (exactly as
  [`/compare-clean`](src/routes/compare-clean/+page.svelte) does). Reason: `@import "tailwindcss"` ships
  **Preflight** (a base reset) that would collide with the Auxero `app.css` on un-migrated pages. Scoping the
  entry to clean routes keeps the two worlds isolated — **do not** make it global while `app.css` still loads.
- **End-state (Phase 6, after `app.css` is deleted):** **promote the entry to ONE global import** in the root
  layout (beside `bohemcars.css`) and delete the per-route imports. Single stylesheet, Preflight as the only
  reset — the textbook v4 structure.

**Svelte scoped-style rule:** a `.svelte` `<style>` block that uses `@apply` must start with
`@reference "$lib/styles/bohemcars.tailwind-entry.css";` so it sees the theme without duplicating CSS. **Prefer
utility classes in markup** (no `@reference` needed); reach for `@apply` only when a scoped style genuinely needs it.

---

## 6. Phase 0 — Foundation (split: 0a safety · 0b atoms · 0c dogfood)

No live route behavior changes in this phase. Stand up a safety harness, then the **minimal** shared substrate,
then prove it on the known-good POC. **Build only what the next phase needs — defer speculative composites.**

### Phase 0a — Safety harness, audit & isolation (first, before any component)

> ⚠️ **The worktree is dirty.** `git status` shows in-progress user changes (modified `package.json`,
> `messages.ts`, `+layout.svelte`, several components, untracked assets). **Do not revert, stash, or overwrite
> unrelated changes.** Branch from the current state; touch only migration files; never `git checkout`/`restore`
> someone else's edits. Verify a migrated route only against its own `before/` baseline, not the whole tree.

1. **Route-inventory check (scripted, repeatable).** A command that flags which routes still produce a
   `pageDocument`, so progress is a measurable burn-down. Ground-truth signals:
   ```
   rg -l "renderAuxeroPageDocument|renderAuxeroPageSlot|pageDocument" src/routes   # shell routes remaining
   rg -l "AuxeroPageShell|AuxeroPublicShell|AuxeroDashboardSlotShell" src/lib       # shell consumers
   rg -c "\{@html" src/lib src/routes                                               # blob injections
   rg -c "!important" src/                                                          # specificity debt
   rg -n "auxeroFullPage|app\.css|auxero-guards\.css" src/routes src/lib            # chrome/theme coupling
   ```
   Record the starting counts (**28 shell routes · 17 `{@html}` · 1,840 `!important`**) as the baseline.
2. **Baseline-capture convention.** Before touching a route, save `outputs/qa/migration/<route>/before/`:
   desktop (1440) + mobile (390) screenshots + Lighthouse JSON (mobile + desktop). `after/` mirrors it at verify time.
3. **Dependency pre-flight (install only when the consuming primitive lands).** Neither is in `package.json` yet:
   - `@fontsource-variable/manrope` — add **when** the root font swap / `bc/Seo` is implemented (0b). Until then
     the existing Google-Fonts `<link>` keeps working; don't remove it pre-emptively.
   - `embla-carousel-svelte` — add **only** at Phase 3/4 when `bc/Carousel` is actually built. **Not** in Phase 0.
4. **Global clean-chrome verification.** Confirm [`SiteHeader`](src/lib/components/layout/SiteHeader.svelte) +
   [`MobileAppbar`](src/lib/components/layout/MobileAppbar.svelte) + [`SiteFooter`](src/lib/components/layout/SiteFooter.svelte)
   + `MobileBottomNav` render **1:1 against the current Auxero header/footer** on a throwaway clean route.
   Highest-leverage task — all 28 pages inherit this chrome.
5. **Guard-CSS isolation decision.** `auxero-guards.css` is imported globally (§2 caveat). Either **(a)** move its
   import out of [+layout.svelte:3](src/routes/+layout.svelte#L3) into the Auxero shell path so clean routes stop
   receiving it, or **(b)** accept it ships inert until Phase 6. Test the step-4 throwaway route with/without it:
   if any guard rule leaks onto clean pages → do (a); else (b) is fine. Decide here and document it.

### Phase 0b — Minimal `bc/` atoms only (YAGNI: no speculative composites)

Build just what the early pages need, on the already-proven `tailwind-variants` + `cn()` toolchain (used in
admin today), bound to `bc-*` tokens. Each atom: references only `bc-*` utilities; bakes in its own responsive
rules; ships a short usage example. Components consume the **existing** Tailwind entry (§5a) — never add a second
`@import 'tailwindcss'`, and keep that entry per-route until Phase 6 (Preflight-vs-`app.css` isolation).

- `Container`, `Button` (`variant: primary|ghost|neutral`, `size`, `pill?`, disabled, `min-h-[44px]`),
  `Pill`/`Badge` (`tone: brand|solid|eyebrow`), `Card` (`variant: default|soft`, `media?` = the `.bc-card`
  contract), `Seo` (`<svelte:head>` title/meta/canonical/OG from `+page.ts` — replaces the
  [page-document.ts](src/lib/auxero/page-document.ts) head-string parsing), `FormField` (input/label/validation),
  `Accordion` (**native `<details>/<summary>`** — zero client JS, safe on SSR-only routes).
- Promote [`CleanSiteFooter`](src/lib/components/layout/CleanSiteFooter.svelte) → `bc/Footer`. Add `SectionHero`
  **when the first page with a hero needs it** (likely a Phase 1 pilot), not speculatively.
- Land `$lib/i18n/t.ts` (promote the POC's inline `t(bg,en)` helper). Self-host fonts via
  `@fontsource-variable/manrope` here (single root import; kills the per-page Google-Fonts `<link>` + FOUT).

**Deferred until a route truly needs them** (avoid speculative abstraction):
`VehicleCard` + `CompareTable` → Phase 3 (`/inventory`, `/compare`); `Carousel` + extra `AppBar`/`IconDisc`
variants → Phase 3/4.

### Phase 0c — Dogfood on the POC

Refactor [`/compare-clean`](src/routes/compare-clean/+page.svelte) to consume the new `bc/` atoms + global clean
chrome (instead of inline utility strings / its inline header). This proves the library and the chrome on a
known-good page **before** any live route changes. (Its compare table stays inline until `CompareTable` lands in Phase 3.)

**Phase 0 exit criteria:** safety harness in place · dirty-tree respected · guard-CSS decision documented · global
chrome verified 1:1 · minimal atoms built and type-clean · `/compare-clean` re-pointed onto them. No live route changed.

---

## 7. The migration waves (dependency-ordered)

Order is chosen so the recipe is validated on cheap pages first and the riskiest page is last. Each route is
one PR. Pages **drop `auxeroFullPage`** (use global clean chrome) unless noted.

### Phase 1 — Pilots (validate recipe + global chrome end-to-end)
Lowest-risk, mostly static. Proves the chrome integration that the POC didn't exercise.
- `/terms`, `/faqs`, `/reviews`, `/contact`
- Data already typed: [terms.ts](src/lib/auxero/terms.ts), [faqs.ts](src/lib/auxero/faqs.ts) (use `bc/Accordion`),
  [reviews.ts](src/lib/auxero/reviews.ts), [contact.ts](src/lib/auxero/contact.ts) (use `bc/FormField`).

### Phase 2 — Content pages (recipe at scale)
- `/about`, `/services`, `/import`, `/financing`, `/calculator`, `/sell-your-car`,
  `/agents`, `/agents/[slug]`, `/blog`, `/blog/[slug]`
- All have clean typed builders already ([about.ts](src/lib/auxero/about.ts), [services.ts](src/lib/auxero/services.ts),
  [calculator.ts](src/lib/auxero/calculator.ts), [sell-your-car.ts](src/lib/auxero/sell-your-car.ts), …).
- `/calculator` and `/sell-your-car` carry forms + the BNB rate `1.95583` (dedupe into one constant) and
  `EUR` price literals — centralize while here.

### Phase 3 — Composite pages (the heavy hitters)
- **`/compare`** — fold the [`CompareCleanPage`](src/lib/components/compare/CompareCleanPage.svelte) POC into the real
  route, then **delete `/compare-clean`** and its server file. First "retire a duplicate" win.
- **`/`** (home) — `HomeFiveTemplatePage` orchestrates 7+ sections; rebuild each on `bc/` primitives, convert
  the mobile CSS-`order` reflow to Tailwind responsive ordering. Many sections (`HomeFiveHeader/Hero/…`) are
  *already* Svelte carrying 100+ `!important` each — those `!important` strip out once `app.css` is gone.
- **`/home2`** — currently a raw `{@html runtimeHtml}` blob ([HomeTwoTemplatePage.svelte](src/lib/components/home2/HomeTwoTemplatePage.svelte))
  fed by the shared home page data ([home-five-page-data](src/lib/server/home-five-page-data.ts)); rebuild on the
  same home sections (it's an alt-homepage layout, not new content).
- **`/inventory`** — desktop + mobile surfaces; view-models exist
  ([inventory-desktop.ts](src/lib/auxero/inventory-desktop.ts), [inventory-mobile.ts](src/lib/auxero/inventory-mobile.ts)).
  Preserve the intentional Sidebar/Grid + Popover/Modal client-pick toggles (these are deliberate pitch options,
  not over-engineering — do **not** simplify them away).

### Phase 4 — The PDP (`/inventory/[slug]`) — hardest, isolated last
The only true dual-tree split: desktop is Auxero-template HTML, mobile is the modern vaul snap-sheet.
- **Desktop:** rebuild as clean Svelte from [detail.ts](src/lib/auxero/detail.ts) (gallery via `bc/Carousel`,
  buy-box tab state, spec tables).
- **Mobile:** **keep the existing vaul drawer** ([AuxeroVehicleMobilePdp.svelte](src/lib/components/detail/AuxeroVehicleMobilePdp.svelte))
  — it is already modern Svelte and the mobile PDP UX genuinely diverges (snap points, finance block ≤380px).
  This is the **one sanctioned desktop/mobile component split**; everything else unifies.
- Highest verification bar: swiper→Embla gallery parity, `{#key}` re-render on variant change, sticky buy-box.

### Phase 5 — Account dashboard (mostly a shell swap)
9 hybrid routes. The clean replacement **already exists and is proven**:
[`DashliteDashboardShell`](src/lib/components/account/DashliteDashboardShell.svelte) (used by `/account/vehicles/[slug]`).
- Swap `AuxeroDashboardSlotShell` → `DashliteDashboardShell` across `/account`, `/account/profile|password|
  favorites|messages|listings|listings/new|listings/edit/[id]|compare`.
- Drop the 6 `{@html}` branches; the Svelte fallbacks (`AccountListingsTable`, `AccountListingForm`, …) already exist.
- These keep `auxeroFullPage: true` (the dashboard owns its own sidebar chrome — correct use of the flag).

### Phase 6 — The great deletion (only when 0 routes produce a `pageDocument`)

**Hard gate first — prove zero references, then delete in one commit.** Each deletion must be preceded by an
`rg` that returns nothing:
```
rg -l "renderAuxeroPageDocument|renderAuxeroPageSlot|pageDocument|auxeroPublicShellData" src   # → empty
rg -l "AuxeroPageShell|AuxeroPublicShell|AuxeroDashboardSlotShell|AuxeroRuntimeScripts|AuxeroHead" src  # → empty
rg -l "home-five-page-data|auxero-home-data|auxero-listing-data|auxero-support-data|auxero-account-data|auxero-public-shell|auxero-template|auxero-page" src  # → empty
```

**Static/CSS/template:** [`.template-ref/`](.template-ref) (8.1 MB),
[`auxero-guards.css`](src/routes/auxero-guards.css), [`static/assets/app.css`](static/assets/app.css), swiper bundle.

**Shell components:** [AuxeroPageShell](src/lib/components/layout/AuxeroPageShell.svelte),
[AuxeroDashboardSlotShell](src/lib/components/layout/AuxeroDashboardSlotShell.svelte),
[AuxeroPublicShell](src/lib/components/layout/AuxeroPublicShell.svelte),
[AuxeroRuntimeScripts](src/lib/components/layout/AuxeroRuntimeScripts.svelte),
[AuxeroHead](src/lib/components/layout/AuxeroHead.svelte).

**Server `pageDocument`-builder family** (the whole mutator/wrapper layer — distinct from the *typed view-model
builders* in `$lib/auxero/*.ts`, which are **KEPT**): [auxero-template.ts](src/lib/server/auxero-template.ts),
[auxero-page.ts](src/lib/server/auxero-page.ts), [auxero-public-shell.ts](src/lib/server/auxero-public-shell.ts),
[home-five-page-data.ts](src/lib/server/home-five-page-data.ts),
[auxero-home-data.ts](src/lib/server/auxero-home-data.ts),
[auxero-listing-data.ts](src/lib/server/auxero-listing-data.ts),
[auxero-support-data.ts](src/lib/server/auxero-support-data.ts),
[auxero-account-data.ts](src/lib/server/auxero-account-data.ts) — **plus their `.spec.ts` files, only after the
above `rg` gate is empty.**

**`$lib/auxero` leftovers:** [page-document.ts](src/lib/auxero/page-document.ts),
[fidelity.ts](src/lib/auxero/fidelity.ts), [template-map.ts](src/lib/auxero/template-map.ts),
the `[...templatePath]` catch-all proxy, `auxeroBgReplacements` + `localizeAuxeroHtml` in messages.ts.

> ⚠️ **Do not blanket-delete by `auxero-*` name.** The `$lib/auxero/*.ts` view-model builders (home-five,
> inventory-desktop/mobile, compare, detail, …) are typed data the clean pages consume — **keep them.** Only the
> *server* `pageDocument` wrappers above die. Confirm each target's importers are zero before removing it.

**Then:** remove the `bohemcars:hydrated` / `bohemcars:svelte-mounted` hydration-gate plumbing from
[+layout.svelte](src/routes/+layout.svelte); delete the `auxero-guards.css` import (line 3); and **promote the
Tailwind entry to a single global import** in the root layout — `@import "tailwindcss"` now owns the only
Preflight reset, so drop the per-route entry imports (§5a). **Acceptance test:** clean build + bundle-size drop
+ full test suite green.

### Phase 7 — Harmonize & polish
- Strip any residual `!important` that survived in migrated component `<style>` blocks (most are already gone
  with `app.css`).
- Retrofit the already-clean islands (`/offer`, admin) to consume `bc/` primitives where it reduces duplication
  (low-risk, optional).
- Optional cosmetic rename `$lib/auxero/` → `$lib/content/` (it's just typed data now; the name misleads).
  Mechanical find-replace of imports — defer here to avoid churn during conversion.
- Final accessibility pass (the regex aria-label injection is gone; confirm native a11y on forms/nav/dialogs).
- Full-site Lighthouse + visual sweep.

---

## 8. The per-route conversion recipe (follow verbatim)

For each Auxero route `R`:

1. **Branch** off `main` (one route per branch/PR).
2. **Capture baseline:** screenshot current `R` at desktop (1440) + mobile (390) + Lighthouse (mobile & desktop).
   Save to `outputs/qa/migration/<route>/before/`.
3. **Server:** in `R/+page.server.ts`, delete the `renderAuxeroPageDocument(...)` / `auxeroPublicShellData(...)`
   call. Return the existing typed view-model data (already built by the `content/` module) + `locale` +
   footer data. **Drop `auxeroFullPage`** (public pages) so global chrome applies; keep it (account dashboards).
4. **View:** rewrite `R/+page.svelte` to render a clean component composed from `bc/` primitives, fed by the
   typed data. No `{@html}`. No `AuxeroPublicShell`/`AuxeroPageShell`.
4a. **CSR check:** read the route's `csr` (in `R/+page.ts`). These routes are **SSR-only by default
   (`csr=false`)** — client-JS UI (Embla, JS toggles, `SvelteSet` state) silently dies there. Use native-HTML
   primitives (`<details>` accordion, `<form>` POST, CSS scroll-snap) for SSR-only pages; set `csr=true` **only**
   where interactivity is essential (compare remove, PDP gallery, inventory toggles).
5. **Copy:** shared strings → typed catalog ([messages.ts](src/lib/i18n/messages.ts)); page-local strings →
   `t(bg,en)`. Remove any matching entries from `auxeroBgReplacements` (but don't delete the function until Phase 6).
6. **Meta:** add `bc/Seo` (title/description/canonical/OG) from `+page.ts`.
7. **Body-class CSS check:** if the old page relied on `body.auxero-template-*` scoped selectors, port those
   rules into the component's scoped `<style>` (they silently stop applying once `pageDocument` is gone — a
   classic regression trap).
8. **Verify (the gate, §9).** Capture `after/` screenshots; diff against `before/`.
9. **Ship** only when the gate is green. Revertable PR.

> The mechanics are identical for all 28 because the data is already typed and the chrome is global. The
> per-route work is the *view markup*, sized by visual complexity (terms ≈ an hour; PDP ≈ the hard one).

---

## 8a. Svelte 5 implementation rules (every new component)

Non-negotiable for all `bc/` primitives and rebuilt page views (matches the project's `svelte-core-bestpractices`):

- **Runes mode only** — `$props()`, `$state()`, `$derived()` / `$derived.by()`. No `export let`, no legacy `$:`.
- **Prefer `$derived` over `$effect`.** Use `$effect` *only* for external/DOM-library integration (Embla, vaul,
  IntersectionObserver) — never to compute state from props. (See the POC's `selected`/`rows` deriveds.)
- **Keyed `{#each list as item (item.id)}`** everywhere — stable keys, never index keys on dynamic lists.
- **`onclick={…}`**, not `on:click` (Svelte 5 event attributes); same for all `on*` handlers.
- **No legacy slots** — use snippets (`{#snippet}` / `{@render}`) and `Snippet` props.
- **Native HTML on SSR-only routes** — `<details>/<summary>` accordions, `<form>` POST, CSS scroll-snap; set
  `csr=true` only where client interactivity is essential (compare remove, PDP gallery, inventory toggles).
- **No `{@html}`** for app content; tokens-only styling (`bc-*`); zero `!important`.
- **Scoped `<style>` + `@apply` needs `@reference`** to the Tailwind entry (§5a) — prefer utilities in markup;
  use `@apply` only when a scoped style genuinely needs it.
- **Autofix every edit:** after editing any `.svelte` file, run it through the **Svelte MCP autofixer** (via the
  `svelte-file-editor` agent / `svelte-code-writer` skill — e.g. `npx @sveltejs/mcp svelte-autofixer <file>`) and
  resolve what it flags before committing.

---

## 9. Verification & no-regression gate (every route)

A route does not merge until **all** pass:

| Gate | Command / tool | Pass condition |
|---|---|---|
| Type safety | `npm run check` | 0 errors |
| Lint + format | `npm run lint` | clean (prettier + eslint) |
| Unit | `npm run test:unit -- --run` | green |
| E2E | `npm run test:e2e` | green (update snapshots intentionally only) |
| Build | `npm run build` | succeeds, no new warnings |
| Visual 1:1 — desktop | Playwright / chrome-devtools-mcp @ 1440px | matches `before/` (manual diff) |
| Visual 1:1 — mobile | Playwright / chrome-devtools-mcp @ 390px | matches `before/`; green chrome intact |
| Lighthouse — mobile | `lighthouse_audit` (where available) | **stays 100** (perf/a11y/best-practices/SEO) |
| Lighthouse — desktop | `lighthouse_audit` (where available) | ≥ baseline (target: improves vs `app.css`) |
| `!important` count | `rg -c "!important"` on the route | route's own styles = 0 |

> `npm run verify` chains check + lint + unit in one shot. Run it (plus `build`) as the pre-merge sweep.

**Operational footguns to respect during gating** (from project history):
- **Stop the dev server before `svelte-kit sync` / `check` / `build`.** Running them against the live `:5174`
  dev server wedges it (500 ENOENT). Restart after.
- chrome-devtools-mcp **`fullPage` screenshots fake broken lazy images** — use viewport captures + scroll.
- If the MCP browser profile locks, kill stray `mcp-chrome` processes.

---

## 10. Footguns & gotchas (carry these into every PR)

These are known traps documented from prior work on this exact codebase:

1. **`auxeroFullPage` is overloaded** — it's chrome ownership, not theme. Dropping a page to clean does *not*
   always mean removing it (admin/offer/account keep it). Reason about header/footer ownership separately.
2. **`pageDocument.bodyClass` body-scoped CSS dies silently** when a page drops `pageDocument`. Any
   `body.auxero-template-* { … }` rule must be ported to component scope (recipe step 7).
3. **`app.css` global `* { color:#1c1c1c }`** makes lucide/SVG icons invisible on dark/green surfaces. The
   `svg{color:inherit}` fix in [bohemcars.css](src/lib/styles/bohemcars.css) handles it globally — keep it.
4. **`#wrapper { overflow:hidden !important }` kills `position:sticky`.** Gone with the shell, but watch sticky
   buy-box / sticky filters during the PDP/inventory rebuilds; use a scoped `overflow:clip` override if needed.
5. **Manrope weight caps at 800** — `font-weight:900` silently clamps. Primitives cap at `font-extrabold`.
6. **Headings are semibold (600), not bold** — the calm even-scale look the mobile audit settled on. Don't
   reintroduce a "wall of bold."
7. **`replaceAll` brand swaps mis-case Bulgarian** — the regex translation layer is being deleted; do not add to it.
8. **Hydration race** — legacy `app.js`/`swiper.js` gate on `bohemcars:hydrated`. While both worlds coexist,
   leave the gate intact; remove only in Phase 6 when no template page remains.
9. **Cutout-vs-photo image logic** — `VehicleCard`/`CompareTable` must preserve `object-contain`+padding for
   cutouts vs `object-cover` for photos, and the homepage photo-only filter (per the WebP pipeline).
10. **Intentional "options" are not over-engineering** — inventory's Sidebar/Grid + Popover/Modal toggles and
    the home2/offer/AI-copilot product surfaces are deliberate. Migrate them faithfully; don't "simplify" them away.
11. **Routes are SSR-only by default (`csr=false`).** Client-JS UI (carousels, JS toggles, `SvelteSet` reactive
    state) silently dies on these — the FAQ broke until it was rewritten to native `<details>`. Match the
    primitive to the route: native-HTML where SSR-only; opt into `csr=true` only where interactivity is essential.

---

## 11. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Visual drift vs current theme | Med | High | Per-route before/after screenshot gate; tokens already encode the look |
| Mobile Lighthouse regression | Low | High | Lighthouse-100 gate per route; fonts self-hosted (fewer requests) |
| Pulling `app.css` too early breaks half-migrated pages | Med | High | Engine deleted **only** in Phase 6, after 0 routes use `pageDocument` |
| PDP dual-tree complexity | High | Med | Isolated to Phase 4, last; mobile vaul sheet kept as-is |
| Body-class-scoped CSS silently lost | Med | Med | Recipe step 7 explicit check; grep `body.auxero-template-` per route |
| Scope creep into working admin | Low | Med | Admin explicitly out of rebuild scope (§3) |
| Carousel parity (swiper→Embla) | Med | Med | Validate on home rails (Phase 3) before PDP gallery (Phase 4) |
| i18n string loss during catalog move | Med | Low | Keep `auxeroBgReplacements` until Phase 6; diff copy in the visual gate |

---

## 12. Sequencing summary

```
Phase 0  Foundation      bc/ primitives · Seo · fonts · Carousel · global chrome · recipe   [no live route changes]
Phase 1  Pilots          terms · faqs · reviews · contact                                   [validate recipe+chrome]
Phase 2  Content         about · services · import · financing · calculator · sell-your-car
                         · agents(+slug) · blog(+slug)
Phase 3  Composites      compare (retire /compare-clean) · home · home2 · inventory
Phase 4  PDP             inventory/[slug]  (desktop rebuilt · mobile vaul kept)             [hardest, isolated]
Phase 5  Account         9 dashboard routes → DashliteDashboardShell (shell swap)
Phase 6  DELETE ENGINE   .template-ref · auxero-template.ts · app.css · auxero-guards.css
                         · shells · page-document · hydration gate · regex i18n            [~15 MB, 1,840 !important → 0]
Phase 7  Harmonize       strip residual !important · primitives into offer/admin
                         · optional auxero/→content/ rename · a11y + full Lighthouse sweep
```

**Invariant:** after every PR the app is fully shippable. The two worlds coexist cleanly until Phase 6
because the unlock (§2) is per-route and the engine is shared but inert for converted pages.

---

## 13. Appendix — full route inventory & status

**Legend:** ⬜ to migrate · ✅ already clean · 🔧 shell swap

### Public (Phase 1–4) — 19 routes, all ⬜
`/` · `/home2` · `/inventory` · `/inventory/[slug]` · `/compare` · `/about` · `/services` · `/import` ·
`/financing` · `/calculator` · `/sell-your-car` · `/contact` · `/agents` · `/agents/[slug]` · `/blog` ·
`/blog/[slug]` · `/reviews` · `/faqs` · `/terms`

### Account (Phase 5) — 9 routes, all 🔧 (DashliteDashboardShell swap)
`/account` · `/account/profile` · `/account/password` · `/account/favorites` · `/account/messages` ·
`/account/listings` · `/account/listings/new` · `/account/listings/edit/[id]` · `/account/compare`

### Already clean (no rebuild) — ✅
All of `/admin/*` (16, shadcn) · `/offer` · `/compare-clean` (POC — *deleted* in Phase 3 once folded into `/compare`) ·
`/account/vehicles/[slug]` (the DashliteDashboardShell reference impl)

### Keep (data layer) — the win, not cruft
Every [`$lib/auxero/*.ts`](src/lib/auxero/) view-model builder (home-five, inventory-desktop/mobile, compare,
detail, about, services, calculator, sell-your-car, contact, faqs, reviews, blog, agents, dashboard, …) —
typed data, zero HTML strings. Feeds the clean components directly. (Optional `→ content/` rename in Phase 7.)

---

_End of plan. Phase 0 is the next action: stand up `src/lib/components/bc/` and harden the global clean chrome._
