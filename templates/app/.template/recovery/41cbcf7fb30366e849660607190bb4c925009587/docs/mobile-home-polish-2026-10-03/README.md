# Mobile Home and navigation polish - 3 October 2026

The local App preview at http://127.0.0.1:6483/bg now groups the configured dealer logo and location on one row, with search inside the dark panel. One compact car-list heading/link follows the panel; the repeated heading above the phone feed is removed. The make strip, promotional carousel and existing car-card composition are retained.

Buy keeps its car with a larger visible size. Sell, Leasing and Services use distinct original transparent key, calculator/key and wheel/wrench illustrations on phones. The initial header measures 102px and the scrolled header settles at 52px, with 44px tab targets. Wider screens retain the previous tab artwork, separate search and inventory-heading order. Empty English location copy is shortened to Visit us; the configured city/address and full accessible location label are retained. The first visible Home carousel image loads eagerly.

Leasing results no longer show the visible Import cars / Коли за внос heading or Demo / Демо badge. The country/search controls, real result count and cards remain. Import examples are still kept separate from dealer stock, and the enquiry draft still explains that the website sends nothing.

## Before and after

| View | Before | After |
| --- | --- | --- |
| Home, Bulgarian 390 x 844 | [Before](before/bg-home-390.jpg) | [After](after/bg-home-390.jpg) |
| Home, Bulgarian 320 x 844 | [Before](before/bg-home-320.jpg) | [After](after/bg-home-320.jpg) |
| Home, desktop 1440 x 1000 | [Before](before/bg-home-1440.jpg) | [After](after/bg-home-1440.jpg) |
| Leasing, Bulgarian 390 x 844 | [Before](before/bg-finance-390.jpg) | [After](after/bg-finance-390.jpg) |

Additional final views cover [tablet Home](after/bg-home-768.jpg), [English Home at 320px](after/en-home-320.jpg), the [scrolled mobile header](after/bg-home-320-scrolled.jpg), Sell and Services at 320px and 390px, and leasing at 320px. Screenshots come from the local in-app browser. Browser viewport widths include its scrollbar, so the content width is slightly smaller than the requested viewport.

## Verification

[Recorded results](results.json): 44 focused checks passed with zero browser console errors. Home, Sell, Leasing and Services have no page overflow at 320px and 390px. Home also passes at 768px and 1440px, with an English 320px check. All four mobile tab images load, the stock-search count stays beside regular 16px text, and the logo/contact row fits on one line at the narrowest width.

Home search reaches nine Toyota results; the relocated View all link opens all 48 stock records. The location drawer closes with Escape and restores focus. Leasing country/search filters combine, empty reset restores the five examples, the selected-car enquiry retains country/model/price, and its prepared draft stays non-submitting. The calculator remains illustrative. Sell's hero action works by keyboard and selects Sale. Services search/category selection leads to the selected diagnostics enquiry route. The shared scrolled header retains 44px targets.

`npm run check` passed using Node 22.20.0: lint, TypeScript and the production webpack build, including 407 generated static pages. The build used `.next-build-check`, separate from the running `.next` development output. Generated `next-env.d.ts` changes were restored to the existing dev type paths. `git diff --check` passed. An initial LCP warning was addressed by eager loading the first Home campaign image; no measured speed improvement is claimed. Network-idle waits are unreliable with the development server; loaded-image state, DOM checks and captures establish rendering readiness.

The screenshots reflect the existing Cars main working tree, including preserved shared-pill drafts from other work. This pass does not select a template release or refresh/deploy a dealer. See [the earlier Sell implementation and checks](../sell-polish-2026-10-03/README.md) and [saved original assets and exact built-in imagegen prompts](../../public/showroom/navigation/MOBILE-PROMPTS-2026-10-03.md).
