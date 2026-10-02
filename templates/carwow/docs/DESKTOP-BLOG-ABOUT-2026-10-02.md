# Desktop Blog and About refinement — 2 October 2026

Blog topics used generic rectangular discovery controls with a number on every tag. About's hero mixed a car-search prompt with large location, phone and social buttons, while its introduction added another large white box.

## Changes

- Blog topics now use rounded neutral pills in a compact white toolbar, sentence-case labels, a yellow selected state and one result count. Search, category/tag combinations, reset and browser history keep their existing URL behavior.
- About's charcoal hero centres the location and appointment information above a yellow viewing action and an outlined inventory link. Phone and monochrome social links have quieter treatment below. Existing destinations and accessible labels are retained.
- About's introduction keeps its copy and contact link, with a centred 860px text measure and no outer card or redundant inner padding.

The shared hero artwork, 400px desktop hero height, content shell, Home, inventory and mobile compositions remain unchanged.

## Verification

Runtime: Node `24.21.0`. The existing dev server remains on `127.0.0.1:6464`; checks used a separate production preview on port `6465`.

- `npm run check`: zero errors and warnings.
- `npm run lint:code`: passed. Prettier and `git diff --check` passed for task-owned files.
- `node scripts/check-typography.mjs`: passed across 298 source files.
- `npm run test:tooling`: 11 passed; `npm run test:unit -- --run`: 187 passed across 22 files.
- `npm run build`: passed, including locale validation and the Vercel adapter.
- Production Chromium: 32 existing tests passed in `desktop-discovery.e2e.ts` and `desktop-sections.e2e.ts`, covering Blog combinations/Back/reset, route layouts, inventory controls and the retained Sell entry.
- Production layout comparison: 32 states across Home, inventory, Blog and About; English and Bulgarian; 992, 1280, 1440 and 1920px. No horizontal overflow or page errors. Shared hero panels remained centred, contained and charcoal.
- Mobile comparison: all 16 route/locale/width states at 320 and 390px matched their before snapshots for visible content, geometry and computed typography/style. Home's 1440px signatures also matched. All 64 protected mobile/shared source files retained their SHA-256 hashes.
- `node scripts/backend-secret-boundary.mjs`: passed, scanning 362 source and 431 built client files.

Full-project formatting still reports 10 pre-existing files outside this change. The architecture checker still reports the unchanged, unreachable `src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. Neither gate was weakened or unrelated mobile code edited.

An initial check attempt encountered a full L: drive. Verification resumed after space became available. Only inactive generated `.svelte-kit/output` received reversible NTFS compression; no source, recovery files or audit evidence was deleted.

Evidence: `.audit/desktop-blog-about-polish-2026-10-02/`, including matching before/production snapshots, source hashes and logs. These are local template checks; no template release was selected and no dealer was refreshed or deployed.
