# Styling and visual system

Auto Best combines an image-led automotive layout, Inter typography, rounded surfaces and direct call-to-action controls. This document describes the existing design and where its styling lives. It is not a proposal for a new theme.

Overlay footer actions use the shared `dn-overlay-footer`/`dn-mobile-overlay-footer`
roles in `base.css`: by default 14px text, a 44px target and a 36px visible pill. Primary
actions follow the existing surface tokens and use intrinsic width; secondary
actions have a pale grey surface and muted text. Search editors retain 16px text
entry and their existing row sizing. Close controls keep their 44px targets.
The compact localized labels are Clear/Apply and Изчисти/Приложи; result actions
use Show (count)/Покажи (count). Home retains its Save (count) label.

The [7 October desktop search update](DESKTOP-MODEL-PICKER-2026-10-07.md) specifies a 720px Make logo grid, 640px Model panels, 480px companion panels, search in the header row and live Home counts from 992px.

At desktop widths, the vehicle detail preview uses a 16:10 frame. `VehiclePhoto.svelte`
opens the full, uncropped photograph in a native dialog with keyboard focus containment,
Escape/backdrop/close actions and focus restoration. Its image link also works without
JavaScript. The full-size photo mounts only while the viewer is open; mobile retains
its existing preview frame.

Desktop article cards use a 160px image, 16px content padding, category metadata,
a two-line summary and a localized reading action. Home's featured articles use
the same treatment. Each remains one complete link, including its reading action.
The Blog index uses four columns at 1360px and above, two at compact desktop
widths and one below 992px. Its grid follows the hero with the section's 32px
padding, without a second empty margin. Index image sizes match those columns;
Home's featured cards retain their existing grid and image sizing.
Vehicle prices, budgets, filter chips and finance controls share the locale policy's
currency formatter and symbol. EUR renders as `€` with the locale's number grouping.
Vehicle card labels allow a line break before a currency symbol or code while keeping
the grouped digits together, so enlarged mobile prices fit their cards.

## Desktop route composition

Home, Inventory and Advice frame their search panels with the original inward-facing
vehicle pairs through `CampaignVehiclePair.svelte`. `DesktopHeroScene.svelte`
reuses `leadSite.artwork.discoveryBackground` behind these three pairs and disables
their native dot and red-curve decoration through the existing `decoration` prop.
It uses the same graphite artwork as the four Home section headers from 992px.
About and Contact use the
approved larger car scenes through `DesktopHeroScene.svelte`, giving their simpler
introductions more presence. Blog keeps its original vehicle pair over the shared background. All use the same
black palette and subtle halftone dots. The About and Contact/service scenes omit
decorative red curves; their company page labels use plain text without a red dash.
The warm About photograph and
the distorted Blog/Contact props are retained as provenance only. White headings,
red primary actions and white search panels share one
treatment. Each scene is selected explicitly from `lead-site.ts`; Contact service
entries use the Contact scene. All desktop
route heroes share a 540px frame. Home, Inventory and Blog omit their supplementary
desktop line and position the title 28px above the unchanged search panel at 340px.
Below 1200px, those titles use the 32px compact section role to clear the side cars;
wider desktop uses the 48px hero role. Service introductions remain at 200px.
About and general
Contact start their page label at the same 200px anchor, followed by a stronger
two-line introduction. About keeps the complete introductory phrase on the first
line and the configured business name on the next; Bulgarian reads
“Запознайте се с” / “Auto Best”. Contact keeps its own natural phrase lengths;
the two headings do not need equal line widths. Their headlines use the 56px role,
or 48px below 1200px.
About keeps its plain location subtitle 8px below the title. Actions flow 24px
below the copy, followed by any configured social profiles. The shared frame
stays 540px with the default content; enlarged type or longer business names can
increase its height so content and actions remain readable. Enlarged type also
increases the company introduction's clearance below the header.
Home retains the shared hero anchor and center lane, with a single white,
rounded browsing bar through `HomeBrowseBox.svelte` from 768px. Make, Model,
Body style and Budget share one white surface with subtle vertical dividers,
a small permanent label, a 17px value and a 56px circular search action.
Rounded pale field surfaces appear on hover, keyboard focus or while open;
adjacent dividers recede in those states. Each complete field opens its own Bits UI selector,
reusing `ListingFacetEditor.svelte` with its `desktopChoices` presentation and
the existing listing draft transitions. Desktop choices use the same round
`DesktopFilterChoice.svelte` rows as Inventory; mobile retains its own rows.
Save commits a field locally; Escape, Close and outside dismissal discard its
draft. Search sends saved criteria to `/listing-grid` through native GET.
Budget supports exact amounts and rejects reversed ranges. The seven Home
facet shortcuts have been removed. Three inventory-backed budget links sit
20px below the desktop bar, centered with transparent pill surfaces, subtle
outlines and light text. They reuse `listingBudgetCaps()`, the localized budget
labels and native `/listing-grid?price_max=…` links used on mobile. Their shared
44px hit areas keep a 40px painted outline; hover adds a faint light fill and
keyboard focus has a visible white ring. The 320/390px mobile entry retains its existing
Buy/Import tabs, search and shortcuts. Inventory retains its separate search
panel and seven shortcuts. Desktop facets retain the 44px control target and
shared prominent-control type.
Home's desktop G-Class/Urus pair uses equal painted heights and a shared tyre
baseline while preserving each cutout's proportions. From 1200px, their inward
noses leave the same 24px clearance beside the search bar; the compact laptop
composition remains above the controls. `Hero.svelte` owns these Home-only
overrides; other campaign scenes retain area normalization.
Inventory's seven desktop shortcuts open anchored, field-specific menus through
`DesktopVehicleSearch.svelte` at 992px and above. Make and Model open their searchable
native checkbox choices immediately; Type and Body open short radio lists; Budget,
Year and Mileage open their number inputs. The 380px menu uses a 16px title,
44px option targets and a fixed compact footer, with 16px viewport clearance.
Bits UI owns placement and collision handling. Short windows use a side placement;
an off-screen anchor dismisses the menu and releases its focus scope.
`DesktopFilterChoice.svelte` owns white option rows with 12px hover corners,
dark copy and a left-aligned 20px circular indicator. Checkbox choices retain
native multiselect semantics and a checkmark; radio choices retain a dot.
Search and numeric inputs use white surfaces and the shared control radius; range presets wrap as outlined pills
and use a pale surface with an emphasized border when selected. Radio dots and
checkbox marks use black; Apply uses the existing ink/white
roles shared by the full filter form. Home and listing native search actions and
hero/sticky search actions use the same black treatment at 992px and above.
The portal mounts in `.dn-app-shell` to retain the existing theme context.
Quick menus keep the page visible and scrollable. Full filters and native search
use a lighter backdrop without blur.
The shortcut surfaces share Home's pale background, border, control radius and
17px role through `VehicleDiscoveryForm.svelte`; both use a downward chevron.
Applied values retain their field name in the accessible label and ranges show
both endpoints through the shared summary helper.

