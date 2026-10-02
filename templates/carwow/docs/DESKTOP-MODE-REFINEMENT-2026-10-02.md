# Desktop mode controls — 2 October 2026

The Home mode selector uses a centered 312px row of three equal controls with 8px gaps and corners. Each inactive control has a white surface, neutral outline and medium-weight label; the selected mode has black fill and a semibold white label. Removing the enclosing grey rail reduces its visual weight and the task panel from 220px to 212px. All modes retain 44px targets and the same panel height. Disabled controls no longer receive enabled hover styling, and the redundant coarse-pointer mode rule was removed.

This changes the existing `DesktopHomeSearchPanel.svelte` style owner. Its mode state, keyboard handling, independent drafts and form routing remain unchanged. Shared discovery styles, mobile compositions, data, assets and typography tokens were not edited.

Verified using Node 24.21.0 and the standalone production preview at `http://127.0.0.1:6464`:

- Svelte check: zero errors and warnings. Scoped ESLint, formatting and the 299-file typography guard passed.
- Unit suite: 187 tests in 22 files passed. Production build and Vercel adapter completed.
- Chromium: all 12 selected Home mode, intake, query, hierarchy and desktop frame scenarios passed.
- EN/BG Home geometry at 992, 1280, 1440 and 1920px: eight states passed, with 400px heroes, 212px task panels in all three modes, no overflow and readable controls.
- All 125 protected source/data/asset hashes matched the starting snapshot. Four EN/BG Home render comparisons at 320 and 390px matched the previous production geometry and styling exactly.
- The architecture check still flags the existing unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. Its source blob, `7a0ee36e8a44c5745bda8a0055134534458507aa`, matches the starting source. The mobile module and gate were preserved.

Logs, matching before/after measurements and screenshots are retained under `.audit/desktop-mode-refinement-2026-10-02/`. These are local template checks; template promotion and hosted delivery require separate evidence.
