# Mobile

Mobile is the Cars master imported from `L:/inspiration/mobile-de-app`, repository
`darkapoparka/inspiration-mobile`, commit
`89e4395cdc3954857a6194612b3ae302ad7164d0` on 1 October 2026.
The source manifest records the imported files and hashes. Cars owns subsequent
edits in this directory; the inspiration checkout remains independently preserved.

## Composition and behavior

The owner-requested showroom adaptation makes Cars the home: search, vehicle
category tabs, horizontal filter pills and photo-led inventory share one screen.
The native icon row offers cars, motorbikes, e-bikes, motorhomes and trucks & more.
Used/New condition choices live inside Filters. Category selections retain their
own filters; categories without sample stock show an honest empty state.
On Cars and Services, the logo header and original search scroll with the page.
On Cars, categories and quick-filter pills also scroll away. Below 1024px, a
compact search/filter/sort row appears after the pills leave the viewport. Its
57px row has 36px painted faces inside 44px targets, 14px labels and 16px icons,
plus a short applied-filter summary and a filter count. Safe-area padding can
increase the row height on devices that need it.
Search and Filters open the existing editor; closing it restores the opener and
browsing position. The extra row is hidden and inert at the top and absent from
the desktop layout. The phone Home header groups
the retained logo, search and vehicle categories on white, with the original
unboxed category artwork. Primary phone search uses a flat light-gray fill;
compact quick pills use a lighter gray fill and dark selected faces on white.
The sticky search uses the same fill as the primary search. The phone category
scroll viewport uses the same 16px
side gutters as search and quick filters. Its category rail shares the Services
tab rail's soft shadow below 700px. Applying
filters moves browsing to that panel after the editor closes; the page keeps a single natural scroll
area, including short and empty result lists. Services retains its pinned category
tabs and quick-filter pills. Its phone category rail sits 8px below the same
flat light-gray 48px search used on Home; the rail's shadow is clipped above the
tabs and retained below them. Services uses the same continuous white canvas
and compact gray quick pills on white as Cars, with 16px from pill face to content.
Phone service cards retain their artwork, faint edge and
subtle shadow. The raised white tab rail retains its spacing and
shadow. Cancelling an editor or closing sorting restores the opener and the saved
browsing position. Detail and editor headers remain sticky so Back and dismissal controls
stay available. The sort dialog uses a concise localized title and keeps 48px
close and option targets on small screens.
The bottom navigation is a centered floating Cars / Services / Contact dock,
capped at 204px with at least 16px side gutters, 24px corners and a restrained
shadow. At normal text size it is 48px tall. The three equal-width links retain
their positions across routes and show a small icon above a persistent label.
Visible localized text provides each link's accessible name; decorative SVGs
are hidden from assistive technology. The active destination has a subtle
neutral fill and stronger text color.
Links have at least 44px height,
retain their keyboard focus rings, and use `aria-current`.
The existing Lucide package supplies 20px car-front, service-grid and message
glyphs with a consistent 1.8px stroke. Labels use 0.75rem text and may wrap
when enlarged. The preceding cutout experiment remains archived locally,
outside the runtime assets.
The dock floats 10px
above the bottom safe area; page clearance and toast offsets
account for its height. Vehicle detail retains its own enquiry footer.
The formerly used Phosphor source and MIT license remain under
`src/components/icons/phosphor/` as provenance. Saved cars live in the header
and work locally without an account. Vehicle Back retains the inventory filters,
sort and scroll position. The native make/model picker and range controls remain.

