# Microsoft Fluent System Icons Regular

Mobile header, menu, dock, inventory and existing mobile-action consumers render official Microsoft Fluent System Icons through `src/lib/components/layout/MobileActionIcon.svelte`. Desktop/footer consumers retain their separate renderer.

The owner rejected the Material Symbols Sharp implementation after seeing the actual page and favoured Fluent and MingCute in a five-family dock comparison. Fluent Regular was selected for its rounded outlines and consistent weight beside Inter and the site's controls. This is a design judgment; the retained screenshots support owner review.

- Upstream: [Microsoft Fluent System Icons](https://github.com/microsoft/fluentui-system-icons).
- Pinned commit: `a563cf9166f4f91aa617557ed272612b7f0a2f72`.
- Variant: native **24px Regular** SVG, `viewBox="0 0 24 24"`.
- License: [MIT](fluent-icons-LICENSE.txt); retain the [upstream notice](fluent-icons-NOTICE.txt).
- Geometry and original-source hashes: [manifest](fluent-icons.json).
- Delivered module: `src/lib/components/layout/fluent-mobile.ts`.

Sixteen established action roles use fourteen upstream SVGs. Home, Vehicle Car, Tag, Globe and Navigation serve the five dock destinations. Location, Call, Search, Options, Arrow Sort, Dismiss, Document Text, Building and Arrow Right serve existing actions. Phone roles share Call; import and language roles share Globe.

Only the original fixed paint color is replaced with `currentColor`; path data, native view boxes and any path winding rules are preserved. Active and inactive destinations use identical Regular geometry. The existing neutral selection surface, charcoal color, semibold caption and `aria-current` convey selection. No artificial strokes, path edits, icon font or additional package dependency are introduced.

`scripts/check-visual-system.mjs` verifies the reviewed commit, module and individual geometry hashes. Mobile interaction checks verify the mounted family, native view boxes, selection state, alignment, labels and touch targets in Bulgarian and English. Historical icon modules and notices remain with the retained sources.
