# Day & Night — desktop style guide

Updated 2026-10-02. Desktop refinement of the existing dealer site, with separate mobile compositions preserved. This guide governs new desktop styling; it does not certify every legacy route as migrated.

## Direction

Yellow identifies brand surfaces and section browse actions, including All videos, View all reviews and related promotional links. Hero search panels use charcoal, with white fields and light-grey filter controls. Reading, service and media panels remain white. Do not introduce cream, beige, warm-grey fills or brown-tinted borders into desktop controls.

Desktop routes share a cool light-grey canvas (`--desktop-canvas`, `#f4f6fa`) with white cards and reading/form panels. Quiet grey belongs to supporting controls or content inside a white panel. Do not invert this into a white page with grey primary cards on another route. `desktop-page-frame.css` owns the canvas adapters within the 992px desktop boundary; yellow heroes and promotional banners retain their brand surfaces.

Warm yellow identifies the dealership. White provides a clean reading and input surface. Black submits standard primary actions and identifies selected filters. Within a dark hero search panel, the primary action and focus ring use yellow for contrast, and the current Home mode has a white fill with dark text. Light neutral controls open filters without competing with the primary action. Red identifies meaningful status, errors and the approved Sell / trade-in promotional banner. Avoid introducing another accent or a different neutral palette per route.

Section browse links use brand yellow with dark text and an arrow. Hover deepens the same yellow; keyboard focus has a visible 2px outline. Keep black buttons on yellow banners, including Buy, Arrange a viewing and the Sell page's inventory banner. The deep brand red (`--sa-red-strong`) Sell / trade-in banner uses a yellow CTA with dark text and a white focus ring. Check icons inherit the banner text color. Keep both banners flat, with matching geometry.

The previous mismatch was measurable: home and inventory shortcuts used different heights, radii, active colors and icon treatments; cool blue-grey borders sat beside the yellow hero. Fix these families together rather than recoloring individual controls.

## Source of truth

- Desktop section browse links: `src/lib/components/shared/DesktopBrowseLink.svelte`. Its default `brand` tone is yellow; `dark` provides contrast on yellow banners. All consumers belong to desktop compositions. Do not duplicate this button's styles in section components.
- Shared desktop route heroes: `src/lib/components/layout/DesktopYellowRouteHero.svelte`. All route decks use charcoal, white controls, yellow primary actions and yellow focus outlines. Standard decks are 720px wide with 20px vertical and 24px horizontal padding, 12px corners and a 24px heading gap. Home, About and Sell use 640px panels with a 44px attached header and a 130px body; Blog uses the same width and a shorter 146px panel. Home, Blog and Sell share their selector rules in `desktop-controls.css`. Standard action pairs are centered, with a 12px gap and a 300px maximum per button; a single action stays centered. Custom children own only their content layout, without a second layer of panel padding.
- Shared desktop form CTA grammar: `src/lib/styles/desktop-controls.css` (992px and wider). `sa-cta-primary` and `desktop-primary-action` use black on light surfaces; the shared hero owns the yellow exception on charcoal. Secondary/ghost actions use white with a neutral border. Filter pills keep white-default / black-selected / yellow-hover states on light surfaces. Blog uses yellow for selected filters on charcoal.
- Shared desktop discovery roles and chip states: `src/lib/styles/desktop-discovery.css`.
- Shared desktop content frame: `src/lib/styles/desktop-page-frame.css` (1320px maximum, matching desktop gutters). Reviews, Sell, Contact, Financing, Calculator, Team, profiles, related articles and Saved cars use the same outer frame; reading columns and form panels may be narrower inside it.
- Existing brand yellow, Geist font and responsive heading scale: `src/lib/styles/tokens.css`.
- Do not change global/mobile tokens to solve a desktop-only issue.
- The former generated visual specimen is not shipped. Review the live Home and Inventory routes; their components and shared styles are the implementation authority for complete controls.

## Palette