At 1024px and wider, Cars, Services, Contact and Saved cars use a 72px logo header
with centered Cars / Services / Contact navigation, an avatar menu for Saved cars,
Settings and language, plus a separate hamburger menu on the right. Cars is home;
the navigation uses compact 34px tab faces with 10px corners, a subtle active
fill, 48px click targets, visible keyboard focus and `aria-current`. The bottom
dock is hidden at this breakpoint. Header navigation uses the same destination
data as the phone dock and retains inventory filters and sort on return to Cars.
The 280px hamburger dropdown is labelled Demo account, shows the local saved-car
count and links to Saved cars and Settings. It introduces no authentication or
account transmission. Legacy donor profile routes are not exposed by this menu.
It sits 6px below its trigger, with a small pointer centered on the Menu button
and a restrained shadow to make the header attachment clear.
Individual service choices remain on the Services page. Links
remain native navigation, with arrow-key shortcuts, Home/End, Escape and focus
return. Outside clicks, focus leaving the menu and the phone breakpoint dismiss it.
Phones keep their floating dock, spacing and navigation behavior.
The desktop page frame is capped at 1400px with at least 24px outer gutters.
`showroom-desktop-tokens.stylex.ts` owns the frame width and gutters.
Home, Saved and related cars share the listing grid: four columns from 1024px,
five from 1440px.
Vehicle and enquiry action bars use the same frame bounds.
Desktop cards lead with 20–22px bold prices and 16px medium-weight names,
followed by year, mileage, gearbox and fuel pills. Phone cards retain 15px medium-weight names
and 18px prices. Phones and tablets show
two columns, with one-column reflow for enlarged phone text or a single saved car.
Responsive listing image sizes follow the photo bounds.
Cars, Services and Contact share a 380px desktop hero below the 72px header,
with the same location line, heading typography, vertical heading anchor and
28px content-drawer overlap. The shared hero stylesheet and ShowroomHeroHeading
own this frame. A two-row desktop grid centers the heading and a 68px control
row. Home keeps its 1040px vehicle-search capsule and existing fields;
non-car search keeps its 880px width. Services uses a single 620px search
capsule in the hero. All / Import / Sell appear as desktop pills in the
content drawer below, alongside contextual service filters. They inherit
Home's desktop base font, use 16px/22px labels with 40px painted faces inside
44px targets, 12px horizontal face padding and 8px gaps. No additional button
padding widens the category pills. The category/filter handlers and keyboard
navigation remain. The control row can wrap at narrower desktop widths.
Contact uses compact 44px write/call/map actions in the same hero control row.
Write focuses the existing enquiry field; Call appears only for a verified
configured phone, and the map action uses the existing contact location.
The white description capsule is replaced by natural-width actions.
The contact body is capped at 1040px with a map/details panel beside the enquiry
form, aligned at the top rather than stretched to equal heights. The desktop
map panel uses 20px padding, an 18px title and 15px contact details. Supporting
form copy retains 16px text.
Below 1024px the shared wrappers remain display: contents; phone headings
retain their accessible hidden treatment and the phone control composition.
Services and Contact inherit the same base font as Home instead of forcing a
separate desktop font. Desktop navigation retains its compact 34px faces with
16px text.
Utility headers use 24px titles on desktop. Settings supporting copy and language
options use 16px desktop text; their phone typography remains unchanged.
Escape also closes desktop filter popovers when focus remains on their trigger.
In desktop All filters, keyword search spans the modal body beneath the title
and close control. Two quiet surfaces group make/model and numeric ranges, then
fuel, gearbox, body type and condition. From/To share one outlined field; checkbox
options use plain rows within their group. These compact styles apply only to
All filters; phone editors and desktop quick popovers retain their presentation.
The fixed footer applies the draft; Escape cancels and restores the opener.
Phone Services tabs retain their existing underline composition.

Desktop inventory uses compact, natural-width pills for Year, Mileage, Fuel,
Gearbox, Body type and Condition in a soft gray sticky rail. White 36px faces
sit inside 44px targets; applied criteria use the existing orange accent. All
filters stays neutral with a quiet count badge, alongside a matching Sort pill
at the right end of the rail. Clear is a small labelled icon when criteria apply.
The rail wraps when needed without a horizontal separator. Mileage, Gearbox and
Body type open and focus their actual fields in More, using the filter editor's
existing draft and apply flow. Make and Price remain in the hero fields. The
cards follow the rail directly; the extra stock heading and duplicate count are
removed. Desktop browsing accounts for the rail's actual height when it wraps.
The inventoryDesktop presentation is
opt-in; phone pills and Services retain their existing rails and appearance.

