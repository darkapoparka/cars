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
The bottom navigation is Cars / Services / Contact. Saved cars live in the header
and work locally without an account. Vehicle Back retains the inventory filters,
sort and scroll position. The native make/model picker and range controls remain.

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
The header uses a neutral text placeholder until an actual dealer logo is supplied.
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
