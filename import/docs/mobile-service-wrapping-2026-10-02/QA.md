# Narrow Services cards — 2 October 2026

On narrow cards, the title now spans the full card width above a row containing the photo, description and rounded action. Titles retain their 20px size and remain complete. The single whole-card link and service destinations are preserved.

At 320px the title has 266px available instead of 179px. All six Bulgarian and English titles stay on one line at 320, 360, 375 and 390px. Narrow cards measure 164px high; the three previously wrapped Bulgarian cards measured 190px. The existing 390px and desktop compositions are unchanged. Enlarged text retains the original reflow behavior and can wrap naturally.

| Before · 320px                     | After · 320px                    |
| ---------------------------------- | -------------------------------- |
| ![Before](before/services-320.jpg) | ![After](after/services-320.jpg) |

## Verification

Using Node 24.21.0 and the retained lockfile in the isolated C-drive candidate:

- Prettier and ESLint passed for `ServiceCard.svelte` and `mobile-secondary.e2e.ts`.
- `npm run build` passed.
- `playwright test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts --grep 'service filters|contact and account pages reflow' --workers=1 --reporter=list`: **6 passed, 2 skipped**. The skipped cases are existing desktop exclusions for mobile service filters.
- The Services regression now checks all six titles for a single rendered line and no page overflow at 320, 360, 375 and 390px in both locales. Existing search/filter recovery, white single-row filter pills and destinations also pass.
- The existing 320px/200% root-font checks pass in both locales, including complete service-title bounds.
- Browser inspection covered the same four phone widths, all six titles, the remaining cards and 1440px desktop.
- `git diff --check` passed.

Before screenshots and the wider/lower/English checks use the existing development server on port 6790. The 320px after screenshot uses the frozen production preview on port 6795. `card-geometry.json` records actual browser measurements, `verified-files.json` matches both changed files to the passing candidate, and `source-snapshot.json` records the frozen input receipt.

Unrelated work and the active development server are preserved. This correction does not promote a template release or deploy a dealer.
