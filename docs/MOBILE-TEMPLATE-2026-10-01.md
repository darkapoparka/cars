# Mobile template import — 1 October 2026

The Cars library now contains **Mobile** at `templates/mobile`, imported from the
clean `L:/inspiration/mobile-de-app` checkout at commit
`89e4395cdc3954857a6194612b3ae302ad7164d0` (`darkapoparka/inspiration-mobile`).
The original source remains unchanged. The existing Cars exporter recorded file
hashes in `templates/mobile/.template/source-manifest.json`.

## Preview and verification

Open **http://127.0.0.1:6474/**. The shared launcher supports
`-Template mobile -Port 6474`. Node 22.20.0 and the retained npm lockfile were used.
The new template has its own dependency installation and build output on C:;
directory junctions preserve the canonical source in Cars. The preview wrapper
and Webpack configuration preserve dependency junction paths on Windows when
dependencies live on another drive.

Verified on this copy:

- ESLint and TypeScript passed.
- All 57 domain tests passed.
- Production build passed, including 48 generated static pages.
- Browser smoke showed the Mobile title, rendered controls, successful hydration
  and no framework error overlay.
- The route/polish suite passed 45 routes, 48 responsive cases and six additional
  assertions, with no browser errors or external requests.
- All 13 interaction scenarios passed: filters/sort, saved searches, parking and
  comparison, gallery gestures/zoom, vehicle details, local drafts, dealer follows,
  local sell drafts, preferences, storage recovery and responsive route coverage.
- Widths include 320, 390 and 1440 pixels. Mobile and desktop captures were viewed.
- `node scripts/check-workflow.mjs` and PowerShell launcher parsing passed.

The full Cars workflow suite passed **243 of 244** tests. The existing failure is
`Auto Best refresh keeps approved hero artwork and restores Navara dealer data`
at `scripts/refresh-client.test.mjs:175`: the assertion expects an inline
`i18n.dealer('addressLine')` binding in Auto Best's Hero, which now renders the
separate `HeroLocation` component. This task did not modify those files or weaken
the assertion. The same failure was reproduced with a saved test log.

The compact machine-readable receipt is [mobile verification](mobile/2026-10-01/verification.json).
Raw reports remain local under `runtime/mobile-20261001-artifacts/qa/`.

## Template status

The catalog registers Mobile and the preview launcher can run it. Its original
mobile.de UI, seller identities and captured fixtures remain recognizable for
reference review. The import is a working library candidate; dealer adaptation,
localization, mounting and exact-source release acceptance are still required
before it becomes a published dealer design. The existing release lock and
dealer design sets were not changed by this task.

Product fonts, native icons, photographs and domain catalogs are source assets.
Native Android screenshots/UI hierarchies are local comparison evidence under
ignored `reference/android/`, rather than product assets published with the clone.
A byte-identical C: copy of all 1,614 reference files (191,842,674 bytes) was prepared.
Their relocation is awaiting the owner response because automatic approval review
blocked the relocation command; both copies remain preserved.

## Android reference

The preserved `Pawtreon_Reference_Pixel_9_Pro_API_36` AVD was opened once on
**emulator-5554**. It initially booted, passed ADB checks, and opened mobile.de 10.26.
It also contained CARS24 UAE, AutoScout24 and DubiCars. AutoScout24 26.38.6 home,
results and filter screens were inspected and captured.

L: fell from approximately 5 GiB free before launch to approximately 27 MiB.
The emulator subsequently exited and disappeared from ADB; L: recovered to about
590 MiB. It was not restarted, wiped or relocated. Its data remains on L:. More
space is needed before another boot. The observed timing does not by itself prove
which process caused the exit or every byte of the drive growth.

## Final app reference recommendation

**AutoScout24 is the recommended final template reference** for the European
dealer portfolio, based on the four candidates reviewed. This is a design choice,
not a claim of an objective worldwide winner.

Its live Android interface gives us a search-first home, simple make/model entry,
category chips, clearly separated filter rows, prominent search actions and a
persistent navigation bar. Its price assessments, saved searches and structured
dealer/detail information are relevant patterns for our projects.
The [Google Play listing](https://play.google.com/store/apps/details?id=com.autoscout24&hl=en)
showed 4.7 stars and 50M+ downloads when researched.

Compared with the alternatives:

- [CarGurus](https://play.google.com/store/apps/details?id=com.cargurus.mobileApp&hl=en)
  is a strong reference for deal ratings, history and price-drop information. Its
  inspected Play promotional screens include iPhone chrome, so they do not establish
  the current Android interface or native flow acceptance.
- [Autotrader UK](https://play.google.com/store/apps/details?id=uk.co.autotrader.androidconsumersearch&hl=en)
  has useful stock/search patterns and a distinctive identity; its listing and
  promotional imagery were reviewed, without installing the Android application.
- [Cars.com](https://play.google.com/store/apps/details?id=com.cars.android&hl=en)
  offers dense stock rows and direct contact actions. Its listing and public
  preview imagery were reviewed, without installing the Android application.

No additional template was generated from these candidates during this import.
