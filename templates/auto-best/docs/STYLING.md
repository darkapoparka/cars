# Styling and visual system

Auto Best combines an image-led automotive layout, Onest typography, rounded surfaces and direct call-to-action controls. This document describes the existing design and where its styling lives. It is not a proposal for a new theme.

## Desktop route composition

Home, Inventory, Blog and Contact use individual graphite campaign images through
`DesktopHeroScene.svelte`. The artwork shares subtle halftone dots and restrained
red accents, with vehicles or relevant service objects confined to the edges.
About retains its architectural photograph with a darker grade. White headings,
red primary actions and white search/category/location controls share one
treatment. Each scene is selected explicitly from `lead-site.ts`; Contact service
entries use the Contact artwork. All desktop
route heroes share a 540px frame: titles start at 200px, leaving 60px below the
desktop header, and primary controls start at 340px. Subtitle length does not move
either anchor. Home and Inventory use the same search-panel bounds, padding and
radius; Blog uses that same center lane. The artwork has identical framing
across routes, without additional desktop cutout pairs. Mobile Home
and service illustrations keep their existing composition and do not request
the desktop artwork. The desktop logo has a
fixed image box and flex alignment so decoding or route typography does not move
it within the shared header. White Blog category pills remain distinct from the
canvas; the active and hovered category uses the brand accent.

`HeroLocation.svelte` owns the white 14px location badge used below the Home and
About titles. `DesktopShowroom.svelte` owns the shared About/Contact visit panel:
address and appointment copy, one primary call action, directions, configured
social profiles, and the Google map. Its coordinates come from `brand.ts`.
The map mounts only at 992px and above; the external map link stays available
without JavaScript or when the provider is unavailable. Mobile uses its own
intro and contact cards. General Contact uses the compact desktop visit panel below
the complete hero, with a 32px gap. Its map area reserves both grid rows before
hydration so the external map link stays at the bottom while the iframe mounts.

`DesktopSocialLinks.svelte` renders the same 44px social controls in both company
heroes and visit panels. Hero controls sit 24px below the primary actions and use
a white keyboard focus ring against dark hero artwork. Visit panels use the
shared focus colour. Profiles come only from `brand.ts`.
Empty profile URLs omit the corresponding icon instead of creating dead links.
The existing mobile social layout remains separate.

Below 992px, About and general Contact use an overlay header on their dark hero,
with an inset white card overlapping the banner by 52px, as on Home. About uses
`EntryCard.svelte` for its only visible page heading, introduction, inventory
action and configured social profiles. Its compact mobile hero is a background;
the desktop hero copy stays in its separate layout. Contact groups its
phone and directions actions before address and visit details. Its actions stack
when their container is narrower than 18rem, including enlarged text. Blog's
header shares the yellow hero surface. `BlogHero.svelte` keeps its native GET
search field fully inside that hero, without a subtitle or an overlapping card.
Its mobile submit control has a 16px arrow and a 32px painted circle inside the
44px hit area. Search stays inline and preserves the query/category URL contract.
Its horizontally scrolling categories reuse the 44px target and 40px painted pill proportions;
the active mobile category uses ink. Desktop Blog controls retain their own
composition and accent selection.

About's mobile location section shows `ShowroomMap.svelte` directly below the
service cards. The card already provides the dealer, address and directions;
it omits the duplicate visit heading and address/appointment paragraph.
Its directions link flows after the address so enlarged text stays clear of it.

Desktop inventory cards keep the existing five-column wide grid and 16px gutters.
Model titles use one line with an ellipsis, while the heading tooltip, accessible
link label and detail page retain the complete vehicle title. Cards use 16px
content padding and a 12px title-to-specifications gap. Mobile retains its two-line
title and separate horizontal composition.

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
| `--dn-text-caption` | `0.75rem` | Compact mobile dock labels, inventory badges and video durations |
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

Use regular 400 for prose, the interpolated UI weight 450 where dense black interface text needs less visual harshness, medium 500 for navigation/actions and semibold 600 for headings and emphasis. Prominent full-width overlay actions use `--dn-cta-font` (18px/500 at the default root size); ordinary compact controls use `--dn-control-font` (16px/500). Both use 1.3 line-height. `--dn-tab-font` supplies quieter 16px/500 entry tabs. The shared `.dn-segmented-control` / `.dn-segmented-option` style owns Buy/Import, Sale/Trade-in and Link/Info controls: 44px touch targets inside a 44px shell, pill geometry, pale surface, white selected option and keyboard focus. On mobile, collapsed Home/Sell/Import entry triggers use the 52px prominent field role; their red entry CTAs retain the 44px interaction shell and compact-action typography. Single-line editor inputs use the same 44px field frame. Components retain their existing tab/group behavior.

