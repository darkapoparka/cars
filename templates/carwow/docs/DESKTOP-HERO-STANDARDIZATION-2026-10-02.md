# Desktop hero panel standardization — 2 October 2026

The accepted Cars panel was lower than Home because each route centred its whole
heading and panel group independently. Home's 208px panel moved the heading and
panel upward compared with Cars' 146px panel. Supporting paragraphs outside the
panel introduced another difference on Contact, Financing, FAQ and other routes.

## Result

- Home now uses `DesktopYellowRouteHero`, the same component as the other primary
  desktop routes. The duplicated Home stage positioning was removed. The retained
  `/home1` photo composition keeps its existing layout.
- Home's desktop headline is shortened to "Разгледай. Купи. Продай." in Bulgarian
  and "Browse. Buy. Sell." in English. The desktop-only message was edited in
  the reviewed localization source, then its catalog and manifest regenerated.
  Mobile's headline and composition retain their existing copy and layout.
- The shared hero reserves space for its heading and starts every panel at the
  same vertical position for the current viewport. Panel height no longer moves
  the heading or panel upward. The heading area accommodates two lines of the
  existing fluid desktop title font.
- At 992, 1280 and 1440px, panels start 166px into the 400px hero, with a 24px gap
  below the heading. At 1920px, the shared start is approximately 185px because
  the existing title font grows to 57.6px. All audited routes match Cars at each
  width; content keeps at least 32px of space at the hero's bottom.
- Home's tabs are 44px high and its panel body uses less padding. Buy, Sell and
  Import all retain their fields, filters and draft behaviour, with the same
  174px panel height and position in English and Bulgarian.
- Supporting paragraphs sit inside the charcoal panel. Standard panels have a
  compact 146px minimum height, with content allowed to determine additional
  height. Existing 640px segmented and 720px standard panel widths are retained.
- Home, Blog and Sell share the same selector rules in `desktop-controls.css`:
  a 44px attached dark bar, white active state, equal-width options and inset
  keyboard focus. Home and Blog retain their inspected appearance; Sell's
  registration/VIN modes now use this bar instead of a separate small pill.
- About places phone/social links in the same 44px dark header above centred
  location/hours and a full row of yellow/white actions. About and Sell now use
  Home's 640px panel width, 130px body and 174px overall height. Blog retains its
  shorter 146px panel. Registration/VIN entry and modal behaviour are preserved.

Measured production panels at 1440px in English:

| Route    | Previous height | Current height | Current panel start |
| -------- | --------------: | -------------: | ------------------: |
| Home     |           208px |          174px |               166px |
| Cars     |           146px |          146px |               166px |
| Blog     |           150px |          146px |               166px |
| About    |        201.89px |          174px |               166px |
| Sell     |           171px |          174px |               166px |
| Services |           121px |          146px |               166px |
| Contact  |            88px |          146px |               166px |

## Verification

Runtime: retained Node 24.21.0 and npm lockfile. The existing development server
on `127.0.0.1:6464` was preserved. Production verification used a temporary Vite
preview on `127.0.0.1:6465`.

- `npm run check`: zero errors and warnings.
- Scoped ESLint and Prettier: passed for the changed source and browser tests.
- `node scripts/check-typography.mjs`: passed, 298 source files.
- `npm run test:unit -- --run`: 22 files and 187 tests passed.
- `npm run build`: passed, including the Vercel/public-asset adapter.
- Chromium production tests: 42 passed across `desktop-hero-consistency`,
  `desktop-discovery` and `desktop-sections`. The hero matrix covers 18 routes in
  English and Bulgarian at 992, 1280, 1440 and 1920px, plus the 991/992px boundary.
  Checks retain Home tab interaction, inventory filtering and focus return, Sell
  registration/VIN prefill, service selection, Blog search/filter history, and
  card state/navigation.
- Independent production browser audit: 56 desktop states across seven routes,
  both languages and four widths; no horizontal overflow, browser errors or
  controls outside their panels.
- Mobile preservation: all 28 rendered comparisons at 320/390px matched the
  fresh pre-edit signatures exactly. All 64 protected mobile/data source hashes
  matched. Mobile did not request the desktop hero artwork. New shared geometry
  and spacing tokens are scoped to `min-width: 992px`.
- `node scripts/workspace-doctor.mjs --fetch`: completed. Unrelated Cars,
  templates and independent Admin work remains outside this task's changes.

The early dev pass identified the wide Bulgarian title issue and a hover-state
assertion after exercising Home tabs. The heading reservation was corrected and
the test pointer moved away before checking the resting tab colour. Concurrent
Vite reloads also disrupted two dev navigations and an input interaction. The
final production pass above completed with all 42 tests passing.

Evidence is retained under `.audit/desktop-hero-standardization-2026-10-02/`:
fresh before/production measurements, screenshots, mobile signatures and hashes,
check/build/test logs, workspace doctor output, and source/delivery records.