| Role                     | Token                                                  | Value / use                                          |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| Brand                    | `--sa-yellow`                                          | Existing brand yellow; header and hero               |
| Canvas                   | `--discovery-canvas`                                   | `#f4f6fa`; cool light-grey discovery section         |
| Reading / form panel     | `--discovery-panel`                                    | `#ffffff`; standard panels and filter groups         |
| Hero search panel        | `--discovery-action-hover`                             | `#343a3e`; Home and inventory task groups            |
| Surface                  | `--discovery-surface`                                  | `#ffffff`; text fields, chips, vehicle cards         |
| Quiet surface            | `--discovery-muted-surface`                            | `#f3f4f6`; supporting controls                       |
| Text                     | `--discovery-ink`                                      | `#171b1e`                                            |
| Secondary text           | `--discovery-muted`                                    | `#62676e`; readable placeholders and supporting text |
| Border                   | `--discovery-control-border`                           | `#d9dde1`; neutral grey, 1px                         |
| Border hover             | `--discovery-border-hover`                             | `#9ca3af`                                            |
| Filter                   | `--discovery-filter-background`                        | `#f3f4f6`; dark text/icons                           |
| Light control hover      | `--desktop-secondary-hover`                            | `var(--sa-yellow)`; dark text and icons              |
| Filter / chip hover      | `--discovery-filter-hover` / `--discovery-light-hover` | Shared light control hover                           |
| Action / selected filter | `--discovery-action`                                   | `#171b1e`; black                                     |
| Action hover             | `--discovery-action-hover`                             | `#343a3e`                                            |

## Header utilities

Desktop header utilities, including Sell, are icon-only: 24px outline icons inside matching 48px transparent targets, with accessible labels and titles. Sell uses the existing plus-circle icon and existing sell-request link. Never apply the primary CTA class or a filled button background to this utility row.

## Control families

| Family          | Geometry                                                                    | State and behavior                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero task panel | Home, About and Sell: 640px maximum; inventory: 720px maximum; 12px corners | One charcoal task group. Home, About and Sell use a 44px attached header and a 130px body with 12px/24px padding, for 174px overall height. Inventory uses 20px/24px padding. No shadows or decorative frame.                                                                                                                                                                                             |
| Hero modes      | Attached full-width 44px header; equal 44px targets; 16px labels            | Home uses Buy a car / Sell or trade in / Car import; Bulgarian uses Купи / Продай / Внос with the full wording in tooltips. Sell uses two equal Registration / VIN options. Use one continuous row without gaps, individual borders, corners or underlines. The selected option is white with dark text; inactive labels are white on black. Retain each control's existing keyboard and draft semantics. |
| Hero search     | 54px white pill; 44px circular trailing action                              | Yellow action with a dark 20px Lucide Search icon. Put the prompt inside the field; keep a visually hidden accessible label and action title. Home submits the query; inventory opens its shared search/filter dialog.                                                                                                                                                                                    |
| Filter trigger  | 40px height; 8px corners; 16px medium; 104px minimum; sized to its label    | Light neutral default with dark text/chevrons; yellow hover; black applied selection with white text/chevrons. Opens the existing filter interface.                                                                                                                                                                                                                                                       |
| Shortcut chip   | 40px height; 8px corners; 14px medium; 12px horizontal padding              | Text-only, white default, yellow hover, black active. Same class and state styling on home and inventory. At least 44px for coarse pointers.                                                                                                                                                                                                                                                              |
| Section browse  | At least 44px high; 8px corners; 16px semibold; 18px arrow                  | Yellow default with dark text; darker yellow hover; visible keyboard focus. Size to the label. Use black with white text on yellow banners. Preserve existing destinations and labels.                                                                                                                                                                                                                    |
| Dialog field    | Light surface and neutral border; 8px radius                                | Use the same neutral family for triggers and fields inside the dialog. Apply submits the draft; Escape cancels and returns focus.                                                                                                                                                                                                                                                                         |
| Vehicle card    | White, 12px radius, 1px neutral border                                      | 4:3 photography, a single-line model name, four compact specification badges, then price and the bottom action. Retain white circular favorite/compare controls over photography.                                                                                                                                                                                                                         |