`.dn-entry-field` and `.dn-entry-field__input` own the shared field surface, focus and `--dn-entry-font` (18px/400). Single-line editor inputs and overlay search fields use the 44px field frame. The mobile `.dn-entry-field--prominent` variant uses the shared 52px control role, a pale borderless surface and regular 16px/400 copy for Home/Sell/Import entry points. Prompts and icons use the muted text role; entered values use ink. Buy has one leading search glyph; entry fields have no trailing glyph. The whole entry opener retains its existing editor behavior. Home's native Import URL field uses the same variant with a leading listing glyph. Mobile overlay search uses the same pale surface and control radius through `dn-mobile-overlay-search`. The multiline modifier uses the control radius and may grow naturally. `ContactIntent` renders one secondary white phone button below the Sell/Import card, outside `.dn-contact-intent__main`, using the ordinary control type, pill radius and 44px action height. Enquiry components do not duplicate that entry call action.

Home, Sell and Import use `ui/entry/EntryCard.svelte`, `EntrySegments.svelte`, `EntryInput.svelte` and `EntryAction.svelte`. The card owns padding, spacing, border, radius and shadow; routes own placement and workflow content. Use these components instead of redefining controls in route CSS. Native inputs preserve validation, binding and focus. Sale starts with vehicle details and offers a listing/VIN alternative; Import accepts a listing link or search criteria. `EnquiryEntryField.svelte` remains the editor used by the legacy standalone enquiry presentation.

Shared entry segments fill the card content width. Each option has a 44px minimum hit target and a transparent 2px border insets the selected paint to 40px without increasing the shell height. Use short translated labels that stay on one line at 320px. The centered CTA uses `--dn-entry-action-width` (180px maximum), a 44px interaction target and a 40px painted pill. `--dn-entry-card-padding` and `--dn-entry-stack-gap` both reference the 16px spacing token.

Body copy is 16px with 1.5 leading; long editorial prose uses 1.65. Labels, supporting metadata and helper text use the 14px meta role. The compact five-item mobile dock and inventory badges use the 12px caption role. Nonessential video duration text may use the 12px caption role. Mobile section headings use 24px and service titles use 18px. Make controls and cards reflow around the type instead of adding smaller local overrides. Include `textarea` in native font inheritance.

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
| `--dn-control-height-editor` | aliases `--dn-control-height-default` (44px) |
| `--dn-content` | 1360px |
| `--dn-menu-content` | 1320px |
| `--dn-home-section-space` | 32px |
| `--dn-home-heading-banner-height` | 176px |
| `--dn-home-banner-overlap` | 24px |
| `--dn-mobile-nav-height` | 64px |
| `--dn-mobile-detail-bar-height` | 60px |

The shared spacing scale runs from 2px through 32px and supplies repeated relationships such as banner padding, overlap and control insets. It is not a mandate to tokenize every coordinate: artwork placement, local 14px card corners and one-off responsive geometry remain with their component owner.

The control family is rounded: pill actions, rounded input surfaces and compact circular icon buttons. Interaction size and painted size are separate. Entry tabs use a 44px shell with 44px touch targets; quick pills and compact entry CTAs use a 44px target with a 40px painted surface; standard search and single-line editor fields paint the full 44px field; prominent Home/Sell/Import entry fields use 52px. Full-width mobile overlay actions retain their deliberate 48–54px role, and option or overview rows use a 52px minimum where their two-column content needs more breathing room. The import link/criteria field is separate from its primary action. Multiline fields and wrapping options may grow naturally.

Inventory filter chips (including removable active filters), results filters/sorting, the header phone link and mobile footer contact links have a minimum 44px hit height. Keep vehicle-card dimensions and their 12px mobile inventory / 10px carousel gaps independent from control sizing. Metadata badges are labels inside the card link, not separate touch targets. Tablet service cards extend the action link over the card; verify the actual hit area before resizing its text. Vehicle-card keyboard focus uses the opaque `--dn-focus` color and an inset outline so the card's clipped corners do not hide it.

## Responsive composition

Mobile inventory uses a photograph matching the full height of the right column: a subtle 12px make, a 16px medium model capped at two lines, a plain 18px semibold price and four equal specification badges in a two-by-two grid. Each badge's text stays on one line. Shared flexible grid rows keep cards equally tall. The complete vehicle name remains in the accessible link label and title attribute. Keep the 12px gap between cards and the keyboard focus border visible around the whole card.

