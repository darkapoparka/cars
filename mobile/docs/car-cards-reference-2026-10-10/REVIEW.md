# Vehicle cards following the owner's Signature references

References inspected live: http://127.0.0.1:6478/ and
http://127.0.0.1:6478/2. Desktop borrows their rounded white information panel,
quiet fact pills and separate price/action row. Phone cards borrow /2's clear
3:2 photo, compact name, muted year/mileage and distinct price.

The showroom keeps four desktop columns. Its phone inventory uses two compact
columns, reducing to one for enlarged text or a single saved car. Save remains
a working local action: a small photo-corner heart on desktop and a quiet heart
beside the phone price. Desktop's View link opens the actual vehicle detail.
Vehicle facts, original photos, locale/storage behavior and the header/hero
source remain intact. Captured sample photographs still contain donor branding.

## Retained comparison

- [Desktop before](before-1440.png) / [desktop after](after-1440.png), 1440 x 1000.
- [Phone before](before-390.png) / [phone after](after-390.png), 390 x 844.

These are the four captures for this revision, using the same route, viewport,
inventory and scroll anchor. The previous comparison folders remain declared
design baselines because they are linked in the owner's review conversation.
No additional build, dependency installation, static-asset copy or screenshot
matrix was created. Targeted pre-edit source snapshots in
`.qa/card-reference-owner-20261010/` are recovery evidence.

## Focused checks

The existing development preview at http://127.0.0.1:6474/ was reused.
Chromium checks passed at 320, 390, 1024 and 1440px: no page overflow, clipped
visible facts or clipped prices; usable save targets and visible keyboard focus.
Bulgarian and English were checked at 390 and 1440px. At 320px, 200% text switches
to one column with prices fitting. Phone save/reload/remove, card/detail/related
navigation and browser Back passed. The desktop View link also passed.
The updated live in-app browser was inspected with the photos visibly loaded.

Scoped ESLint and strict typecheck passed. Domain logic did not change.
Production build/release checks were not run for this local visual iteration,
following the owner's proportional QA instruction.

Baseline card SHA-256: `c4b7cc37b7965da304e34a8c94bd58c54e953e79849412951bdbc673d574f16c`.
Final card SHA-256: `4ed9cc408187ac3e6493d825087a9bd3b78dd49711b3e6aed606c49075b04066`.
The evidence JSON records this final source and the individual viewport results.
Edits remain local in the shared Cars main checkout; this is not a hosted release.

## Density and mobile typography follow-up

The owner requested smaller desktop cards and single-line, lighter phone names.
The grid now has five columns from 1440px, with four from 1024px. Desktop panel
padding is 16px, content gaps are 10px, and names use 16px semibold type.
At 1440px the first card changes from 318.3 x 385.3px to 251.4 x 320.7px.

Phone names use 15px medium-weight type with single-line ellipsis. Full names
remain accessible. Caption padding drops to 6px, gaps to 3px, and the price row
to 2rem. At 390px the first card changes from 213.5px tall to 196.2px, while
the 44px save target remains centered on the price and independently clickable.

- [Desktop before](after-1440.png) / [desktop after](density-after-1440.png).
- [Phone before](after-390.png) / [phone after](density-after-390.png).

The follow-up adds only two captures, reusing the previous final captures as
matched baselines. Both comparisons are retained because they show distinct
owner-requested revisions and are linked in the review conversation.
The compact density report records focused checks at 320, 390, 1024, 1439 and
1440px, including the four-to-five-column boundary. No overflow, clipped prices
or clipped visible facts; phone titles stay on one line; save/remove remains
independent. English phone text and 200% text reflow also passed. Scoped ESLint
and diff checks passed. The existing dev preview and dependency installation
were reused; no production build or broad regression suite was run.

## Price spacing and photo corners

The owner identified lingering price spacing and square-looking photos. The
phone price now sits 2px below a 16px year/mileage line box; its row follows the
22.5px price line instead of reserving 32px. The desktop View target keeps its
44px hit area with transparent 8px extensions, removing 16px of empty flow
height. Mobile save targets also remain 44px and centered on the price.

BMW 120 source photographs have embedded white bars. The existing desktop
letterbox crop now applies on phones too, so the actual photograph reaches the
rounded clipping frame. Original image files and gallery data are preserved.

- [Phone before](density-after-390.png) / [phone after](price-photo-after-390.png).
- [Desktop before](density-after-1440.png) / [desktop after](price-photo-after-1440.png).

