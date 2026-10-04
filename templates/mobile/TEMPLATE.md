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
On Cars and Services, the logo header and search scroll with the page. Only the
category tabs and quick-filter pills stay pinned at the top while browsing.
The raised white tab rail retains its spacing and shadow. Detail and editor
headers remain sticky so Back and dismissal controls stay available.
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

Backgrounds use the same roles across routes and viewport sizes:
`colors.background` for the continuous white page canvas, header, sticky page
controls, cards, information surfaces and overlays; `colors.controlSurface` for
fields and secondary actions. Quick-filter pills use the light control token with
a thin neutral border when inactive. Applied or selected pills invert the
existing text/page tokens for a near-black fill and white text; their border
matches the fill. Both states retain the same geometry and 48px targets.
Tab rails use the same page
or sheet surface token. No route adds its own neutral palette. The centered desktop
frame keeps the white page token, with the existing stripe token outside it.
White service, vehicle and import cards, Contact panels and enquiry starters use
the same 1px `colors.line` border. This keeps distinct groups visible on the white
canvas without adding another background color or shadow. Existing corner radii
and padding remain.

Overlay text fields use a neutral 2px focus outline. Composite search and numeric
fields outline their complete rounded container; their inner inputs have no
separate outline. Range keyboard focus identifies the active thumb. Price, year
and mileage cards are 64px tall at normal text size, retain 16px values and keep
both bounds side by side at 320px. They stack when enlarged text needs more width.
Orange remains the form-action, selected-range and validation-error color.

Home search and filter pills open one editor with the same underline tabs: Search,
Make & model, Price, Year, Fuel, Condition and More. Search opens at the text
field with matching vehicle suggestions. Options update a draft; Show cars applies it.
Close, Escape and browser Back cancel unapplied changes. The native make/model
taxonomy and selection logic power a dedicated showroom list inside that editor.
Compact Make/Model controls switch views; selected makes remain editable. Model
choices have aligned labels and selection controls, with expandable families.
Optional variants and exclusion live in a collapsed More options section.
At 700px and wider, this filter editor uses the site's 1100px width cap with
24px viewport gutters. All seven tabs share the available width. Its height is
capped at 640px or the viewport minus 48px, with options scrolling above the
fixed footer. Search, make/model and single-setting panels retain a readable
760px content cap. More groups mileage, transmission and body type into three
columns from 1000px; below that, mileage spans two columns. The desktop apply
action is 240px wide. Phones retain the full-screen editor, scrolling tabs,
stacked settings and full-width apply action.
Inventory and import cards share 16:10 photo frames, 16px corners and compact
12px body padding. Inventory photos sit inside a 12px white frame with 10px
inner corners. The title and price share a wrapping row; the trim stays below,
followed by compact year, mileage, fuel, power and transmission badges. Long
vehicle names and the factual badges wrap within the card at 320px.
Photo save actions use the same outline-heart family
as the header, with a 36px face inside a 48px button and an explicit pressed state.