Keep `scrollbar-gutter: stable` on the root element. Classic desktop scrollbars otherwise change the available page and fixed-navigation width when moving between long pages (Home) and short pages (Sell/Import). Overlay scrollbars on touch devices retain their normal behavior.

| Range | Main behavior |
| --- | --- |
| Up to 767px | Mobile navigation, home service grid, compact search and bottom-sheet treatments |
| 768–991px | Intermediate layout; individual components retain their own arrangements |
| 992px and above | Desktop composition, section banners and desktop discovery controls |
| 1440px and above | Individual campaign artwork fills the shared hero frame |

Additional 359/374/380px and 1199px rules handle particular text, grid and control constraints. These are local breakpoints, not separate site themes. Safe-area insets supplement the fixed mobile navigation and sheet footers. The normal dock and vehicle-detail action bar are separate layouts with different height tokens.

The mobile dock is a flat white bar spanning the viewport. `BottomNavIcon.svelte` delegates to the mobile-only `MobileActionIcon.svelte` renderer for five official Hugeicons Stroke Rounded glyphs in a 24px frame with 1.8px rendered strokes; source and MIT license are recorded in [Hugeicons provenance](../provenance/hugeicons.md). All icons and captions share their baselines, including Sell. The active destination uses red icon/text with a transparent background; inactive items use ink. All normal phone widths, including 320px, show the same caption labels and destination order across Home, inventory, Sell and Import. Labels do not disappear after a timer. Only dock content widths of 15rem or less use accessible icons alone, supporting enlarged text. Labels use the compact caption role, with semibold on the active destination. Every link keeps at least a 44px target. The shared dock-height token also reserves page and overlay space; the vehicle-detail Call/Viewing action bar remains its contextual layout.

## Homepage patterns

**Hero and search.** The hero and its vehicle artwork remain separate from the search panel. Buy/Import tabs share the quieter pill-shaped segmented control with Sell/Import. Mobile entry fields use a pale borderless surface and regular text; primary actions remain red. Desktop discovery is its own presentation. The older charcoal-search token names do not mean the current entire search panel should be recolored charcoal.

**Mobile services.** The current preview has four illustrated cards in a 2-by-2 grid below search. Text sits above a centered lower image region. Inventory, sell, import and leasing each retain their own color and existing generated artwork. This is distinct from the wider desktop campaign pair.

**Section introductions.** Desktop inventory/body/brand/editorial sections use their existing branded heading banners attached to light content panels. Their heading/CTA and overlap rules are shared. Mobile uses compact headings appropriate to its denser layout rather than miniaturizing the full desktop banners.

**Body types and brands.** These use image-led grid tiles, live labels and expandable mobile discovery. Artwork bounds align the visible car or logo rather than the transparent image canvas. Labels are centered within the mobile cards. Body-type and brand components own their own header actions and expansion state; changing one should not implicitly replace the other.

**YouTube.** The mobile video section is a rounded black container with a simple YouTube title and image-led video items. Its outgoing channel link, thumbnails and click-to-play player come from different parts of the implementation.

## Inventory and vehicle cards

Mobile inventory starts with a rounded search field and compact filter/sort controls, followed by one horizontal quick-filter rail. Make and model stay together in that rail. Active chips expose removal; selectors retain a dropdown affordance. The filter sheet contains the deeper options.

Vehicle cards prioritize photograph, model and price. Desktop and carousel variants use a separate regular metadata make label and omit an exact repeated make prefix from the model; differently named model families retain their full title. Mobile inventory shows the complete vehicle title once, including its make. The whole card is one link. Desktop grids adapt through intermediate widths, with aligned specification and price rows. Shared card hover shadows stay shallow, and article/discovery focus indicators use the focus token.

## Detail, sell and import

Vehicle detail uses route-specific gallery, information tabs, price/contact actions and supporting finance/seller content. The current working preview includes image-generated financing and seller banners; the separate import explainer belongs to the import journey rather than the vehicle page. Their text is already part of the image: changing alt text does not change the displayed words. Use the approved image as an image, with its existing interactive wrapper.