Listing search and the dedicated listing Filters action share
`VehicleSearchDialog.svelte` as their full desktop form. Its soft grey fields,
keyword pill and filled equipment section are retained. The 13 criteria stay in
one visible grid: four columns on desktop, two below 992px. The form uses the
existing 1200px maximum width, 24px viewport clearance, a scrolling content area
and a footer outside that scroll area. Native selects retain scalar and range
presets. Make/model use searchable checkbox popovers, with the same 44px control
height and label baseline as the native fields. Equipment retains its pale group
and white option surfaces; shared circular checkbox marks preserve multiselect.
The separate Main/More/Extras desktop workspace has been removed.

The keyword opener focuses search. Listing Filters focuses its heading and uses
that same form, while each hero shortcut still opens its own anchored selector.
Current values outside the sample catalog remain selectable, including exact
numeric criteria from the URL. Clearing changes the local draft, retains sort
order and keeps the form open; Apply performs the existing GET navigation.
Escape, Close and backdrop dismissal discard the local draft and restore the
opener's focus and page scroll. Reversed price/year ranges cannot be submitted.
A valid empty result can be applied and displayed by the existing results page.

Make changes clear only incompatible models. Shared model transitions and the
suggestion matcher in `listing-draft.ts` normalize suggestion queries without
changing the vehicle keyword. Both the full form and direct menus keep repeated
make/model values and canonical equipment names in GET data. Native dialog focus
containment owns the full form; Bits UI owns compact popover placement, nested
picker focus and collision handling. The pinned typography and icon families
remain unchanged.
Blog uses that same center lane with one white panel containing the
search field, red submit action and category pills. The artwork has identical framing
across routes. `getVehicleArtworkRatios` in `vehicle-artwork.ts` normalizes desktop
cutouts by the area of their visible alpha bounds. Hero pairs, section banners,
Home action banners and vehicle menu cards share this rule, with a frame size for
each placement and no model-specific scale boosts. Taller bodies remain taller
and shorter in length without stretching. Tyre baselines and front-edge anchors
remain aligned; the cars stay at the outer edges, leaving the copy and controls clear.
Home's Import banner uses the brand red surface and Leasing uses graphite, with
matching white copy and white actions. `leadSite.artwork.desktopActionScenes`
selects their separate transparent, front-facing G-Class/logistics and Urus/finance
compositions. The optional `normalizationBounds` in `getVehicleArtworkRatios`
sizes the main vehicles by equal visible area while the full composition bounds
anchor their supporting props. This avoids making the car smaller because a ship
or percentage symbol widens the image. Their 234px frames and copy/action
baselines remain shared. Desktop picture sources keep these assets out of mobile
requests; existing mobile action and service artwork remains configured separately.
Below 1200px, search-hero cutouts sit above the panel's outer corners so the wider
panel does not hide them. Home, Inventory and Blog share this placement;
section banners keep their smaller frame.
The Home inventory and editorial heading banners reuse the same cutout renderer
in its smaller section frame. Mobile Home
and service illustrations keep their existing composition and do not request
the desktop artwork. The desktop logo has a
fixed image box and flex alignment so decoding or route typography does not move
it within the shared header. Blog category pills use the subtle surface inside
the white panel; the active and hovered category uses the brand accent.

`HeroLocation.svelte` owns About's plain 18px location subtitle below its title,
with the configured city and street address, a localized directions label and
full address hover title. Home omits its desktop location line; the header keeps
the business address available. General
Contact also shows the localized city and street address below its hero title.
`DesktopShowroom.svelte`
owns the shared About/Contact visit panel:
the street address, one primary call action, directions, configured
social profiles, and the Google map. Its coordinates come from `brand.ts`.
The map mounts only at 992px and above; the external map link stays available
without JavaScript or when the provider is unavailable. Mobile uses its own
intro and contact cards. General Contact places the desktop visit panel below
the complete hero, with a 32px gap. About and Contact share one white panel with
32px padding and a compact header above one full-width, inset map. The visit title
and address sit on the left without an appointment sentence; Call and
Directions sit side by side on the right. The header wraps into two rows when
enlarged text needs more room. The address label remains available to screen
readers without repeating it visually. The map reserves 300px before hydration,
includes the provider's fullscreen permission and has a plain address fallback
without JavaScript. Directions remains available in the header; there is no
duplicate map action row underneath the iframe.