Backgrounds use the same roles across routes and viewport sizes:
`colors.background` for the continuous white page canvas, header, sticky page
controls, cards, information surfaces and overlays; `colors.controlSurface` for
fields and secondary actions. Inactive quick-filter
pills use the white page token with a faint border and no shadow. Applied or selected pills invert the
existing text/page tokens for a near-black fill and white text; their border
matches the fill, without a shadow. Phone Cars and Services quick pills share compact white 36px faces and 14px
labels inside 48px tap targets, with the same geometry when selected. Desktop inventory pills use
38px faces and 44px targets. Their flat presentation keeps them secondary to
search and category navigation.
Tab rails use the same page
or sheet surface token. No route adds its own neutral palette. The centered desktop
frame keeps the white page token, with the existing stripe token outside it.
Phone search keeps the shared pill shape around its flat light-gray 48px target.
Home and Services category rails use a quieter lower shadow, retaining their
active underline. Inactive quick-filter pills use the lighter gray stripe token
with transparent borders on the white rail; selected pills retain their dark fill.
Tablet controls and desktop quick-filter pills retain their existing geometry and styling.
Vehicle cards use the owner's Signature references at port 6478. Desktop cards
have a faint rounded edge and a white information panel over the photo edge.
Year, mileage, transmission and fuel use quiet pills below the name. Phones use
unboxed photo/name/year-and-mileage/price cards. Inventory, Saved and related
vehicles share the card; photographs remain clear of specification badges.
On phones, a `colors.background` results sheet sits beneath the
quick pills with 16px before the first card. Cars uses a continuous white canvas;
Services also uses a continuous white canvas without raised upper corners. Both
lists retain the page's natural scroll. Cars keeps compact search/filter/sort
access while browsing; Services retains its sticky pill row. The edge token has
a corresponding dark-theme value.
Service and import cards, Contact panels and enquiry starters retain the same
1px `colors.line` border. Existing corner radii and padding remain.

Overlay text fields use a neutral 2px focus outline. Composite search and numeric
fields outline their complete rounded container; their inner inputs have no
separate outline. Range keyboard focus identifies the active thumb. Price, year
and mileage cards are 64px tall at normal text size, retain 16px values and keep
both bounds side by side at 320px. They stack when enlarged text needs more width.
Orange remains the form-action, selected-range and validation-error color.

Home search and filter pills open one editor with the same underline tabs: Search,
Make & model, Price, Year, Fuel, Condition and More. Search opens at the text
field with matching vehicle suggestions. Options update a draft; Show cars applies it.
The phone editor's scrolling tab rail reaches both viewport edges. Labels use
equal 8px inner padding in 52px targets, with an 8px rail gutter so the first label
aligns with the 16px fields. Short labels retain a 48px minimum width rather than
extra width that changes their apparent gaps. The 3px underline fills the selected
target, with space below its text box. This edge treatment is scoped to
the phone filter editor; the category row and other tab layouts retain their styles.
The phone editor title uses 18px semibold type; section headings use 16px semibold,
tabs use 16px medium, and the active tab uses semibold. Search, make search,
numeric bounds and budget presets share 16px outer gutters and start 16px below
the rail. Search and make fields have matching icon/text insets and an 8px gap
before their list rows. Range controls use a 56px slider area, with 16px before
price shortcuts and 24px between separate filter groups. Search fields and the
apply action have 48px targets. Search results follow the field directly, without
an introductory heading. Suggestions align regular-weight muted prices with the
16px medium vehicle name and use 14px facts below it. Embedded category and model
lists share the fields' outer gutters; nested model rows retain their indentation.
The white heading remains continuous with the tabs,
whose shadow is clipped above and retained below the underline.
Close, Escape and browser Back cancel unapplied changes. The native make/model
taxonomy and selection logic power a dedicated showroom list inside that editor.
On phones, choosing or editing a brand opens its models directly. A single Makes
back action and brand heading replace the two view selectors; their navigation
row keeps a constant height. Model choices have aligned labels and selection
controls, with expandable families.
The phone model list names its brand in the All models row. Unchecking that row
removes the brand and returns focus to its brand choice. The Makes back action
returns to brands while retaining model selections and clearing
the model search. Phone search results show year and mileage beneath the model,
with a right arrow beside the price. Selecting a result applies the current search
and opens that vehicle; returning to inventory preserves the search. Show cars
still applies the draft to the full matching inventory.
Desktop uses separate brand and model panels with independent search fields.
Brand checkboxes select and deselect directly; a separate edit action opens an
existing brand's models. A labelled Remove action stays beside the model heading.
Removing a brand clears its model criteria and search, then returns keyboard
focus to that brand's checkbox. Unchecking All models also removes the brand.
Make and Model use equal-width panels with quiet backgrounds, matching search
fields, 18px headings and 16px model rows. Selected brands summarize their models;
model checkboxes align on the left and selected rows use a neutral surface.
Phones use their own full-width brand and model rows.
Optional variants and exclusion live in a collapsed More options section.
Price shortcuts offer Any and upper limits of EUR 40,000, 60,000 and 100,000.
They replace both price bounds; custom ranges clear the shortcut highlight.
The labelled Clear action resets every draft section while preserving its vehicle
category. Show applies the cleared draft; closing cancels it. Both actions retain
their positions as the match count and selected filter section change.
At 700px and wider, this filter editor is capped at 820px with 24px viewport
gutters. Seven 16px tabs share a fixed 56px height, a quiet background and an
inset underline. Their weight stays constant on selection, and their widths
follow their labels so larger text fits without shifting neighboring tabs.
Long labels can wrap at spaces. Search fields use a light surface and border;
brands have aligned 20px checkboxes and a visible Remove action. A quiet inset
outline retains keyboard focus. The desktop apply button stays stationary with
instant hover feedback.
The dialog has a fixed height of 680px or the viewport minus 48px, so tab changes,
selections, searches and family expansion cannot recenter the frame. Only the
inner content scrolls above the fixed footer. The model list and its always
reachable More options disclosure have their own bounded scrolling areas.
More puts mileage across the first row, with transmission
and body type in two columns below. Rounded selection rows share a quiet surface.
Desktop content has 24px gutters and a 240px apply action with 16px text.
The native backdrop uses an 8px blur with a light 22% dim on desktop.
Phones retain the full-screen editor, scrolling tabs, stacked settings and
full-width apply action.
Inventory, Saved and related vehicles use 3:2 photos. Desktop uses four columns
from 1024px and five from 1440px. The white rounded information panel starts
20px over the photo edge. A 20–22px bold price leads the panel, with a 16px
medium-weight model name 4px below it. Four neutral fact pills form two rows
8px below the heading: year and mileage, then transmission and fuel. The rows
have a 6px gap. Desktop panels retain 16px padding. Small cards use 12px facts
and 20px prices; wider cards use 13px facts and 22px prices. Desktop
names can occupy two lines, with the full name in the tooltip.
The full card opens its vehicle. The price is plain text, with no extra badge.
The trim and power remain in the vehicle details.

