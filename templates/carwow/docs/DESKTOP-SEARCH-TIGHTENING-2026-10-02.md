# Desktop search controls — 2 October 2026

Home now uses a centered Buy / Sell / Import segmented selector with a filled selected state. The Buy label remains accessible but occupies no visual row; the field contains the search prompt. Home and inventory use the same 54px search frame, 12px field corners, 44px action, 8px control corners and a compact filter row aligned beneath the field. The Home panel is 220px high in all three modes, down from 240px; standard heroes remain 400px high.

Reviewed the standalone production preview at `http://127.0.0.1:6464`, using the retained Node 24.21.0 runtime. The shared shortcut styling also applies to desktop Journal filters. Mobile compositions, locale logic, data, assets and shared typography tokens were not edited.

Verification:

- Svelte check: zero errors and warnings. Scoped ESLint and formatting passed. Typography guard passed across 299 source files.
- Unit suite: 187 tests in 22 files passed. Production build and Vercel adapter completed.
- Production geometry and screenshots: Home and inventory in EN/BG at 992, 1280, 1440 and 1920px; 16 states passed. Search/filter alignment, no horizontal overflow, single-row filters, readable shortcuts and equal Home mode heights were checked.
- Mobile preservation: all 125 protected source/data/asset hashes matched the starting snapshot. Eight EN/BG Home/inventory render comparisons at 320 and 390px matched the previous production layout and styling exactly.
- Chromium interaction coverage: 27 selected scenarios. The first run passed 26; the Blog Back/reset case switched from EN to BG once, then passed an isolated rerun. The test now requires the restored English reset link before activation; that updated case passed. No application locale code was changed. Search, mode drafts, intake routing, filters, focus return, reset and URL history were exercised.
- The existing architecture check still fails on the unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. Its source blob remains `7a0ee36e8a44c5745bda8a0055134534458507aa`, identical to the starting source. The mobile module and architecture gate were preserved.

Logs, before/after measurements and screenshots are retained under `.audit/desktop-search-tightening-2026-10-02/`. This is local template implementation evidence; template promotion, dealer refresh and hosted delivery are separate operations.