About's service panel uses the configured transparent light-surface logo above
its introduction and service cards on desktop. The image replaces the visible
business-name heading while retaining its accessible heading name. Its bounded
220px by 58px image box preserves the logo's proportions without a decorative
background. The desktop service cards use white surfaces and the shared soft
card shadow, matching the article cards' separation from their white panel.
Hovering anywhere over a desktop service card also fills its action red;
keyboard focus uses the same action state. Both states use the stronger shared
shadow. Mobile retains its existing service composition.

`DesktopSocialLinks.svelte` renders the same 44px social controls in both company
heroes and About's visit panel. General Contact uses its dedicated profile cards
below the visit panel. Hero controls sit 24px below the primary actions and use
a white keyboard focus ring against dark hero artwork. Visit panels use the
shared focus colour. Profiles come only from `brand.ts`.
Empty profile URLs omit the corresponding icon instead of creating dead links.
The existing mobile social layout remains separate.

General Contact places `ContactSocialChannels.svelte` directly below its desktop
visit panel, using the same content width, white surface and 20px corner radius.
The panel has 32px padding and a 32px gap above it. Its title sits above a centered
row of profile cards with a pale surface, 1px border, 16px radius and 24px padding.
Cards share the row evenly up to 400px each, with 16px gaps. Their 52px round brand
icons sit above platform names and sample labels. Preview-only missing URLs are
noninteractive samples; published pages omit
missing profiles. The shared footer suppresses its desktop service strip on this
route. Contact owns the social panel in its page content.

Desktop navigation runs Home, Inventory, Guides, About, Contact through the
`desktopNavigation` export. Its DOM and keyboard order agree; other menus use
their existing content order.

`Header.svelte` keeps a dropdown open while one of its links has keyboard focus,
even when the pointer leaves. Escape closes it and restores the trigger; moving
focus outside dismisses it. At compact container widths, navigation can wrap
between the logo and action columns. Feature titles use the control leading
role, and long titles/sidebar labels can wrap with enlarged text. When enlarged
text leaves insufficient room for three feature cards or two link groups,
their container queries reflow the cards into two columns with a full-width
last card and the link groups into one column.
`LocaleSettingsMenu.svelte` also dismisses when focus leaves its controls.

At 992px and above, the filter dialog's search field uses the 52px minimum
prominent role with an inset charcoal submit button using the 40px compact
minimum. Both can grow with enlarged text. The button has the same vertical
clearance above and below and sits close to the field's right edge; its label,
live count and arrow retain their existing alignment and submission behavior.

Below 992px, About and general Contact use an overlay header on their dark hero,
with an inset white card overlapping the banner by 52px, as on Home. About uses
`EntryCard.svelte` for its only visible page heading, a service-section shortcut,
inventory action and configured social profiles. The service link uses Home's
pale entry-field treatment and a downward arrow; it scrolls to the four existing
service cards. Phone and location remain in the header and contact/map sections.
Empty profile URLs omit the corresponding social icon.
Its hero reuses the configured dark showroom illustration. Below 768px, a 244px
banner places the card at Home's 192px anchor, with the artwork capped at 320px
to keep the showroom visible above it. At 768–991px the banner follows the image's
natural height. The artwork is requested only below 992px; the desktop hero
copy stays in its separate layout. Service cards align their icon and title in
one row, then give the description the full width below that row. Contact groups its
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
service cards, without a duplicate visit heading. The shared About, Contact and
vehicle-page map embeds Google Maps using `brand.showroomCoordinates` and the
current locale. It mounts within 240px of the viewport, leaving hidden company
maps unloaded on desktop. A 280px map area keeps the page stable while loading;
the plain address fallback can grow with enlarged text. The directions action
stays below the map and opens the same coordinates in Google Maps, including
without JavaScript. Mobile uses the existing official Hugeicons arrow.
General Contact groups its visit heading, address and appointment text above the
map inside one white card below 992px. The outer card owns the border and rounded
corners; the embedded map has a straight top edge beneath the visit details.

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

Shared `tokens.css` registers the pinned local Inter v4.1 WOFF2. `--dn-font` is `Inter Variable`, followed by Segoe UI, Arial and sans-serif. Vite bundles the reviewed Latin/Cyrillic subset with a content hash. Both weight and optical-size axes and all OpenType layout features are retained, without an external font service. Body/entry roles use 450, controls 500 and headings/prices 600; existing 400-weight metadata remains quieter. Required Bulgarian characters include Ѝ/ѝ, although the file has no dedicated Bulgarian alternates. Keep real BG/EN language tags and [font provenance/license](../provenance/inter.md).

Desktop discovery values use the 17px prominent-control role at 992px and above, retaining 44px targets and space for the native select arrow. They do not grow to the 20px card-heading role on wider screens.

Mobile card prices use the 1.3 control line height, including the 20px Home price role, so glyph metrics fit at 200% text size.

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

Body and entry roles use the interpolated weight 450, navigation/actions use medium 500 and headings use semibold 600. `--dn-field-font` owns ordinary filter values and options (16px/450); `--dn-field-label-font` owns their supporting labels (14px/450). Home's bar keeps its 17px value role and uses the same 14px label role. Mobile Home and inventory overview rows keep labels and summaries at 16px/450, with muted color distinguishing the summary. `DesktopFilterChoice.svelte` and `ListingFacetEditor.svelte` share the field role for options and numeric values. Numeric placeholders inherit the input size and weight; range presets and compact Apply/Clear actions use the 16px/500 control role. Prominent full-width overlay actions use `--dn-cta-font` (18px/500 at the default root size); ordinary compact controls use `--dn-control-font` (16px/500). Both use 1.3 line-height. `--dn-tab-font` supplies 16px/500 entry tabs. The shared `.dn-segmented-control` / `.dn-segmented-option` style owns Buy/Import, Sale/Trade-in and Link/Info controls: 44px touch targets inside a 44px shell, pill geometry, pale surface, white selected option and keyboard focus. On mobile, collapsed Home/Sell/Import entry triggers use the prominent field role; their red entry CTAs retain the 44px interaction shell and compact-action typography. Single-line editor inputs use the same 44px field frame. Components retain their existing tab/group behavior.

