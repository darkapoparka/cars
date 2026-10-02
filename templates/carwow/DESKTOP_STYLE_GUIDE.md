# Desktop style guide

Updated 2 October 2026. This is the implementation contract for the Carwow desktop storefront. Home and Inventory define the visual language; About, Team and the other desktop routes use the same surfaces, typography, controls and content frame.

The desktop composition starts at 992px. Keep mobile components, shared business data, source artwork, fonts and mobile copy unchanged. Use the existing viewport context; never add a competing viewport listener or gate an already-selected desktop shell a second time.

## Surfaces and colour

| Role                                            | Treatment                                                                                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Page canvas                                     | Cool grey `--desktop-canvas` (`#f4f6fa`).                                                                                              |
| Primary card or reading/form panel              | White `--desktop-panel`, a neutral 1px border and 12px corners.                                                                        |
| Supporting control inside a panel               | Quiet grey `--desktop-field`; it must read as a control rather than a second card.                                                     |
| Hero task panel                                 | Charcoal body `--desktop-action-hover`, with the darker `--desktop-action` attached header where there are modes or contact utilities. |
| Hero primary action                             | Yellow with dark text.                                                                                                                 |
| Section browse action or final View all tile    | Yellow with dark text and an arrow.                                                                                                    |
| Primary action on a light form or yellow banner | Black with white text.                                                                                                                 |
| Secondary action on charcoal                    | Transparent with a quiet light border, white text and a visible arrow.                                                                 |
| Selected filter on a light surface              | Black with white text; yellow is hover feedback.                                                                                       |
| Error or meaningful status                      | Existing semantic colour tokens.                                                                                                       |

Keep one canvas throughout the route. Do not alternate white page sections with grey primary cards. Yellow heroes and the existing yellow/red promotional banners retain their brand roles. Do not add cream, warm grey, blue accents, gradients or decorative shadows.

## Frame, hero and rhythm

- `desktop-page-frame.css` owns the 1320px maximum content width and responsive gutters. Use its tokens for cards, section headers and promotional panels. Reading columns may be narrower inside that frame.
- `DesktopYellowRouteHero.svelte` owns the 400px hero and shared heading/panel position. At 992–1440px the panel starts 166px into the hero; the existing fluid title moves that to approximately 185px at 1920px. Route content must not override this geometry.
- Home, Sell and About have a 640px task panel with a 44px attached header and a 130px body, for 174px overall. Blog uses the same width with its shorter 146px content. Standard route panels use 720px and grow to fit their content. The retained `/home1` photo layout keeps its separate composition.
- Use the existing desktop section-spacing tokens. A section header owns one 24px gap before its grid. Use 20px card-grid gaps, 16px card padding, 12px between control rows and 8px between closely related labels.
- Artwork stays outside the task panel. Retain the approved cutouts and their crops; do not replace imagery to conceal a spacing problem.

## Typography and icons

Use self-hosted Geist, including Cyrillic, and the existing typography tokens. Hero titles use the existing fluid hero role. Section titles use `--sa-heading-section`, 1.15 leading and the existing tracking. A compact panel heading uses the 28px panel role; repeated card titles use 18px and supporting text uses 14px. Inputs and normal action labels use 16px. Do not shrink labels to fit Bulgarian.

Use Lucide icons consistently: 20px for search, 18px for action arrows and telephone, 16px for chevrons. Icons inherit the control colour. Avoid mixing custom icon drawings with Lucide or repeating decorative icons beside text that already explains the action.

## Task panels and controls

Home, Blog and Sell share `desktop-hero-controls` and `desktop-hero-selector` in `desktop-controls.css`: equal 44px options in one attached bar, white selected state, no separate pill frame and no underline selection. Keep the full accessible labels, tooltips, keyboard behaviour and separate drafts.

Home's Buy field and Sell's registration/VIN field share a 54px white pill with a 44px yellow trailing action inset by 5px. The prompt belongs inside the field, with a visually hidden label. Sell uses an arrow and a one-line helper; Enter and the arrow open the existing intake. A navigation link must remain a link, rather than imitating an editable input.

About's contact header keeps the phone and social destinations. Its body contains location/hours and one centred action row: a compact yellow viewing action and a quiet outlined inventory action. Both have 44px targets and widths determined by their labels. Do not stretch two navigation actions into equal large blocks or turn the contact header into fake mode tabs.

Home retains four filters; Inventory retains Make, Model, Price, Mileage and More. Other choices stay in the existing filter dialog. Inventory has one centred sort/view-control row beneath its hero, a live result count in the search field and removable applied-filter tags. Do not restore a permanent type-preset strip above the results.

Filter and shortcut controls use the owning rules in `desktop-discovery.css`: white defaults, black applied states and yellow hover, with readable text and at least 44px targets for coarse pointers. Do not stretch one shortcut across an entire row.

## Cards and collections