Phones show two compact cards per row, with 15px medium-weight, single-line
names, 12px year/mileage text and 18px prices. Long names use an ellipsis; the
full name remains in the tooltip and accessible card label. The caption starts
6px below the photo with 2px content gaps; the price row follows its text height.
Year/mileage uses a 1rem line box and the price uses 1.25 line-height. The
price row uses the full card width.
Their 12px-rounded photos have no fact overlay. White padding embedded in the
BMW 120 photos is cropped before clipping, matching the desktop crop. The 8rem minimum card width keeps two columns at 320px even with a 15px
classic scrollbar. The grid can reduce to one column for enlarged text or a
single saved car. Phone and tablet cards below 1024px have no wishlist overlay;
saving remains in the vehicle page's header. Desktop cards retain their small
photo-corner heart, with a 17px outline, 26px visible face and 44px target.
A full-card native link opens the correct vehicle, preserves inventory return
context and has an inset keyboard focus ring. There is no separate desktop
View button; the full-card link is the primary navigation target.
The Saved empty state directs people to open a car to save it. Bulgarian PDP
condition values use `Употребяван` and `Нов`, including the compound new/accident
status. Visible section labels use `Описание` and `Подобни` without repeating
that the page describes a car. Captured vehicle facts and save storage are intact.

BMW X6, 540 and X3 desktop covers use selected existing exterior gallery photos;
phones retain their original images through the picture's media source.
The 540 cover keeps its existing crop; embedded donor branding remains in some
sample photographs. Known letterboxed photos retain their desktop crop helper.
Import cards retain their 12px padding.

