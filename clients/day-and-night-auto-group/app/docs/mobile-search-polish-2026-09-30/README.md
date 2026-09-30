# Mobile search and filter refinement

Follow-up to the [mobile audit](../mobile-audit-2026-09-30/audit-report.json), in the Cars-owned App template. Reference source: `L:/inspiration/cars24`, read only.

Search now uses a soft, borderless capsule throughout Home, inventory, filter sheets, feature search and its entry link. Autofocus and pointer input do not draw a second outline. Tab navigation draws one visible focus ring, without adding React state updates during typing.

Quick filters use fully rounded 44px controls with plain icons. Applied filters have a filled state, a dot and an accessible applied label. Mobile filter categories and footer actions use the same rounded geometry. Category and brand names use normal capitalization.

The search screen has labeled brand shortcuts, a quieter finance link, consistent section spacing, and 56px suggestion rows. Long queries wrap. Keyboard selection scrolls the active suggestion into view, including a 500px-high viewport.

Verification includes 320px, 390px, 768px and 1440px views, keyboard/pointer focus, search suggestions and selection, model filtering, clearing filters, sorting, modal Escape/focus return and feature search. Computed-style observations are recorded in [browser-observations.json](browser-observations.json). They cover visible text contrast, editable font sizes, accessible names, touch targets, document overflow and broken images; they are not a formal WCAG certification or a physical-device Web Vitals benchmark.

Screenshots: [Home](home-390.jpg), [Search](search-390.jpg), [320px filters](filters-320.jpg), [390px filters](filters-390.jpg).

Final check and production route results are recorded in `audit-report.json`. The dev server is restored to `http://localhost:3001/bg` after production verification.
