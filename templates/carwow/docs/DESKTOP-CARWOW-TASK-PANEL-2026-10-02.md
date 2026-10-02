# Desktop task panels — 2 October 2026

The previous Home panel repeated separate outlined mode buttons inside a wide white card, with a left-aligned filter row and unused space on the right. That composition did not follow the search hierarchy visible at [Carwow](https://www.carwow.co.uk/).

The live reference was inspected at 1440px in its Find a car and Sell my car states, together with its used-car inventory. Its Home search groups mode navigation, a centred white search pill and secondary controls inside a compact dark panel. The master now uses that hierarchy with the dealership's yellow and retained self-hosted Geist. The owner rejected underlines, so the selected Home mode uses a white fill rather than copying the reference's indicator. The retained four/five-column car grids and specification badges follow the owner's explicit density and card requirements.

Home uses a 640px charcoal panel, an attached 52px mode header and a 560px search field. Existing translated labels now read Buy a car, Sell or trade in and Car import. Inventory uses the same charcoal surface, 54px white search pill, 44px yellow circular action and compact centred filters; it retains 720px to fit the additional More filters control. Selected filters have a contrasting white border and keyboard focus uses yellow on the dark surfaces. Sell and Import retain visible white labels, guidance, validation and the existing intake routes. The mode state, independent drafts, keyboard handling and query/filter logic were preserved.

Home browse headings already owned a 24px bottom margin, while the content added another 24px above its cards. The original Home composition now uses the heading's single gap. The retained `/home1` inventory spacing remains explicit in its own variant rule. Mobile compositions, shared typography tokens, locale catalogs, data and assets were not edited.

Verification using Node 24.21.0 and the production preview at `http://127.0.0.1:6464`:

- Svelte check: zero errors and warnings. Scoped ESLint, formatting and the 299-file typography guard passed.
- Unit suite: 187 tests in 22 files passed.
- Production build and Vercel adapter completed. All 28 selected Chromium scenarios passed, covering mode keyboard handling and drafts, Sell/Import routing and validation, Buy query preservation, quick filters and focus return, matching controls, card actions, browse tiles, section frames and the complete header search field.
- English and Bulgarian Home/Inventory at 992, 1280, 1440 and 1920px: all 16 geometry states passed. Heroes remain 400px, filters stay in one row and all three Home modes remain 208px tall.
- Both development and production passed all 16 geometry states. Eight English/Bulgarian Home/Inventory production comparisons at 320 and 390px matched the starting layout, typography, control styling and accessible content. All 125 protected source/data/asset hashes matched the starting snapshot.
- The production loading scenario confirmed one desktop Home stylesheet URL across server bootstrap and hydration, loaded photography throughout the Home sections and consistent card-image geometry. This is a local loading check, not a new public speed benchmark.
- The architecture check still reports the existing unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. Its blob is unchanged at `7a0ee36e8a44c5745bda8a0055134534458507aa`; the mobile module and check were preserved.

Evidence is retained under `.audit/desktop-carwow-task-panel-2026-10-02/`. This is local template refinement; template promotion, owner visual acceptance and hosted dealer delivery remain separate.
