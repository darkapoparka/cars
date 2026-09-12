> Visual replacements from this pass were rejected. See [VISUAL-RESTORATION.md](VISUAL-RESTORATION.md) for the recovered homepage and [CONTACT-ARTWORK-RESTORATION.md](CONTACT-ARTWORK-RESTORATION.md) for the restored Sell/Import controls, generated scene artwork, dark help sheets and real map. Earlier screenshots and the isolated build do not describe the restored state.

# Mobile implementation — 12 September 2026

Working template: `J:\cars\templates\auto-best`. Main development URL: `http://127.0.0.1:6461`.

This is the implementation record for [the original mobile plan](../../audits/2026-09-12-mobile-finalization/MOBILE-FINALIZATION-PLAN.md), not a replacement audit. Existing uncommitted work was preserved. No commit, push, deployment, business verification, or lead backend was performed.

## Delivered work

| Plan | Implementation |
| --- | --- |
| M01 — Asset gate | Removed the fixed asset-total expectation; checks ownership, source references, retained provenance, file signatures, and empty files. Scratch generation output is outside served assets. |
| M02 — Warnings and tests | Svelte warnings are build failures; unused body-card selectors are removed. Expansion tests follow configured visible/total counts. |
| M03 — Overlays | Shared reversible scroll lock and keyboard containment for menu, filters, nested choices, enquiries, and financing. Mobile filter opening focuses its heading rather than forcing the keyboard. |
| M04 — Validation | Trimmed required make/model; per-field errors; bounded years; shared photo type/size/count policy; retained drafts and object-URL cleanup. |
| M05 — Budgets | One interval definition generates labels, counts and destination URLs, including exclusive lower limits. Boundary regressions are covered. |
| M06 — Artwork | Body/brand previews use one responsive image representation and a shared accessible expansion control. Narrow cards no longer depend on fixed-width baked card geometry. |
| M07 — Readability | Listing, PDP and calculator secondary text use accessible contrast values; tested modal states must actually be open before accessibility checks. |
| M08 — Media | Responsive WebP exports and width selection; below-fold loading; no initial multi-megabyte service PNG originals; reproducible image manifest/export script. |
| M09 — Code ownership | Canonical service, brand/social/location, discovery, filter, finance and enquiry policies. Homepage and inventory now share the existing filter dialog; the duplicated 770-line quick-search implementation became a small trigger. |
| M10 — PDP | Compact financing/seller panels, calculator sheet, consistent sticky actions, segmented information tabs, one location section, and responsive imagery. Finance selection makes a validated round trip through contact back to the calculator. |
| M11 — Sell/Import | Matched entry controls and call placement; dark enquiry fields/panel/footer; no-link import path; explicit unsent/copy/share behavior. |
| M12 — Other mobile pages | Matching type/brand expansion; compact footer; repeated lower service navigation removed on mobile; responsive editorial media and deliberate click-to-load maps. |
| M13 — Regression | Chromium and WebKit automated route/state, focus, image-failure, short-viewport, cancellation, and image-budget coverage. Enlarged dock labels grow without fixed-height clipping. Physical-device and assistive-technology sign-off remains manual. |
| M14 — Readiness | Dependency audit is clean after a compatible cookie override. Isolated production build and framework-owned nonce/hash CSP tested locally; preview noindex safeguards remain. Public deployment and business approval remain outside this change. |

## Evidence

See [QA results](QA-RESULTS.md) for final run timestamps, exact commands, results and limitations; [change details](CHANGES.md) for source ownership and behavior. Browser evidence is under `artifacts/mobile-changes-chromium`, `artifacts/mobile-quality-{chromium,webkit}`, and `artifacts/mobile-resilience-{chromium,webkit}` at the template root.

Selected before/after and current-state screenshots are copied into `screenshots/`. Full-page captures place fixed navigation at the captured viewport position; use the viewport captures to assess sticky controls.
