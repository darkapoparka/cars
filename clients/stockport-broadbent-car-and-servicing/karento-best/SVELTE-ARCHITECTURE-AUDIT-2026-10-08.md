# Karento Best architecture audit · 8 October 2026

The maintained frontend has been refactored into typed Svelte 5 feature components while retaining all 39 variants, the 30 canonical routes and the selected Home 3 / List 2 / Details 3 composition. The original library, frozen Best evidence, stylesheets, artwork, typography and default palette remain preserved. This follows the interaction and lifecycle work recorded in [SVELTE-AUDIT-2026-10-08.md](SVELTE-AUDIT-2026-10-08.md).

## Maintained architecture

Pages compose named sections; sections select layout configuration and shared feature components. Repeated content lives in explicit typed data modules. Dealer personalization stays at `content.ts`, routing at `routes.ts`, navigation at `Header.svelte`, and visitor state at the typed per-layout `PreviewState` context. Account preview state is never a process-global singleton.

| Feature                 | Shared components | Replaced repetition                                                                     |
| ----------------------- | ----------------: | --------------------------------------------------------------------------------------- |
| Vehicle search          |                 4 | Categories, locations and date fields across four search layouts                        |
| Listings                |                14 | Six listing sections, filters, toolbar, pagination, brand strip and product/rental rows |
| Vehicle/product details |                23 | Four detail layouts, review form, seller/reservation/sidebar and related records        |
| FAQ                     |                 5 | Six sections with configurable groups and support cards                                 |
| Dashboards              |                38 | Eleven account layouts with shared shell, sidebar, tables, fields and preferences       |
| Page headers            |                 6 | Thirteen page headers and eleven account headings                                       |
| Finance                 |                 3 | Five calculator/promotion sections                                                      |
| Editorial               |                11 | News cards, sources, team, subscriber banner, article comments and sharing              |
| Contact and plans       |                 2 | Location cards and membership cards/features                                            |

Seven duplicated vehicle card files were removed; the distinct grid, editorial and featured designs use three maintained components with typed presentation options. Six duplicate dashboard wrappers were removed. All 123 hashed section filenames now have descriptive names, and dashboard names match the routes and content they compose. No maintained source file is unreachable or byte-identical to another.

`PageMetadata` owns dealer-aware document titles. Nine alternate variants had the generic Bootstrap template title; their replacements are explicitly declared in `provenance/reviewed-reference-adjustments.json`. The captured body, image and composition contracts are unchanged.

`DemoForm`, `DemoActionButton`, `DemoActionLink` and `DemoFeedback` compile truthful preview feedback without additional layout wrappers or an imperative HTML-output generator. Feedback is singular per action container and releases ownership on navigation. The remaining sign-in helper is named `demo-sign-in.ts`. Generic runtime HTML rendering, raw page injection, legacy Svelte directives, untyped escape hatches and global legacy script loading are absent.

## Validation

Node 26.10.0 and the pinned dependencies were used. The local production preview binds to loopback at `127.0.0.1:6466`. During comparisons, the frozen executable build was served at `127.0.0.1:19479` to capture the appearance before this architecture pass. Its temporary server was stopped after verification; the executable evidence build remains preserved. Native-to-native comparisons apply no reference styling adjustments or pixel masks; their threshold remains 0.1.

| Check                                             | Final result                                                                                                                                                                  |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict Svelte/TypeScript and unused-symbol checks | 0 errors, 0 warnings                                                                                                                                                          |
| Formatting and production build                   | Passed                                                                                                                                                                        |
| Unit contracts                                    | 17 passed; 607 original hashes and original static asset bytes preserved                                                                                                      |
| SSR route/alias compositions                      | 102 passed; nine invalid/prototype-name URLs return HTTP 404                                                                                                                  |
| Links, IDs and control associations               | All 39 variants; 2,898 resolving internal links                                                                                                                               |
| Interaction journeys                              | 21 passed                                                                                                                                                                     |
| Native widgets and disposal                       | Passed at 320, 390 and 1440px                                                                                                                                                 |
| Hydrated canonical-page smoke checks              | 30 passed                                                                                                                                                                     |
| Direct comparison with the frozen build           | All 39 variants retain visible text and image order; nine declared title changes                                                                                              |
| Svelte MCP analysis                               | 290 components/rune modules checked; zero issues                                                                                                                              |
| Source import graph                               | All 316 files reachable from eight app/type entry points; zero unused files or byte-identical duplicates                                                                      |
| Full rendered matrix                              | 120 comparisons passed: all 39 variants plus the drawer at 320, 390 and 1440px; zero differing pixels at the unchanged 0.1 threshold, equal page heights and section geometry |
| Matched before/after viewport captures            | 27 passed; 25 are raw-pixel identical, including the displayed desktop and mobile pairs                                                                                       |
| Cars workflow documentation checker               | Passed                                                                                                                                                                        |

Of the 117 full-document page comparisons, 113 are raw-pixel identical. All 120 comparisons pass without pixel masks or reference styling adjustments. The two non-identical viewport captures are the mobile calendar at 320 and 390px: respectively five and eight pixels differ by at most one channel value out of 255. Both have zero differences at the fixed comparison threshold. The displayed desktop Home and mobile vehicle screenshots are raw-pixel identical.

The 390px matrix resumed in a fresh browser after a readiness timeout following 36 passing comparisons. The remaining three dashboard routes and drawer passed against the same frozen baseline and final build, with unchanged timeouts and assertions. Both original receipts are retained and identified in the consolidated evidence. Current source hashes were checked again after the full matrix.

Rendered checks caught and resolved repeated brand keys during hydration, missing inline whitespace, duplicated review ratings, incorrect extracted prices, a missing settings action and booking name, missing inventory grid wrappers, a lost logo sizing class and a non-breaking space in a booking title. The original composition and literal whitespace were restored instead of relaxing assertions or changing CSS. The three affected dashboard routes pass focused comparisons at all three widths.

The analyzer's generic suggestions in 15 files were reviewed. Literal space/non-breaking-space interpolation preserves required composition; `bind:this` provides nodes for focus, dialogs, geometry and the feedback portal; the gallery's local Map computes stable keys in a pure derived calculation; and remaining effects synchronize external DOM/focus. No blanket suppression was added. These boundaries follow the official [keyed each](https://svelte.dev/docs/svelte/each), [attachment](https://svelte.dev/docs/svelte/@attach) and [context](https://svelte.dev/docs/svelte/context) documentation.

## Evidence and retained material

Source inventories, semantic contracts and browser receipts are recorded in ignored `.runtime/architecture-20261008/` and `.runtime/evidence/`. Bulk matched captures, the frozen executable build, current analyzer output, visual comparison receipts and recovery archives are in `C:/Users/radev/.codex/visualizations/2026/10/07/01a118aa-31c5-78d3-886d-c35e159a8035/svelte-architecture`.

The original `../karento`, `provenance/frozen-best` and migration history remain preservation evidence outside the runtime import graph. Unloaded original vendor assets and their licensing evidence remain byte-preserved. Source recovery preimages were retained. Automatic approval review blocked deletion of ten ignored temporary compiled SSR-check directories with “blocked by policy”; those generated caches remain outside maintained application source, with a verified recovery archive.

This is a local source cleanup and browser verification. Dealer generation, template-lock release, publishing-mirror synchronization, hosting, real account/payment services and deployment are separate work. The existing reuse limitations in [REUSE.md](REUSE.md) still apply.
