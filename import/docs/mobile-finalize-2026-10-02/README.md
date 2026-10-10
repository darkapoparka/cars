# Import mobile finalization — 2 October 2026

The remaining customer listing editor now follows the existing mobile account pattern. The PDP renders its correct mobile composition before JavaScript loads. The settled public design is preserved.

## Changes

- Customer listing creation/editing has readable native fields, optional expandable photos/documents, and compact pinned draft/submit actions. It uses the retained account shell and design tokens. The desktop compatibility form remains available.
- Draft creation redirects to its saved record. Saving, editing, reloading and submitting preserve the actual fields and media. Invalid uploads preserve entered text and do not create an orphan draft. Successful saves clear file selections so the next submission does not append the same upload again.
- Local demo uploads added after compilation are delivered through the filesystem owner's resource route. Resource paths and media families are validated; live mode disables delivery. These are preview capabilities, not production document storage or notification delivery.
- The PDP server renders the two responsive compositions, CSS selects the appropriate one, and hydration keeps the active composition. The mobile drawer starts at its existing resting position before its gesture library measures the viewport.
- The closed locale dialog defers its country list until opened. Inventory prioritizes its fourth initially visible vehicle photo. A font-preload trial was removed after measurements did not demonstrate a reliable benefit; the existing font loading remains in place.

## Matching screenshots

Original JPEG captures are retained without image editing. Editor pairs use the user's In-app Browser at the same viewport and top scroll position. PDP first-paint pairs use the frozen production preview with JavaScript disabled, at 390×844. They show the rendering correction, not a redesign of the settled PDP.

| View                           | Before                                   | After                                  |
| ------------------------------ | ---------------------------------------- | -------------------------------------- |
| Editor, 320×568                | [Before](before/editor-320.jpg)          | [After](after/editor-320.jpg)          |
| Editor, 390×844                | [Before](before/editor-390.jpg)          | [After](after/editor-390.jpg)          |
| PDP before JavaScript, 390×844 | [Before](before/pdp-first-paint-390.jpg) | [After](after/pdp-first-paint-390.jpg) |

Additional captures show the [expanded photo section](after/editor-photos-320.jpg) and [PDP enquiry sheet](after/pdp-inquiry-390.jpg). The enquiry sheet was scrolled, and browser Back closed it and restored the enquiry button's focus.

## Verification

Production checks used the complete frozen source copy and the pinned Node 24.21.0 runtime on port 6795. The user's development server on 6790 was preserved. Saving/uploading tests used isolated synthetic data directories and no external provider credentials.

| Check                                                           | Result                                                                                                            |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Full existing Chromium mobile suite                             | 193 passed, 51 desktop-only cases skipped                                                                         |
| New editor/rendering/resource suite, Chromium                   | 12 passed across both projects; 8 mobile-only cases skipped on desktop                                            |
| Final affected-route Chromium recheck                           | 56 passed: public reflow/accessibility, secondary pages, comparison, services, account/editor and locale controls |
| WebKit editor, gallery, contact sheet, menu and locale controls | 18 passed                                                                                                         |
| Desktop controls/patterns                                       | 21 passed; final PDP/forms/hierarchy recheck: 7 passed                                                            |
| JavaScript-disabled PDP screenshot capture                      | Passed                                                                                                            |
| Svelte diagnostics                                              | 0 errors, 0 warnings                                                                                              |
| Production build and application ESLint                         | Passed                                                                                                            |
| Architecture and image-signature checks                         | Passed                                                                                                            |
| Unit tests                                                      | 18 files, 124 tests passed                                                                                        |

The full `npm run verify` command stops at 46 existing formatting failures in unrelated files. Its gate was not changed or bypassed. Application lint, architecture, assets and unit checks were run separately; task-owned formatting is checked separately. The full command is therefore **not reported as passing**.

Coverage includes 320/390px, Bulgarian/English, 200% root text sizing, short 360px editor viewports, validation, actual media delivery, no-JavaScript draft creation, and focus/Back behavior. Short viewport emulation does not certify a physical phone's software keyboard. Automated axe scans are not a full manual accessibility certification.

The broad run was followed by a fresh snapshot containing the existing desktop work in this shared checkout. The final affected-route, WebKit and desktop PDP checks use that snapshot. Font preloads were subsequently removed; the production build, ten new mobile tests and first-paint capture passed again. [Source evidence](source-evidence.json) identifies the snapshot and task-owned file hashes. Other tasks' changes are preserved and are excluded from this mobile commit. A concurrent desktop breadcrumb removal in the shared PDP component remains separate; this commit stages the verified mobile rendering changes without that removal.

## Loading measurements

Three cold Chromium contexts per route, 390×844, cache disabled, 4× CPU slowdown, 150ms latency, 200,000 download bytes/second (1.6Mbps), and 93,750 upload bytes/second. The language prompt is already acknowledged. Observation ends five seconds after hydration and font readiness, without scrolling or input. Third-party map/image requests are included. Functional tests and application lint do not run concurrently with the final timing pass.

[Loading results](loading-results.json) retain each sample, medians and the profile. These are local lab observations, not field Core Web Vitals, Lighthouse scores or physical-device timing. The baseline's PDP LCP describes the wrong desktop fallback; comparing that value directly with the corrected mobile screen would be misleading. PDP composition presence is reported separately from JavaScript hydration and does not mean its controls are already interactive.

| Route            | Before LCP | Final LCP | Final CLS |
| ---------------- | ---------: | --------: | --------: |
| Home             |      1.95s |     2.46s |   0.00000 |
| Inventory        |      3.60s |     3.23s |   0.02358 |
| Services         |      2.60s |     2.87s |   0.00035 |
| Contact          |      3.14s |     3.14s |   0.00029 |
| PDP              |    0.88s\* |     1.05s |   0.01547 |
| Account listings |      1.51s |     1.74s |   0.00050 |

\*The old PDP value measures its incorrect fallback. The final value measures the native vehicle photo. The mobile composition is now present in the server response; interactive controls still wait for hydration.

These results do not establish a general speedup. Cold inventory, Services and Contact still exceed 2.5s LCP in this profile. Home also has variable hydration timing. Baseline and final snapshots contain other tasks' desktop edits, and system load is not controlled; differences on unchanged mobile routes are not assigned to this task. The font-preload trial and all three samples are retained in the results file. No further font changes were kept on the strength of these timings.

This is local template implementation and browser verification. It does not promote an immutable template release, deploy dealer copies, or certify production form/upload integrations.