This defect correction adds two captures and reuses the preceding density
captures as its matched baselines. Earlier pairs remain linked design-review
evidence. Focused checks at 320, 390, 1024 and 1440px passed, including save/remove,
44px targets, single-line mobile names, English text, full prices, unclipped facts
and 200% phone text reflow. A pixel check confirms the affected photograph no
longer has its white top strip. Scoped ESLint and diff checks passed.
Current card source SHA-256: `580f23e654a83395434408f0581e12788d4556c2109a74b6adf7834abed5e2c7`.
The source is tied to `price-photo-verification.json`. No production build,
dependency copy, full regression campaign or hosted release was created.

## Remove the competing View button

The owner preferred the fact pills and price without a separate dark View pill.
The shared vehicle card now has one native full-card link plus its independent
save button. The price stands alone below the facts. Unused View action styles
and markup were removed; photo treatments, typography and fact pills are intact.

- [Desktop before](price-photo-after-1440.png) / [desktop after](no-view-after-1440.png).

Only one new screenshot was retained, paired with the preceding final capture.
At 1440px each card has one native link, its focus ring is visible, and clicking
the displayed price opens the correct vehicle. At 390px all phone card heights
match the preceding capture; save/remove, English text, prices and facts passed.
Scoped ESLint and diff checks passed. Source SHA-256:
`7adf6e0b1cbfe1dd29da80af4a67bb0c67f943e9c2bfde803316be1295bee14a`.
Focused results are in `no-view-verification.json`; the existing preview was reused.

## Price-first desktop hierarchy

The owner requested price above the model instead of below the fact pills.
Desktop captions now lead with a 20–22px bold price. The 16px medium-weight
model sits 4px below it, followed by the existing quiet fact pills after 8px.
The price remains plain text. A grouped heading provides this hierarchy while
retaining the compact phone title, metadata and price order.

- [Desktop before](no-view-after-1440.png) / [desktop after](hierarchy-after-1440.png).

Only one new capture was added. The preceding final capture is its matched
baseline; earlier linked revisions remain declared design-review evidence.
At 1024 and 1440px, all cards read price, model, facts with a larger, heavier
price. Full prices and visible facts fit; clicking the price opens the right car
and native focus is visible. At 390px, all phone heights match the preceding
version. The 320px check, 200% text reflow, English text and independent
save/remove checks also passed. Scoped ESLint and diff checks passed.
Source SHA-256: `804aaeee48ad149d019733136c243060b3aaf4621b95b61b3bf01d0e52b5a276`.
Results are in `hierarchy-verification.json`. This local visual iteration reused
the preview and dependencies without a production build or broad release checks.

## Quieter secondary facts

The owner asked whether the card could be improved further. Desktop cards keep
the year and mileage pills, while transmission and fuel share one muted 12px
line. The price-first heading, four/five-column grid, photography and compact
phone composition are retained. At 1440px the first card is now 285.7px tall,
compared with 293.7px in the preceding revision.

- [Desktop before](hierarchy-after-1440.png) / [desktop after](quiet-facts-after-1440.png).

Only one new capture was added, reusing the preceding final capture as its
matched baseline. Focused checks at 1024, 1440 and 390px passed: full prices and
facts fit, native card navigation and focus work, and independent save/remove
and English text work. All phone card heights match the preceding revision.
Scoped ESLint and diff checks passed. Source SHA-256:
`8c5fcdee4eeed46ab0e1c99233725dfcbdb2d31f7ce3de3debbe8bc0450af952`.
Results are in `quiet-facts-verification.json`. The existing preview and
dependencies were reused without a production build or broad release checks.

## Restore all four pills and correct narrow phone grid

The owner rejected removing the gearbox/fuel pill treatment. All four desktop
facts again use the matching two-by-two pills, retaining the price-first heading.
The real in-app browser reproduced a one-column defect at 320px: its classic
scrollbar leaves only 273px for the grid, below the former 8.5rem card minimum.
Reducing that minimum to 8rem preserves two columns with 129.5px cards. Saved
uses the same corrected minimum; enlarged text and a single saved car still
reflow naturally.

- [Phone before](restore-pills-before-320.png) / [phone after](restore-pills-after-320.png).
- [Desktop before](quiet-facts-after-1440.png) / [desktop after](restore-pills-after-1440.png).