Mobile Sell/trade-in and Import show their segmented choice and one summary field, matching Home's entry pattern. `ServiceEntryField.svelte` owns the full-screen white editor and its local draft; Save applies it, while Cancel/Escape discards changes and restores focus. Sell requires make/model or a listing/VIN; year and mileage are optional. Import's Find-a-car choice opens the make/model, budget, year and preferences editor immediately. The existing enquiry dialogs handle contact, photos and review after the entry is saved. Mobile editors and enquiry dialogs use the whole viewport without rounded sheet corners. Desktop keeps its inline form presentation.

Editor headers reuse `dn-mobile-overlay-header` and `dn-overlay-close`, matching Home's typography and spacing. Close-button hit areas come from `--dn-control-hit-height`; form and footer controls use existing editor/overlay height roles. Sell/Import banners size naturally to their text, CTA and padding, without a fixed or minimum height. Their content-width Call CTA follows the copy and shares Buy's compact typography, 40px painted surface and 44px interaction target. Artwork fits the resulting height; enlarged copy grows the banner naturally.

The four mobile Home action tiles use a title and smaller supporting line on solid blue, red, ice-blue and charcoal surfaces, with a shared 16px grid gap. Cars shows the actual record count, described as sample inventory until `template.verifiedInventory` is enabled. Sell, Import and Leasing use the existing localized service descriptions. Cars, Sell and Import retain their transparent vehicle artwork, including Import's ship and transporter. Leasing uses the car, euro coins and calculator foreground derived from the Cars App finance banner; [asset and prompt](../provenance/home-action-finance-v3.md) record its source. `homeActionArtwork` owns these choices independently of `mobileActionArtwork`, which remains in use by existing service/desktop compositions. A 128px minimum frame keeps the art clear of both text lines; enlarged text can reflow the grid to one column.

General Contact combines contact actions with a contained map section. About and editorial retain their own route composition. Detailed form controls are not a reason to add a second visual system to those pages.

## Artwork and icons

Stock images use photo framing; decorative cutouts use proportion-preserving containment. `VehicleCutout`, `HeroVehicles`, `ArtworkRegion` and `FeatureArtwork` interpret the data modules. A bounds tuple describes visible artwork; a crop tuple describes a viewport into a larger image. Their numeric meanings are documented in [Data](DATA.md).

`Icon.svelte`, `MobileNavIcon.svelte` and the service/social icon components are existing native SVG renderers. Reuse their names and visual weight for an established action. Adding an icon font or a second icon library is unnecessary for ordinary customization.

## Interaction styling

Existing focus rings, selected states and disabled states communicate different things. Hover effects should stay secondary to the static composition, and mobile scrolling should not rely on hover. Respect the existing reduced-motion media queries. Native modal placement, page scroll handling and the dock interaction need to be considered together when changing drawer styling.

For a visual adjustment, find the winning rule in the component/route/global cascade and edit that owner. Keep the current appearance for architecture-only changes. [Testing](TESTING.md) lists the representative viewports and interaction checks.

## Role-based mobile control contract

Mobile controls use shared size roles. Home quick links, inventory quick filters and Home/Sell/Import entry CTAs use a 44px interaction shell with a 40px painted surface, 16px control type and an 8px content gap. `dn-entry-action` additionally owns the 180px maximum width, 20px inline inset and 15px arrow icon. `dn-quick-pill` and inventory quick filters use the shared 16px inline inset. Inventory search uses the same 16px control typography and 40px paint within its 44px target; Home/Sell/Import entry openers use regular 16px copy in a 52px field, while editor fields retain their 18px entry role. Segmented options paint a 40px surface inside a 44px shell and use 16px tab type. Longer quick-filter rails scroll horizontally without shrinking their labels.

The mobile Home opener uses one 22px Hugeicons search glyph; overlay search fields retain 18px icons and the shared entry-icon gap. The mobile inventory opener also uses a 22px Hugeicons search glyph. Header location and phone glyphs use 22px within their retained 44px targets, keeping their visible size below the logo mark. Icon-only controls use a 44px target with a 40px painted circle, while each component chooses an icon size appropriate to its visual role. Grid/flex geometry centres icons; do not add device-specific translations or route-specific offsets.

Below 768px, Home/Sell/Import entry fields and overlay searches share a pale surface, no decorative border, the control corner radius and no shadow. `--dn-control-height-prominent` and the `--dn-entry-prominent-*` roles own the main entry geometry and regular text. Icons have no decorative circles. Inventory search, sort and filter controls use a 4px layout gap while retaining their 44px touch targets. Mobile focus uses the ink color; keyboard focus remains visible and pointer focus on the entry opener does not leave an outline. Interactive controls suppress the native tap highlight.

