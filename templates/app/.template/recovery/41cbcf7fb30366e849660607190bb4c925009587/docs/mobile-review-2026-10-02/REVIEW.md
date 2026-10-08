# App mobile changes for visual review — 2 October 2026

The preview is working again at [Home](http://127.0.0.1:6483/bg) and [Cars](http://127.0.0.1:6483/bg/cars). This is a restrained mobile spacing pass, with the functional Back, search and enlarged-text defects corrected. Owner visual acceptance is pending.

## Why the server failed

The existing Node process was still listening on 6483, but requests returned HTTP 500. L: had no free space, and Next's development log recorded `ENOSPC: no space left on device, write`.

The inactive App development cache was moved to C: with all 108 files preserved and checked by SHA-256. Its original cache path is a junction, and the preview continues to use the default `.next` output and Node 22.20.0 on the same port. Other projects and the original Cars24 checkout were preserved. Recovery files remain available in the task's temporary folder.

## What changed after reviewing the proposals

- **Keep the illustrated service tabs.** Replacing them with text-only tabs would remove useful reference character. Their mobile tiles are slightly shorter, and labels and artwork now use normal layout so enlarged text can grow.
- **Keep the full promotional copy and CTA.** The dealer panel, promotion padding and surrounding gaps were tightened. The required banner → search → makes → promotion → inventory sequence remains.
- **Treat the first car's position as a composition choice.** Home saves about 51–53px; the first car still starts below the initial dock at 320×740. This pass exposes the inventory heading more clearly while preserving the illustrated navigation and promotion.
- **Coordinate the Cars control stack.** Only inventory gets the 56px mobile title row. Pills have 40px visible surfaces inside 44px targets, 12px horizontal padding and 8px gaps. The sticky offset follows the shorter header.
- **Reuse the sourced Home emblem renderer in Search.** Sell and Services keep their existing compact selectors; forcing Home's 72px circles into those layouts would need a separate composition review. No emblem assets were replaced or generated.

## Matched screenshots

These are actual browser captures at matching viewport sizes, with no raster edits. The pre-change captures were saved before implementation. Committed App source did not change between the earlier audit baseline and this implementation's start. Enlarged-text baseline images were copied unchanged from that audit.

### Home — 390×844

| Before | After |
| --- | --- |
| ![Home before at 390px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-home-390.png) | ![Home after at 390px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-home-390.png) |

### Cars — 390×844

| Before | After |
| --- | --- |
| ![Cars before at 390px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-cars-390.png) | ![Cars after at 390px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-cars-390.png) |

### Home — 320×740

| Before | After |
| --- | --- |
| ![Home before at 320px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-home-320.png) | ![Home after at 320px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-home-320.png) |

### Cars — 320×740

| Before | After |
| --- | --- |
| ![Cars before at 320px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-cars-320.png) | ![Cars after at 320px](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-cars-320.png) |

## Measured spacing

Measurements use visible borders at normal text; touch targets are reported separately. Safe-area insets in these desktop-browser captures are zero.

| Relationship | Before | After |
| --- | --- | --- |
| Cars Back surface → search | 20px | 14px |
| Cars search → visible pills | 10px | 12px |
| Cars visible pills → first car | 20px | 16px |
| Cars visible pill / target | 36 / 44px | 40 / 44px |
| Cars first card top | 182px | 172px |
| Cars scrolled header + toolbar | 124px | 116px |
| Home first card top, 320px | 738.66px | 686px |
| Home first card top, 390px | 738.66px | 687.30px |
| Home space after final browse link | About 250px | About 96px |
| Cars space after inventory notice | 270px | 96px |

The shell reserves dock space once; pages now add 16px ordinary bottom padding. Wider Home and Cars composition is retained. At 1440px Home still has the existing four-promotion grid, so its inventory begins farther down the page; that is a separate wider-layout decision.

## Functional corrections and evidence

| Check | Verified result | Evidence |
| --- | --- | --- |
| Detail Back | Toyota list stays at 9 cars, ascending price sort, the same URL and 500px scroll position. This also survives reloading the detail page. | [Before](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/back-before.json), [detail reload](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/back-detail.json), [after](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/back-after.json) |
| Direct-entry Back | A directly opened detail returns to the full 48-car list. | [Result](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/direct-entry-back.json) |
| Stocked suggestions | Toyota suggestions come from actual stock, with case duplicates removed. RAV4 and Prado are absent; choosing Yaris returns its one listing. Free-text search remains available. | [Suggestions](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/toyota-suggestions.json), [Yaris result](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/stocked-search-result.json) |
| Car facts | 12px mobile text, one horizontal row beside the photograph. ArrowRight scrolls 40px; at the end only the left overflow cue remains. Full text is preserved. | [Keyboard](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/facts-keyboard-320.json), [end](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/facts-end-320.json) |
| Enlarged detail tabs | Labels grow without overlapping. End selects Interior and scrolls it fully into view; document width remains 320px. | [Keyboard result](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/detail-text200-keyboard-320.json), [selected Interior](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-detail-text200-interior-320.png) |
| Filter and sort | Both fit 320×480, dismiss with Escape and restore focus to their respective triggers. | [Filter](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-filters-320-480.png), [sort](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-sort-320-480.png), [filter focus](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/filters-dismissed-320-480.json), [sort focus](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/sort-dismissed-320-480.json) |
| Price and gallery | Detail and its price sheet show €94,099, with the amount unchanged. Gallery opens with a loaded image and dismisses. ISO codes remain where useful in payment calculations. | [Detail](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-detail-390.png), [price sheet](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/price-sheet-390.json), [gallery](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/gallery-390.json) |

## Enlarged-text comparisons

This is a **200% font and pixel line-height stress simulation** at 320px, with images and viewport unchanged. It is browser stress evidence, not a physical-device or WCAG certification. The discovery-header spacer follows the measured expanded header, preventing it from covering the dealer panel.

| Home before | Home after |
| --- | --- |
| ![Home with doubled text before](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-home-text200-320.png) | ![Home with doubled text after](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-home-text200-320.png) |

| Detail before | Detail after |
| --- | --- |
| ![Detail with doubled text before](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/before-detail-text200-320.png) | ![Detail with doubled text after](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-detail-text200-320.png) |

## Validation and source boundaries

- The final **`npm run check` passed** under Node 22.20.0 after the keyboard-scroll correction: ESLint, TypeScript and the production build, including 407 generated pages. The check used separate build output on C: to keep the running preview's output intact. [Result](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/check-result.json), [log](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/check.log).
- [20 rendered page/width combinations](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/responsive-checks.json) passed: Home, Cars, Search, detail, Sell, Finance and Services at 320/390px; Home, Cars and detail at 768/1440px. No document horizontal overflow, broken loaded HTML images or application errors occurred in that fresh browser session. Deferred images and all possible gallery states are outside that claim.
- Desktop [Home](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-home-desktop.png) and [Cars](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/after-cars-desktop.png) were visually inspected. Desktop cards retain wishlist controls and two fact rows.
- Earlier development/HMR attempts produced a transient manifest parse error. The final settled browser session has [no application errors](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/settled-errors.json).
- Build-generated `next-env.d.ts` and `tsconfig.json` are restored to their captured original bytes, preserving the pre-existing App change. [Hash evidence](L:/CODEX/cars/templates/app/docs/mobile-review-2026-10-02/generated-files-restored.json).
- The original `L:/cars-app` → `L:/inspiration/cars24` checkout remains clean. Native [Home](L:/CODEX/cars/templates/app/reference/cars24/02-home-top.png) and [Cars](L:/CODEX/cars/templates/app/reference/cars24/15-buy-results-top.png), original source and retained web captures informed the review; no live native app or physical phone test is claimed.
- This changes the App candidate only. Dealer refresh, release selection and deployment remain separate work. No enquiry, booking or payment was submitted.
