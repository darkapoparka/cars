# Microsoft Fluent System Icons Regular

Mobile header, menu, dock, inventory and existing mobile-action consumers render official Microsoft Fluent System Icons through `src/lib/components/layout/MobileActionIcon.svelte`. Desktop/footer consumers retain their separate renderer.

The owner rejected the Material Symbols Sharp implementation after seeing the actual page and favoured Fluent and MingCute in a five-family dock comparison. Fluent Regular was selected for its rounded outlines and consistent weight beside Inter and the site's controls. This is a design judgment; the retained screenshots support owner review.

- Upstream: [Microsoft Fluent System Icons](https://github.com/microsoft/fluentui-system-icons).
- Pinned commit: `a563cf9166f4f91aa617557ed272612b7f0a2f72`.
- Variant: native **24px Regular** SVG, `viewBox="0 0 24 24"`.
- License: [MIT](fluent-icons-LICENSE.txt); retain the [upstream notice](fluent-icons-NOTICE.txt).
- Geometry and original-source hashes: [manifest](fluent-icons.json).
- Delivered module: `src/lib/components/layout/fluent-mobile.ts`.

Twenty-one established action roles use nineteen upstream SVGs. Home, Vehicle Car, Tag, Globe and Navigation serve the five dock destinations. Location, Call, Search, Options, Arrow Sort, Dismiss, Document Text, Building and Arrow Right serve existing actions. Arrow Counterclockwise serves the mobile quick-search reset action. Arrow Left serves the icon-only filter Back action requested by the owner on 6 October 2026. Checkmark serves Home and inventory multiselect indicators, replacing the font glyph on 8 October 2026; it renders through the same mobile SVG component at 18px inside the existing 20px circle. Phone roles share Call; import and language roles share Globe. Vehicle detail now shares the native Arrow Left, Call, Share Android, Chat, Location and Arrow Right geometry. Its mobile equipment list uses a neutral 20px Checkmark, without the legacy font glyph; desktop rendering is preserved. Share Android and Chat were added from the same pinned commit on 8 October 2026.

Only the original fixed paint color is replaced with `currentColor`; path data, native view boxes and any path winding rules are preserved. Active and inactive destinations use identical Regular geometry. The existing neutral selection surface, charcoal color, semibold caption and `aria-current` convey selection. No artificial strokes, path edits, icon font or additional package dependency are introduced.

`scripts/check-visual-system.mjs` verifies the reviewed commit, module and individual geometry hashes. Mobile interaction checks verify the mounted family, native view boxes, selection state, alignment, labels and touch targets in Bulgarian and English. Historical icon modules and notices remain with the retained sources.
