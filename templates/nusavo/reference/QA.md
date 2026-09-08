# Nusavo verification — 2026-09-06

## Source checks

- Production build: passed (`build-final.log`).
- Svelte check: 0 errors, 0 warnings (`check-final.log`).
- Svelte autofixer: all 39 Svelte components reviewed. The author archive was retried separately after an `npx.ps1` invocation failure (`autofixer-babyhepi.log`). No issues reported. App effect suggestions were reviewed: the effect synchronizes navigation DOM accessibility attributes and does not assign reactive state.
- Dependency audit after final install: 0 vulnerabilities.
- UI scanner findings are original template placeholder copy and stylistic choices. They are deliberately retained for the requested visual clone, rather than rewritten.

## Rendered routes

All 36 pages checked at **1440 × 1000** and **390 × 1000**, for **72 route/viewport checks**. Final results have:

- No horizontal overflow.
- No broken images.
- No JavaScript page errors.
- No failed HTTP responses observed.

See `qa/results.json` and the matching screenshots. One late browser resource-exhaustion event during the long batch affected the Driving Guide checks; both widths were repeated in a fresh browser and passed. Final results include those confirmed reruns.

## Reference comparison

The homepage was captured from the author demo and local application at identical viewports, with fonts loaded and carousels paused on the first slide. Pixelmatch at threshold 0.1 measured:

| Viewport | Differing pixels |
| --- | ---: |
| 1440 × 1000 | 0.152% |
| 390 × 1000 | 0.944% |

The diff images primarily show text rasterization and small rendering differences. These measurements cover the **homepage first viewport**, not every pixel of every page. The other pages have full-page responsive screenshots and representative visual comparisons, rather than a numerical parity claim.

Files: `qa/visual-comparison.json`, `qa/compare-reference-*.png`, `qa/compare-local-*.png`, and `qa/compare-diff-*.png`.

## Interactions

18 checks passed in `qa/flows.json`: mobile menu and keyboard operation, carousel initialization and visible logos, electric/all category filtering, FAQ open/close, image viewer open/Escape, correct car selection, quantity totals, persistence, removal, empty-field checkout validation, local purchase summary, contact feedback, and absence of JavaScript errors throughout the walkthrough.

## Deliberate scope

This is a local visual clone. Booking, payments, authentication, password reset, and message delivery have no backend integration. Contact/account/newsletter forms display honest local feedback. The purchase-summary body is a local preview summary because the public source widget was empty without a completed order. Google Maps and YouTube remain external reference embeds. The original broad stylesheet structure and demo content are preserved for the user's planned later refactor.
