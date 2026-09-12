# Styling and visual system

Auto Best combines an image-led automotive layout, Onest typography, rounded surfaces and direct call-to-action controls. This document describes the existing design and where its styling lives. It is not a proposal for a new theme.

## CSS structure

[app.css](../src/app.css) imports four global sheets in this order:

| Sheet | Contents |
| --- | --- |
| [tokens.css](../src/lib/styles/tokens.css) | Semantic colors, typography, radii and shared layout dimensions |
| [base.css](../src/lib/styles/base.css) | Native element defaults, controls and shared utility classes |
| [navigation.css](../src/lib/styles/navigation.css) | Shared navigation foundations |
| [composition.css](../src/lib/styles/composition.css) | Hero geometry, shell relationships, responsive layout and cross-component adjustments |

Svelte component `<style>` blocks own internal presentation. Route sheets such as `contact/contact.css`, `listing-grid/listing.css` and the detail `detail.css` files own page composition and route-specific component adaptations. Route CSS is imported from the corresponding page and is global CSS; its selectors therefore use route/component prefixes.

Svelte adds a scoping class to component selectors, which changes specificity. Moving a selector unchanged from a component to a global sheet can change the result. Explicit `:global(...)` selectors are used where an owner styles child-component output. See the [Svelte scoped styles reference](https://svelte.dev/docs/svelte/scoped-styles).

The `dn-` class prefix is inherited naming, not a runtime dependency on the original dealer. Renaming it is unnecessary for a client skin.

## Color palette

These are the shared token defaults, not a list of every local campaign color:

| Token | Value | Role |
| --- | --- | --- |
| `--dn-red` | `#c40101` | Primary red actions and branded sections |
| `--dn-red-hover` | `#a90000` | Red hover state |
| `--dn-ink` | `#14171d` | Main dark text/surfaces |
| `--dn-ink-hover` | `#292e36` | Dark hover state |
| `--dn-muted` | `#626873` | Supporting text |
| `--dn-line` | `#e7e8eb` | Subtle control/separation lines |
| `--dn-surface` | `#f6f7f9` | Neutral shared surface |
| `--dn-home-panel` | `#f1f3f5` | Homepage content panels |
| `--dn-mobile-canvas` | `#f4f5f7` | Mobile page background |
| `--dn-mobile-surface` | `#fff` | Mobile cards and controls |
| `--dn-focus` | `#0b57d0` | Visible keyboard focus |

The approved mobile service grid is deliberately not monochrome: inventory is blue, sell/trade-in red, import pale blue and leasing charcoal. Its working-preview component uses these local gradients:

| Card | Gradient |
| --- | --- |
| Inventory | `#135da8` to `#0d3d72` |
| Sell / trade-in | `#d00832` to `#9b001f` |
| Import | `#e8f4ff` to `#c8e3f8` |
| Leasing | `#23262b` to `#111317` |

Those colors belong to that campaign family. Changing the brand red alone does not recolor baked image text, all artwork, or every local gradient.

## Typography

The root layout imports `@fontsource-variable/onest`. `--dn-font` is `Onest Variable`, followed by Segoe UI, Arial and sans-serif. Fonts are bundled with the application.

| Token | Size | Typical use |
| --- | --- | --- |
| `--dn-text-badge` | `0.75rem` | Compact badges |
| `--dn-text-meta` | `0.875rem` | Supporting metadata |
| `--dn-text-body` | `1rem` | Body copy and default action type |
| `--dn-text-lead` | `1.125rem` | Introductory copy |
| `--dn-text-card` | `1.25rem` | Card headings |
| `--dn-text-subheading` | `1.5rem` | Subheadings |
| `--dn-text-heading` | `1.875rem` | Headings |
| `--dn-text-section` | `2.625rem` | Large section titles |
| `--dn-text-display` | `3.75rem` | Display text |

Component-specific sizes also exist; the table is not a command to normalize every heading. Mobile section headings commonly use 22px, and mobile service titles use 18px in the current working design. The shared action shorthand is `--dn-cta-font`, with weight 600, body-size text and 1.3 line-height. Heading tracking and responsive sizes are owned by the relevant component.

## Shape, spacing and layout

| Token | Default |
| --- | --- |
| `--dn-radius-sm` | 10px |
| `--dn-radius-control` | 12px |
| `--dn-radius` | 16px |
| `--dn-radius-lg` | 20px |
| `--dn-radius-button` | `--dn-pill`, 999px |
| `--dn-content` | 1360px |
| `--dn-menu-content` | 1320px |
| `--dn-home-section-space` | 32px |
| `--dn-home-heading-banner-height` | 176px |
| `--dn-home-banner-overlap` | 24px |
| `--dn-mobile-nav-height` | 56px |
| `--dn-mobile-detail-bar-height` | 67px |

There is no universal spacing-scale engine. Existing layouts use small 8–12px gaps, 12–24px internal padding and larger section spacing where appropriate. Mobile cards also use local 14px corners; drawers commonly use 24px top corners. Keep the owning value rather than inventing an additional global token for a one-off adjustment.

The control family is rounded: pill actions, rounded input surfaces and compact circular icon buttons. The mobile sell action and import entry control use 44px geometry in the current working design. That is not a blanket instruction to resize every desktop control or every drawer button to 44px.

## Responsive composition

| Range | Main behavior |
| --- | --- |
| Up to 767px | Mobile navigation, home service grid, compact search and bottom-sheet treatments |
| 768–991px | Intermediate layout; individual components retain their own arrangements |
| 992px and above | Desktop composition, section banners and desktop discovery controls |
| 1440px and above | Wide hero side-vehicle artwork is enabled by its media sources |

Additional 359/374/380px and 1199px rules handle particular text, grid and control constraints. These are local breakpoints, not separate site themes. Safe-area insets supplement the fixed mobile navigation and sheet footers. The normal dock and vehicle-detail action bar are separate layouts with different height tokens.

## Homepage patterns

**Hero and search.** The hero and its vehicle artwork remain separate from the search panel. Mobile Buy/Import tabs have a light enclosing panel and a dark selected tab; primary actions are red. Desktop discovery is its own presentation. The older charcoal-search token names do not mean the current entire search panel should be recolored charcoal.

**Mobile services.** The current preview has four illustrated cards in a 2-by-2 grid below search. Text sits above a centered lower image region. Inventory, sell, import and leasing each retain their own color and existing generated artwork. This is distinct from the wider desktop campaign pair.

**Section introductions.** Desktop inventory/body/brand/editorial sections use their existing branded heading banners attached to light content panels. Their heading/CTA and overlap rules are shared. Mobile uses compact headings appropriate to its denser layout rather than miniaturizing the full desktop banners.

**Body types and brands.** These use image-led grid tiles, live labels and expandable mobile discovery. Artwork bounds align the visible car or logo rather than the transparent image canvas. Labels are centered within the mobile cards. Body-type and brand components own their own header actions and expansion state; changing one should not implicitly replace the other.

**YouTube.** The mobile video section is a rounded black container with a simple YouTube title and image-led video items. Its outgoing channel link, thumbnails and click-to-play player come from different parts of the implementation.

## Inventory and vehicle cards

Mobile inventory starts with a rounded search field and compact filter/sort controls, followed by one horizontal quick-filter rail. Make and model stay together in that rail. Active chips expose removal; selectors retain a dropdown affordance. The filter sheet contains the deeper options.

Vehicle cards prioritize photograph, title and price over metadata. Mobile year/mileage badges and fuel/transmission icon treatments remain secondary. Card links cover the intended card area, not only a tiny title. Desktop grids adapt through intermediate widths rather than imposing the mobile card structure everywhere.

## Detail, sell and import

Vehicle detail uses route-specific gallery, information tabs, price/contact actions and supporting finance/import/seller content. The current working preview includes image-generated financing and seller banners. Their text is already part of the image: changing alt text does not change the displayed words. Use the approved image as an image, with its existing interactive wrapper.

Sell/trade-in and import have related entry geometry but distinct workflows. Their informational drawers are native dialogs with dark sheets, light text, rounded top corners and viewport-level backdrops. They are not ordinary boxes attached inside the entry card. Their backgrounds, sheet surfaces and backdrop treatments have separate CSS owners.

General Contact combines contact actions with a contained map section. About and editorial retain their own route composition. Detailed form controls are not a reason to add a second visual system to those pages.

## Artwork and icons

Stock images use photo framing; decorative cutouts use proportion-preserving containment. `VehicleCutout`, `HeroVehicles`, `ArtworkRegion` and `FeatureArtwork` interpret the data modules. A bounds tuple describes visible artwork; a crop tuple describes a viewport into a larger image. Their numeric meanings are documented in [Data](DATA.md).

`Icon.svelte`, `MobileNavIcon.svelte` and the service/social icon components are existing native SVG renderers. Reuse their names and visual weight for an established action. Adding an icon font or a second icon library is unnecessary for ordinary customization.

## Interaction styling

Existing focus rings, selected states and disabled states communicate different things. Hover effects should stay secondary to the static composition, and mobile scrolling should not rely on hover. Respect the existing reduced-motion media queries. Native modal placement, page scroll handling and the dock interaction need to be considered together when changing drawer styling.

For a visual adjustment, find the winning rule in the component/route/global cascade and edit that owner. Keep the current appearance for architecture-only changes. [Testing](TESTING.md) lists the representative viewports and interaction checks.
