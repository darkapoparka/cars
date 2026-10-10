# Services mobile consistency — 2 October 2026

Home and Services now share `MobileSearchControl.svelte`: the existing 48px white pill, 18px search text and inset dark circular action. Home retains its dialog controller, focus restoration and modes. Services edits a real search input and submits its native GET form. The desktop Services field and other `SearchField` consumers retain their existing styling.

Services uses one image-left card composition across normal phone widths. Concise localized mobile titles replace the narrow-screen title-above-image workaround. Titles keep their 20px size; short descriptions are shown in full. Text can wrap naturally when enlarged. Desktop titles, summaries, artwork and destinations are retained. Search includes the visible mobile copy as well as the original descriptions and included work.

| Before · 320px                        | After · 320px                       |
| ------------------------------------- | ----------------------------------- |
| ![Before](before/services-bg-320.jpg) | ![After](after/services-bg-320.jpg) |

The Home 390px before/after screenshots have identical SHA-256 hashes. Additional evidence covers Services at 390px, English at 320px, the remaining Bulgarian cards and desktop.

`verified-files.json` matches the six changed source/test files to the frozen candidate. `source-snapshot.json` records its input digest. Unrelated working changes and the active 6790 development server are preserved. This is focused local template verification, without template promotion or dealer deployment.

## Verification

Node 24.21.0 and the retained lockfile were used in the isolated C-drive candidate.

- Scoped Prettier and ESLint passed.
- `npm run check` passed with zero errors and warnings; `npm run build` passed.
- `playwright test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts tests/mobile-sheet-regressions.e2e.ts --grep 'service filters|contact and account pages reflow|home sourcing helper' --workers=1 --reporter=list`: **8 passed, 4 skipped**. The skips are existing desktop exclusions for mobile-specific tests.
- The Services regression checks both locales at 320, 360, 375 and 390px, white single-row filter pills, filter/empty recovery, visible-summary search, native query submission and destinations.
- Existing 320px/200% root-font checks pass in both locales, including service-title bounds. Existing Home import-dialog and contact-continuation checks pass in both locales. The Home buy search action was also checked manually for opening and Escape focus restoration.
- Browser measurements confirm 20px single-line titles, zero page overflow at all four phone widths, and a 48px pill search with 18px text. Desktop was inspected at 1440px.
- `git diff --check` passed.

Before captures use the preserved development server on 6790. Final Services captures at 320px, 390px, English 320px and desktop use the frozen production preview on 6795; the lower-card and Home comparisons use 6790. `card-geometry.json` records the measured Bulgarian phone layouts. This evidence covers local Chromium rendering and the listed flows, without a physical-device or full-template-release claim.
