# Svelte skills audit · 8 October 2026

The maintained Karento Best frontend has been audited with `svelte-code-writer` and `svelte-core-bestpractices`. This pass modernized DOM integration and corrected keyboard, gallery, calendar and viewer lifecycle defects while preserving the approved design and all 39 compiled variants. The earlier cleanup already present in the shared checkout was preserved and revalidated; [FINAL-REVIEW.md](FINAL-REVIEW.md) records that work.

## Changes from this pass

- Replaced maintained `use:` actions with typed Svelte attachments, including all four independent vendor libraries. Native quantity controls, dropdown navigation and drawer focus now share [attachments.svelte.ts](src/lib/attachments.svelte.ts). Cleanup remains registered immediately and asynchronous vendor work remains guarded against disposal.
- Used Svelte's `on` event API for attachment listeners. This fixes selection focus restoration when delegated child handlers close a dropdown. Arrow keys open the menu and wrap in either direction; disabled drawer controls are excluded from the focus trap.
- Replaced imperative category-class mutation with local typed rune state in all four search layouts. Selected categories expose `aria-pressed`; Space activates them. Dropdown accessible names follow their selected values. Explore and mobile controls prevent unwanted hash navigation and Space scrolling.
- Gave gallery items stable source/occurrence keys, including explicit neighbour-copy keys. Keyboard focus follows the visible photo. Mouse/touch gestures prevent native image dragging and suppress accidental viewer opening after a successful swipe.
- Made calendar selection derive from its bound value, so valid typed dates update the highlighted selection. Popup positioning/dismissal use declarative document/window events and a typed portal attachment; delayed focus and rapid closure check connectivity and open state.
- Validated viewer indexes, cancelled stale asynchronous opening requests and guarded native close events. A queued close from an earlier opening can no longer erase a reopened viewer. The deterministic regression closes and reopens in the same browser task, then checks the visible viewer and its exact image after two animation frames.
- Enabled `noUnusedLocals` and `noUnusedParameters`. Removed the obsolete DOM category helper and consolidated quantity/dropdown/drawer behavior at the typed attachment boundary. The complete maintained source has no duplicate files or unreferenced components.
- Expanded the browser suite to 20 journeys and added widget regressions for focus, real mouse/CDP touch gestures, typed dates, invalid indexes, rapid dismissal and queued close events. The Explore test awaits the preserved submenu animation before Tab; its focus assertion is retained. Visual tests accept a width subset so independent full-route runs can cover the same default matrix without changing any comparison threshold.

The attachment and event integrations follow the official [Svelte attachment documentation](https://svelte.dev/docs/svelte/@attach) and [event listener documentation](https://svelte.dev/docs/svelte/svelte-events). Visitor state still uses typed per-layout context; it is not a process-global account singleton.

## Verification of the final build

Node 26.10.0 and a clean `npm ci` were used. Browser evidence uses Playwright Chromium; mobile touch uses Chromium CDP. The final production Node preview binds only to `127.0.0.1:6466`.

| Check                                              | Result                                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Strict Svelte/TypeScript, including unused symbols | 0 errors, 0 warnings                                                                                                             |
| Formatting, production build, scoped whitespace    | Passed                                                                                                                           |
| Unit contracts                                     | 15 passed; all 607 preservation hashes and all original asset bytes match                                                        |
| HTTP compositions and aliases                      | 102 passed; nine invalid/prototype-name routes return real HTTP 404                                                              |
| All-variant links and control associations         | 39 variants; 2,898 resolving internal links; no duplicate IDs or missing targets                                                 |
| Browser journeys                                   | 20 passed; no page errors                                                                                                        |
| Native widgets                                     | Passed at 320, 390 and 1440px, including same-task viewer close/reopen                                                           |
| Hydrated page smoke checks                         | 30 passed; no page/widget errors or missing associations                                                                         |
| Svelte MCP analysis                                | All 183 components/rune modules checked; zero issues                                                                             |
| Responsive rendered comparisons                    | All 120 passed: 117 full-document pages and three drawers                                                                        |
| Maintained source inventory                        | 198 files, 181 components, two rune modules; all reachable from eight app/type entry points; no duplicates or unreferenced files |
| Preserved approved reference                       | All six recorded source/style/portrait hashes verified                                                                           |
| Cars workflow documentation checker                | Passed                                                                                                                           |
| Dependency audit during `npm ci`                   | Zero reported vulnerabilities                                                                                                    |

All 120 comparisons contain zero pixels above the fixed 0.1 threshold. Full-document page heights and section geometry match, with no native horizontal overflow, broken images, page errors or widget errors. 97 of the 117 page comparisons also match raw pixels exactly. Threshold equality is not universal raw-pixel equality.

The reference remains approved Cars checkpoint `4dda98868c448f1735e595628624f5e4178dce86`. Existing declared Contact, wallet-chart and range-layer reference adjustments are unchanged. CSS, artwork, typography, palette, immutable source and preservation assertions were not edited.

Matched before/after captures cover Home, Vehicles, Vehicle, Contact, Login, drawer, calendar, viewer and gallery keyboard state at all three widths. The gallery focus receipt changes from the hidden previous slide to the visible current slide while preserving its rendered pixels. Desktop and mobile comparison pairs were inspected directly.

The analyzer's generic suggestions in nine files were reviewed: explicit non-breaking-space interpolation preserves required inline spacing; `bind:this` supplies nodes needed for focus/dialog/geometry; the gallery's temporary Map only computes unique keys inside a pure derived calculation; and the remaining effects synchronize external DOM/focus without deriving reactive state. Blanket suppressions and untyped escape hatches were not introduced.

## Evidence and scope

The final visual receipt is [svelte-audit-visual.json](.runtime/evidence/svelte-audit-visual.json). Browser, native-widget and smoke receipts are in ignored `.runtime/evidence/`. Check/build/test/analyzer logs, source hashes and queued-close before/after probes are in ignored `.runtime/svelte-audit-20261008/`.

Large full-page comparisons, the final combined `visual-final.json`, matched captures and desktop/mobile before/after pairs are archived at `C:/Users/radev/.codex/visualizations/2026/10/07/01a118aa-31c5-78d3-886d-c35e159a8035/svelte-audit`. Intermediate and failed runs are preserved as diagnostic evidence and excluded from final passing results.

Original library files, old static vendor bytes and frozen migration evidence remain intentional preservation material. The maintained app loads no jQuery, Slick, legacy datepicker, global legacy script runner, generic HTML renderer or whole-page HTML injection. Preserving historical assets does not make them runtime dependencies or supported regeneration tools.

This is a local maintained-source audit. Changes remain reviewable in the shared Cars main checkout; no commit, publishing-mirror update, deployment, template-lock or dealer-manifest change was made. Sample inventory/account/financial content remains demonstration data, with integration and localization limits recorded in [REUSE.md](REUSE.md). The checks do not assert owner visual acceptance, hosted/CI qualification or universal defect-free behavior.
