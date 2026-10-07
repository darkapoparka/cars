# Karento Best native Svelte promotion, 7–8 October 2026

The existing `templates/karento-best` master now contains the compiled Svelte application. Home 3, List 2 and Details 3 remain selected; all 39 variants and 30 website routes remain available. Captured source is preserved in Git checkpoints and immutable evidence. `templates/karento` was not rewritten. The standalone `darkapoparka/cars-template-karento` repository mirrors the maintained application.

Calendars, galleries and photo viewing are native Svelte components. Production code no longer injects complete HTML pages or loads jQuery, Slick, the old datepicker or global legacy main.js. Independent Swiper, scrollbar, chart and range libraries have lifecycle-owned adapters with tested cleanup. Content and preview state have typed boundaries.

The final Contact request is included: a shared white outer panel, an inner form card, a full-height map and the corrected displayed-address query. Source ownership moved before the final Contact edit, so that edit was made directly in Svelte.

Reviewed artwork URLs and bytes are preserved. Contact portraits and How it Works artwork now live under `templates/karento-best/static/assets/karento-best/contact-avatars` and `how-it-works`, respectively. The older artwork receipts record their captured-renderer source paths; those receipts remain historical provenance. The native build serves the same public URLs directly from its own static assets.

The template's `IMPLEMENTATION-REPORT.md` and `provenance/native-verification.json` record the finished checks and their scope. The preserved captured-renderer checkpoint is `4dda98868c448f1735e595628624f5e4178dce86`; `reviewed-reference-adjustments.json` records the subsequent owner-requested Contact change, wallet chart resize fix and stable 2D range-slider layer explicitly. The native application contains these changes; the reference receives the same declared adjustments during comparison. Hash-locked source, visible comparison regions and the fixed pixel threshold are preserved.

The full responsive run passed 117 page comparisons (39 variants at 320, 390 and 1440px) plus three drawer views, with zero pixels above the unchanged 0.1 threshold. Of the page comparisons, 99 also match every raw pixel; 18 have only below-threshold differences. Strict Svelte checks report zero errors and warnings, all 15 unit contracts pass, and the production build, 102 SSR comparisons, nine HTTP 404 checks, 14 browser journeys and 30 canonical smoke routes pass. All 607 original recorded files remain preserved.

The active native preview is [127.0.0.1:6466](http://127.0.0.1:6466/). The standalone mirror preview is [127.0.0.1:6477](http://127.0.0.1:6477/). Evidence lives in the template's ignored `.runtime` and Cars `runtime/karento-native-completion-20261007`.

This is source promotion, not dealer release. The approved template lock, manifests, 25 leads, provider bindings and hosting remain unchanged. Real authentication, purchases, enquiries, inventory and complete localization remain separate product integrations. Use the existing Cars release and publishing workflows for an authorized dealer rollout.

The portfolio integration suite passed 379 of 381 tests. Two Modern refresh fixtures fail with `Missing Modern financing logo anchor` in the existing refresh adapter. The native Karento work does not modify that adapter or those fixtures. The workflow documentation checker passes.
