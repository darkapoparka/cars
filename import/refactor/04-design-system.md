# 04 — Design system and Tailwind v4 contract

## Desired result

Equivalent controls, surfaces, headings and cards must look related across page families without making every surface identical. Desktop should have a coherent information hierarchy and useful density. Mobile’s current grey canvas, white cards, compact metadata, clear mode tabs and overlay controls are protected starting points.

Do not introduce another design language. Do not add gradients, oversized pills, decorative red labels or new banners to demonstrate that a refactor happened.

## Token ownership

Separate three concerns:

| Layer                  | Owns                                                                                                                         | Does not own                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Brand inputs           | Logo/assets, body/heading font choice, accent and accent contrast, approved inverse surface                                  | Every component’s margin or an arbitrary CSS string supplied by a form          |
| Semantic tokens        | Canvas/surface/raised/inverse, primary/muted text, borders, focus/status, typography and control roles, spacing/radii/motion | A token for every one-off 7px offset                                            |
| Component measurements | Stable local relationships such as gallery ratio, drawer width and toolbar layout                                            | Repeated brand colour literals or route-specific overrides of another component |

Start by adopting the existing `--bc-*` vocabulary where it is accurate. Do not rename the entire namespace just for aesthetics. Collapse aliases only after tracing their consumers; provide a temporary compatibility mapping with a removal task when necessary.

`--bc-accent-olive` and similar historical names should not define a new product colour family merely because they exist. A meaningful status colour can differ from the brand accent. A neutral background must not silently change to a brand tint on one route.

## Runtime values and utility mapping

Use one authoritative set of custom properties, mapped into Tailwind’s utility namespaces. This illustrative fragment extends the existing approach; exact colours/type values remain subject to reference-page review.

```css
/* tokens.css: values live here, not in each page. */
:root {
	--bc-accent: #b9161c;
	--bc-accent-contrast: #ffffff;
	--bc-surface-raised: #ffffff;
	--bc-border: #d8dde3;
	--bc-control-height-standard: 2.75rem;
}

/* theme.css: aliases generate utilities, without copying values. */
@theme inline {
	--color-action: var(--bc-accent);
	--color-on-action: var(--bc-accent-contrast);
	--color-surface: var(--bc-surface-raised);
	--color-border: var(--bc-border);
	--spacing-control: var(--bc-control-height-standard);
}
```

Keep existing `bc-*` utility names during migration where that reduces churn. Choose one final naming vocabulary only after consumer mapping. Theme overrides must exist on a scope inherited by portals as well as normal descendants. A drawer appended to `body` must not lose a theme defined only on a page wrapper.

Use explicit complete utility strings in variant maps. Do not generate classes with fragments such as `bg-${brand}`. Use custom properties for actual runtime values. Test that `tailwind-merge` handles any custom utility vocabulary correctly before assuming caller classes override variants as intended.

## CSS entry point and cascade

The target is one app-level Tailwind import plus explicit token/base/component ownership. Existing route-specific Tailwind imports and legacy stylesheet links must be removed in a controlled order, not all at once.

1. Inventory which routes depend on legacy base styles, reset rules, grid utilities, vendor widgets and guards.
2. Create an isolated reference component fixture with the proposed token mappings. Verify form controls, headings, buttons and links with the actual fonts.
3. Establish the final layer order for new styles: theme, base, components, utilities. Scope admin density/colour aliases rather than importing another global reset.
4. Migrate one public route family, ensuring it does not accidentally consume legacy `.btn`, `.container`, `.grid` or form rules.
5. Remove that family’s guard selectors and runtime stylesheet dependency once its old consumers are gone.
6. Retire legacy CSS entirely only after the last supported route and packaging consumer has migrated.

**Important cascade constraint:** normal unlayered CSS outranks normal layered CSS, and important declarations have a different layer ordering. Wrapping the entire important-heavy vendor stylesheet in an early layer is not an automatic fix. Inspect computed styles and remove conflicting declarations rather than creating another layer of `!important`.

Scoped Svelte CSS is appropriate for component layout. Utilities are appropriate for composition. Do not express the same padding/colour in both places. Parent pages may control layout gaps and placement; they may not override a child’s internals with a route/body selector. Keep rare global selectors close to the owned primitive or the temporary legacy adapter.

## Role scale to review and then freeze