Home's Buy field and Sell's registration/VIN field share the `desktop-hero-search-field`, `desktop-hero-search-input` and `desktop-hero-search-action` classes in `desktop-controls.css`. Sell uses a 20px arrow inside the same 44px yellow action. Its accessible name and title remain Continue; clicking it or pressing Enter opens the existing valuation flow. Keep Sell's localized helper to one short line without clipping or reducing its font size. About uses one introductory sentence beneath its hero; its hero already contains the contact and inventory actions.

## Typography, icons and spacing

- Use the existing self-hosted Geist family including Cyrillic. Use existing responsive H1/H2 tokens; do not create a second heading scale.
- Section headings use `--sa-heading-section`, weight 700, 1.15 leading and -0.8px tracking. Keep 28px headings inside form/reading panels and 18px vehicle titles; a secondary section must not inherit the hero title size.
- Use 16px search text and filter/mode labels, 14px shortcuts and supporting labels. Let layout wrap rather than shrinking text for a long Bulgarian label.
- Lucide supplies utility icons: 20px for search, 16px chevrons, 18px filter tools, consistent 2px stroke. Icons inherit their control color.
- Shortcut text already explains the category. Do not add miniature car drawings, decorative price symbols, or mixed icon fonts.
- Use 8px within small groups, 12–16px between control rows, and 24–36px between content groups. A Home browse heading owns one 24px bottom gap; its content must not add a second top gap. Preserve distinct mobile and desktop layouts.
- Hero search fields use a pill and circular action, following the inspected Carwow search pattern. Filters and shortcuts retain restrained rounded rectangles; status badges retain their own meaning.

## Focus and effects

| Control                                                     | Hover treatment                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| Black primary CTA                                           | Charcoal `--desktop-action-hover`, white text/icons                 |
| White or light-grey button, filter, shortcut, photo utility | Brand yellow background and border, dark text/icons                 |
| Selected filter, shortcut or photo utility                  | Charcoal with white text/icons; remains visibly selected            |
| Inactive Home mode tab                                      | Lighter charcoal fill with white text                               |
| Selected Home mode tab                                      | Light-grey fill with dark text; remains visibly selected            |
| Hero search / Continue action                               | Slightly lighter yellow with dark text/icons                        |
| Header utility on yellow                                    | Existing subtle ink-tinted background; keep the icon-only treatment |
| Text input                                                  | Keep its neutral fill; use the focus outline when editing           |
| Vehicle card                                                | Neutral border emphasis; keep the card surface white                |

Hover is temporary feedback, never the selected state. No translation, scale, size changes or decorative shadows. Disabled controls must not look enabled on hover.

No decorative shadows on panels, cards, menus or hover states. Do not simulate depth using filters, gradients or glow. Photographic ground shadows embedded in the approved car images are image content.

Keyboard focus uses a solid 2px outline with a 2–3px offset: black on light panels and yellow within charcoal hero panels. Home mode focus is inset 4px to stay within its attached header. Outline the composite search field and suppress the inner input outline. Keep visible focus; never erase it globally. Use only short color transitions, with reduced-motion support. A selected inventory shortcut also retains its accessible state and existing remove affordance.

## Ownership and migration

| Family                        | Owners migrated in this pass                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Home task controls            | `DesktopHomeSearchPanel.svelte`                                                                                              |
| Inventory task controls       | `InventoryDesktopPage.svelte`, `InventoryFilterTriggers.svelte`, `InventoryFilterDialog.svelte`                              |
| Shared shortcut appearance    | `desktop-discovery.css`, `DesktopHomeInventoryTabs.svelte`, `InventoryShortcutShelf.svelte`, `InventoryTypePills.svelte`     |
| Discovery canvas/card borders | `DesktopHomeInventoryPreview.svelte`, `DesktopHome.svelte`, `DesktopHomeInventoryCard.svelte`, `InventoryDesktopPage.svelte` |
| Buy / Sell and review panels  | `DesktopHomeReviews.svelte`; the desktop composition sheet does not override their geometry                                  |
| Three promotional banners     | `DesktopHomeWhyDayNight.svelte`; compact content with a separate illustration area                                           |
| Desktop video panel           | `DesktopHomeVideos.svelte`; white section panel, 16:9 thumbnails and click-to-play players                                   |
| Desktop vehicle card details  | `DesktopVehicleCardDetails.svelte`, `VehiclePriceRow.svelte`; one hierarchy for Home, catalogue and related cards            |
| Type and make browse grids    | `DesktopHomeVehicleCategories.svelte`, `DesktopHomeBrandStrip.svelte`; centered headings and a final View all tile           |