Vehicle detail uses a 24px title, a quieter 14px trim line and a 24px price.
The retained price rating sits opposite the price, with slimmer bars and a 44px
details target. The finance entry uses a neutral rounded row and shorter label;
Contact and Enquire actions use 15px medium text, with 44px mobile targets and
48px targets on larger screens. Enquire uses the existing near-black text token
with white text and a visible outside focus ring. Price reductions use a small
plain chip. One raised white information
sheet overlaps the photo by 20px, with rounded top corners and a small handle.
Three equal-width Details / Photos / Features underline tabs sit at the sheet's
entrance, before the title and price, so they remain visible on short phone screens.
The selected detail tab uses the same neutral text token for its label and
underline. The handle and tab rail stick beneath the header within the information section;
the page retains one browser scroll.
Details contains the title, price, finance and contact block, mileage and other
summary facts, technical data and description. These sections share one continuous
white surface with dividers instead of separate rounded cards. Once the contact
actions pass beneath the pinned rail, a compact price + Enquire bar appears at
the bottom, with safe-area spacing and vehicle context. Photos and Features keep
this contact bar visible while their content replaces Details.
The resize-aware contact observer accounts for the pinned tab rail's actual height.
All specifications still opens the existing dialog. Photos has an inline grid and
the existing full-screen viewer. In this grid, browser Back closes the viewer,
Forward reopens its last photo, and Escape returns focus to the opener. Features
shows all equipment inline, including the retained highlight badges.
Tab selection replaces the URL fragment and preserves router state and the
inventory Back entry. Selected sections survive reload; the separate gallery
returns to the selected section. Summary facts use semantic label/value pairs,
smaller icons and shorter registration/owner labels; panel footers use 48px
controls. Buying/Leasing uses native pressed buttons, and the lease entry opens
the captured terms. Ratings, prices and finance terms remain sample data requiring
dealer verification. Owner visual acceptance and phone-browser checks remain pending.

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
Their white 40px outlined faces use 15px text inside 48px targets. Selected pills
use a near-black fill with white labels and icons.
Vehicle category assets use contained 64 x 40 boxes in 88px-wide tabs, retaining
the 52px rail height and horizontal scrolling. Their original pixels and alpha
are preserved.
Make/Model view selectors retain their 36px faces and 48px targets.
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
Inventory cards keep a variant line and two compact year/mileage and
fuel/transmission pairs. Facts wrap as whole pairs on narrow cards, avoiding
leading separators and clipped transmission labels. English Automatic is shortened to Auto in compact
facts; full values remain in the detail page and the facts tooltip.

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
Mobile uses locally bundled Manrope Latin and Cyrillic subsets under their OFL
license, keeping Bulgarian labels, model names and prices in one family. The
BG/EN header action has a transparent background and a 44px touch target. Mobile
vehicle detail ends on a white surface with dividers around contact and related
cars, without outer card frames. The mobile font and flat detail footer stay below
700px; desktop retains its original typography and framed detail footer.

Contact puts rounded grey Call us / Visit us actions on the shared white page
canvas below the logo header. The enquiry form sits in a white outlined card, centered within
620px on wider screens. Verified phone and directions enable the native links;
missing details show inactive preview actions. Email is offered when configured.
The compact Save enquiry draft button retains local storage and native validation.

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

## Development and checks

Use Node 22.x (this workstation: `L:/Toolchains/Node/22.20.0/node.exe`).
From this directory run `npm ci`, then `npm run check`.
`npm start` serves the production `.next-review` build on port **6474**.
`npm run dev` uses the same port; run one mode at a time.
Dev and production share the preview launcher, which preserves project-facing
dependency paths for Windows junctions on another drive. Dev writes to `.next`;
on Windows an existing dev-output junction selects the physical `.next-preview-6474`
fallback, including when `NEXT_DIST_DIR` explicitly points at the junction.
The launcher refuses a junction at the fallback too, keeping dev routes readable.
The local production build writes to `.next-review`. For dependencies on
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

## Personalization and release

Brand boundaries are `src/lib/showroom.ts`, `src/app/layout.tsx`,
`src/styles/tokens.stylex.ts`, `src/lib/catalog.ts` and `public/`.
The header uses a fictional SHOWROOM placeholder logo until an actual dealer logo is supplied.
The showroom configuration holds verified logo, phone, email, address, directions
and opening hours; absent contact details do not create invented call/map links.
Replace sample stock, imagery and captured detail facts for a real dealer proposal.
Preserve truthful demo responses. Example services require dealer confirmation.

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
contains an exported source snapshot and `.cars-template-source.json` receipt.
Update the master first and publish a scoped export through the existing Cars
source utilities, preserving the mirror's history. The separate
`darkapoparka/cars-app-mobile` marketplace project is independently maintained.

[The deployment record](../../docs/mobile-template-vercel-20261003.md) identifies
the initial deployed source and its focused live browser checks.
[The drawer correction](../../docs/mobile-pdp-drawer-correction-20261003.md) records
the subsequent owner-requested layout repair. This test preview does not select
a dealer release or refresh existing dealer copies.
