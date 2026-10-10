# Final Svelte review · 8 October 2026

This is a historical review of the 8 October checkpoint. Current desktop ownership is defined by [the typography contract](docs/DESKTOP-TYPOGRAPHY-SYSTEM-2026-10-09.md) and [the geometry contract](docs/DESKTOP-GEOMETRY-SYSTEM-2026-10-09.md); fresh desktop results are recorded in [the final verification report](docs/DESKTOP-FINAL-VERIFICATION-2026-10-09.md). The results below describe this earlier checkpoint.

The maintained frontend is native Svelte 5 / SvelteKit 3. This review corrected interaction and accessibility defects and simplified maintained code while preserving all 39 variants and the approved design. Work is local to the Cars master; it has not been committed, mirrored or deployed.

## Corrections and cleanup

- Isolated repeated FAQ groups and gave controls stable, instance-specific IDs. Settings labels now toggle their own checkbox. Search dropdown associations no longer repeat the same ID.
- Separated the loan calculator and review form: collapsing either no longer collapses the other. Corrected their duplicated panel IDs across the detail layouts.
- Removed stale captured Swiper control references; the live library supplies matching IDs during initialization. Added checks for label and ARIA references before and after hydration.
- Replaced the demo account's global custom-event bridge with typed per-layout context. Storage remains optional and browser previews remain isolated.
- Used Svelte window scroll binding and SvelteKit navigation hooks for navigation cleanup. Removed an unnecessary route key block.
- Registered widget disposal immediately after allocation, including before later event registration. Preserved asynchronous unmount and repeated-navigation checks.
- Consolidated the one byte-identical vehicle-card pair into `VehicleGridCard.svelte`. Gave sign-in and error sections descriptive names. All remaining maintained components are referenced by imports or the validated route registry.
- Removed four unused migration-era helpers for DOM accordion toggles, tab selection/keyboard handling and image opening. Their maintained replacements already live in compiled Svelte components.
- Made error pages display their actual status; failed lazy page imports show 500 instead of a misleading 404. The designed 404 view remains unchanged.

## Fresh local verification

Node 26.10.0, a clean `npm ci`, and the production Node preview at `127.0.0.1:6466` were used.

| Check                                                 | Result                                                                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Strict Svelte/TypeScript                              | 0 errors, 0 warnings                                                                                     |
| Formatting, production build, scoped whitespace check | Passed                                                                                                   |
| Unit tests                                            | 15 passed, including all 607 original preservation hashes                                                |
| SSR compositions and aliases                          | 102 passed, plus 9 genuine HTTP 404 responses                                                            |
| All-variant link and control audit                    | 39 variants; 2,898 resolving internal links; no duplicate IDs or missing label/ARIA targets              |
| Browser journeys                                      | 16 passed, including independent accordions/forms, settings labels and simulated page-import failure     |
| Native widgets                                        | Passed at 320, 390 and 1440px, including navigation disposal and absence of legacy widget requests       |
| Hydrated page smoke checks                            | 30 passed; no page/widget errors or missing control targets                                              |
| Responsive visual comparisons                         | 120 passed: 39 variants at three widths plus three drawer views; 18 post-cleanup comparisons also passed |
| Dependency audit                                      | 0 reported vulnerabilities from `npm ci`                                                                 |
| Maintained source inventory                           | 196 files, 181 Svelte components; no byte-identical files or unreferenced components                     |
| Cars workflow documentation checker                   | Passed                                                                                                   |

The visual reference is the approved Cars checkpoint `4dda98868c448f1735e595628624f5e4178dce86`, verified against all six hashes in `provenance/reviewed-source.json`. The fixed comparison threshold and declared reference adjustments are unchanged. Static artwork, CSS, original library, frozen evidence and provenance assertions were not edited. Earlier interrupted comparisons are excluded from final results.

All 117 full-document page comparisons and three drawer comparisons have zero pixels above the fixed 0.1 threshold. Of the page comparisons, 98 also match raw pixels exactly; this result does not claim universal raw-pixel equality. Matched mobile and desktop captures were inspected directly.

After removing the four unused helpers, all 113 client JS/CSS files and 90 compiled application server modules remained byte-identical. Three generated framework/adapter files changed with build metadata; SvelteKit defaults its build version to the current timestamp. The rebuilt server passed the full QA suite and 18 additional rendered comparisons covering Home, the four distinct review-form layouts and the drawer at all three widths. Both visual receipts and `final-build-comparison.json` are retained in `.runtime/evidence/`.

Browser/HTTP receipts are in ignored `.runtime/evidence/`; check/build/unit logs and the source inventory are in `.runtime/final-review-20261008/`. Large rendered comparisons, selected matched screenshots and the read-only QA reference are archived under the task's C: evidence directory to avoid exhausting L:. The temporary reference server has been stopped; the canonical preview remains at 6466.

## Review boundary

This validates the maintained frontend and its demonstration behavior. Dealer-specific sample-content replacement, sales/import adaptation, authentication, persisted enquiries, live inventory, payment services, complete localization and mounted dealer publishing remain separate integrations described in `REUSE.md`. No template lock, dealer manifest, hosting choice or unrelated Cars change was modified.

Original artwork and frozen migration evidence remain intentional preservation material. They are not application dependencies or supported regeneration tools. This review does not assert a hosted deployment, GitHub Actions result, owner visual acceptance or universal defect-free behavior.
