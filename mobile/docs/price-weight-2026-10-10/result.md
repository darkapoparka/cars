# Card price weight

Local source: `src/components/ShowroomVehicleCard.tsx`, based on Cars `78efbba1d`.
Change: card prices use font weight 600 instead of 700 on mobile and desktop.

Focused live preview check: `http://127.0.0.1:6474/` on 10 October 2026.
- 390px: rendered weight 600, font size 18px, first-row card geometry unchanged.
- 1440px: rendered weight 600, font size 20px, first-row card geometry unchanged.
- 320px: rendered weight 600, font size 18px; both first-row prices fit and no page overflow.
- Scoped `git diff --check` passed.

Retained evidence: `before-mobile.jpg`, `after-mobile.jpg`,
`before-desktop.jpg`, `after-desktop.jpg`. One matched pair per affected surface.
No production build or deployment was performed for this local style edit.
