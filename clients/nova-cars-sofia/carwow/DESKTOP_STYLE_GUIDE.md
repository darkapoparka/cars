# Day & Night — desktop style guide

Updated 2026-09-06. Desktop refinement of the existing dealer site, with separate mobile compositions preserved. This guide governs new desktop styling; it does not certify every legacy route as migrated.

## Direction

Yellow identifies brand surfaces and the hover state of light action controls. Panels are white; fields and control rails are light grey. Do not introduce cream, beige, warm-grey fills or brown-tinted borders into desktop controls.

Warm yellow identifies the dealership. White groups a task. White provides a clean reading and input surface. Black submits the primary action and identifies the current mode or selected filter. Light neutral controls open filters without competing with the primary action. Red identifies meaningful status, errors and the approved Sell / trade-in promotional banner. Avoid introducing another accent or a different neutral palette per route.

The paired homepage promotional banners use yellow with black text and a black CTA for Buy, and deep brand red (`--sa-red-strong`) with white text and a white CTA for Sell / trade-in. Check icons inherit the text color. Keep both banners flat, with matching geometry. The white Sell CTA uses the shared yellow hover; the black Buy CTA uses charcoal hover.

The previous mismatch was measurable: home and inventory shortcuts used different heights, radii, active colors and icon treatments; cool blue-grey borders sat beside the yellow hero. Fix these families together rather than recoloring individual controls.

## Source of truth

- Shared desktop CTA grammar: `src/lib/styles/desktop-controls.css` (992px and wider). `sa-cta-primary` and `desktop-primary-action` use black; secondary/ghost actions use white with a neutral border.
- Shared desktop discovery roles and chip states: `src/lib/styles/desktop-discovery.css`.
- Existing brand yellow, Geist font and responsive heading scale: `src/lib/styles/tokens.css`.
- Do not change global/mobile tokens to solve a desktop-only issue.
- [Visual specimen](artifacts/desktop-style-guide.html) uses the shared token stylesheet and chip classes. The site components remain the implementation authority for complete controls.

## Palette

| Role                     | Token                                                  | Value / use                                          |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| Brand                    | `--sa-yellow`                                          | Existing brand yellow; header and hero               |
| Canvas                   | `--discovery-canvas`                                   | `#f4f6fa`; cool light-grey discovery section         |
| Task panel               | `--discovery-panel`                                    | `#ffffff`; hero task boxes and filter groups         |
| Surface                  | `--discovery-surface`                                  | `#ffffff`; text fields, chips, vehicle cards         |
| Quiet surface            | `--discovery-muted-surface`                            | `#f3f4f6`; segmented rail                            |
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

| Family              | Geometry                                                    | State and behavior                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Task panel          | 12px radius; flat white                                     | Group one task. No shadow, glass, gradient or heavy black frame.                                                                                                            |
| Buy / Sell / Import | 36px tab, 42px rail; 15px semibold                          | Dark active tab identifies a mode. Arrow keys change mode; retain independent drafts. Coarse pointer tabs are at least 44px.                                                |
| Search              | 54px outer field; 8px radius; 44px trailing icon action     | White field, black action, white 20px Lucide Search icon. Accessible label and title are required. Home submits the query; inventory opens its shared search/filter dialog. |
| Filter trigger      | 46px high; 8px radius; 15px medium                          | Light neutral default with dark text/chevrons; yellow hover; black applied selection with white text/chevrons. Opens the existing filter interface.                         |
| Shortcut chip       | 36px high; 8px radius; 14px medium; 12px horizontal padding | Text-only, white default, yellow hover, black active. Same class and state styling on home and inventory. At least 44px for coarse pointers.                                |
| Dialog field        | Light surface and neutral border; 8px radius                | Use the same neutral family for triggers and fields inside the dialog. Apply submits the draft; Escape cancels and returns focus.                                           |
| Vehicle card        | White, 12px radius, 1px neutral border                      | No default or hover shadow. Darker border can communicate hover. Retain white circular favorite/compare controls over photography.                                          |

