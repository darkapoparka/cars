# Styling and visual system

Auto Best combines an image-led automotive layout, Onest typography, rounded surfaces and direct call-to-action controls. This document describes the existing design and where its styling lives. It is not a proposal for a new theme.

## CSS structure

[app.css](../src/app.css) imports three global sheets in this order:

| Sheet | Contents |
| --- | --- |
| [tokens.css](../src/lib/styles/tokens.css) | Generic fallbacks, foundation values, semantic aliases and shared component tokens |
| [base.css](../src/lib/styles/base.css) | Native element defaults, controls and shared utility classes |
| [composition.css](../src/lib/styles/composition.css) | Shared shell, hero and cross-component layout relationships |

Svelte component `<style>` blocks own internal presentation. The explicit Phase 3 owners are:

- `Header.svelte`: top bar, desktop/mobile header, navigation and mega-menu geometry.
- `VehicleDiscoveryForm.svelte`: discovery/search geometry and breakpoints.
- `ListingFilters.svelte`: visible filters, mobile filter sheet and sorting controls.
- `ListingResults.svelte`: result-grid and empty-state geometry.
- `VehicleCard.svelte`: vehicle-card sizing and responsive variants.

Route sheets such as `contact/contact.css`, `listing-grid/listing.css` and the detail `detail.css` files own page-stage composition and route-specific adaptations. Standalone `.css` files are already global CSS and must use ordinary selectors; Svelte `:global(...)` belongs only inside a component style block. Do not reintroduce a giant route or desktop stylesheet to bypass component ownership.

Semantic UI identity uses named classes, typed props and explicit attributes such as `data-route`, `data-contact-topic`, `data-journey`, `data-mobile-bottom`, `data-slot` and `data-variant`. Selectors must not depend on element order, generated class names or class substrings. `check:css-policy` enforces these boundaries and also keeps dealer artwork/palette values in the typed lead-site configuration.