`.dn-entry-field` and `.dn-entry-field__input` own the shared field surface, focus and `--dn-entry-font` (18px/450). The full desktop filter form deliberately keeps this larger entry role; supporting labels inherit the shared label role without a local weight override. Single-line editor inputs and overlay search fields use the 44px field frame. The mobile `.dn-entry-field--prominent` variant uses the shared prominent control role, a pale borderless surface and the same entry typography for Home/Sell/Import entry points. Prompts and icons use the muted text role; entered values use ink. Buy has one leading search glyph; entry fields have no trailing glyph. The whole entry opener retains its existing editor behavior. Home's native Import URL field uses the same variant with a leading listing glyph. Mobile overlay search uses the same pale surface and pill radius through `dn-mobile-overlay-search`. The multiline modifier uses the control radius and may grow naturally. `ContactIntent` renders one secondary white phone button below the Sell/Import card, outside `.dn-contact-intent__main`, using the ordinary control type, pill radius and 44px action height. Enquiry components do not duplicate that entry call action.

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
| `--dn-radius-sheet` | 24px, sheet corners |
| `--dn-radius-mobile-card` | 12px |
| `--dn-radius-card` | 16px on desktop; follows `--dn-radius-mobile-card` below 768px |
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

The shared spacing scale runs from 2px through 32px and supplies repeated relationships such as banner padding, overlap and control insets. Corner declarations use radius tokens, including intentional desktop geometry and one-pixel border insets; spacing tokens must never supply a radius. Below 768px, content, service, entry, discovery and showroom card roles all resolve to the shared 12px mobile card radius, matching the All services banner. Inputs retain their control or pill role, small media their media role, and bottom sheets their 24px top corners. Desktop and tablet card roles preserve their reviewed values. `check:tokens` rejects raw corner values and spacing-token misuse. The mobile root uses `scrollbar-gutter: auto` to avoid reserving a classic-scrollbar strip beside full-width cards and dialogs; desktop retains its stable gutter.

Outer card containers use `--dn-radius-card` or their semantic card-family role. The mobile shell redirects those roles to `--dn-radius-mobile-card`, making that token the single size control for mobile cards. Its current default is 12px; [the applied 12px result](mobile-card-radius-12-2026-10-09/README.md) records the rendered result and preserved desktop sizes. Mobile vehicle facts retain 6px corners and inset car photographs retain 10px corners. Header/dock shapes, controls and drawer corners use their separate roles. Card media with a one-pixel border inset follow the outer card through `--dn-radius-card-inset`. Banner-picker tiles, selected-vehicle summaries, enquiry reviews, completion and feedback panels also use the mobile card role. Inset Contact, upload and review vehicle photos use the 10px `--dn-radius-sm` role below 768px; their existing desktop radii are retained. The [final whole-template rounding audit](mobile-radius-final-audit-2026-10-09/README.md) records the missed states, matched screenshots and desktop comparisons.

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
| 1440px and above | Full-width hero artwork keeps the shared center lane clear |

Additional 359/374/380px and 1199px rules handle particular text, grid and control constraints. These are local breakpoints, not separate site themes. Safe-area insets supplement the fixed mobile navigation and sheet footers. The normal dock and vehicle-detail action bar are separate layouts with different height tokens.

The mobile dock is a flat white bar spanning the viewport. `BottomNavIcon.svelte` delegates to `MobileActionIcon.svelte`, sharing the pinned [Fluent Regular SVGs](../provenance/fluent-icons.md) with header, menu and other mobile actions. Use the official native 24px geometry without added strokes or stretched glyphs. Active and inactive destinations retain the same Regular geometry; `currentColor` supplies the selected and muted colors. The rejected generated trial remains in [historical provenance](../provenance/generated-bottom-nav.md). All icons and captions share their baselines, including Sell. Each glyph sits in a 40px by 28px pill frame; the active destination paints only this frame with the neutral selection surface and uses charcoal icon/text. Inactive items use the muted text token. All normal phone widths, including 320px, show the same caption labels and destination order across Home, inventory, Sell and Import. Labels do not disappear after a timer. Only dock content widths of 15rem or less use accessible icons alone, supporting enlarged text. Labels use the compact caption role, with semibold on the active destination. Every link keeps at least a 44px target. The shared dock-height token also reserves page and overlay space; the vehicle-detail Call/Viewing action bar remains its contextual layout.

The mobile menu uses plain navigation rows on white, with the neutral selection surface and charcoal text on the current destination, including general Contact. Mobile selected-state surfaces and borders use neutral tokens below 992px. Its Call action is primary and its address shortcut uses the pale secondary surface. The vehicle-detail bar follows the same priority: red Call and pale Viewing. Both reuse the shared compact-control role, with a 44px target and 40px paint at normal text size, and allow enlarged labels to wrap. Menu triggers announce a dialog, and Escape restores focus to the opener. Advice keeps its image-free mobile list cards; their shared 12px corners, faint border and subtle shadow reuse the shared white-card treatment.

Visible mobile overlay titles use the 1.3 control leading role so enlarged glyphs fit inside their heading box while preserving room for the close button. Inventory uses the concise localized Filters title below 768px, while desktop retains Car search. Escape closes advice search immediately, including when its search field contains a query, and restores focus to its opener. Sell/Import mobile entry grids allow their single column to shrink within the card, including at 200% text size in WebKit.

