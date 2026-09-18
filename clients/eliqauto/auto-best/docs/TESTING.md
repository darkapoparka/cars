# Testing reference

Tests cover different layers: source/type checks, domain logic, runtime media, build output and real browser behavior. This document explains the available commands; it is not a claim that every suite currently passes.

## Package commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server |
| `npm run build` | SvelteKit/Vite production build |
| `npm run preview` | Serve built output locally |
| `npm run check` | SvelteKit synchronization and Svelte/TypeScript diagnostics |
| <code>npm run check:architecture</code> | Native source architecture checks |
| <code>npm run check:css-policy</code> | Reject fragile selectors, invalid standalone-CSS <code>:global(...)</code>, and dealer artwork/palette leakage |
| `npm run check:tokens` | Validate token aliases, reference cycles, source usage and shared control-height overrides |
| `npm run check:typography` | Reject local typography values outside the shared token owner |
| `npm run smoke:typography` | Current Sell/Import flows, entry tabs, action hierarchy and clipped controls at 320/390/768/1440px |
| `npm run smoke:phase4` | Phase 4 discovery-draft, shell/navigation, focus, return-state and breakpoint contracts |
| `npm run check:assets` | Static media and source-reference checks |
| `npm run validate` | Architecture, CSS policy, tokens, typography, assets and domain checks followed by Svelte/type check and build |
| `npm run quality` | Combined validation and browser suite chain |
| `npm run smoke` | Route/journey, enquiry and discovery browser suites |
| `npm run check:domain` | Inventory, filter and journey/domain assertions |

The exact command definitions are in [package.json](../package.json). `quality` composes existing scripts rather than starting the application server itself.

## Typical development checks

```sh
npm run check:css-policy
npm run check:tokens
npm run check
npm run check:domain
npm run check:assets
npm run build
```

`validate` combines the static/domain/build stages defined in the package. Architecture checks examine native application boundaries; CSS policy checks enforce semantic selectors and centralized dealer theme ownership; token checks verify the shared reference graph and component aliases; asset checks compare public media with references; domain checks exercise actual TypeScript domain functions rather than separately reimplementing them.

The standalone `check` script currently uses `--threshold error`; warnings are not automatically equivalent to a failed warning-free check. To inspect stricter diagnostics explicitly, run `npx svelte-check --tsconfig ./tsconfig.json --fail-on-warnings` after synchronization. Its `quality` chain is validation followed by smoke.

## Browser setup

Start the intended server in one terminal. In another, set `BASE_URL` and run the suite:

```powershell
$env:BASE_URL = "http://127.0.0.1:6461"
npm run smoke
```

Or in a POSIX shell:

```sh
BASE_URL=http://127.0.0.1:6461 npm run smoke
```

For the built preview, use that preview URL instead. `scripts/browser.mjs` controls the browser channel/executable and target URL. [Development](DEVELOPMENT.md) describes the environment options.

## Browser suite responsibilities

| Script | Main behavior |
| --- | --- |
| `scripts/sveltekit-smoke.mjs` | Entry point for native route and journey coverage |
| `scripts/route-smoke.mjs` | Routes/status codes, images, page errors, overflow and responsive layout |
| `scripts/journey-smoke.mjs` | Listing/article returns, vehicle contact context, discovery and menu interaction |
| `scripts/enquiry-smoke.mjs` | Enquiry entry, steps, review, local photos and sharing/copy behavior |
| `scripts/mobile-filter-smoke.mjs` | Mobile filter draft, nested choices, application and empty results |
| `scripts/desktop-discovery-smoke.mjs` | Desktop discovery and sticky-control behavior |
| `scripts/phase4-smoke.mjs` | URL/filter preservation, nested and outer draft ownership, pending desktop values, shell transitions, menu focus, duplicate IDs and 767/768/991/992 boundaries |
| `scripts/typography-smoke.mjs` | Entry/segment/CTA hierarchy, keyboard tab switching, link/VIN/description editor save and discard, stable card height, sell/import validation and review, reference edits and clearing, manual fallback, copied text, Escape/focus return, control reflow and screenshots |