Three new captures were retained: the reproduced phone defect and two final
views. The preceding desktop capture supplies the matched desktop baseline.
The phone comparison reserves the same 15px scrollbar space before and after;
the real in-app browser also confirms two columns with full prices and no
price/heart overlap. Focused checks at 1440, 390 and 320px passed, including four
matching desktop pills, card navigation, keyboard focus, independent saving,
English text, no overflow and enlarged text reflow. The 390px card heights remain
unchanged. Scoped ESLint and diff checks passed. Card source SHA-256:
`804aaeee48ad149d019733136c243060b3aaf4621b95b61b3bf01d0e52b5a276`.
Results are in `restore-pills-verification.json`. No production build or broad
release checks were run for this correction; the live preview was reused.

## Move the phone wishlist heart to the photo

Following the owner's approval, the phone save control now sits in the photo's
top-right corner, matching the desktop placement. Its 17px outline uses the
existing 26px white face and 44px tap target. The price row no longer reserves
44px for a heart, leaving its full width available to the price.

- [Phone before](restore-pills-after-320.png) / [phone after](corner-heart-after-320.png).

Only one new capture was retained; the preceding final phone capture is its
matched baseline. Focused browser checks passed at 320, 390 and 1440px, including
two phone columns with a reserved classic scrollbar, full prices, independent
save/remove, English text, keyboard focus, card navigation and enlarged text
reflow. Phone card heights and desktop card/type/price/heart geometry match the
preceding revision. The real phone preview confirms all hearts are inside the
photo corner and the price row has zero reserved right padding.
Scoped ESLint and diff checks passed.
Source SHA-256: `67638472e4df84bc1e84f3043e64285fd15818457468dfa44f346910d55810cd`.
Focused results are in `corner-heart-verification.json`. The existing preview
was reused; no production build or broader release campaign was run.

## Keep saving on the vehicle page for compact cards

The owner asked to leave the small card photos clear and save from the vehicle
page. Cards below 1024px now have no visible or accessible wishlist control;
the existing vehicle-header save control remains available. Desktop card saving
is retained. The Saved empty-state hint now directs people to open a car.

Bulgarian condition values now read `Употребяван`, `Нов` and
`Нов, без произшествия`. The nearby headings use `Описание` and `Подобни`.
Captured vehicle facts and the existing saved-car storage are unchanged.

- [Cards before](corner-heart-after-320.png) / [cards after](pdp-save-cards-after-320.png).
- [Vehicle copy before](pdp-copy-before-320.png) / [vehicle copy after](pdp-copy-after-320.png).

Three new captures were retained, reusing the preceding card capture as its
matched baseline. Both 320px comparisons reserve the same classic scrollbar
space and use the same content anchor. Focused checks at 320, 390 and 1440px
passed: two phone columns, full prices, unchanged phone card heights, card-to-PDP
navigation, PDP save/reload/Saved-list/remove, concise used/new labels and
headings, matching Bulgarian/English empty-state hints, retained desktop card
save/remove and no page errors or overflow. The live in-app phone preview also
confirms the shorter labels and the vehicle-header save control.

Scoped ESLint and diff checks passed. Source hashes and focused results are in
`pdp-save-verification.json`. The existing preview and dependency installation
were reused; no production build or broader release campaign was run.

## Compact search access while browsing

The owner requested the proposed mobile search/filter/sort row. Below 1024px,
the initial header, search, categories and quick pills retain their composition.
The quick pills now scroll away. Once they leave the viewport, a fixed 61px row
provides search, an explicit filter control and sorting, each with a 44px target.
Applied selections appear in one ellipsized summary with a full accessible
label; the filter control shows the active count. The existing editor, sorting
and inventory state remain the source of behavior. Desktop has no extra row.

- [Before scrolling controls](toolbar-before-390.png) / [after](toolbar-after-390.png).
- [Applied-filter summary](toolbar-active-390.png).

Three useful captures are retained in the existing owner output: a matched
390px pair and the applied-filter state. The pair reserves the same classic
scrollbar space and anchors Audi RSQ8 at 210px. Initial 390px card, photo, title
and price geometry matches the baseline exactly. Browser checks confirmed the
toolbar's height and targets, no overflow, inert hidden controls, search draft
dismissal with focus/scroll restoration, price/fuel apply with the correct count
and summary, and price sorting with focus/scroll restoration.