Vehicle cards retain one hierarchy: 4:3 photograph, one-line 18px model name, year/mileage and transmission/fuel badges, then price, one-line financing metadata and the detail action. Long model names use an ellipsis with their full accessible text and tooltip. Keep the four facts in a two-column definition list with 14px text; buying facts precede actions. No internal separators or facts below the buttons.

Home and default Inventory use four columns at 992–1439px and five from 1440px. Keep alternate density/sidebar controls. Type and make collections use centred headings and a final yellow View all tile rather than another heading CTA. The complete taxonomy remains available in Inventory.

`DesktopTeamCard.svelte` owns the team-card family for About and Team:

- Four equal cards, 20px gaps and the same white/border/radius treatment as vehicle cards.
- A 4:3 portrait crop aligned toward the top. Clip it to the card's top corners; do not add a rounded frame inside the card or social controls over the face.
- A one-line 18px name using the full width of the body. Retain the complete localized name in the accessible link and tooltip.
- A 14px role with space for up to two lines, so every card's action row aligns. Do not squeeze the title beside the phone icon.
- A separate 44px footer row with a readable profile link and phone/email utilities. Keep all existing destinations and conditional email support.
- Demo portrait/profile disclosure stays visible. No invented staff names, roles or identity changes.

Services retain five white cards per desktop row, 16:9 imagery, 18px headings and two-line 14px previews. Blog retains its regular four-column grid, or three columns at 992–1199px. No oversized featured article. Existing search, filters, URL/history and empty states remain functional.

## About page composition

About begins with the team section under its hero. One concise introduction belongs with that section heading; do not add another standalone slogan/intro section above it. The shared team cards provide the visual content. Keep the disclosure below the grid and the reviews destination as a compact secondary link.

The brand collection has a centred heading, two balanced rows of eight compact logo tiles and a final yellow View all tile. Logo and name are stacked, so longer brand names do not compete with the logo for horizontal space. The full brand list remains available in Inventory.

Support links use three compact white cards: 18px heading, a two-line 14px summary and a visible action. Keep the icons small and the padding consistent with the other cards. The visit panel retains the address, hours, viewing action and click-to-load map; it is functional location content, not another large introductory split.

## Media and promotional panels

YouTube and Home reviews use matching flat white containers and stretch to the same grid-row height. Keep 28px padding, or 24px at 992–1199px. Three equal 16:9 thumbnails form one row. Official thumbnail artwork carries its text; retain accessible video titles without captions below. Clip all four media corners and mount the player only after activation.

The retained YouTube mark has a desktop-only proportional clipping window. Do not change the source logo or mobile images. Promotional banners keep their matching grid geometry, separate artwork column and content-driven height; actions stay compact rather than spanning the entire panel.

## Hover, focus and behaviour

Use short colour/border transitions. Cards retain white surfaces and emphasize their neutral border on hover or focus within. White/grey utilities and browse tiles become yellow; selected controls retain their selected state. Yellow actions deepen the same yellow. Quiet hero actions become white with dark text. No lift, zoom, size changes, shadows or glow.

Keyboard focus uses a visible 2px outline: dark on light surfaces, yellow on charcoal. Attached headers use an inset outline. The composite search field owns its focus ring; suppress only its inner input outline. Retain Escape, focus return, form validation and URL/history contracts. Respect reduced motion.

## Ownership

| Family                                 | Source owner                                                           |
| -------------------------------------- | ---------------------------------------------------------------------- |
| Canvas and content frame               | `src/lib/styles/desktop-page-frame.css`                                |
| Hero geometry, modes and input actions | `src/lib/styles/desktop-controls.css`, `DesktopYellowRouteHero.svelte` |
| Filter/shortcut states                 | `src/lib/styles/desktop-discovery.css`                                 |
| Section heading and browse action      | `DesktopSectionHeading.svelte`, `DesktopBrowseLink.svelte`             |
| About content and navigation           | `DesktopAboutPage.svelte`                                              |
| About/Team cards                       | `DesktopTeamCard.svelte`; both pages consume it                        |
| Vehicle facts and price hierarchy      | `DesktopVehicleCardDetails.svelte`, `VehiclePriceRow.svelte`           |
| Home composition and media             | Existing desktop Home components and `daynight-home-desktop.css`       |

Edit the owning component/rule. Do not append competing route overrides, revive legacy utility layouts or introduce a second business-data source. Existing narrow legacy adapters are not permission to spread `!important` throughout new components.

## Verification

Review English and Bulgarian at 992, 1280, 1440 and 1920px, including hover, keyboard focus, navigation and long names. Compare fresh mobile renders at 320/390px and protected mobile/data hashes before and after. Check the 991/992px boundary when shared desktop controls change. Run the relevant existing browser cases, Svelte/typography checks, scoped lint/formatting, unit tests and production build. Capture independent screenshots; never replace visual baselines to hide an unexplained difference. Source, owner visual acceptance, template promotion and dealer deployment remain separate.