## Overlay control proportions

Home and listing overlay search fields match their opener role: 44px field, 18px type and no decorative border. Home overview rows are 52px with 16px labels, 14px values and 17px arrows. Home option cards are 52px with compact 14px copy and the approved dark selected state. Listing overview rows are 52px with 16px copy; the listing submit action is 54px. Nested picker choices are 52px, while Clear/Apply actions remain 48px. Single-line editor inputs are 44px.

These dimensions are semantic role tokens or deliberate component geometry; they are not a mandate to flatten all controls. Longer localized option labels may grow vertically instead of shrinking type. `scripts/overlay-proportions-smoke.mjs` verifies the role matrix in BG and EN at 320, 390 and 430px.

Overlay gutters, row gaps and row corners reuse the foundation spacing/radius system. Collapsed filters use concise unrestricted values such as “Всеки бюджет”, “Всеки пробег” and “Всяка година”; active values use ink emphasis and wrap without truncation.

### Mobile listing cards

Below 768px, the listing variant keeps a photograph in the left half, with 8px card padding and a 12px column gap. The photograph matches the full height of both rows beside the identity, plain price and four supporting badges in the right column. Badges use two rows of two, with each badge's text on one line. The manufacturer stays subtle at 12px/400, with a 16px/500 model and 18px/600 price. Model names stop at two lines; the complete title remains in the heading's title attribute and the card's accessible link label. Optional `Vehicle.cardBrand` supplies a sub-brand without changing inventory filtering by make. At card widths of 15rem or less, including enlarged text, the photograph returns to its natural 3:2 ratio, then details and badge grid stack in reading order. The mobile `sizes` hint follows the half-width frame. `ListingResults.svelte` keeps equal mobile card heights; `VehicleCard.svelte` owns the composition, preserving desktop/tablet variants. Mobile carousel fuel/transmission badges share one row. Offscreen photographs remain lazy. The quick-filter rail has 4px of space above and 8px below, independently of its 44px tap targets.

Badge columns and row heights are equal. Mobile mileage keeps every digit without grouping or a unit; automatic, electric and petrol/LPG use compact localized labels. Ellipsis contains unusually long badge values without a second text line. Full values and units remain in accessible text and title attributes.

The mobile inventory toolbar places Search, Sort and Filters in that DOM and visual order, with Filters at the far right. Sort and Filters reuse `dn-icon-button`: 44px interaction shells, 40px white painted circles and 20px icons. Focus uses `--dn-focus`; applied filters and non-default sorting use red icon emphasis. Search also paints inside a 44px shell. `ListingFilters.svelte` owns these controls and their existing dialogs.

## Shared icon-only controls and modal behavior

Use `dn-icon-button` from `base.css` for close, back and clear controls. It owns a token-derived 44px interaction shell with a 40px visible circle, non-shrinking SVG centering and an explicit native-appearance reset. `dn-compact-control` applies the same 44px shell and 40px visible pill to quick filters and Home, Sell and Import entry actions; `dn-entry-action` and `dn-quick-pill` select their shared width and padding roles. Components own contextual surface, ink, position and responsive visibility.

`src/lib/ui/focus.ts` owns modal Tab containment; `trapDialogTab` adapts native dialog events. Disabled, hidden, inert, negative-tabindex and child-dialog controls are excluded. Focus wrapping scrolls the active control into view; closing restores the opener without scrolling the underlying page. Scroll locks release only after their last owner, even when close and unmount both run.

Home’s View all action includes `listingVehicles.length` through the localized `home.viewAllCount` message. Mobile Sell and Import use a photo banner beneath the form with one telephone action. Reuse the Cars App exchange and collection artwork through `leadSite.artwork.serviceBanners`; the heading gets the full card width and can reflow with enlarged text. The existing bordered How it works disclosure remains on desktop.

Sell/Import mobile heroes reuse exactly the same central car crop from the Sell asset. A fixed 1:2:1 grid changes only the left/right service details. Do not switch the central car between separately generated scenes: even aligned frames contain different vehicle geometry. Home and service illustrations retain their shared centered frame. Verify with `scripts/hero-composition-smoke.mjs` at 320/390/430/1440px in EN/BG.

PDP mobile tabs use the same 44px control height and inset selection paint as entry segments, with compact three-option labels. The mobile finance trigger belongs inside the white information card below the active tab panel; desktop retains its sidebar calculator. Home and service hero artwork share one frame (56px top, 136px height); one shared car crop fixes the center and tyre baseline across service navigation.