The current values below are starting contracts, not a proposal to enlarge the UI. Their use is more important than exact duplication of the table in CSS.

| Role                  | Starting intent                                              | Review criteria                                                               |
| --------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Compact utility       | Existing 36px visual/control role where appropriate          | Pointer use and spacing; mobile target may be larger than the visible surface |
| Secondary action      | Existing 40px role                                           | Header/tool actions align with equivalent actions across routes               |
| Standard field/action | Existing 44px role                                           | Readable text, consistent icon and padding; no cramped focus/error states     |
| Primary action        | Existing 48px role                                           | One clear primary action in a group, not every button made dominant           |
| Hero search           | Existing 56px role                                           | Deliberately larger context only, not a default for ordinary forms            |
| Metadata badge        | Existing compact non-interactive role, around 30px on mobile | Smaller than quick filters; no false affordance or oversized badge row        |
| Icon action           | Separate glyph, visible surface and hit area                 | Consistent close/menu/search geometry and accessible label                    |
| Mode tabs             | Shared text, baseline, underline and hit-area contract       | Switching Buy/Import/Sell or Link/VIN does not shift alignment or height      |

The product’s preferred mobile touch target is at least 44px where practical. Do not misstate this as the exact WCAG 2.2 AA minimum: the W3C minimum criterion uses 24px with exceptions; the larger product target is intentional. Validate actual focus/spacing, not just CSS width declarations.

## Typography

Preserve the approved Sofia Sans storefront family initially. Confirm the shipped weights and Cyrillic coverage. Use role tokens for page title, section title, card title, price, field label, body, metadata and secondary finance text. Avoid arbitrary 650 weights when only discrete 400/600/700 faces are shipped; verify actual rendered font selection.

Desktop fluid headings must not become oversized on a compact laptop. Card titles should preserve the owner’s preference for a compact first line where practical, with an intentional trim/details treatment rather than several mandatory rows and fixed-height empty space. Long Bulgarian model names and long translated controls are required fixtures.

The price remains the strongest numeric element. Monthly finance text is secondary and must not compete visually with the metadata badge row. Do not solve that issue by shrinking the main price or the image. Use tabular numerals for changing numeric interfaces where it helps alignment, not as a blanket typographic rule.

Default text and inputs must remain readable at their existing control heights. Form hints and validation text should not create competing heading levels. Keep heading semantics separate from visual role classes.

## Containers, surfaces and rhythm

Resolve the competing 1,440px page-width and 1,320px content-width values into a documented layout contract. Recommended starting point: retain the current 1,320px content container for ordinary desktop content, a narrow reading/form measure, and explicit full-bleed hero/gallery sections. Review compact laptop and ultrawide widths before freezing it.

Use a small spacing scale for repeatable relationships. A section gap, card padding and control gap are different roles. Do not apply one large vertical padding to every page section. White/neutral-grey/inverse surfaces must have consistent semantic meaning. Borders, radii and shadows should reinforce those surfaces, not create a separate floating card for every paragraph.

Sticky headers, bottom navigation and action bars need shared offsets and scroll padding. Preserve scrollbar width/gutter across route navigation. Do not rely on body-class resets to mask layout shifts.

## Overlay and motion contract

Use a named stacking scale for header, popover, drawer, dialog and toast. Document how nested content and portals inherit theme and stacking. Keep one owner for scroll locking and focus restoration. Overlay headers have a deliberate title/description/body gap; an absent description must not reserve an empty row.

Mobile full-screen forms preserve safe-area and keyboard-inset handling. Desktop can use a bounded dialog/side panel rather than stretching the mobile sheet into a giant empty surface. Motion should be restrained, cancellable on route changes and respect reduced-motion preferences. Do not disable all transitions with a broad page-descendant selector to cure a single broken animation.

## Enforcement without new bureaucracy

Add checks for required token definitions, forbidden new route-qualified descendant selectors in migrated folders, unapproved raw brand colours and new important declarations outside a small allowlist. Use counts as ratchets, not as gamable vanity targets. Keep explicit exceptions for focus/screen-reader utilities, reduced motion, calculations, real image geometry and legacy third-party integration awaiting retirement.

A token pass is complete only after computed-style checks, reference screenshots, long-content fixtures and second-brand testing agree. Replacing every hex value with a uniquely named variable is not completion.
