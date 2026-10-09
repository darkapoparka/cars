# Auto Best full-project inspection — 9 October 2026

The initial inspection fixed the mobile corner mismatch across Auto Best. Content cards, vehicle cards,
brand/body tiles, entry forms, services, showroom panels and related cars now use
the shared mobile card role, initially **16px**, matching the All services banner.

The original Home override used the 24px spacing token as a corner radius. Other
components retained independent 14–26px values or inherited their desktop corner
roles on phones. Those overrides are now governed by the shared radius system.
Controls, media, badges and drawers retain their separate roles; drawers use 24px
top corners and pill controls remain pills.

The follow-up [16px versus 12px comparison](../mobile-card-radius-comparison-2026-10-09/README.md)
connects the remaining generic outer cards to the mobile card role and supplies
matched screenshots. The owner then selected [12px as the saved mobile default](../mobile-card-radius-12-2026-10-09/README.md).
The applied 12px default passes the newer 66-case mobile corner checks, and
tablet/desktop rounding remains unchanged. The results below record the initial
inspection before that size selection.

## Scope and corrections

The source inventory covers **172 runtime files, 99 Svelte components, 11 CSS files
and all eight page routes**. Inspection included shared navigation, menus,
preferences, search/filter choices, finance and enquiry dialogs, empty results,
error pages, typography, icons, media, locale behavior and demo form boundaries.

All **464 physical corner declarations** now use radius tokens, inheritance or
intentional zero corners. Component-local radius variables also alias shared
tokens. The token check rejects literal corner values, spacing tokens used as
radii, local numeric radius variables and logical corner bypasses. Runtime checks
assert the actual computed mobile card corners, so a competing responsive rule
cannot pass on token usage alone.

Two additional mobile defects were corrected:

- `scrollbar-gutter: stable` reserved a 15px strip on phones, narrowing full-screen
  dialogs and misaligning the fixed dock. Below 768px the root now uses `auto`.
- Safari could clip Bulgarian card prices at 200% text size because the space
  before `€` was nonbreaking. Currency symbols and codes may now wrap separately;
  the grouped digits and amount stay intact. Ten normal-size Safari comparisons
  confirm unchanged price/card geometry at 320, 390, 768, 992 and 1440px in BG/EN.

The country preference list now has stable keys. Existing smoke assertions were
updated for the current 20px header icons, 48px editor fields, visible mobile
glyphs, desktop toolbar alignment and the shared filter form's submitted values.

## Verification

Checks used Node 22.20.0 and fresh, task-owned production previews. All owned
preview listeners were closed after their runs.

| Evidence | Result |
| --- | --- |
| Architecture, CSS policy, tokens, typography, assets, domain/security/overlay checks | Pass |
| Svelte type/compiler check | 0 errors, 0 warnings |
| Production build and dependency audit | Pass; 0 vulnerabilities |
| Radius policy fixtures | 3 pass |
| [HTTP security](qa/http-security.json) | 9 pass |
| [Routes, redirects and sitemap](qa/routes.json) | 114 pass |
| [Rendered route sweep](qa/rendered-routes.json) | 90 BG/EN states at 320/390/1440px; no page overflow, duplicate IDs, broken local media or browser exceptions |
| [Shared mobile card corners](qa/radius.json) | 60 pass across ten route states in BG/EN at 320/390/767px |
| [Mobile filters](qa/mobile-filters.json), [Home browse](qa/home-browse.json), [desktop discovery](qa/desktop-discovery.json), [enquiries](qa/enquiries.json) | 4, 10, 6 and 4 pass |
| [Responsive journeys](qa/responsive-journeys.json) | 6 journey groups pass, including breakpoint/landscape checks through 1920px |
| [Mobile composition](qa/mobile-polish.json), [service overlays](qa/service-overlays.json) | 8 and 24 pass |
| [Chromium text reflow](qa/reflow-chromium-full.json) | 138 pass at 320/390/430px; normal, text spacing, 200% text and short dialogs |
| [Safari/WebKit text reflow](qa/reflow-webkit-320.json) | 46 pass in BG/EN at 320px, including all tested dialogs |
| [Final Chromium price recheck](qa/price-reflow-chromium.json) | 2 pass after the currency-space correction |
| [Normal price layout comparisons](qa/price-layout.json) | 10 pass; the original currency whitespace reproduces Safari clipping at 200% |
| [Desktop/tablet corner equivalence](qa/desktop-corners-equivalence.json) | 90 pass at 768/992/1440px, in BG/EN across 15 route states |
| [Final rebuilt preview](qa/final-render.json) | 6 pass at 320/390/767/768/992/1440px for the shared discovery radius, mobile gutter and page width |

The 138-case Chromium sweep precedes the currency-space correction; the focused
Chromium rerun and complete 320px WebKit sweep verify that final correction.
The source/compiler/build checks were repeated after the final local radius alias.
The standard smoke suites all pass individually after correcting stale assertions;
the earlier stopped smoke-driver run is retained in ignored runtime logs.

All 99 Svelte files were inspected with the Svelte analyzer. Its remaining
advisories concern recognized locale/path wrappers, explicit external links and
existing focus/draft bindings; source guards and runtime routing/focus checks
verify those contracts. Analyzer advisories are separate from the clean Svelte
compiler result.

## Rendered comparisons

These matched full-page screenshots use Bulgarian at 390px:

| Surface | Before | After |
| --- | --- | --- |
| Home | [Before](before-home-bg-390.png) | [After](after-home-bg-390.png) |
| About/showroom | [Before](before-about-bg-390.png) | [After](after-about-bg-390.png) |
| Article/content cards | [Before](before-article-bg-390.png) | [After](after-article-bg-390.png) |
| Vehicle details | [Before](before-vehicle-bg-390.png) | [After](after-vehicle-bg-390.png) |
| Sell | [Before](before-sell-bg-390.png) | [After](after-sell-bg-390.png) |
| Import | [Before](before-import-bg-390.png) | [After](after-import-bg-390.png) |

Safari price reproduction at 320px with 200% text:
[original currency whitespace](safari-price-before-320-200.png) and
[corrected wrapping](safari-price-after-320-200.png). The former is reconstructed
by restoring only the exact pre-fix currency whitespace in the rendered card.

## Source and acceptance boundary

Work is in the canonical `L:/CODEX/cars/templates/auto-best` checkout on `main`.
[Source scope](source-scope.json) records the baseline/current hashes and 48
affected runtime paths. The shared checkout's existing edits and other tasks'
work were retained. Desktop filters and company heroes changed independently
during the audit, so historic whole-page screenshots are not a claim of desktop
pixel identity. The 90 equivalence cases isolate this task's corner replacements
inside the current browser cascade and confirm unchanged geometry and styling.

The detailed [source inventory](qa/source-corners.json) and
[validation record](qa/validation.json) are local audit evidence. These changes
are uncommitted working source; template promotion, dealer/public deployment and
owner visual acceptance are separate operations. Demo enquiry delivery remains
subject to the existing template configuration.
