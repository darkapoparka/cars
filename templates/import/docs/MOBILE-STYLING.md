# Mobile control styling — Import

Approved on 9 October 2026 after the rendered mobile icon comparison. This is the
current project rule for mobile action icons and control labels below 768px.

## Action icons

Use half of the **visible control surface** height for its action icon:

| Visible control height | Action icon size |
| ---------------------- | ---------------- |
| 36px                   | 18px             |
| 40px                   | 20px             |
| 44px                   | 22px             |
| 48px                   | 24px             |
| 56px                   | 28px             |

Consume `--bc-control-icon-size-*` from [tokens.css](../src/lib/styles/tokens.css)
and the shared control components. Keep icon stroke settings, button heights,
corners and spacing consistent with the approved component. Existing 46px wizard
actions use 23px icons through their component height variable.

Measure the painted surface separately from its native tap area. The Home search
field is 48px high; its action has a 44px tap area around a 36px painted circle,
so its magnifier is 18px. The comparison removal control has a 28px painted
surface and a 14px icon within a 44px target. Preserve these tap areas and prefer
44px targets for new standalone mobile utilities.

Apply this scale to action glyphs in header, PDP, drawer, photo viewer, contact,
search and form controls. Dropdown chevrons, status symbols and vehicle metadata
use their existing inline sizes. Bottom navigation keeps its approved 22px icon
and caption layout; its whole row height does not determine glyph size.

## Text and labels

Text has an independent typography scale. **Do not use `button height / 2` for
font size.** Choose the existing label/search/CTA token for the control's role,
and preserve approved component overrides. Equal-role controls share font size,
weight and line height even when their labels differ.

Use these shared roles at the default root font size:

| Mobile text role                                       | Size | Weight                   | Shared token                                             |
| ------------------------------------------------------ | ---- | ------------------------ | -------------------------------------------------------- |
| Main search and service entry fields                   | 20px | 400                      | `--bc-text-search`                                       |
| Quick pills                                            | 18px | 400                      | `--bc-text-quick-pill`                                   |
| Form fields, filter options and standard action labels | 18px | 400                      | `--bc-text-control`, `--bc-text-filter`, `--bc-text-cta` |
| Field labels and supporting body copy                  | 16px | Existing label/body role | `--bc-mobile-label`, `--bc-mobile-body`                  |

Search uses the 20px entry role below 768px. Quick-pill and CTA labels share
the 18px control role, including PDP Inquire/Call. Preserve headings and
captions in their own roles. A 44px button can pair a 22px icon with an 18px
action label; a 48px search field uses 20px text independently of its icon.

Empty entry prompts and native input placeholders use the same readable gray
(`--bc-control-placeholder`, mapped to `--bc-copy` on mobile). Entered values
use `--bc-ink`; both use regular 400 weight. Keep disabled fields distinct from
empty enabled fields. Component fallbacks preserve existing desktop colours.
Use the shared tokens rather than introducing page-specific sizes or shades.
Primary form-submit variants keep their existing shared 600 emphasis; entry
prompts and entered values stay regular rather than borrowing heading weight.

Home, Cars and Import country filters use the shared 18px role
(`--bc-text-quick-pill`), within 40px visible surfaces and 44px tap areas.
The owner requested the compact height and circular selection on 10 October 2026.
This is an independent text choice; action icons keep their own size tokens.
The override applies below 768px and preserves the existing desktop typography.

Selected inventory pills display only the chosen value, such as `BMW`, `X5`,
a price range or a starting year. Unselected pills display their category.
Keep the full category and value in the accessible label, preserve the existing
selection summaries and ellipsis, and retain the 44px tap area.

Check actual BG/EN labels before changing typography, including paired PDP
actions and longer Bulgarian wording at 320px. Keep labels readable and on one
line at the default text size. Content-sized controls can grow in width to fit
their glyphs; shared button rows must still fit their viewport.

## Search and filter shapes

Mobile search triggers and search inputs use `--bc-radius-pill`, including
keyword overlays and searchable Make/Model pickers. Reuse the search spacing
and icon tokens so opening a picker does not introduce another field style.
Search text keeps the regular 20px search role.

The shared comparison/account search field uses the 48px entry role with a 24px
magnifier. Comparison pickers opt into a neutral fill;
account fields retain their white surface on the shaded page.

Make/Model and other labeled form selectors use the 44px field role and shared
control corners. Home and Cars search overlays opt into a neutral inset fill via
`--bc-mobile-field-surface`; Import and Sell keep white fields on their shaded
form canvas. Enabled empty prompts retain readable contrast in both contexts.