Below 768px, `ListingFacetEditor.svelte` provides the choices shared by quick
pickers and full inventory filters. Plain white rows retain 48px targets; the
selected row uses a pale surface and a small black selection indicator.
Radios retain a 20px frame, thin outline and centered 8px dot. Brand, model and
equipment multiselects use circular 20px frames with a white checkmark when
selected. The mobile `dn-mobile-filter-check` rule in `base.css` also owns Home's
brand/model marks. Home centers the option label beside that shared mark and
keeps its existing two-column choices, without local sizing or corner overrides.
Native checkbox behavior and whole-row targets are retained;
forced-colors mode uses native controls. Focus outlines and wrapping labels
survive enlarged text. Home's option cards retain their selected surface/ink roles.
Compare the [square marks](filter-round-controls-2026-10-06/before-brands-390.png)
with the [circular marks](filter-round-controls-2026-10-06/after-brands-390.png).

Matched 320px captures compare the [grey selected row](mobile-selection-2026-10-04/before-bg-320.jpg) with the [black selected row](mobile-selection-2026-10-04/after-bg-320.jpg).

## Homepage patterns

**Hero and search.** The hero and its vehicle artwork remain separate from the search panel. Buy/Import tabs share the quieter pill-shaped segmented control with Sell/Import. Mobile entry fields use a pale borderless surface and regular text. Home's browse and Import entry actions use charcoal with white text; its quick pills remain white. Call actions retain the red accent. Desktop discovery is its own presentation. The older charcoal-search token names do not mean the current entire search panel should be recolored charcoal.

Desktop Inventory shortcuts open an anchored 380px menu for their own field.
`ListingChoicePicker.svelte` owns every dropdown in the shared full desktop form,
the reusable inline discovery fields and desktop sorting. `listing-draft.ts`
maps URL field names to draft values and supplies localized options, including
exact applied values outside the preset catalog. `DesktopFilterChoice.svelte`
supplies circular radio/checkbox marks; native inputs remain available in
forced-colors mode. All form triggers retain their soft-grey 44px frames,
aligned labels and the existing equipment group. Menus have white search fields
where useful and independently scrolling options. Brand/model menus stay open
for multiselect. Radio arrows browse; click, Enter or Space commits. Escape
closes the nested menu first and restores focus to its field. The outer draft
changes the URL only on Apply; cancelling restores the applied filters.
Sorting submits only a confirmed choice and retains the applied filters.
`FilterPopoverHeader.svelte` supplies a shared 52px header with a plain 18px
close glyph inside a transparent 44px target. `ui/focus.ts` supplies the opening
focus rule: pointer opening focuses the menu container, while keyboard opening
enters search, the first range input or the checked option. The listing keyword
action still focuses search directly. Selected presets scroll into view without
moving the page. Nested popovers own Tab navigation while the outer native
dialog's containment is suspended for that child. Compare the [previous quick menu](dropdown-polish-2026-10-07/before-make-1440.png)
with its [compact header and neutral opening](dropdown-polish-2026-10-07/after-make-1440.png).
Mobile keeps its separate picker composition. Budget values use the configured
currency and locale number formatting. Compare the [native Type field](styled-filter-selectors-2026-10-06/before-type-1440.png)
with its [shared styled menu](styled-filter-selectors-2026-10-06/after-type-1440.png).

**Mobile services.** The current preview has four illustrated cards in a 2-by-2 grid below search. Text sits above a centered lower image region. Inventory, sell, import and leasing each retain their own color and existing generated artwork. This is distinct from the wider desktop campaign pair.

**Section introductions.** Desktop inventory/body/brand/editorial sections share
one graphite background with fine dots fading toward a quiet center and soft
edge lighting. `leadSite.artwork.discoveryBackground` owns its single WebP URL.
The Home route applies it at the same scale and position from 992px, with a
centered white heading and white action; mobile does not request it. The cards
below supply the imagery. [Shared background and exact prompt](../provenance/home-shared-background-2026-10-03.json)
record its generation and delivery. The [original backgrounds](../provenance/home-section-backgrounds-2026-10-02.json)
and [Featured texture](../provenance/home-inventory-texture-2026-10-03.json)
remain archived without runtime requests.
All content sections use the shared 32px section padding, giving adjacent panels
the same 64px gap. The white content panel overlaps its 164px banner by 24px,
with rounded upper corners forming an inward curve at the join. Heading and
action are centered within the visible banner above that overlap, with equal
clearance above and below. The optional video section uses the same banner
geometry. Mobile retains its compact section headings.

Home groups curated previews inside these panels. Inventory and Blog put their
full result grids directly on the shared grey canvas, with controls in their
own panel. These are complementary compositions using the same palette,
typography, card surfaces, corner radii and spacing scale.

**Body types and brands.** These use image-led grid tiles, live labels and expandable mobile discovery. Artwork bounds align the visible car or logo rather than the transparent image canvas. Labels are centered within the mobile cards. Body-type and brand components own their own header actions and expansion state; changing one should not implicitly replace the other.

**YouTube.** The mobile video section is a rounded black container with a simple YouTube title and image-led video items. Its outgoing channel link, thumbnails and click-to-play player come from different parts of the implementation.

## Article cards

Article titles use their natural height without reserving empty lines. Blog's
curated order puts the four longer headlines first, then the shorter headlines,
with "How to choose a car" starting the short-title row. Four columns start at
1360px, giving the short titles enough width for one line in Bulgarian and
English. Smaller desktops use two columns. Titles can grow with enlarged text;
mobile cards retain their existing presentation.

The default twelve guides fill three rows of four on wide desktops. They share
one index with search and category filters; pagination is unnecessary at this
size. Every card links to its complete localized guide.

## Footer service strip