Svelte adds a scoping class to component selectors, which changes specificity. Moving a selector unchanged between a component and a global sheet can therefore change the result. Use `:global(...)` only when a component intentionally styles child-component output. See the [Svelte scoped styles reference](https://svelte.dev/docs/svelte/scoped-styles).

`Footer.svelte` owns the footer and its optional service links, including their responsive styles. The shell's footer visibility and bottom-offset relationships remain shared composition concerns.

The `dn-` class prefix is inherited naming, not a runtime dependency on the original dealer. Renaming it is unnecessary for a client skin.

## Token architecture

`tokens.css` is the single source of truth for reusable visual values. It follows the same reference-and-alias model used by Style Dictionary and the DTCG format, while staying as CSS because this template currently has one delivery platform and does not need a token build dependency.

- **Foundation tokens** own raw colors, spacing, font sizes, weights and the 40/44/48px control-height scale.
- **Semantic aliases** name reusable roles such as canvas, raised surface, hover surface, strong ink and emphasized lines.
- **Component tokens** describe stable relationships for Home, navigation, entry workflows and other shared patterns. They reference foundation or semantic tokens instead of copying values.

A component may override a component token for a responsive mode, but the override should reference another shared token. Campaign gradients, artwork crops, provider-specific embeds and genuinely one-off geometry can stay local. `check:tokens` verifies unique global declarations, alias references, cycles, unresolved source usage and the shared control-height contract.

## Color palette and dealer theme

`tokens.css` contains generic fallback values so components remain renderable without a mounted dealer configuration. The active Day & Night preview values live in the typed [`lead-site.ts`](../src/lib/config/lead-site.ts) configuration. `SiteShell.svelte` maps that configuration to semantic CSS custom properties; generic components consume those properties rather than embedding dealer literals or artwork paths.

| Lead-site role | Active value | CSS property consumed by components |
| --- | --- | --- |
| Accent | `#c40101` | `--dn-red` |
| Accent hover | `#a90000` | `--dn-red-hover` |
| Workflow canvas | `#a90f1c` | `--dn-workflow-canvas` |
| Hero surface | `#171a1f` | `--dn-theme-hero-surface` |
| Campaign surface / accent | `#18191c` / `#b80024` | `--dn-theme-campaign-surface` / `--dn-theme-campaign-accent` |
| Blog hero | `#f0c84b` | `--dn-theme-blog-hero-surface` |

The mobile service grid keeps its approved four-tone family through `leadSite.theme.actionTones`: blue inventory, red Sell/Barter, pale-blue Import and charcoal Leasing. Components reference `--dn-theme-action-*` properties, so the current appearance is preserved without dealer-specific literals in generic component CSS.

All `/assets/images/lead/` paths are owned by `lead-site.ts`, including route heroes, workflow banners, vehicle cutouts, sample inventory, videos and PDP artwork. Data and presentation modules may add dimensions, crops or semantic keys, but they must obtain the source path from configuration. `check:css-policy` rejects lead artwork paths elsewhere in `src/`.

Shared neutral interface values such as ink, muted text, lines, raised surfaces and focus color remain generic tokens. A client theme should change the typed dealer roles and artwork mapping, not search-and-replace colors throughout component styles.

## Typography

The root layout imports `@fontsource-variable/onest`. `--dn-font` is `Onest Variable`, followed by Segoe UI, Arial and sans-serif. Fonts are bundled with the application.

| Token | Size | Typical use |
| --- | --- | --- |
| `--dn-text-caption` | `0.75rem` | Nonessential video durations |
| `--dn-text-badge` | `0.875rem` | Compact badges |
| `--dn-text-meta` | `0.875rem` | Supporting metadata |
| `--dn-text-body` | `1rem` | Body copy, inputs and ordinary controls |
| `--dn-text-control-prominent` | `1.0625rem` | Spacious desktop discovery values and dense PDP values |
| `--dn-text-lead` | `1.125rem` | Introductory copy, primary actions and prominent entry fields |
| `--dn-text-card` | `1.25rem` | Card headings |
| `--dn-text-subheading` | `1.5rem` | Subheadings |
| `--dn-text-heading` | `1.875rem` | Headings |
| `--dn-text-section-compact` | `2rem` | Compact desktop section titles |
| `--dn-text-section` | `2.625rem` | Large section titles |
| `--dn-text-hero` / `--dn-text-hero-large` | `3rem` / `3.5rem` | Hero titles |
| `--dn-text-display` | `3.75rem` | Display text |

All live-text typography values belong to `tokens.css`. Components and route sheets select semantic roles; they must not introduce numeric font sizes, font weights, line heights, tracking, or local font shorthands. `check:typography`, included in `validate`, enforces this boundary. Fluid section, hero and display roles also live in tokens. Responsive layouts may select a smaller heading role, but must not shrink ordinary controls below the control role to make them fit.

Use regular 400 for prose, the interpolated UI weight 450 where dense black interface text needs less visual harshness, medium 500 for navigation/actions and semibold 600 for headings and emphasis. Primary actions use `--dn-cta-font` (18px/500 at the default root size); ordinary controls use `--dn-control-font` (16px/500). Both use 1.3 line-height. `--dn-tab-font` supplies quieter 16px/500 entry tabs. The shared `.dn-segmented-control` / `.dn-segmented-option` style owns Buy/Import, Sale/Trade-in and Link/Info controls: 44px total height, pill geometry, pale surface, white selected option and keyboard focus. The 40px options and 2px outer inset form the 44px shell. On mobile, collapsed Home/Sell/Import entry triggers and their red entry CTAs also use a 44px shell; full editor inputs use a compact 48px frame. Components retain their existing tab/group behavior.

The entry field is the strongest editable element. `.dn-entry-field` and `.dn-entry-field__input` own its shared border, surface, focus and `--dn-entry-font` (18px/400). Full editor inputs and desktop entry triggers use the 48px editor frame; mobile collapsed Home/Sell/Import triggers use a 44px frame while keeping the same type and focus treatment. The multiline modifier uses the control radius. Home search and both import entry modes consume this same style; do not add smaller local font or border overrides. `ContactIntent` renders one secondary white phone button below the Sell/Import card, outside `.dn-contact-intent__main`, using the ordinary control type, pill radius and 44px action height. Enquiry components do not duplicate that entry call action.

Sell/Import entry fields fill their card width. `EnquiryEntryField.svelte` renders an input-shaped button with a single-line saved value and opens a native dialog to edit a listing link, VIN, or description and budget. The editor is a bottom sheet on mobile and a centered dialog on desktop. Save applies the draft; Cancel, Escape and backdrop dismissal discard it and restore focus. Switching Link/Info preserves each value and the card height. The red CTA continues the existing enquiry flow; an empty Import entry opens its editor first.

The centered mode switch uses `--dn-entry-segment-width` (up to 240px with a narrow-screen inset), and the red CTA uses `--dn-entry-action-width` (up to 220px). These controls remain narrower than the entry field; on mobile the segment shell, collapsed trigger and CTA share the 44px control shell, while the desktop trigger remains taller. Mobile entry titles have one short helper line underneath; the Sell/Import fields have no decorative leading icon.

Body copy is 16px with 1.5 leading; long editorial prose uses 1.65. Labels, supporting metadata, helper text and the mobile dock use the 14px meta role. Nonessential video duration text may use the 12px caption role. Mobile section headings use 24px and service titles use 18px. Make controls and cards reflow around the type instead of adding smaller local overrides. Include `textarea` in native font inheritance.

Sell/Trade-in accepts an optional listing URL or 17-character VIN before opening the enquiry. The reference remains editable and is included in the review and copied/shared text. When supplied, vehicle details are optional; without it, the existing required vehicle fields apply. This is a reference shortcut, not ad import, VIN decoding or automatic valuation. `src/lib/data/vehicle-reference.ts` owns parsing and reuses the listing URL validator.

## Shape, spacing and layout

| Token | Default |
| --- | --- |
| `--dn-radius-sm` | 10px |
| `--dn-radius-control` | 12px |
| `--dn-radius` | 16px |
| `--dn-radius-lg` | 20px |
| `--dn-radius-button` | `--dn-pill`, 999px |
| `--dn-control-height-compact` | 40px |
| `--dn-control-height-default` | 44px |
| `--dn-control-height-editor` | 48px |
| `--dn-content` | 1360px |
| `--dn-menu-content` | 1320px |
| `--dn-home-section-space` | 32px |
| `--dn-home-heading-banner-height` | 176px |
| `--dn-home-banner-overlap` | 24px |
| `--dn-mobile-nav-height` | 56px |
| `--dn-mobile-detail-bar-height` | 60px |

The shared spacing scale runs from 2px through 32px and supplies repeated relationships such as banner padding, overlap and control insets. It is not a mandate to tokenize every coordinate: artwork placement, local 14px card corners and one-off responsive geometry remain with their component owner.

The control family is rounded: pill actions, rounded input surfaces and compact circular icon buttons. Entry tabs and entry-card primary actions use a 44px hit height with explicit text labels. Primary actions and single-line inputs inside the full multi-step enquiry dialogs use the shared 48px editor height. The import link/criteria field is separate from its primary action, so a small icon does not have to communicate the entire request action. Other controls retain their owning geometry and expand when text wraps.

Inventory filter chips (including removable active filters), results filters/sorting, the header phone link and mobile footer contact links have a minimum 44px hit height. Keep vehicle-card dimensions and their 8px mobile inventory / 10px carousel gaps independent from control sizing. Metadata badges are labels inside the card link, not separate touch targets. Tablet service cards extend the action link over the card; verify the actual hit area before resizing its text. Vehicle-card keyboard focus uses the opaque `--dn-focus` color and an inset outline so the card's clipped corners do not hide it.

## Responsive composition

Mobile inventory cards use one 18px/500 title row with an ellipsis; the full name remains in the link's accessible label, the title attribute and the detail page. The right-hand column uses 14px vertical / 12px horizontal padding, four rows (24/20/20/22px), and 6px gaps, giving the current cards a consistent 132px height. Metadata uses 14px text in compact 20px badges. Fuel/transmission badges omit decorative icons on phones; desktop badges retain them. Mobile photos fill their entire image column with `object-fit: cover`, with no letterboxing. Keep the 8px gap between inventory cards. The keyboard-only focus border is drawn above the photograph and badges so the complete card remains visibly selected; normal tapping does not display this border.

Keep `scrollbar-gutter: stable` on the root element. Classic desktop scrollbars otherwise change the available page and fixed-navigation width when moving between long pages (Home) and short pages (Sell/Import). Overlay scrollbars on touch devices retain their normal behavior.

| Range | Main behavior |
| --- | --- |
| Up to 767px | Mobile navigation, home service grid, compact search and bottom-sheet treatments |
| 768–991px | Intermediate layout; individual components retain their own arrangements |
| 992px and above | Desktop composition, section banners and desktop discovery controls |
| 1440px and above | Wide hero side-vehicle artwork is enabled by its media sources |

Additional 359/374/380px and 1199px rules handle particular text, grid and control constraints. These are local breakpoints, not separate site themes. Safe-area insets supplement the fixed mobile navigation and sheet footers. The normal dock and vehicle-detail action bar are separate layouts with different height tokens.

## Homepage patterns

**Hero and search.** The hero and its vehicle artwork remain separate from the search panel. Buy/Import tabs share the quieter pill-shaped segmented control with Sell/Import. The white, bordered entry field uses larger regular text; primary actions remain red. Desktop discovery is its own presentation. The older charcoal-search token names do not mean the current entire search panel should be recolored charcoal.

**Mobile services.** The current preview has four illustrated cards in a 2-by-2 grid below search. Text sits above a centered lower image region. Inventory, sell, import and leasing each retain their own color and existing generated artwork. This is distinct from the wider desktop campaign pair.

**Section introductions.** Desktop inventory/body/brand/editorial sections use their existing branded heading banners attached to light content panels. Their heading/CTA and overlap rules are shared. Mobile uses compact headings appropriate to its denser layout rather than miniaturizing the full desktop banners.

**Body types and brands.** These use image-led grid tiles, live labels and expandable mobile discovery. Artwork bounds align the visible car or logo rather than the transparent image canvas. Labels are centered within the mobile cards. Body-type and brand components own their own header actions and expansion state; changing one should not implicitly replace the other.

**YouTube.** The mobile video section is a rounded black container with a simple YouTube title and image-led video items. Its outgoing channel link, thumbnails and click-to-play player come from different parts of the implementation.

## Inventory and vehicle cards

Mobile inventory starts with a rounded search field and compact filter/sort controls, followed by one horizontal quick-filter rail. Make and model stay together in that rail. Active chips expose removal; selectors retain a dropdown affordance. The filter sheet contains the deeper options.

Vehicle cards prioritize photograph, title and price over metadata. Mobile year/mileage badges and fuel/transmission icon treatments remain secondary. Card links cover the intended card area, not only a tiny title. Desktop grids adapt through intermediate widths rather than imposing the mobile card structure everywhere.

## Detail, sell and import

Vehicle detail uses route-specific gallery, information tabs, price/contact actions and supporting finance/seller content. The current working preview includes image-generated financing and seller banners; the separate import explainer belongs to the import journey rather than the vehicle page. Their text is already part of the image: changing alt text does not change the displayed words. Use the approved image as an image, with its existing interactive wrapper.

Sell/trade-in and import have related entry geometry but distinct workflows. Their informational drawers are native dialogs with dark sheets, light text, rounded top corners and viewport-level backdrops. They are not ordinary boxes attached inside the entry card. Their backgrounds, sheet surfaces and backdrop treatments have separate CSS owners.

General Contact combines contact actions with a contained map section. About and editorial retain their own route composition. Detailed form controls are not a reason to add a second visual system to those pages.

## Artwork and icons

Stock images use photo framing; decorative cutouts use proportion-preserving containment. `VehicleCutout`, `HeroVehicles`, `ArtworkRegion` and `FeatureArtwork` interpret the data modules. A bounds tuple describes visible artwork; a crop tuple describes a viewport into a larger image. Their numeric meanings are documented in [Data](DATA.md).

`Icon.svelte`, `MobileNavIcon.svelte` and the service/social icon components are existing native SVG renderers. Reuse their names and visual weight for an established action. Adding an icon font or a second icon library is unnecessary for ordinary customization.

## Interaction styling

Existing focus rings, selected states and disabled states communicate different things. Hover effects should stay secondary to the static composition, and mobile scrolling should not rely on hover. Respect the existing reduced-motion media queries. Native modal placement, page scroll handling and the dock interaction need to be considered together when changing drawer styling.

For a visual adjustment, find the winning rule in the component/route/global cascade and edit that owner. Keep the current appearance for architecture-only changes. [Testing](TESTING.md) lists the representative viewports and interaction checks.

## Compact mobile control contract

Compact mobile controls use one 44px interaction shell; do not add a 42px size. Search and editable entry fields paint the complete 44px field surface. Quick-filter pills, Home/Sell/Import entry CTAs and icon-only buttons retain the same 44px interaction shell but paint a 40px surface through the shared 2px inset. This keeps touch geometry consistent without making every pill look as heavy as an input.

dn-compact-control owns 16px control typography, 20.8px line height and an 8px content gap. dn-entry-action additionally owns the 220px maximum width, 20px inline inset and 15px arrow icon. dn-quick-pill owns the 16px inline inset. Search fields use the stronger 18px entry role, 18px icons and the shared 12px entry-icon gap. Flex alignment centres the line box and icon; do not add component-specific pixel nudges.

## Expanded overlay control proportions

Mobile search and filter overlays use `--dn-overlay-control-height` at 44px through the default control token. Centered desktop overlays opt into `--dn-overlay-control-height-expanded` at 48px, while editor input fields remain 48px through `--dn-entry-height`. Field/action typography remains 18px and option/secondary-action typography remains 16px. Longer option labels may grow vertically; do not shrink their text to fit.

The home search dialog resets `--dn-entry-height` at its own boundary so its editable search field remains 48px; mobile filter rows and actions use the 44px overlay frame. Height and typography must be verified together. `scripts/overlay-proportions-smoke.mjs` checks the 44px mobile overlay controls, 48px editor fields and EN/BG text fit.

Overlay gutters, row gaps and row corners use `--dn-overlay-gutter`, `--dn-overlay-gap` and `--dn-overlay-row-radius`, each aliased to the existing foundation scale. Collapsed filters show concise unrestricted values; active values use ink emphasis and wrap without truncation.

### Owner-approved mobile listing title contract — 20 September 2026
Mobile listing cards retain their font sizes, use natural content rows with token-based gaps, and keep titles on one line with visual ellipsis. Full model text remains in the DOM/accessibility tree and detail destination. This supersedes the earlier two-line mobile-card assertion; desktop presentation is unchanged. Locale acceptance covers both languages and all eight retained cards.

## Shared icon-only controls and modal behavior

Use `dn-icon-button` from `base.css` for close, back and clear controls. It owns a token-derived 44px interaction shell with a 40px visible circle, non-shrinking SVG centering and an explicit native-appearance reset. `dn-compact-control` applies the same 44px shell and 40px visible pill to quick filters and Home, Sell and Import entry actions; `dn-entry-action` and `dn-quick-pill` select their shared width and padding roles. Components own contextual surface, ink, position and responsive visibility.

`src/lib/ui/focus.ts` owns modal Tab containment; `trapDialogTab` adapts native dialog events. Disabled, hidden, inert, negative-tabindex and child-dialog controls are excluded. Focus wrapping scrolls the active control into view; closing restores the opener without scrolling the underlying page. Scroll locks release only after their last owner, even when close and unmount both run.