Additional mobile/accessibility/resilience and visual-comparison tools exist in the newer local working source but are not package scripts in this standalone baseline. Do not assume a fresh clone includes them.

## Phase 4 regression contract

`npm run smoke` now includes `npm run smoke:phase4`. The focused suite uses the same `BASE_URL`, browser helper and artifact reporting conventions as the existing route, journey, enquiry, mobile-filter and desktop-discovery suites.

It verifies sort and chip changes without dropping unrelated URL state; nested picker Apply/Cancel versus outer dialog Apply/Cancel; deterministic make/model reset; Home desktop pending values; filtered inventory → detail → anchored return; direct and client-side route presentation; contact-topic and menu active state; detail mobile actions; footer/mobile-dock/detail-bar transitions; focus restoration; desktop mega-menu keyboard ownership; duplicate IDs; horizontal overflow; and explicit 320, 390, 430, 767/768, 844-landscape, 991/992, 1024, 1440 and 1920 boundaries.

The domain suite exercises parser/serializer round trips for every public listing key, draft conversion, equipment-array isolation, malformed/zero/whitespace/safe-integer numbers, make/model reset and preservation, facet URL preservation, chip labels, sort behavior and safe return context using the real TypeScript modules.

Phase 4 visual qualification compares production previews of the exact parent and implementation commits with fonts loaded, reduced motion and stable scroll position. Its committed result is documented in [the architecture execution ledger](ARCHITECTURE-REFACTOR-PLAN.md#phase-4-implementation-record--15-september-2026); generated screenshots and JSON reports remain under ignored `artifacts/`.

Reports/screenshots generated by the active scripts are written under `artifacts/`. Inspect the named failure and the corresponding source. An old report is not the result of the current run; a screenshot alone does not establish that a form, redirect or keyboard flow works.

## Practical browser scenarios

Use 390px and 1440px as the primary mobile/desktop pair. Add 320px and 430px for narrow mobile behavior, 768px/991px/992px for layout transitions, and a wide viewport for hero artwork. Use the same viewport, browser, loaded fonts and scroll position for visual comparisons.

| Area | Exercise |
| --- | --- |
| Home | Search, Buy/Import mode, service links, body/brand expansion and video action |
| Inventory | Query, make/model dependency, range values, equipment, sorting and zero matches |
| Filter dialogs | Open nested choices, cancel, apply, close and return focus |
| Detail | Data/description/equipment tabs, contact actions, finance and return to filtered stock |
| Sell/import | Invalid and valid input, back/edit, review, photo removal, copy/share and cancellation |
| Editorial | Search/category, article opening, related links and filtered return |
| Shell | Mobile menu, desktop mega menu, keyboard navigation and footer/dock behavior |
| HTTP | Known pages, invalid IDs, redirects, robots and sitemap |

Check that content does not disappear behind fixed mobile actions, that a closed dialog releases page scrolling, and that each important link retains its intended destination. Missing-image and provider-failure scenarios are useful for client deployment, but a mocked provider test does not verify the provider itself.

## Updating tests with components

Prefer accessible roles/names for meaningful interactions and stable component selectors for layout-specific checks. When a component is renamed or split, update its tests to exercise the same behavior. Avoid treating a stale selector as proof that the application is broken, or removing the assertion merely because it fails.

The standalone source and current working preview have different enquiry/finance implementations; select the actual component for the tested revision. [Components](COMPONENTS.md) records that distinction.

## Documentation-only changes

Check relative file links, headings, code paths and npm script names against the checkout. Ensure examples describe implemented APIs and Markdown is UTF-8. Application screenshots and a production rebuild are unnecessary when the diff changes only documentation and no build inputs.

Current cross-repository ownership, approved releases, dealer-copy workflow and standalone/mounted limits: [Cars integration](CARS-INTEGRATION.md).