Home, Cars and Import country quick filters share `.mobile-quick-pill` from
[mobile-controls.css](../src/lib/styles/mobile-controls.css). The shared owner
sets their 12px control corners (`--bc-radius-control`), 40px visible height,
44px tap area, 18px text and padding; use
`.mobile-quick-pill--icon` for an icon-only quick filter. Keep page-specific
rail layout, selected states, flags and label truncation in the component.
The icon-only filter keeps the same 40px surface and 20px glyph, with a 2.25
stroke for clearer visual weight beside text pills. Preserve the matching rail
height rather than widening or raising the filter button.
The owner chose these corners on 10 October 2026 after the matched mobile comparison.
Quick pills use the shared 8px horizontal padding and 4px inline gap. Avoid
page-specific padding or font overrides that make the same control look larger.
Ordinary form fields and action buttons retain their existing component shapes.

Home and Import use `.mobile-quick-rail` for shared scrolling, gaps and 2px block
padding. Their quick-filter rows start at the shared 14px mobile gutter.

Final Home corner roles, confirmed on 10 October 2026: quick filters, brand cards
and type cards use 12px corners; vehicle cards retain their existing 10px corners.
Quick filters match the browse controls they accompany. These are separate
component roles, so the vehicle-card radius does not set the quick-filter radius.
The same 12px corner looks rounder on a 40px-high filter than on a taller browse
card because it occupies a larger share of the control's height.
Sell's outer white valuation panel uses the shared 16px panel radius, matching
the default drawer corners; its inset banner retains the 12px card radius.

Compact pills and default mobile icon actions share `--bc-mobile-control-surface-size`
(40px), `--bc-mobile-control-hit-size` (44px) and
`--bc-mobile-control-glyph-size` (20px). Quick pills use 2px vertical margins and
transparent pseudo-element outsets to retain the 44px rail footprint and tap area.
Icon-only pills extend the target on all four sides. `MobileIconAction` retains
its native 44px box around the 40px painted circle.

Controls next to a search field share its visible height. The Cars search toolbar
sets the shared icon-action surface and glyph tokens to the standard role:
44px Search, Filter and Sort surfaces, with 22px action icons. Quick filters in
the separate row remain 40px high. Home and Import header utilities occupy a
different row from their 48px search fields and keep the compact 40px circles.
Search fields keep their existing dimensions and independent 20px typography.
The toolbar sizing applies below 768px and preserves desktop styling.
Default Filter and Sort circles share Search's borderless white surface; keep
their selected fill and visible keyboard focus styling.

## Selection sheets and option rows

Use [MobileChoiceRow](../src/lib/components/common/MobileChoiceRow.svelte) for
mobile option lists. It owns label/count grouping, optional logos or flags,
selection marks and focus styling. Keep labels at the existing 18px control role,
aligned in full-width rows with a 56px minimum height. Counts sit beside the label;
only the selection mark occupies the trailing edge. Selection indicators are
inline status marks, so the action-icon half-height rule does not apply to them.

Single choices use a circular dot indicator. Set `multiple` for circular checkmark
indicators. The shapes match while the selected marks communicate different behavior.
Preserve each flow's
existing selection, Apply, Done and Back behavior; appearance must not change
single selection into multiple selection or discard a draft.

Use `.mobile-disclosure-row` for filter category overviews and
`.mobile-choice-list` for stacked options. Quick-filter rails remain pills.
The shared list style owns faint inset separators. Keep numeric inventory counts
in the option data and merge them through the domain helper, rather than parsing
display labels inside a component.
Short selection sheets use the shared white inset surface; searchable and long
filter flows keep their full-screen frame with a lightly shaded search capsule.
Shared `MobileSheet` consumers opt in with `surface="selection"`; content
drawers and photo viewers retain their existing appearance.

## Mobile keyboard and searchable pickers

Make and Model use the existing full-screen picker frame. Keep the search input
outside the scrolling results so it stays at the top while the keyboard is open.
The picker and its actions fit the remaining visible height.

Use the existing `keyboardInset` attachment on shared `MobileSheet` contents and
the Home/Cars search overlays. Keep the inset local to the overlay and leave
Vaul input repositioning disabled so two mechanisms do not move the same panel.

In option pickers, the keyboard's Done action dismisses typing and retains the
query. Single selections return to the parent form; multi-selections retain the
existing Apply action. Keyword search keeps its normal Search/submit behavior.
Long forms scroll their fields within the sheet when focused; focusing a field
does not create another page or discard the draft.

Check reduced-height layouts as well as normal mobile widths. Desktop responsive
checks do not reproduce a native iOS or Android keyboard; record that distinction.

## Verification and accessibility

Follow [QA](QA.md): load the actual fonts, inspect matched BG/EN screenshots at
320px and 390px, and check native targets, painted surfaces, icon centering,
label fit and viewport overflow. Changes to shared owners also need desktop
preservation checks. Text resizing must retain content and usable controls.

The half-height icon scale is this project's visual rule. WCAG's
[44px enhanced target criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)
concerns the clickable area; it does not prescribe a label font size. Its
[text-resizing criterion](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
addresses enlargement without lost content or functionality.
