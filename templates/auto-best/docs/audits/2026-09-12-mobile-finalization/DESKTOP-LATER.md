# Desktop later — scope and guardrails

Desktop design follows mobile finalization. This audit sampled desktop/breakpoint behavior and ran the existing desktop-discovery suite; it did not approve the entire desktop visual design. Preserve the mobile contract established by [MOBILE-FINALIZATION-PLAN.md](MOBILE-FINALIZATION-PLAN.md).

## Fix now because shared code is already broken

The body-type grid at 1440px renders baked mobile cards and desktop cutouts together. This is C05, not a deferred aesthetic preference. Repair breakpoint isolation during the mobile work, and keep a regression screenshot at 1440px. Also preserve desktop filter query state, keyboard-operable navigation, and correctly sized modal/popup boundaries when touching shared owners. The passing desktop-discovery smoke test did not detect the doubled body artwork.

## Guardrails during mobile changes

Use representative widths at 767/768 and 991/992 because content and navigation change at different breakpoints; include 1440px for shared-card/header regressions. Check search and menu opening, native focus, popover dismissal, results alignment, and one-artwork-only rendering. A responsive implementation may legitimately have different content and navigation breakpoints; document their roles rather than blindly forcing one universal breakpoint.

Keep the same typed inventory, filters, service/journey definitions, artwork manifest, and brand configuration for both surfaces. Desktop may present more controls inline, but must not implement another interpretation of budgets, models, years, or query serialization. Do not clone complete route components into mobile and desktop versions.

## Desktop work after mobile approval

**D01 — Header, navigation, and hero ownership.** Audit 992/1024/1280/1440/1920px plus text enlargement. Resolve the overlapping global/scoped header and hero rules before cosmetic additions. Keep route titles in route content, not in the global navigation header. Check hover/focus/click behavior and opening a new tab on navigation links.

**D02 — Discovery and inventory composition.** Set one search/filter width and alignment contract for homepage and listing. Review sticky discovery boundaries, long labels, empty results, full filter dialogs, card counts per row, image crop, and vertical alignment. Preserve mobile picker semantics and URL-backed state.

**D03 — PDP composition.** Review gallery/media priority, content width, sidebar hierarchy, calculator placement, contact actions, map, and related inventory as one composition. Reuse the mobile decision on financing/seller artwork rather than creating a different data model. Avoid duplicate CTAs and duplicated business facts.

**D04 — Contact, About, and editorial consistency.** Finalize hero/artwork balance, white content panels, map span, readable article line length, social icon sizing, and consistent heading placement. Do not use demo team/partner content or invented testimonials to fill empty space. Check all nine current articles and deliberate long-content fixtures.

**D05 — Final responsive sign-off.** Run production build and all regression suites, compare approved mobile screenshots again, and perform keyboard/zoom/reflow checks across both layouts. Re-measure production media and runtime performance after desktop composition changes.

## Not part of this phase

A new CMS, database migration, application-wide state layer, generic form engine, replacement CSS framework, or lead-submission backend is not justified by the audit. Do not publish sample stock, remove noindex gates, or change the business identity as part of a layout polish. Those require separate verified input and explicit release approval.