Phone vehicle detail retains its compact 20px title, 18px advertised price,
rounded trim pills and side-by-side Contact and Enquire actions. An explicitly
supplied price rating sits beside the title. CSS grid lets long names wrap without
hidden measurement elements or layout observers. Price notes appear only when
supplied; sample disclosure remains below the detail content. Summary controls
retain 44px targets. The finance entry shows the same illustrative estimate as
the local calculator. Enquire uses the existing near-black text token with white
text and a visible focus ring. One raised white information sheet overlaps the
photo by 20px, with rounded top corners. The summary precedes the three equal-width
Details / Features / Photos tabs.
The selected detail tab uses the same neutral text token for its label and
underline. The handle and tab rail stick beneath the header within the information section;
the page retains one browser scroll.
Details contains the title, price, finance and contact block, mileage and other
summary facts, technical data and description. These sections share one continuous
white surface with dividers instead of separate rounded cards. Once the contact
actions pass beneath the pinned rail, a compact price + Enquire bar appears at
the bottom, with safe-area spacing and vehicle context. Photos and Features keep
this contact bar visible while their content replaces Details.
On phones, its Enquire pill has a 36px visible face inside a 44px tap target,
with a 120px minimum width. The compact scrolled header brings the title 8px
closer to Back while retaining each icon's 44px target.
Below the phone vehicle description, Financing uses an inset neutral banner with
a calculator icon, the existing monthly amount and a chevron. The whole banner
opens the local calculator and restores focus on dismissal. It appears below
700px; tablet and desktop retain their existing finance entry.
The resize-aware contact observer accounts for the pinned tab rail's actual height.
All specifications still opens the existing dialog. Photos has an inline grid and
the existing full-screen viewer. In this grid, browser Back closes the viewer,
Forward reopens its last photo, and Escape returns focus to the opener. Features
shows all equipment inline, including the retained highlight badges.
From 1024px, the full-width vehicle heading sits above the gallery and price card.
The title wraps independently of save/share, which sit opposite the quieter trim
line. Four captured vehicle facts share a grey strip underneath. The shorter right
card groups the advertised price and rating, the labelled Financing row and contact
actions. Features uses a two-column semantic checklist with leading checks. The
phone and tablet retain their native composition. Features uses one responsive
semantic list instead of separate mobile and desktop render trees.
Desktop rating, finance and contact dialogs restore focus to their opener after
dismissal, including pointer activation in Safari.
Tab selection replaces the URL fragment and preserves router state and the
inventory Back entry. Selected sections survive reload; the separate gallery
returns to the selected section. Summary facts use semantic label/value pairs,
near-black icons centered in a 44px column and shorter registration/owner labels.
The six fact icons share the heading's themed text color.
The fact icons use 40px boxes; the taller calendar uses 36px and Fuel has a small
optical inset. The fact grid has no trailing padding before the section inset.
Technical data uses a rounded inset table with alternating shaded rows; panel
footers use 48px controls. Summary CTA faces are 36px on mobile and 40px on desktop
inside 44px targets. Buying/Leasing uses native pressed buttons, and the lease
entry opens the captured terms. Ratings, prices and finance terms remain sample data requiring
dealer verification. The integration report records source and rendered browser checks.

Services has three equal-width All / Import / Sell tabs that fill the viewport.
Import and Sell use white starter cards with the same thin border. Import puts
a small globe beside its heading and a neutral entry area. Their compact entry
buttons open a three-step enquiry sheet at the optional VIN field. Under the tabs,
secondary pills filter services, example import
countries or sale purpose. Country and sale type prefill new enquiries; resumed
drafts retain edits made inside the sheet. Import examples show illustrative
country badges in a larger single-column mobile list, with two columns on desktop.
Their origins are demo data, not evidence of
completed dealer imports. Drafts stay on the device; forms do not send an enquiry,
decode a VIN or invent a valuation.
Import and Sell starter headings use the same 18px size. The entry summary stays
on one line and exposes its full value through an accessible description and
tooltip. Native 48px entry targets and smaller Start faces are retained.

Underline tabs use a raised white strip without a full-width border. The 12%
shadow with a 4px drop and 8px blur provides elevation. The rail paints above
following content so its shadow stays visible. Flush detail tabs remove the top
margin and keep the same elevation.
The 52px targets and 3px active underline remain. Home tabs scroll horizontally
at their own widths. Filter editor tabs scroll on phones and share the dialog
width on desktop. Services distributes its
three categories equally across the viewport, allowing labels to wrap at larger
text sizes. The wider indicator follows the retained native search reference.
Home and service pills sit on the same white canvas as the listings below.
Their compact white outlined faces use 14px text inside 48px targets. Selected pills
use a near-black fill with white labels and icons.
Vehicle category assets use contained 64 x 40 boxes in 88px-wide tabs, retaining
the 52px rail height and horizontal scrolling. Their original pixels and alpha
are preserved.
The phone Makes back action and price shortcuts retain 48px targets.
Each service overview card is one native link, with a smaller 28px View/Enquire
cue with a small right chevron at top right and its description across the full
width below. Cues align with the first title line, including wrapped titles;
paired desktop cards use equal heights. Short descriptions keep this service
directory compact without promotional imagery. The All pill
includes the service count, updated for the search query; no separate count row
appears above the cards. Service detail CTAs have 36px painted faces inside 44px
targets and use their natural width. Starter entries keep 48px targets with a
smaller 32px Start face.