The standard desktop heroes share a 400px minimum height, 36px top padding, 32px bottom padding, 24px panel gap and matching title typography through the geometry tokens in `desktop-controls.css`. Home and `DesktopYellowRouteHero.svelte` consume that contract; route styles must not override the height or vertical content padding. Keep artwork and task-panel widths appropriate to each route. The retained `/home1` photo composition has its own layout.

Standard route task panels default to white with 20px padding. Compact panels keep that padding while using a narrower width. Reviews use 24px grid gaps and author rows aligned to the bottom of each card; the Home review heading has one 24px gap above its cards. Longer reading routes use the existing 76px section rhythm, with a 52px first-section inset. Preserve all mobile compositions and shared font/data assets when applying these desktop rules.

Home follows the compact dark task-panel hierarchy inspected at [Carwow](https://www.carwow.co.uk/) on 2 October 2026: mode navigation in the panel header, a centred white search field, then the secondary controls. Its filled selected tab replaces the reference's underline, in keeping with the owner's request. Retain the dealership's yellow, self-hosted Geist, existing actions and four quick filters. The Home panel is 640px wide, with a 560px field; inventory keeps 720px to accommodate its fifth filter. Both use the same dark surface, 54px white pill, 44px yellow circular action and 12px corners. The Buy prompt belongs inside the field; its label stays available to assistive technology. Sell and Import retain readable white field labels and guidance. Use 12px between search and one centred row of compact filters; do not stretch filters into large equal-width boxes. Selected filters have a white outline on the dark panel. Keep all four Home filters, and Make, Model, Price, Mileage and More filters in inventory. Fuel, transmission, availability and extras remain in the full filter dialog. Newest cars retains its centered title, full-width nine-chip grid and final inventory-browse tile, without a heading or footer CTA. Inventory has no permanent type-preset row in its hero or above the cars. The search control displays the live result count in parentheses, with a localized status description for assistive technology. Below the hero, one centered row contains sorting and Grid / List / sidebar controls. Every selected filter, including body type, appears as a removable tag above the results; removing it restores both the URL and result count.

The desktop header-search overlay retains its complete 54px field frame, white input and 44px black trailing action on a light panel. `desktop-controls.css` owns this adapter inside the 992px media boundary. Keep the phone field and shared search submission/lifecycle unchanged.

`InventoryPageShell.svelte` exclusively selects the desktop composition. Do not add a second CSS viewport gate around its shell: WebKit can disagree at the 992px scrollbar boundary. `InventoryDesktopPage.svelte` also keeps the shared route hero visible within this selected desktop branch, without changing the hero's other consumers. `desktop-controls.css` keeps the document scrollbar gutter-free whenever the selected desktop composition mounts `.site-chrome[data-daynight-site-chrome]`. This covers all desktop storefront routes, including Sell, Contact and the auxiliary pages. Match the component class as well as the data attribute: the mobile bottom dock shares the latter. Native scrolling remains available; mobile has no desktop SiteChrome component and retains its existing scrollbar rules. Avoid a breakpoint-conditioned `scrollbar-gutter: stable` on the document: WebKit can repeatedly change viewport mode at 992px, dropping focus and hiding content. Keep the existing scroll-lock compensation for open dialogs.

The paired action banners have matching grid geometry and a 272px minimum height, growing to fit longer copy. Keep the car illustrations in their own grid column instead of mixing absolute positioning with grid placement. Video and review sections use matching flat white containers with 28px padding; review quotes sit on quiet neutral surfaces inside the group.

The desktop Home preview shows seven cars plus its final inventory-browse tile in four columns at 992–1439px, and nine cars plus the tile in five columns from 1440px. Default Inventory uses the same column counts and centered content frame; retain the existing alternate density and sidebar controls. Card details follow the owner's hierarchy: a single-line model name, year/mileage badges followed by transmission/fuel badges, then price, financing and the detail action at the bottom. Every 18px title occupies exactly one line. Longer names use an ellipsis, retaining the complete name in the link's accessible text and tooltip. Use a two-column definition list with four light-grey badges, 14px text, 6px corners, 4px vertical padding, 6px horizontal padding and 6px gaps. Center each value inside its badge; keep the values unbroken and fully readable. Definition labels remain available to assistive technology. Buying facts must appear before the action in both DOM and visual order. `DesktopVehicleCardDetails.svelte` owns the layout and typography for Home, Inventory and related cards, without legacy title, paragraph or tag classes. Do not reorder it with route-specific CSS. Keep details compact and omit internal divider lines. Avoid spec pictograms and transmission badges over the photos. Keep actual availability, photo counts, save/compare actions, financing links and detail navigation. Map cards retain their separate composition.

The desktop card's generic financing caption is one line of 14px metadata: Financing / Финансиране. Its tooltip and accessible text retain the full financing-on-enquiry wording. Actual monthly figures remain intact. Keep the caption beneath the price, fully visible beside the detail action; do not shrink its font to accommodate the longer phrase or change the mobile caption.

Type and make headings are centered without a separate heading CTA. The last tile opens the full inventory, replacing the last preview tile; the complete taxonomy remains available through inventory filters. The strip variant retains its compact logo-only composition.

The video group uses three equal 16:9 thumbnails in one row. The retained YouTube logo has substantial canvas padding; the desktop heading clips that padding with a proportional CSS window so the visible mark aligns with the heading's type. Both the wrapper and image explicitly inherit the heading font to retain those proportions. Leave the source asset unchanged. Thumbnail artwork carries its own text; video titles remain in accessible play/close/player labels, without captions below. Round and clip the media itself on all four corners. Cache the official 1280×720 thumbnails in the desktop-only asset directory, leave existing mobile images/data intact, and create the player only after activation.

`DesktopServicesPage.svelte` uses five white service cards per row at desktop widths, with 16:9 images, 18px headings and two-line 14px description previews. All six services remain available. Hero shortcuts form two balanced rows of three compact links, and each card still opens the existing request form with its service selected.

Home groups YouTube and testimonials in equal grid rows, allowing the taller content to set both panel heights. Both white panels stretch to their row and use matching 28px padding, or 24px at 992–1199px. Keep video thumbnails at 16:9, centered in the available content space; do not stretch media or clip review text to force a fixed height.

`DesktopAboutPage.svelte` groups the first introduction below the hero inside a compact white panel, with centered copy and a 28px heading. Do not restore the oversized photo/text split. Team, contact and map content retain their functional compositions.

`BlogIndexPage.svelte` displays articles in a regular four-column desktop grid, with three columns at 992–1199px. Category and topic links use the shared filter-pill states; search, topic and category selections preserve each other in the URL. Keep Back, clearing filters and empty results functional. Do not enlarge a featured post or add a second sidebar article layout. The mobile branch retains its own composition.

Legacy CSS still exists. Shared chip rules contain narrowly scoped `!important` adapters to outrank it. Edit those owning rules instead of appending another late override. Use the same token values for the rest of the family; preserve route-specific data and semantics.

The shared CTA contract also covers Sell, Services, Contact, About, Financing, Compare and vehicle detail actions. Legacy map/sidebar controls and remaining non-CTA menu/modal families still need migration before claiming full site-wide compliance. Historical `DESIGN.md` branch references are not current checkout instructions; `AGENTS.md` identifies the active checkout.

## Review before accepting a change

Check Home and Inventory together at 1280, 1440 and 1920px, plus the separate 390px mobile composition. Inspect default, hover, focus, applied filter, dialog open/close and empty results. Verify no horizontal overflow, readable icons, keyboard focus return, query preservation and working links. Run the existing scoped interaction tests and Svelte checks. Do not regenerate visual baselines solely to hide an unexplained change.