On desktop, the four existing service shortcuts sit inside one white rounded
panel with a centered "Next steps" heading. The inner cards use white surfaces,
the shared soft card shadow and the existing red icons. Hover and keyboard
focus use the stronger shared shadow. Four columns start at 1360px; smaller
desktops use two columns to leave enough room for the labels. Destinations,
route-specific visibility and the tablet/mobile presentation are preserved.

## Inventory and vehicle cards

Mobile inventory starts with a rounded search field and compact filter/sort controls, followed by one horizontal quick-filter rail. Make and model stay together in that rail. Active chips expose removal; selectors retain a dropdown affordance. The filter sheet contains the deeper options.

Vehicle cards prioritize photograph, model and price. Desktop and carousel variants use a separate regular metadata make label and omit an exact repeated make prefix from the model; differently named model families retain their full title. Mobile inventory shows the complete vehicle title once, including its make. The whole card is one link. Desktop grids adapt through intermediate widths, with aligned specification and price rows. Shared card hover shadows stay shallow, and article/discovery focus indicators use the focus token.

## Detail, sell and import

Vehicle detail uses route-specific gallery, information tabs, price/contact actions and supporting finance/seller content. The current working preview includes image-generated financing and seller banners; the separate import explainer belongs to the import journey rather than the vehicle page. Their text is already part of the image: changing alt text does not change the displayed words. Use the approved image as an image, with its existing interactive wrapper.

Mobile Sell/trade-in and Import show their segmented choice and one summary field, matching Home's entry pattern. `ServiceEntryField.svelte` owns the full-screen white editor and its local draft; Save applies it, while Cancel/Escape discards changes and restores focus. Sell requires make/model or a listing/VIN; year and mileage are optional. Import's Find-a-car choice opens the make/model, budget, year and preferences editor immediately. The existing enquiry dialogs handle contact, photos and review after the entry is saved. Mobile editors and enquiry dialogs use the whole viewport without rounded sheet corners. Desktop keeps its inline form presentation.

Editor headers reuse `dn-mobile-overlay-header` and `dn-overlay-close`, matching Home's typography and spacing. Close-button hit areas come from `--dn-control-hit-height`; form and footer controls use existing editor/overlay height roles. Sell/Import banners size naturally to their text, CTA and padding, without a fixed or minimum height. Their content-width Call CTA follows the copy and shares Buy's compact typography, 40px painted surface and 44px interaction target. Artwork fits the resulting height; enlarged copy grows the banner naturally.

The four mobile Home action tiles use white surfaces, 12px outer corners and a shared 16px grid gap. Each has an 88px artwork frame with 8px corners, followed by a left-aligned title and smaller supporting line. The artwork uses the available frame width without inset padding, with an 80px maximum visible height; copy baselines align across all four cards. Cars shows the actual record count, described as sample inventory until `template.verifiedInventory` is enabled. Import uses the concise localized supporting line “По заявка” / “On request”; Sell and Leasing retain their existing descriptions. Cars uses a matching silver estate/SUV pair. Sell, Import and Finance share the bright silver estate used in the approved services overview, with graphite props and restrained red details. The [shared asset record and prompts](../provenance/silver-service-system-2026-10-04.md) document their source and crops. `homeActionArtwork` and `mobileActionArtwork` reference the same measured `serviceIllustrationArtwork` entries. `MobileCoreActions.svelte` owns the cards' border, corners and shadow; the Home route uses the same shared 12px card radius for vehicle, body-type, brand, article and browse cards as the services overview. Enlarged text can reflow the action grid to one column.

Below brand discovery, `MobileServicesOverview.svelte` adds one white service-overview card with the localized title “Нашите услуги” / “Our services”, concise supporting text and a compact dark action with white text beside the matching silver car-and-showroom cutout. An intrinsic 8rem artwork column keeps the illustration the same size across normal phone widths; the copy uses the remaining space. At a container width of 20rem or less, the title and supporting line use the existing body/caption roles and the visual action reads “Виж всички” / “View all” beside the pinned Fluent arrow, including at 320px. The label stays on one line and reuses the existing enlarged-text reflow. The visual action has a 40px frame, 28px painted surface, the shared fully rounded pill shape and medium-weight text; its padding/inset use the existing shared tokens scoped to this card, while its radius inherits the shared button token. The entire card is the generously sized single link to the localized About `#process` section, with no nested interactive control. The supporting line “За вашата кола” / “For your car” stays on one line at normal 280–430px phone widths. Shared spacing, corner, surface, shadow and typography tokens preserve the card's natural height and artwork aspect ratio. The font-relative 14rem container query allows enlarged text to stack while ordinary narrow screens retain side-by-side copy and artwork. It is hidden at 768px and above; the desktop Home composition is preserved. The decorative image loads lazily. Services and Home advice actions keep about 15–16px of visible space below their painted pills; the advice card outer frame and action inset already contribute 12px of that spacing. The [matched mobile card-action comparison](mobile-card-actions-spacing-2026-10-09/README.md) records the shorter cards and unchanged desktop composition. The final copy uses “Нашите услуги”, “За вашата кола” and “Виж всички”; [the final comparison](mobile-card-finish-2026-10-09/README.md) also records the shared 20px mobile card price role.

The reusable silver service family is configured once in `leadSite.artwork.serviceIllustrations`. About cards, desktop menus, desktop Home actions, mobile shortcuts and call banners resolve to that registry. Artwork dimensions and crops belong in `serviceIllustrationArtwork`; do not restore separate darker car variants per placement. Hero artwork remains independently owned by `leadSite.artwork.mobileHero` and `vehicle-artwork.ts`: Home keeps its original front-facing pair, and Sell/Import share their original front-facing car with the existing crops and side props. Service-card artwork changes do not authorize hero changes. Inventory photographs and editorial photography retain their content identities.

General Contact combines contact actions with a contained map section. About and editorial retain their own route composition. Detailed form controls are not a reason to add a second visual system to those pages.

