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
The bottom navigation is Cars / Services / Contact, using one 24px outline icon
family with a simple side-profile car. Saved cars live in the header
and work locally without an account. Vehicle Back retains the inventory filters,
sort and scroll position. The native make/model picker and range controls remain.

Every Home filter pill opens one editor with the same underline tabs: Make & model,
Price, Year, Fuel, Condition and More. Options update a draft; Show cars applies it.
Close, Escape and browser Back cancel unapplied changes. The native make/model
taxonomy and selection logic power a dedicated showroom list inside that editor.
Compact Make/Model controls switch views; selected makes remain editable. Model
choices have aligned labels and selection controls, with expandable families.
Optional variants and exclusion live in a collapsed More options section.
Inventory and import cards share 16:10 photo frames, 16px corners and compact
12px body padding. Long vehicle names wrap within the card; inventory keeps its
two single-line subtext rows. Photo save actions use the same outline-heart family
as the header, with a 36px face inside a 48px button and an explicit pressed state.
Services has three equal-width All / Import / Sell tabs that fill the viewport.
Import uses a white starter card with a thin border, a small globe beside its
heading and a neutral entry area; Sell keeps its white starter box. Their compact entry
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

Underline tabs keep 52px targets and use a wider 3px active rail. Home and filter
editor tabs scroll horizontally at their own widths. Services distributes its
three categories equally across the viewport, allowing labels to wrap at larger
text sizes. The wider indicator follows the retained native search reference.
Home and service pills use
lighter 32px outlined faces inside 48px targets, with neutral filled selection
and a stronger selected border.
Make/Model view selectors retain their 36px faces and 48px targets.
Each service overview card is one native link, with a smaller 28px View/Enquire
cue at top right and its description across the full width below. The All pill
includes the service count, updated for the search query; no separate count row
appears above the cards. Service detail CTAs have 36px painted faces inside 44px
targets and use their natural width. Starter entries keep 48px targets with a
smaller 32px Start face.

Home places Sort in the quick-pill row, with Clear at its end when filters are
active. Inventory starts directly below the controls, while the result count
remains available to screen readers. Home and Services share a 44px search field
with 16px input text. Text search stays inline; filter pills open the tabbed editor.
Search uses one custom Clear action, suppresses the browser's extra search adornments
and provides a Search keyboard action. Enter dismisses the keyboard after inline
filtering; composition input is preserved. Pill, tab and bottom-navigation focus
rings use the showroom accent and sit inside their targets. Toasts account for
the phone's bottom safe area.
Inventory cards keep two subtext rows: one variant line and one year/mileage/
fuel/transmission line. Automatic is shortened to Auto in the compact facts;
the full values remain in the detail page and the facts tooltip. Long rows
truncate rather than creating a third line.

Contact puts rounded grey Call us / Visit us actions on a white strip below the
logo header. A white enquiry card sits in the grey section below, centered within
620px on wider screens. Verified phone and directions enable the native links;
missing details show inactive preview actions. Email is offered when configured.
The compact Save enquiry draft button retains local storage and native validation.

The imported marketplace screens and taxonomy remain reference source. Old
`/search` and `/results` entry links resolve to Cars. Fixture data and local storage
keep the template usable without a live dealer service. Contact saves local enquiry
drafts and never claims to have sent an enquiry.

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
on Windows an existing `.next` junction selects the physical `.next-preview-6474`
fallback. The local production build writes to `.next-review`. For dependencies on
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

The catalog registers a working library candidate. No dealer release is selected,
and the existing dealer generator and default design sets remain as recorded.
Dealer mounting, personalization adapters, localization and exact-source release
acceptance remain required before offering Mobile as a published dealer design.

Read [the imported architecture reference](docs/REFERENCE-ARCHITECTURE.md) as
historical donor context. New copy-specific results belong in Cars `docs/`.
