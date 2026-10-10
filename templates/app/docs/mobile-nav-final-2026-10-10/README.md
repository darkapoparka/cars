# Final mobile navigation and quick pills — 10 October 2026

Preview: `http://127.0.0.1:6506`. Canonical source: `L:/CODEX/cars/templates/app`, Cars `main`. Node 22.20.0; existing Next.js 16.3.8 webpack preview and installed dependencies reused.

Sell uses the image-generated straight euro-note artwork, with upright sides and aligned flat lower edges. The other three artwork files remain unchanged. All four illustrations share the same 64 × 42px mobile frame and visible bottom baseline through individual source view boxes. Following the owner's visual correction, Buy is optically scaled to 86% from its bottom center, bringing the wide car back close to its previous painted size without raising its bottom edge. The previous Sell scaling workaround is removed. Tab heights, labels, selected underline and compact-on-scroll behavior remain intact.

Cars and Services quick pill labels use regular 15px type on mobile, up from 14px, with 40px painted surfaces and 44px hit targets. Brand/Model drawer tabs use 14px labels, 36px painted surfaces and the same 44px hit targets. Cars search is now 44px tall, matching Services, with 16px text. Home alone loses 8px of lower banner padding to move the existing brand circles closer to search. Tablet and desktop styles remain unchanged.

The four dock icons now use the existing Lucide library throughout, replacing the separately copied Phosphor paths with consistent rounded strokes. The compact dock layout, active state and 44px links remain intact; no dependency was added.

## Matched 390px comparison

| Before | After |
| --- | --- |
| ![Services before](before-service-390.png) | ![Services after](after-service-390.png) |
| ![Cars before](before-cars-390.png) | ![Cars after](after-cars-390.png) |

Four comparison captures are retained here: two matched route pairs covering the header, underline, dock and both pill consumers. Compact geometry and interaction results are retained alongside them. The generated original and one web derivative are source artwork, not QA intermediates.

## Focused validation

ESLint for the changed code files and TypeScript without emit passed on Node 22.20.0. Browser checks cover 320px Buy/Sell/Finance/Services and Bulgarian Services; 390px Cars/Services; common artwork frame baseline; service category filtering/reset; compact header on scroll; Sell navigation; Cars dock navigation; Brand drawer and Escape dismissal; 44px dock links; no document overflow or browser errors. Final Brand/Model and service drawer checks include selection/reset, the last horizontally scrolling service pill and 320px/390px target geometry. Wider 768px/1440px checks confirm the mobile SVG artwork is hidden and previous image paths retained. The existing root HTML produces Next's advisory about declaring smooth scroll behavior during route transitions; the exact warning is retained in the browser result.

See `verification.json`, `after-checks.json` and `before-checks.json`. Source commit/push is separate from deployment and dealer release selection; this task does not change the approved template lock.
