# Modern desktop refresh

## Current desktop revision

The owner selected the boxed showroom at http://127.0.0.1:6474/ as the stronger direction. Both that reference and the updated Boxcar preview at http://127.0.0.1:6455/ were inspected at desktop width. Modern now uses a centred 1248px outer frame on a grey canvas, a compact desktop navigation header, a full-width search field with an adjacent submit button, category tabs, and compact filter pills. The home route renders the existing inventory results with sorting and grid/list controls. Cards use larger 3:2 photographs, model headings, inline specifications, and clear prices. The grid uses two columns on smaller desktops and three from 1200px. Vehicle details and service pages share the same frame. Opening a modal preserves its horizontal position.

All visual rules are scoped to 1024px and above. Mobile components, form behavior, navigation, and the shared mobile card policies were preserved. The mobile image-size hint remains 46vw. Existing sample inventory, dealer identity, URLs, and static-demo behavior are retained.

Validation on 2 October 2026, with Node 22.23.2 and pnpm 11.4.0:

- Web typecheck passed. The final isolated public-demo production build passed with `E2E_PUBLIC_RUN_ID=desktop-boxed-final-20261002`.
- Biome passed for all thirteen changed source/test files. The existing Web and Marketplace UI suites passed all 271 tests.
- The Codex in-app browser inspected Home, inventory, vehicle details, imports, sell, financing, and contact at 1024, 1440, and 1920px, plus English Home at 1024px. All 22 captures had no horizontal overflow or broken completed visible images.
- Desktop interaction checks verified BMW text search (5 results), a Diesel filter draft and submission (7 results), reset, ascending price order, list/grid switching, vehicle navigation, gallery opening/Escape dismissal, and specification tabs. The frame's left edge remained 88.5px both before and during the gallery modal at 1440px.
- Fourteen mobile before/after captures covered the same seven Bulgarian routes at 320 and 390px. Every persistent measured visible element retained its geometry, typography, text, foreground, and background. Four temporary image skeletons in the 390px Home baseline had finished loading in the after capture; this is not a claim of pixel-identical image decoding. No mobile capture had horizontal overflow.

Current screenshots and JSON evidence are in ignored `runtime/desktop-boxed-2026-10-02/`. The existing focused desktop test assertions were updated for the boxed frame, catalogue heading, adjacent search button, and two/three-column grid. Browser interactions in this revision used the in-app browser; the Playwright/WebKit suites were not rerun. A transient Turbopack CSS hot-refresh error occurred while editing and recovered after full document navigation. Later captures and interactions had no new application errors; inherited image-size/LCP development warnings remain.

Local review preview: http://127.0.0.1:6482/bg. The reference projects were read-only. This is a local source implementation; owner visual acceptance, template release selection, and dealer publication remain separate.

## Previous light draft (superseded)

The owner rejected the initial dark masthead. The revised desktop uses a light navigation header, a plain typographic hero, one integrated search row at 1280px and above, and two rows with matching keyboard order on narrower desktop screens. Vehicle cards have clearer specifications, quieter badges, stronger prices, and a labelled Details affordance. The hidden desktop header uses the normal logo appropriate to the lighter surface. Mobile components and styling below 1024px were preserved.

The light draft was inspected at 1440px before the final card and narrower-desktop refinements. Typecheck, Biome for all ten changed source/test files, and 271 unit tests passed. The isolated production build passed. Final visual/interaction review and fresh mobile screenshot comparison are unfinished: the browser approval check rejected opening both Boxcar and the local Modern tab, reporting a blocked URL protocol. No alternate browser or browser automation was used to bypass that rejection. Local Boxcar reference screenshots informed the source revision.

Local development preview remains http://127.0.0.1:6482/bg. The previous screenshot and browser-test evidence below belongs to the earlier revision, not this final draft. Owner visual acceptance and release selection are outstanding.

## Initial implementation evidence

The desktop layout at 1024px and above now uses a consistent 1280px content frame, a showroom hero with an overlapping search panel, quieter inventory cards, and a listing gallery aligned with the sticky price/contact panel. Boxcar informed the spacing and hierarchy; the Modern identity, existing imagery, data boundaries, URLs, and enquiry behavior remain in use. Service pages use the same frame and simpler headings/forms.

Mobile components and styling below 1024px were preserved. The environment default assignment was also corrected to avoid invalid compiled public-origin assignments in the local preview; existing configured origins retain precedence.

Validation completed on 2 October 2026 with Node 22.23.2 and pnpm 11.4.0:

- Web typecheck and isolated public-demo production build passed.
- Biome passed for all 19 changed source/test files.
- 271 unit tests passed across Web and Marketplace UI.
- Seven desktop browser checks passed, covering navigation, layout at 1024/1440/1920px, filters, financing/import flows, gallery focus, information tabs, and phone handoff.
- Eight mobile browser checks passed in Chromium and WebKit.
- Home, inventory, listing, leasing, import, and sell routes rendered successfully without horizontal overflow. All twelve mobile before/after comparisons at 320px and 390px retained the same measured geometry. Some thumbnail decoding and tiny paint differences prevent a blanket pixel-identical claim.

Local review preview: http://127.0.0.1:6482/bg. Screenshots and detailed comparison reports are in the ignored `runtime/desktop-redesign-2026-10-02/` directory. This is a source implementation and local verification record; template release selection, owner visual acceptance, and dealer publication remain separate steps.
