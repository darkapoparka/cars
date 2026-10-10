# Services card polish — 2 October 2026

Mobile service cards retain the side photo and one whole-card link. Their titles now use the existing 20px entry-size token, and “Виж повече” / “Learn more” uses a compact rounded neutral pill with a 44px minimum height. The photo column is 30% instead of 35%, giving the title and description more space. Redundant mobile declarations were removed; the desktop rules and service destinations are unchanged.

## Rendered checks

- Bulgarian at 390 × 844: all six titles occupy one line. Available title width increases from 210px to 228px.
- Bulgarian at 320 × 844: available title width increases from 164.5px to 179px. The three longer titles use two complete lines; no title or action overflows.
- English at 320 × 844: the two longer titles use two complete lines. All six service links retain their original destinations.
- Bulgarian and English page widths equal the viewport width. Actions measure 44px tall; the Bulgarian pill is approximately 141px wide.
- Desktop at 1440 × 1000: the original image-over-text cards and text-link actions remain visually unchanged.
- The top-view after screenshots at 320px and 390px were captured from the frozen production preview on port 6795. Before, lower-card, English and desktop captures use the existing development server on port 6790.

| 390px before                       | 390px after                      |
| ---------------------------------- | -------------------------------- |
| ![Before](before/services-390.jpg) | ![After](after/services-390.jpg) |

| 320px before                       | 320px after                      |
| ---------------------------------- | -------------------------------- |
| ![Before](before/services-320.jpg) | ![After](after/services-320.jpg) |

## Verification

Using Node 24.21.0 and the retained npm lockfile in the isolated C-drive candidate:

- Prettier and ESLint passed for `src/lib/components/services/ServiceCard.svelte`.
- `npm run build` passed.
- `playwright test tests/mobile-secondary.e2e.ts tests/account-hydration.e2e.ts --grep 'service filters|contact and account pages reflow' --workers=1 --reporter=list`: **6 passed, 2 skipped**. The skipped cases are the existing desktop exclusions for mobile service filters. Passing cases cover search/filter recovery, the single-row white filter pills, service destinations, and the 320px/200% root-font reflow in both locales, including checks for clipped service titles.
- `git diff --check` passed.

`verified-files.json` records the exact component hash shared by the source and passing candidate. `source-snapshot.json` records the frozen input receipt; `card-geometry.json` records browser measurements.

The active development server and unrelated repository work are preserved. This is local template verification; it does not publish a dealer or promote a template release.