The shorter Home headline follow-up repeated `npm run check`, all 187 unit
tests, the production build, scoped formatting and generated locale validation.
Its focused production browser pass confirmed a single unclipped line in both
languages at 992/1280/1440/1920px, with unchanged hero and panel geometry. All
four Home mobile signatures at 320/390px and all 64 protected source hashes
matched the original baseline. Follow-up evidence is in `short-headline/`.

The selector/contact follow-up repeated `npm run check` (zero errors and
warnings), scoped ESLint/Prettier, the typography check, all 187 unit tests and
the production build. The first 42-case browser run passed 34 cases, including
registration/VIN prefill and focus return, and exposed two differences: Sell's
width assertion still expected 720px, and the shared selector changed Home's
active text colour. The width contract now expects the intended 640px Sell
panel; Home's original active colour was restored. The final build passed all
eight affected hero/section cases. Seven passed together; the 992px multi-route
case exceeded its 30-second budget while another browser audit was running and
then passed alone in 11 seconds with the same assertions and a 60-second budget.

The final independent production audit passed 32 desktop states: Home, Blog,
About and Sell in both languages at 992/1280/1440/1920px. Home and Blog matched
their fresh pre-edit styling signatures exactly. About and Sell measured
640px wide and 174px high with 44px headers; selector options were equal-width,
and no labels, controls or panels overflowed. All 16 mobile comparisons across
those routes at 320/390px and all 64 protected mobile/data source hashes matched
the original baseline. Mobile made no desktop-artwork requests. Current
follow-up measurements, screenshots and the retained initial/final/rerun logs
are in `control-consistency/` under the audit directory.

This verifies the local reusable template. Template promotion, dealer refresh,
deployment and hosted acceptance are separate work. No mobile component, shared
content data, assets, dependencies or lockfile was edited.

## Sell input and desktop surfaces follow-up

Sell's registration/VIN entry now shares Home's 54px rounded field and 44px
trailing action through `desktop-controls.css`. The visible Continue label was
replaced with a 20px arrow; the button retains its localized accessible name,
title, submit action and modal/focus behaviour. Its new desktop-only helper is
one line in both languages at all audited desktop widths. Existing mobile
messages retain their original translations.

About has one introductory sentence beneath its hero, with the repeated
paragraph and extra contact CTA removed. Its team and brand cards now use white
surfaces with neutral borders; team names and roles use dark/readable text.
Phone/social links, location/hours and the hero's two actions are retained.

`desktop-page-frame.css` owns one cool grey desktop canvas (`#f4f6fa`) across the
18 audited routes. Primary cards and reading/form panels remain white, with
quiet grey for secondary content inside them. The existing white full-width
sections on Contact, Financing, FAQ and Terms were adapted to the canvas.
Terms has a contained white reading panel; Compare's empty state uses a white
card and a neutral icon. These adapters stay within the 992px desktop boundary
and require the selected desktop `SiteChrome`. The desktop style guide records
the shared roles and updated hero geometry.

Final verification for this follow-up:

- Svelte check: zero errors/warnings. Scoped ESLint/Prettier and the typography
  guard (298 source files) passed; all 187 unit tests and the final production
  build passed.
- Twenty interaction cases were verified across Home, Sell, About, Services,
  Blog and the shared route actions. Nineteen passed in the initial run. The
  remaining Home-to-Sell prefill test had an ambiguous selector matching both
  the hidden fallback and modal fields. It now asserts both explicitly and
  passed its isolated rerun; no product change was needed for that failure.
- Both English/Bulgarian 991/992px boundary tests passed, for 22 verified browser
  cases including the interaction set.
- The independent production audit passed 144 desktop states: 18 routes in both
  languages at 992/1280/1440/1920px. Canvas and representative card roles matched,
  with no full-width white canvas stripes, horizontal overflow or browser errors.
  Sell's field/action sizes and one-line helper matched; About had one intro
  paragraph and no duplicate intro action. Home and Blog's rendered styling
  signatures matched their fresh pre-edit baseline exactly.
- All 72 rendered mobile signatures across the 18 routes at 320/390px matched
  the fresh baseline exactly. All 64 protected mobile/data source hashes also
  matched the original baseline.

The architecture check reports the pre-existing unreferenced
`src/lib/components/shared/mobile/MobileLeadManualCard.svelte`. This file is
unchanged from `HEAD`; there are no imports of it in either `HEAD` or the current
tree. It was preserved under the owner's instruction to leave mobile untouched.
The architecture gate is therefore not claimed as passed.

Evidence, initial/final build logs, retained interaction failure and focused
rerun, desktop/mobile measurements and screenshots are in
`.audit/desktop-hero-standardization-2026-10-02/surface-consistency/`.