## Artwork and icons

Stock images use photo framing; decorative cutouts use proportion-preserving containment. `VehicleCutout`, `HeroVehicles`, `ArtworkRegion` and `FeatureArtwork` interpret the data modules. A bounds tuple describes visible artwork; a crop tuple describes a viewport into a larger image. Their numeric meanings are documented in [Data](DATA.md).

`Icon.svelte`, `MobileActionIcon.svelte` and the service/social icon components are existing native SVG renderers. Mobile actions and `BottomNavIcon.svelte` share the pinned Fluent Regular family. Reuse the existing names and visual weight for an established action. Adding an icon font or a second icon library is unnecessary for ordinary customization.

## Interaction styling

Existing focus rings, selected states and disabled states communicate different things. Hover effects should stay secondary to the static composition, and mobile scrolling should not rely on hover. Respect the existing reduced-motion media queries. Native modal placement, page scroll handling and the dock interaction need to be considered together when changing drawer styling.

For a visual adjustment, find the winning rule in the component/route/global cascade and edit that owner. Keep the current appearance for architecture-only changes. [Testing](TESTING.md) lists the representative viewports and interaction checks.

## Role-based mobile control contract

Mobile controls use shared size roles. Home quick links, inventory quick filters and Home/Sell/Import entry CTAs use a 44px interaction shell with a 40px painted surface, 16px control type and an 8px content gap. `dn-entry-action` additionally owns the 180px maximum width, 20px inline inset and 15px arrow icon. `dn-quick-pill` and inventory quick filters use the shared 16px inline inset. Inventory search uses the same 16px control typography and 40px paint within its 44px target; Home/Sell/Import entry openers use regular 16px copy in a 52px field, while mobile overlay editor fields use the 48px field role with 16px type. Segmented options paint a 40px surface inside a 44px shell and use 16px tab type. Longer quick-filter rails scroll horizontally without shrinking their labels.

The mobile Home and inventory openers use one 22px Fluent Regular search glyph; overlay search fields retain 18px icons and the shared entry-icon gap. Header location and phone glyphs use 22px frames inside subtle 40px circles and their retained 44px targets. Header and other mobile phone actions use the official Call Regular handset. All of these glyphs use the pinned native SVG geometry with `currentColor` and no added stroke. The circles inherit the icon color for consistent contrast on light, red and dark heroes. Icon-only controls use a 44px target with a 40px painted circle, while each component chooses an icon size appropriate to its visual role. Grid/flex geometry centres icons; do not add device-specific translations or route-specific offsets.

Below 768px, Home/Sell/Import entry fields and overlay searches share a pale surface, no decorative border, the control corner radius and no shadow. `--dn-control-height-prominent` and the `--dn-entry-prominent-*` roles own the main entry geometry and regular text. Entry-field icons have no decorative circles. Inventory search, sort and filter controls use a 4px layout gap while retaining their 44px touch targets. Mobile focus uses the ink color; keyboard focus remains visible and pointer focus on the entry opener does not leave an outline. Interactive controls suppress the native tap highlight.

## Overlay control proportions

Home and listing overlay searches use a 48px field with 16px type, the existing grey entry surface, pill corners and no decorative border. Overview buttons and Home choice buttons have a minimum 48px target and grey paint inset 2px vertically; a 4px layout gap leaves 8px between painted surfaces. Native choice lists use white rows and a stronger grey selected surface, with small circular radio/checkbox indicators before the label and the pinned Fluent checkmark. Touch presses visibly change the surface. Labels use 16px control type and summary values use 14px type. Numeric inputs are 48px. Mobile search fields, single-line editor inputs, selects and filter selection/overview controls use the existing pill radius; textareas use the 16px radius. Checkbox/radio indicators, range controls, uploads and desktop styling retain their existing geometry. Mobile overlay headings use 20px/600 type, 20px side gutters and borderless 44px Close/Back targets with 24px Fluent glyphs. Each overlay renders one header; responsive styling belongs to the shared `dn-mobile-overlay-heading` rules in `base.css`. Primary footer actions are 48px; secondary actions retain at least 44px targets. Sell/Import Make and Model retain separate full-width rows. Editor actions follow the fields in the same scroll container so the keyboard cannot hide them behind a separate footer. Long labels grow vertically. Filter geometry is shared through the `--dn-mobile-filter-control-*` tokens.

These dimensions are semantic role tokens or deliberate component geometry; they are not a mandate to flatten all controls. Longer localized option labels may grow vertically instead of shrinking type. `scripts/overlay-proportions-smoke.mjs` verifies the role matrix in BG and EN at 320, 390 and 430px.

Overlay gutters, row gaps and row corners reuse the foundation spacing/radius system. Collapsed filters use concise unrestricted values such as “Всеки бюджет”, “Всеки пробег” and “Всяка година”; active values use ink emphasis and wrap without truncation.

### Mobile listing cards

Below 768px, listing cards use the shared 12px card corners, 8px padding and a 12px column gap. The photograph sits beside the identity and price, with its width capped at 156px. Cards at most 24rem wide show year, full formatted mileage, fuel and transmission below both columns; wider mobile cards add body style. Content-sized badges have 8px horizontal padding and 4px gaps and can wrap with enlarged text. Home carousel cards show year, mileage and fuel beneath their title and price. Badge text stays on one line and may truncate visually while retaining its complete accessible value. The manufacturer stays subtle at 12px/450. The right-hand column aligns the 16px/500 model near the photo top and an 18px/600 euro price near its bottom, inset 2px, with at least an 8px gap. A muted 12px/450 note sits below the mobile model. Optional localized `Vehicle.cardNote` supplies a seller highlight; without it the card uses its listed panoramic-roof feature or first equipment item. Missing equipment and notes leave the line absent. Long notes retain their full title text and truncate in the narrow side column, while enlarged-text stacked cards allow wrapping. Import/condition claims must be supplied per record rather than inferred. Home retains its 20px/600 price role. Below 12rem of card width, including 200% text on narrow phones, the photo, content and facts stack so the full price has its own line. Model names stop at two lines; the complete title remains in the heading's title attribute and the card's accessible link label. Optional `Vehicle.cardBrand` supplies a sub-brand without changing inventory filtering by make. The mobile image `sizes` hint follows the capped frame. `ListingResults.svelte` keeps equal mobile card heights; `VehicleCard.svelte` owns the composition. Offscreen photographs remain lazy. The quick-filter rail has 4px of space above and 8px below, independently of its 44px tap targets.

