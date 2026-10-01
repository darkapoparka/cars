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
The committed product-source fingerprint excludes native captures and generated
`.qa/` test output. All 653 committed source files match the verified working copy.

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
Automatic approval review blocked their relocation command. Both copies remain
preserved; no original reference files were moved or deleted.

## Android reference

**emulator-5554 is online with mobile.de 10.26 open on its home screen.** Its
complete reference runtime now uses `C:/Users/radev/AppData/Local/Cars/mobile-89e4395-20261001/`.
Launch logs confirm that user data, encryption, cache, RAM and temporary paths
are on C:. System images remain read-only on I:. The original L: AVD remains
preserved. The local restart helper is
`runtime/mobile-20261001-artifacts/start-reference-emulator.ps1`.

The preserved `Pawtreon_Reference_Pixel_9_Pro_API_36` AVD was initially opened on
**emulator-5554**. It initially booted, passed ADB checks, and opened mobile.de 10.26.
It also contained CARS24 UAE, AutoScout24 and DubiCars. AutoScout24 26.38.6 home,
results and filter screens were inspected and captured.

L: fell from approximately 5 GiB free before launch to approximately 27 MiB.
The emulator subsequently exited and disappeared from ADB. After L: recovered to
about 4.2 GiB and RAM was checked, one controlled recovery boot used verified
copies of its user-data and cache disks plus temporary files on C:, with read-only
mode and snapshots disabled. It reached ADB online, but QEMU still mapped the
original RAM image under the L: AVD, and L: fell to roughly 295 MiB free. The
recovery emulator was shut down through ADB. The complete C: AVD was then
configured after its six disk hashes were reverified. That runtime booted and
kept its writable paths on C:. L: recovered to about 4.1 GiB free and remained
stable. Original data and the verified C: recovery copies remain preserved.
The observed timing does not by itself prove which process caused the first exit
or every byte of drive growth.

The complete C: cold boot did not expose the original installed app set. The
cached mobile.de APK was restored into this read-only session, and its home was
inspected after declining optional tracking and notifications. The restart helper
restores this cached APK after boot. CARS24's cached base APK requires absent split
APKs; installation failed with `INSTALL_FAILED_MISSING_SPLIT`. AutoScout24 and
DubiCars were inspected/found on the original AVD, and are not installed in the
current C: session. Original AutoScout24 captures remain under
`runtime/mobile-20261001/native-autoscout24*.png`. No account or contact action
was submitted.

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