The focused script stopped at a reset selector that matched both the quick-rail
and dialog clear buttons. That selector is now scoped to the dialog. Reset,
PDP-return, English, 320px and desktop after checks have not been rerun: automatic
browser review subsequently blocked reopening the localhost page. The failure
and source hashes are retained in `toolbar-verification.json`, with the matched
baseline in `toolbar-baseline.json`. This is partial browser validation, not a
passed full report.

Scoped ESLint, strict TypeScript and diff checks passed. The stopped preview was
restarted on 6474 with the existing Node 22 dependency installation and physical
`.next-preview-6474` output. No new build copy, production build, dependency
installation or broad release campaign was created.

## Match sticky controls to the compact pills

The sticky controls now paint 36px faces inside transparent buttons with a
minimum 44px width and height. Search uses 14px text with a 20px line height;
all three icons are 16px. The targets retain an 8px gap. With 6px vertical
padding, the row is 57px high before any device safe-area inset. The action
count stays anchored to the visible filter circle. The existing click handlers,
overlay focus restoration and visibility observer are unchanged.

Scoped ESLint, formatting and diff checks passed. The existing Node 22 preview
on 6474 returned HTTP 200 after recompilation. No restart, dependency install,
production build or new generated output was needed.

The three retained toolbar captures above show the previous 44px painted faces.
Visual rechecks at 320px and 390px remain pending because automatic browser
safety review previously blocked opening the localhost page under its URL
policy. No alternative browser route or headless workaround was attempted.

## Flat gray search and quick pills

The phone control family now uses the existing light-gray control surface for
primary and sticky search, the lighter stripe fill for inactive quick pills,
and dark selected faces. Search shadows and visible inactive pill borders are
removed. The primary search retains its 48px target; compact faces, text sizes,
gaps, tap regions and category rail composition keep their existing geometry.
Services uses the same phone treatment. Desktop search and pill overrides keep
their previous styling.

The [saved white phone baseline](pdp-save-cards-after-320.png) and the existing
6474 preview provide the available comparison. The flat treatment is the local
design choice; fresh matched 320px/390px screenshots and visual acceptance remain
pending under the previously recorded browser URL safety block.

Scoped ESLint, formatting, strict TypeScript and diff checks passed; the updated
preview returned HTTP 200. Source recovery copies share the existing owner
folder with `.tonal-before` suffixes. No new generated build, dependency copy,
production build or screenshot workaround was created.

## Lower and center the desktop hero content

Cars, Services and Contact now share a 380px desktop hero with balanced 64px
vertical padding and centered heading/control groups. The former 300px hero
aligned its content toward the top with 56px/40px padding. The new geometry is
expected to move the one-line Buy heading and search box roughly 60px lower at
1440px. The content drawer starts 80px lower. The current image, header,
24px heading-to-control gap, 28px drawer overlap and compact inventory columns
keep their existing styles.

The reference is App's existing shared `ShowroomBanner` and centered desktop
journeys, verified in the canonical App source and its retained
`docs/desktop-final-polish-2026-10-09/after-home-1440.png`. The edit is confined to
desktop hero geometry and alignment; the hero wrappers remain `display:
contents` below 1024px with the existing phone compositions.

Scoped ESLint, formatting and diff checks passed. The existing preview returned
HTTP 200 for Cars, Contact and Services after the edit. Rendered desktop and
phone comparisons remain pending because of the existing browser URL safety
block. The pixel positions above are expected from the source geometry, not new
browser measurements. Source recovery copies use `.hero-position-before` in the
existing owner folder; no build, dependency copy or new screenshot was created.

## Align Home, Services and Contact hero content

The equal-height heroes still centered different content: Services stacked a
48px category rail above its 60px search, while Contact placed a paragraph
between its heading and 44px action. That moved headings and controls even
though their outer banners were the same height.

`showroom-hero.stylex.ts` and `ShowroomHeroHeading` now share the desktop frame,
location line, heading typography, 24px gap and white 68px control surface.
The car search keeps its existing field layout and 1040px width (880px for
non-car categories). Services places its category tabs and search in a single
row, with a quiet selected tab and the same orange search cue as Home.
Contact places its supporting copy beside the call/write action in that row.
Its existing verified-phone/local-form destination is retained.

Below 1024px, layout surfaces remain `display: contents`; the Contact row and
desktop Services tabs are hidden, and the existing phone search, category rail,
quick filters and card layout remain the mobile composition. The phone search
keeps its left icon; the orange cue is desktop-only.

