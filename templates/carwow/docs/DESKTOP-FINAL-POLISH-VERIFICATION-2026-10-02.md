# Desktop typography and spacing audit

Verified locally in `L:/CODEX/cars/templates/carwow` on `main`, using the retained npm lockfile and Node 24.21.0. This pass removes the requested long review notice on desktop and corrects typography, outer frames, spacing and interaction states.

## Findings and changes

The site already uses self-hosted Geist, including Cyrillic. The inconsistency came from different heading roles and route-specific layout rules, rather than a missing font. Financing sections inherited the 48px hero size; About and Sell used a separate section scale; Calculator panels also inherited hero-sized headings. Section headings now use the existing responsive section token, weight 700 and 1.15 leading. Calculator panels retain a distinct 28px heading. Existing 18px single-line vehicle titles and specification badges remain intact.

Secondary routes had independent gutters and nested 15px padding. The shared frame is now available from the globally loaded desktop control stylesheet: 1320px maximum, 80px total gutters at 1200px and wider, 48px total gutters from 992–1199px. Reviews, Sell, Contact, Financing, Calculator, FAQ, Team, profiles, related articles and Saved cars align with Home and Inventory. Narrow reading columns and form panels remain inside this outer frame. Saved cars retain four columns with 16px gaps at desktop widths.

The shared route hero defaults to a white task panel. Compact two-action decks retain 20px padding instead of exposing two bare buttons. The established 400px hero height, 36px title inset and 24px title-to-panel gap remain consistent.

The long review notice is removed from desktop Home, vehicle details and the Reviews hero, and hidden in desktop-only rules on the shared Reviews and profile compositions. Mobile keeps its existing notice. Review data, ratings and existing sample-count labels are unchanged. Home has one 24px heading gap; the Reviews grid has 24px gaps, consistent 48px avatars and author rows aligned at the bottom of each card. Longer reading sections use the existing 76px rhythm, with a 52px first inset where updated.

About's brand and map controls use yellow hover with dark text. Support and profile cards retain a white surface and neutral border feedback. About and Sell use the shared black keyboard-focus colour. Disabled desktop CTA and inventory-filter selectors no longer receive enabled hover styling.

## Verification

| Check                       | Result                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| Production build            | Passed; final build completed in 1m 54s                                                       |
| Svelte diagnostics          | 0 errors, 0 warnings                                                                          |
| Scoped Prettier and ESLint  | Passed                                                                                        |
| Typography gate             | 299 source files, no local font size, weight or family literals                               |
| Unit suite                  | 187 tests passed in 22 files                                                                  |
| Chromium journeys           | All 60 passed on the final production build                                                   |
| WebKit hero journeys        | All 10 passed with clean exits: EN five cases, BG groups of three and two                     |
| Desktop route captures      | 38 route/language combinations, no horizontal overflow, clipped controls or page errors       |
| Shared-frame/font checks    | All 128 passed: 16 routes × EN/BG × 992/1280/1440/1920px                                      |
| Hover measurements          | 60 probes; no size changes, translations or decorative shadows                                |
| Keyboard mode tabs          | EN/BG ArrowRight changes selection and retains a visible 2px black focus ring                 |
| Primary mobile comparisons  | All 24 exact signatures match across 12 routes at 320/390px                                   |
| Expanded mobile comparisons | 36 exact matches; the two vehicle-detail captures differ only by drawer animation translation |
| Protected-file hashes       | All 125 mobile, shared-data, asset and base-style files match the starting hashes             |

The expanded mobile capture did not wait for the existing detail drawer's opening transition. Its two differing signatures have identical text, URLs, fonts, colours, borders, widths, heights and relative placement; their entire drawer is translated vertically. Four follow-up captures wait for hydration and finite animations to finish. At both widths, both repetitions settle to the existing collapsed position at y=354px with no desktop frame variables applied. The initial comparison remains recorded as a failure rather than being reported as an exact geometry match.

The first implementation check caught two profile components shared with mobile. Their mobile notices and original interaction rules were restored before the final build. The first width audit also caught secondary routes missing the shared frame stylesheet; the global desktop import fixes that loading issue. The initial Chromium run hit the default 30-second deadline in the eight-state Newest cars journey. That test now has a 90-second budget; all geometry and navigation assertions are unchanged. The final full run passed in 2.7 minutes with two workers.

WebKit verifies all 18 standard routes against Home at 992, 1280, 1440 and 1920px, plus the 991/992px composition boundary. The initial BG group passed all five assertions but stalled during Windows worker/report teardown. Rerunning the identical cases in groups of three and two completed normally. The initial timeout log remains available.

Logs, before/after signatures, measurements and screenshots are retained in `.audit/desktop-final-polish-2026-10-02/`. Larger Playwright artifacts use fresh temporary output directories recorded there. The preview at `http://127.0.0.1:6464/en` serves the final production build. This is local source and browser verification; release promotion and hosted dealer verification remain separate operations.