Home places Sort in the quick-pill row, with Clear at its end when filters are
active. Inventory starts directly below the controls, while the result count
remains available to screen readers. Home and Services share a 44px search trigger
with 16px labels. Text entry happens inside the mobile full-screen overlay, with
a contained dialog on desktop. Services search previews matching offerings and
applies the query to All; cancelling retains the original category, country or
topic. Both searches preserve drafts until applied and support Close, Escape and
browser Back. Search uses one custom Clear action, suppresses the browser's extra
search adornments and provides a Search keyboard action. Enter applies the search;
composition input is preserved. Opening Cars search focuses the input once;
switching filter tabs retains their keyboard navigation. Pill and tab focus
rings use the showroom accent; the dock uses the neutral text color. All sit
inside their targets. Toasts account for
the phone's bottom safe area.
Bulgarian is the default language. The mobile header's BG/EN control switches the
showroom, filters, details, equipment, service forms and enquiry UI immediately.
The choice persists on the device; `?lang=bg` and `?lang=en` override it for shared
links. Language settings use the same store. Vehicle filter identifiers and user
messages remain unchanged. Bulgarian search matches translated fuels, body types
and services. Display copy replaces German listing advertisements with factual
vehicle summaries; the captured reference data remains intact.
Showroom cards and galleries use the actual vehicle photos and omit captured
German finance, sale and testimonial slides. Original assets stay in the reference
catalog; verified dealer photos are still required for a real proposal.
Mobile uses the locally bundled Inter v4.1 Latin/Cyrillic variable font under its
OFL license, keeping Bulgarian labels, model names and prices in one family. Its
upright Cyrillic forms replace the rounded Manrope treatment. Font provenance,
coverage and the retained license live in `public/fonts/inter-v4.1.json` and
`public/fonts/inter-OFL.txt`. The
BG/EN header action has a transparent background and a 44px touch target. Mobile
vehicle detail ends on a white surface with dividers around contact and related
cars, without outer card frames. The mobile font and flat detail footer stay below
700px. Below 1024px, vehicle detail retains its native gallery, summary, tabs,
compact header and enquiry dock.

From 1024px, vehicle detail uses the showroom logo header and a rounded Back to
cars button with 28px of space above it. The full-width vehicle heading and four
quick facts sit above the gallery and purchase card. Save and Share align with
the quieter trim line and retain 44px targets plus labels on hover and for
assistive technology.
Checklist remains available below the contact actions. A two-column layout pairs
a 16:10 gallery, photo arrows and five preview thumbnails with a 360px purchase card. That card
retains the existing price, reference rating, buying/leasing state, calculators
and vehicle-specific enquiry routes. A quiet grey panel groups the four quick
facts beneath the title; the price and reference rating share one row, with
wrapping available for enlarged text. It stays visible while the left column's
Details, Photos and Features panels scroll. Short desktop viewports use a normal
flow card; enlarged text can scroll within a tall sticky card. Specifications,
showroom contact and related vehicles use consistent framed sections. All new
layout rules start at 1024px; the phone composition and behavior are preserved.

Phone vehicle actions retain 44px tap targets; the header uses its original 24px
icons inside 36px visible circles with a quiet shadow. The summary leaves 8px
below Enquire and Contact before the tabs.
Switching a visible Details, Features or Photos rail keeps the page steady.
When the rail is pinned after scrolling into a panel, the next panel starts at
its beginning beneath the rail. Selecting the active tab preserves the position.
Phone tab rails share one clipped upper-shadow rule, keeping white surfaces
continuous while preserving the underline and elevation below each rail.

On phones, Contact opens with a concise heading and one-line description. Call
and email actions use configured contact details. The neutral template also shows
a disabled Call us preview with the phone inside the same white card pattern
as Write to us. The placeholder remains display-only. One Write
to us card previews the current message and opens the full-screen enquiry overlay,
with native autofocus on the message field. Vehicle enquiries show the selected
car's photo, model and price in the card and overlay; the overlay also links to the car.
Close, Escape and browser Back dismiss it and return focus to the opener; edits
remain intact. The overlay header stays visible above its scrollable form.
The form has 16px input text, 48px fields and a rounded submit button below the
final field. Phone and email share a row from 380px and stack on narrower phones.
Contact details and the message save together as a local draft; the form does not
transmit enquiries. The location card follows
with the optically centered conceptual showroom illustration, configured address
and a rounded Visit us button, without an extra location caption.
Opening hours only appear when configured. The floating dock hides while the
mobile keyboard is open, and the page leaves scroll space below the location card.
Phone and email links appear when configured; missing dealer contacts are omitted.
Directions retain their existing location preview behavior.
At 1024px and wider, Contact shares Home's image/header banner and rounded drawer.
Its location panel and enquiry form use equal-height grid columns, with no fixed
card height. `ShowroomContactPanel` shows a compact, lazy-loaded map, configured
address, phone/email, opening hours and social links. The form grows with the
panel while retaining local storage and native validation.