Badge columns and row heights are equal. Mobile mileage keeps every digit without grouping or a unit; automatic, electric and petrol/LPG use compact localized labels. Ellipsis contains unusually long badge values without a second text line. Full values and units remain in accessible text and title attributes.

The mobile inventory toolbar places Search, Sort and Filters in that DOM and visual order, with Filters at the far right. Sort and Filters reuse `dn-icon-button`: 44px interaction shells, 40px white painted circles and 20px icons. Focus uses `--dn-focus`; applied filters and non-default sorting use red icon emphasis. Search also paints inside a 44px shell. `ListingFilters.svelte` owns these controls and their existing dialogs.

## Shared icon-only controls and modal behavior

Use `dn-icon-button` from `base.css` for close, back and clear controls. It owns a token-derived 44px interaction shell with a 40px visible circle, non-shrinking SVG centering and an explicit native-appearance reset. `dn-compact-control` applies the same 44px shell and 40px visible pill to quick filters and Home, Sell and Import entry actions; `dn-entry-action` and `dn-quick-pill` select their shared width and padding roles. Components own contextual surface, ink, position and responsive visibility.

`src/lib/ui/focus.ts` owns modal Tab containment; `trapDialogTab` adapts native dialog events. Disabled, hidden, inert, negative-tabindex and child-dialog controls are excluded. Focus wrapping scrolls the active control into view; closing restores the opener without scrolling the underlying page. Scroll locks release only after their last owner, even when close and unmount both run.

Home’s View all action includes `listingVehicles.length` through the localized `home.viewAllCount` message. Mobile Sell and Import use a compact white How it works card beneath the form, with a short service-specific explanation and one official Hugeicons arrow vertically centered beside both copy lines. Use the shared 12px mobile card corners and shadow, 16px padding and a 12px gap below the form. Supporting copy fits one complete line at 320px and wraps naturally with enlarged text. The whole card opens the retained white bottom drawer through its `inlineEntry` variant. Preparation advice, three service steps and a brief demo note sit in its scrollable body; close, Escape and the enquiry action restore focus to the card. Mobile entry titles remain accessible but are visually hidden through `EntryCard.hideTitleOnMobile`; the centered segmented choice uses Home's `min(100%, 15rem)` sizing and 8px option padding. Import uses the configured charcoal `--dn-theme-hero-surface-mid` for its mobile hero; Sell keeps its workflow red, and both primary actions keep the brand accent. The lower mobile canvas fades into a light version of `leadSite.artwork.serviceBackground`. Its single, bottom-aligned 400px layer preserves image proportions and stays behind the content. Desktop keeps its visible entry title and existing bordered disclosure, where this mobile background is not loaded.

Sell/Import mobile heroes reuse exactly the same central car crop from the Sell asset. A fixed 1:2:1 grid changes only the left/right service details. Do not switch the central car between separately generated scenes: even aligned frames contain different vehicle geometry. Home and service illustrations retain their shared centered frame. Verify with `scripts/hero-composition-smoke.mjs` at 320/390/430/1440px in EN/BG.

PDP mobile tabs use the same 44px control height and inset selection paint as entry segments, with compact three-option labels. The mobile finance trigger belongs inside the white information card below the active tab panel; desktop retains its sidebar calculator. Home and service hero artwork share one frame (56px top, 136px height); one shared car crop fixes the center and tyre baseline across service navigation.

`MobileListingFilters.svelte` presents all twelve inventory criteria as subtle neutral
controls on one white sheet, using the field order from `listing-draft.ts`. The sheet
fits its contents and scrolls within the visible viewport on shorter screens.
The overview keeps every criterion directly available, with borderless button surfaces
and inset paint between full-size targets. Search is one pale field with a reachable clear button; the result
action is the sole solid black button and fills the footer. The header reset
icon matches Home and keeps the reset local to the draft. Inventory's
Search opener focuses its keyword input directly. Applied quick pills keep an
outline and removal glyph rather than a solid dark fill.
Choices replace the overview inside the same native dialog. Single choices return
immediately; ranges and extras use Save. Back discards the unfinished pane; Close
discards the whole draft. Search keeps its opening list space to avoid jumping.
Budget presets derive from the current stock, while year and mileage use the
existing filter catalog. Presets edit the local draft and retain the Save step.
Shared opening measurements in `overlay-content.ts` fit wrapped controls without
unnecessary scrolling or spare space. Range errors appear directly beneath their inputs.
Home keeps its make-to-model flow and two-column choice buttons, using the same
soft grey controls and black primary action in a content-sized sheet.
All action glyphs use the pinned Fluent Regular renderer.
See [the restored mobile controls and matched captures](mobile-filter-soft-2026-10-06/README.md).

Home's Комби tile uses the transparent `body-wagon-v2.webp` cutout rather than the
opaque white image. The catalog retains the same visible framing and body-filter
link. Its [asset provenance](../provenance/body-wagon-2026-10-06.md) records the
source and alpha bounds; the original PNG and WebP remain retained.
