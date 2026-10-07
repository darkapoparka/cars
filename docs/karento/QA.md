# Karento capture and QA — 6 October 2026

Canonical source: `L:/CODEX/cars/templates/karento`. Local production preview: `http://127.0.0.1:6462/` (homepage 2).

The source is an HTML-reference capture using Svelte 5.57.2 / SvelteKit 3.0.1. It retains the author's HTML, CSS, assets and classic JavaScript, with separately editable page bodies. It is not a conversion of every plugin into native Svelte components. The captured HTML edition and the requested Next.js edition differ in some copy and behavior.

## Verification

- `npm run check`: 0 errors, 0 warnings.
- `npm run build`: passed with the Node production adapter.
- `npm run qa`: all 39 pages checked at both `.html` and extensionless routes, plus the default home and unknown-route handling. Downloaded assets and local fonts respond successfully.
- Every available page was browser-compared with the live HTML reference at 1440, 390 and 320 px: 117 matched screenshot pairs. These are first-viewport captures, not full-page pixel-diff assertions. Page geometry and broken images were also inspected.
- `visual-comparison.json`: 116 of 117 pairs differ by less than 1% of pixels with pixelmatch threshold 0.15. The largest difference is approximately 1.7% on the 1440 px agent dashboard. JPEG capture, chart/count animation and small text/baseline differences remain; strict pixel identity is not certified.
- `interactions.json`: mobile menu open/close, location dropdown, FAQ expansion, shop quantity increment/decrement, hero slide control and real home-to-inventory navigation passed. Navigation loads one fresh copy of the vendor initialization script.
- Production browser checks after the repairs recorded no new local JavaScript exceptions. The source earning dashboard still reports its missing-chart exception; the local copy guards that absent target. An earlier development hot reload produced a duplicate-script exception, which was absent from the production navigation checks.

## Source gaps and repairs

The linked `privacy.html` and `destination.html` are HTTP 404 upstream. They cannot be claimed as recovered pages. Four homepage-3 testimonial images are also HTTP 404 upstream. Shared CSS references other missing assets for unused sections; all failures are retained in `templates/karento/provenance/capture.json`.

Normalized the redundant slash in five detail-layout-2 gallery paths, verified the gallery loads and has matching page height. Guarded an absent `#chart-3` target without changing intended chart visuals. Localized the original Urbanist font family, including modern variable WOFF2 files. The main homepage and agent dashboard were rechecked after the font update.

Forms, bookings, sign-in and dashboards are the vendor's demonstrations. No dealership backend, payment processing, or messaging integration has been added or tested. No real submissions were made.

This remains an additional local template draft. It has not been selected in `templates.lock.json`, added to the approved five-family publisher, committed, pushed or deployed to dealers.

## Matched evidence

| Width | Reference | Local clone |
| --- | --- | --- |
| 1440 | [Reference](reference-1440.jpg) | [Clone](clone-1440.jpg) |
| 390 | [Reference](reference-390.jpg) | [Clone](clone-390.jpg) |
| 320 | [Reference](reference-320.jpg) | [Clone](clone-320.jpg) |

HTTP results: `http-qa.json`. Screenshot comparison results: `visual-comparison.json`. Control results: `interactions.json`. Additional temporary screenshot pairs are in ignored `runtime/karento-qa/` while review remains open.