## Typography, icons and spacing

- Use the existing self-hosted Geist family including Cyrillic. Use existing responsive H1/H2 tokens; do not create a second heading scale.
- Use 16px search text, 15px filter/mode labels, 14px shortcuts and supporting labels. Let layout wrap rather than shrinking text for a long Bulgarian label.
- Lucide supplies utility icons: 20px for search, 16px chevrons, 18px filter tools, consistent 2px stroke. Icons inherit their control color.
- Shortcut text already explains the category. Do not add miniature car drawings, decorative price symbols, or mixed icon fonts.
- Use 8px within small groups, 12–16px between control rows, and 24–36px between content groups. Preserve distinct mobile and desktop layouts.
- Circles belong to icon actions over media; rounded rectangles belong to discovery controls. Status badges retain their own meaning.

## Focus and effects

| Control                                                                        | Hover treatment                                                     |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Black primary CTA                                                              | Charcoal `--desktop-action-hover`, white text/icons                 |
| White or light-grey button, filter, shortcut, inactive mode tab, photo utility | Brand yellow background and border, dark text/icons                 |
| Selected filter, shortcut, mode tab or photo utility                           | Charcoal with white text/icons; remains visibly selected            |
| Header utility on yellow                                                       | Existing subtle ink-tinted background; keep the icon-only treatment |
| Text input                                                                     | Keep its neutral fill; use the focus outline when editing           |
| Vehicle card                                                                   | Neutral border emphasis; keep the card surface white                |

Hover is temporary feedback, never the selected state. No translation, scale, size changes or decorative shadows. Disabled controls must not look enabled on hover.

No decorative shadows on panels, cards, menus or hover states. Do not simulate depth using filters, gradients or glow. Photographic ground shadows embedded in the approved car images are image content.

Keyboard focus uses a solid 2px black outline with a 2–3px offset. For composite search fields, outline the outer field at a -1px offset so it covers the border, and suppress the inner input outline. Keep visible focus; never erase it globally. Use only short color transitions, with reduced-motion support. A selected inventory shortcut also retains its accessible state and existing remove affordance.

## Ownership and migration

| Family                        | Owners migrated in this pass                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Home task controls            | `DesktopHomeSearchPanel.svelte`                                                                                              |
| Inventory task controls       | `InventoryDesktopPage.svelte`, `InventoryFilterTriggers.svelte`, `InventoryFilterDialog.svelte`                              |
| Shared shortcut appearance    | `desktop-discovery.css`, `DesktopHomeInventoryTabs.svelte`, `InventoryShortcutShelf.svelte`, `InventoryTypePills.svelte`     |
| Discovery canvas/card borders | `DesktopHomeInventoryPreview.svelte`, `DesktopHome.svelte`, `DesktopHomeInventoryCard.svelte`, `InventoryDesktopPage.svelte` |

Legacy CSS still exists. Shared chip rules contain narrowly scoped `!important` adapters to outrank it. Edit those owning rules instead of appending another late override. Use the same token values for the rest of the family; preserve route-specific data and semantics.

The shared CTA contract also covers Sell, Services, Contact, About, Financing, Compare and vehicle detail actions. Legacy map/sidebar controls and remaining non-CTA menu/modal families still need migration before claiming full site-wide compliance. Historical `DESIGN.md` branch references are not current checkout instructions; `AGENTS.md` identifies the active checkout.

## Review before accepting a change

Check Home and Inventory together at 1280, 1440 and 1920px, plus the separate 390px mobile composition. Inspect default, hover, focus, applied filter, dialog open/close and empty results. Verify no horizontal overflow, readable icons, keyboard focus return, query preservation and working links. Run the existing scoped interaction tests and Svelte checks. Do not regenerate visual baselines solely to hide an unexplained change.