Scoped ESLint and formatting checks passed for the eight changed component and
style files. Strict TypeScript passed without incremental output. The existing
6474 preview returned HTTP 200 for Home, Services and Contact. Rendered desktop
alignment and the phone comparison are still pending under the previously
recorded browser URL safety rejection; no screenshots or visual acceptance are
claimed. The current sources are preserved in the existing owner folder with
`.hero-consistency-before` suffixes. No production build, generated-output copy,
dependency installation or browser workaround was used.

## Size the control areas to their content

The owner correctly challenged the equal 1040px control widths. Home needs
space for several vehicle criteria, while the simpler Services and Contact
controls looked unnecessarily stretched. Services now uses a 620px search
capsule with compact All / Import / Sell tabs above it. Their visible faces
are 36px high inside 44px buttons; the existing keyboard and category handlers
are unchanged. Contact's copy/action capsule is capped at 720px. Home retains
its existing 1040px car search and 880px non-car search.

The shared desktop frame now uses a heading row and a 68px base row. This
anchors the title independently of Services' extra navigation row; that row
and its search extend into the available space below. The common 380px banner,
location line, title typography and drawer overlap are retained. The search
surface is painted separately from Services' transparent tab navigation.
Phone wrappers remain `display: contents`, with the existing phone search and
category rail. No new menu state or domain behavior was introduced.

Scoped ESLint, formatting and strict TypeScript checks passed for this edit.
The existing preview responded successfully after recompilation. Rendered
desktop and phone verification remains pending because of the earlier browser
URL safety rejection. No fresh screenshots are claimed. The preceding layout
sources use `.hero-width-before` in the existing owner recovery folder; no new
build output, dependency copy or screenshot workaround was created.

## Move Services categories below the hero

The Services hero now contains only its 620px search capsule. All / Import /
Sell use the existing desktop-pills category row in the content drawer below
the hero, alongside contextual service filters. The duplicated hero tabs and
their screen-specific wrappers were removed. Desktop category labels are 16px
with 38px painted faces inside 44px buttons; the selected category is dark.
The outer control row can wrap at narrower desktop widths. Below 1024px,
the existing phone category rail, search and quick-filter presentation remain.
The category, search, filter and keyboard handlers are unchanged.

Scoped ESLint and formatting checks passed for the four changed source files.
Strict TypeScript passed without incremental output, and scoped diff checks
passed. The existing 6474 preview returned HTTP 200 for Services, Import and
Sell. These status checks do not establish rendered appearance or interaction
acceptance. Visual verification and matched screenshots remain pending under
the automatic browser safety review's URL policy rejection. No browser
workaround, new screenshots, production build or dependency copy was used.
The previous source is preserved with `.services-pills-before` suffixes in
the existing owner recovery folder; temporary replacement files were consumed.

## Match Services controls and compact desktop Contact

The non-inventory drawer forced Mobile UI on desktop while Home inherited
Mobile Base. That made Services and Contact typography differ despite matching
numeric font sizes. The override is removed. Services categories now use the
same 16px/22px base-font labels, 40px painted faces, 44px targets, 12px face
padding and 8px gaps as Home's quick pills, without the extra outer padding.

Contact replaces the wide description capsule with natural-width 44px hero
actions. Write focuses the existing enquiry textarea, Call is conditional on
a configured verified phone, and the map action uses the existing location
helper. The 380px shared hero and its 68px control row remain. The desktop
body is capped at 1040px; map/details and enquiry panels align at the top
without equal-height stretching. The desktop map panel has 20px padding,
an 18px title and 15px detail text. Phone layouts and local-draft saving remain.

An interpolation mistake in the patching script temporarily malformed three
style blocks. Those blocks were repaired from their preserved context and
parsed before replacement. The final six changed source files passed scoped
ESLint, Prettier and strict TypeScript without incremental output. Scoped diff
checks passed. The existing 6474 preview returned HTTP 200 for Home, Services,
Contact and the BMW 540 enquiry context. These are source/HTTP checks, not
rendered or interaction acceptance. Visual checks and matched screenshots
remain blocked by the automatic browser safety review's URL policy rejection.

The seven prior source/document files use .contact-compact-before recovery
suffixes in the existing owner folder. Replacement stages were consumed.
No production build, dependency copy, new screenshots or browser workaround
was used; the existing preview and Home control styles were retained.
The category rail also uses a 44px desktop minimum height; its 52px phone rail is retained.
