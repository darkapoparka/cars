# Desktop hero centring — 2 October 2026

The desktop heroes placed their title and controls at a fixed 36px top inset within a 400px stage. Shorter content left substantially more space underneath, so the group sat too close to the header. Home was about 21px above centre; inventory and Blog were about 52px and 50px above centre.

The shared route hero now centres its title, optional copy and panel as one group. Home uses the same alignment through its existing desktop stage. Equal 32px minimum top/bottom padding allows content to wrap while preserving the 400px hero, typography, 24px spacing before the panel, panel dimensions and artwork. All new layout rules apply at 992px and above.

## Measured spacing

English, 1440px viewport; distances in pixels from the hero edges to the title/panel group:

| Route     | Before: above / below | After: above / below |
| --------- | --------------------- | -------------------- |
| Home      | 36 / 78.25            | 57.125 / 57.125      |
| Inventory | 36 / 140.25           | 88.125 / 88.125      |
| Blog      | 36 / 136.25           | 86.125 / 86.125      |
| About     | 36 / 84.36            | 60.17 / 60.19        |

The existing hero consistency test now checks equal space above and below the complete content group rather than a fixed title inset shared by panels of different heights. Height, typography, containment, overflow and viewport-boundary checks remain in place.

## Verification

Node `24.21.0`; existing dev server on `127.0.0.1:6464` preserved. Tests used a separate production preview on port `6465`.

- `npm run check`: zero errors or warnings.
- Scoped ESLint, Prettier and `git diff --check`: passed. Typography guard passed across 298 source files.
- `npm run test:unit -- --run`: 187 passed across 22 files.
- `npm run build`: passed, including the locale check and Vercel adapter.
- Production Chromium: all 42 tests in `desktop-hero-consistency.e2e.ts`, `desktop-discovery.e2e.ts` and `desktop-sections.e2e.ts` passed. The hero suite covered 18 routes in English/Bulgarian at 992, 1280, 1440 and 1920px, plus 991/992px transitions. Inventory/dialog keyboard behavior, Sell entry, Blog filters/history/reset and existing section layouts also passed.
- Independent comparison: 32 desktop states across Home, inventory, Blog and About were centred without overflow or page errors. At 1440px, panel dimensions and title fonts matched the before snapshots.
- All 16 mobile states at 320/390px matched the fresh before snapshots for content, geometry and computed styles. All 64 protected mobile/shared source hashes were unchanged.

Evidence: `.audit/desktop-hero-centering-2026-10-02/`. This is local master-template verification; no immutable release was selected and no dealer was refreshed or deployed. Existing unrelated repository-wide format/architecture failures remain documented in `DESKTOP-BLOG-ABOUT-2026-10-02.md`.