The imported marketplace screens and taxonomy remain reference source. Old
`/search` and `/results` entry links resolve to Cars. Fixture data and local storage
keep the template usable without a live dealer service. Contact saves local enquiry
drafts and never claims to have sent an enquiry.

Draft saves report actual storage success. If device storage is unavailable,
Contact retains edits in the current session and explains that they were not
persisted. Import/Sell confirms both its form and the Contact draft before
showing a saved stage. Toasts are transient and do not trigger storage writes.
Validation errors describe fields without changing their accessible names.
Escape cancels filled search editors and returns focus; composition input is
preserved. All specifications establishes its opener before displaying the dialog,
so focus returns correctly in WebKit as well as Chromium. Active filter counters
stay within the scrolling pill row.
The favicon reuses the neutral car interface icon, rendered in dark ink on a
white tile at 16, 32 and 48 pixels; native mask assets remain intact.

Next.js 16, React, TypeScript and StyleX are preserved with the original dependency
versions. Required fonts, native SVGs, vehicle photographs, data catalogs, domain
tests are included. Android screenshots and UI hierarchies are retained locally
under ignored `reference/android/` for comparison; the inspiration checkout is
their canonical reference source. A fresh source checkout builds and runs from
the committed product assets without these native captures. Donor secrets, Git metadata,
deployment identity, dependencies, generated builds and old browser QA outputs
were excluded using the existing Cars source exporter.

## Header menu

Cars, Services and Contact share one avatar control on the right. Its Radix
dropdown follows the shadcn menu pattern in the existing StyleX design system.
Saved cars links to the existing saved inventory and displays the local count.
Bulgarian and English choices use the shared locale store; Settings opens the
same working language preference at `/settings`. Desktop also retains its separate
hamburger button for the local Demo account menu. Desktop destinations are visible
in the centered header navigation; phones retain their bottom navigation.

The portrait at `public/images/demo/profile-avatar-20261008.webp` was generated
for this demonstration and depicts a fictional person. The menu is labelled
Guest; it does not imply an authenticated account or a real customer identity.
Replace the demo portrait when wiring a verified account avatar. The generation
receipt is recorded in Cars `docs/mobile-profile-menu-20261008/`.

## Development and checks

Use Node 22.x (this workstation: `L:/Toolchains/Node/22.20.0/node.exe`).
From this directory run `npm ci`, then `npm run check`.
`npm start` serves the production build on port **6474**.
`npm run dev` uses the same port; run one mode at a time.
Dev and production share the preview launcher, which preserves project-facing
dependency paths for Windows junctions on another drive. Dev writes to `.next`;
on Windows an existing output junction selects the physical `.next-preview-6474`
fallback for dev or `.next-review-local` for build/start, including when
`NEXT_DIST_DIR` explicitly points at the junction. The launcher refuses a junction
at the fallback too, keeping route output and server dependency resolution on the
source drive. The usual production output remains `.next-review`. For dependencies on
another drive, the launcher also supplies an external `NEXT_WEBPACK_CACHE_DIR`
for dev. Route output stays on the source drive while large webpack caches use
the dependency cache location. Explicit cache paths and `NEXT_DIST_DIR` remain supported.
The shared launcher also supports this template:

```powershell
./scripts/start-preview.ps1 -Template mobile -Port 6474 -NodePath L:/Toolchains/Node/22.20.0/node.exe
```

Run that command from the Cars root. Supply `QA_URL=http://127.0.0.1:6474`
and a fresh `QA_OUTPUT` under Cars `runtime/` before running copied browser suites.
Keep source and build unchanged during acceptance.
After the layout matrix passes on a frozen build, `QA_SCOPE=state` reruns only
the architecture suite's cross-tab, draft and storage checks. The default scope
still includes the complete viewport matrix and state checks in both engines.

