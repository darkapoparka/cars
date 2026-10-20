# Finished Home banner choices — 9 October 2026

The reusable Auto Best master retains all five choices. Kerbs now use generated painted-concrete corner photographs over the retained asphalt, with each edge rendered at its natural aspect ratio rather than reflecting the left source. Nürburgring retains its admired asphalt/left edge, with a matching reflected kerb on the right. The final choice removes the map. Mobile Headlights gain a quiet dark centre so white copy remains readable. The default remains Kerbs, with the mobile Featured Cars placement.

- [Matched before/after sheet](comparison.png) and [editable HTML](comparison.html).
- [All five desktop/mobile choices](choices.png) and [local review links](choices.html).
- [Asset provenance and configuration boundaries](../../provenance/home-section-polish-2026-10-09.md).

Source changes extend the existing local banner trial in `src/routes/+page.svelte`, `src/lib/config/lead-site.ts`, `scripts/check-assets.mjs` and `REUSE_GUIDE.md`. Three versioned WebP assets were added. The earlier assets and generation history remain intact; the rejected circuit refinement was never made a runtime asset.

## Evidence

Node 22.20.0 was used. Svelte/TypeScript reports zero errors and warnings. Architecture, CSS policy, tokens, typography, pinned font/icon system, 366-file asset guard and Cars workflow-document checks pass. The Svelte autofixer retains its generic advisory about the existing localized `goto()` wrapper; the handler already calls `resolve()` and the browser checks verify focus and scroll preservation when changing choices.

The development captures cover 20 cases: 320/390px BG/EN, 992/1440/1920px desktop, all five choices on desktop and mobile, review selection, live destinations, heading bounds, overflow and browser errors. These records are in `after-browser-checks.json` and `extras-browser-checks.json`. The mobile Kerbs/Circuit encodings are 84,888 and 17,056 bytes respectively.

The unaffected tablet heading crops at 768/991px are byte-identical before/after. The full 768px screenshot is also identical. The 991px full-view comparison has differences confined to the right-column vehicle photographs; its heading, typography, layout and dock match. This task does not claim a pixel-identical full 991px viewport.

The final Circuit change has four additional focused browser cases at 320/390/992/1440px in `final-browser-checks.json`. Production build and fresh built-preview results are recorded at closeout below. The owner subsequently requested the mobile review control and a scoped source commit/push. No template lock, dealer copy or deployment is selected. Other working changes are preserved. Immutable release selection and hosted dealer verification remain separate.

## Closeout

The final paired-kerb Circuit source passes Svelte/TypeScript with zero errors and warnings and the production build. A fresh owned preview passes 14 BG/EN HTTP/configuration cases and six rendered cases covering desktop Kerbs/Circuit, 320/390px mobile Kerbs/Circuit and mobile Headlights. All five assets are served. Ordinary preview Home omits the floating desktop selector; its mobile menu provides the review pill. The temporary preview was stopped after verification; the existing development server was preserved. The final comparison and five-choice sheets show this same paired-kerb Circuit finish.

## Mobile review control

The menu has a centered **Банери / Banner preview** pill immediately below Contact. It opens a separate native modal rather than expanding menu content. Five labeled photographic thumbnails show the options, and the current choice is marked. Escape/Close returns to the pill without closing the menu. Choosing a style closes both dialogs and navigates to Home's Featured Cars banner with a shareable URL. The banner anchor includes mobile scroll clearance. The existing preview/published boundary is shared by both review controls.

`menu-before-*.png` and `menu-after-*.png` show matched menu views; `menu-options-*.png` shows the modal and `menu-selected-*.png` shows the resulting banner. The phone checks cover 320px Bulgarian and 390px Bulgarian/English, all five choices, unchanged menu geometry while the modal is open, nested Escape/focus behavior, refresh retention and selection from the inventory route.

Final verification repeats those three phone cases against a fresh production build in `menu-built-checks.json`, alongside the 14 HTTP and six banner rendering cases. Final source guards cover 171 native application/config files, 169 CSS source files, 366 media assets and 26 overlay checks. Full validation previously passed the unchanged domain/security tests; final Svelte diagnostics remain zero errors/warnings. Cars workflow-document checks pass. The owner authorized a scoped commit/push to Cars `main`; other drafts, release pins and dealer copies are excluded.
