# Mobile quick-filter spacing — 5 October 2026

The phone quick-filter strip now has equal space above and below its pill faces,
measured between the vehicle-type rail and the start of the white inventory canvas.
The previous gaps were 16px above and 8px below. Both are now 16px.

`ShowroomQuickPills` uses symmetric `paddingBlock` instead of separate top and
bottom declarations. Phone block padding is 12px; the 48px button target centers
its 40px face with another 4px on each side. The inventory canvas starts 8px lower,
and its existing 8px padding before the first card remains. Services uses the same
shared correction. Tablet and desktop padding retain their previous values.

The white pill fill, black selected state, pill shadow, vehicle-type rail shadow,
card height and card content are preserved. The change introduces no new wrappers,
props or state.

Full source lint, TypeScript, formatting, 95 domain/localization tests and a
production build with 51 generated pages passed. Browser checks verified the
16px/16px gaps at 320px and 390px, matching Services spacing, unchanged 40px faces
and 48px targets, preserved shadows and card heights, and no document overflow or
console errors. The 1440px desktop filter geometry exactly matches the separately
committed desktop preview at 6478; that desktop work was preserved during this edit.

Matched captures:

- Inventory 390px: [before](before-390.jpg) / [after](after-390.jpg).
- Inventory 320px: [before](before-320.jpg) / [after](after-320.jpg).
- Services 390px: [before](before-services-390.jpg) / [after](after-services-390.jpg).
- [Geometry and validation evidence](verification.json).

Local production preview: http://127.0.0.1:6474/.
This is source polish, not official template release acceptance or dealer deployment.