The header logo and five category illustrations use display-sized lossless WebP
derivatives of the approved PNG artwork. The original masters remain in `public/`.
Run `node scripts/prepare-showroom-assets.mjs` after replacing those masters to
regenerate the derivatives. This only resizes and encodes existing artwork.

## Personalization and release

Brand boundaries are `src/lib/showroom-config.ts`, `src/lib/showroom.ts`, `src/app/layout.tsx`,
`src/styles/tokens.stylex.ts`, `src/lib/catalog.ts` and `public/`.
The header uses a fictional SHOWROOM placeholder logo until an actual dealer logo is supplied.
The showroom configuration holds verified logo, phone, email, address, directions,
opening hours, `mapEmbedUrl`, and `socialLinks` entries with `label`/`href`.
Use the dealer's Google Maps Share > Embed URL for `mapEmbedUrl`; no API key is
embedded in the template. Phone and social destinations remain absent until
supplied. Desktop shows a display-only example phone when `contactPreview` is
enabled; it never creates a call action for that placeholder. Address and phone
share the same small muted icons and row typography. The map CTA sits beside
the showroom heading, keeping contact details together below it.
The neutral Contact demo uses the owner's existing Varna example address
without an extra location caption. Set `contactPreview: false` when personalizing.
A verified address, directions URL or map always takes precedence over that
example, so a real dealer address is never paired with the demo map.
Replace sample stock, imagery and captured detail facts for a real dealer proposal.
Preserve truthful demo responses. Example services require dealer confirmation.

Set a stable dealer slug in `showroom.storageNamespace` when personalizing. It
isolates saved cars, all local enquiry drafts, language and browsing records when
dealers share a browser origin. Keep that slug across template updates. The
standalone template uses `null` to retain its existing saved data. The build
rejects personalized configurations that reuse the standalone namespace, retain
example contacts, or contain invalid contact links. Server and browser metadata
use the configured name. See [the finalization contract](docs/FINALIZATION.md).

Run `npm run qa:showroom` against port 6474 after lint, typecheck, domain tests and
the production build. This adaptation has its own browser checks; historical
marketplace screenshot contracts do not establish showroom acceptance.
Run `npm run qa:polish` for Bulgarian/English reflow, Escape, validation and
storage-failure/retry regressions in Chromium and WebKit.

The catalog registers a working library candidate. No dealer release is selected,
and the existing dealer generator and default design sets remain as recorded.
Dealer mounting, personalization adapters and exact-source release
acceptance remain required before offering Mobile as a published dealer design.

Read [the imported architecture reference](docs/REFERENCE-ARCHITECTURE.md) as
historical donor context. New copy-specific results belong in Cars `docs/`.

## Hosted test preview

The standalone showroom candidate is available at
[cars-template-mobile.vercel.app](https://cars-template-mobile.vercel.app/), with
the [BMW X6 detail page](https://cars-template-mobile.vercel.app/vehicle/bmw-x6)
ready for phone testing. Its private GitHub publishing mirror is
[darkapoparka/cars-template-mobile](https://github.com/darkapoparka/cars-template-mobile).
Vercel builds that repository on Node 22.x; its production branch is `main`.

Cars `templates/mobile` remains the editable master. The publishing repository
contains an exported source snapshot and `.template/source.json` receipt.
Update the master first and publish a scoped export through the existing Cars
source utilities, preserving the mirror's history. The separate
`darkapoparka/cars-app-mobile` marketplace project is independently maintained.

[The deployment record](../../docs/mobile-template-vercel-20261003.md) identifies
the initial deployed source and its focused live browser checks.
[The drawer correction](../../docs/mobile-pdp-drawer-correction-20261003.md) records
the subsequent owner-requested layout repair. This test preview does not select
a dealer release or refresh existing dealer copies.

## Mobile contact and Services polish — 8 October 2026

The Contact location caption is removed on phone and desktop. Mobile Call us
contains its number beneath the heading inside a white card matching the enquiry
entry. The configured phone still controls real dialing; the neutral preview
number remains disabled. Services reserves a right chevron column even at 320px
and aligns it with the title. Its search surface sits above the tab rail below
1024px, and the phone tab wrapper contains its top spacing. The tablet Services
divider is removed. Phone search uses the same light-gray surface and 48px height
throughout the non-desktop layout. Inactive discovery pills use the lighter gray
stripe token on a white rail below 1024px; selected pills
retain their dark state and the category rail retains its soft lift.
