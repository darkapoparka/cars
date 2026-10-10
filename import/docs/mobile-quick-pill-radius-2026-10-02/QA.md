# Mobile quick-pill radius

Home, Cars and Import now use the existing `--bc-radius-pill` token for their mobile quick-filter rows, matching Services and the desktop discovery pills. The change is three CSS declarations in the rendered component owners.

| Row                                    | Before                      | After                   |
| -------------------------------------- | --------------------------- | ----------------------- |
| Home quick searches and filter trigger | 10px                        | Shared full pill radius |
| Cars quick-filter disclosures          | General 12px control radius | Shared full pill radius |
| Import browsing preferences            | General 12px control radius | Shared full pill radius |
| Services quick filters                 | Shared full pill radius     | Already consistent      |

The measured 44px height, intrinsic widths, typography, padding, gaps, white fills and active treatments retain their existing values. Rows remain horizontally scrollable. Other control roles keep their own radii.

## Verification

- Node 24.21.0 and the retained npm lockfile.
- Scoped Prettier and ESLint checks passed for the three source files.
- `npm run check`: zero errors and zero warnings.
- `npm run build`: exit 0. The existing nonfatal Lightning CSS `@reference` warnings remain.
- Live browser review on port 6790: Home, Cars and Import at 320 × 844 and 390 × 844; Services at 390 × 844; desktop Home at 1440 × 1000. All three changed rows retain their measured 44px control height and previous widths. Measured Home, Cars and Import states have no document overflow.
- Native Home quick search followed `/bg/inventory?maxPrice=20000`; a Cars filter sheet opened and Escape dismissed the unsubmitted draft while retaining that URL.
- Existing regression tests run against the frozen production build on port 6795: inventory detail/Back URL preservation, Services search and quick filters, Import preference selection and request handoff in both locales at 320px and 390px, and desktop Home discovery links.
- Results: **9 passed** across the two focused commands; **6 existing desktop skips** for mobile-only cases.

`source-snapshot.json` records the frozen build source digest. `verified-files.json` confirms the three edited files match that build. Browser screenshots are original JPEG captures from the live development server; they are not edited or resized.

## Screenshots

| Page   | Before 320px                    | After 320px                   | Before 390px                    | After 390px                   |
| ------ | ------------------------------- | ----------------------------- | ------------------------------- | ----------------------------- |
| Home   | [Before](before/home-320.jpg)   | [After](after/home-320.jpg)   | [Before](before/home-390.jpg)   | [After](after/home-390.jpg)   |
| Cars   | [Before](before/cars-320.jpg)   | [After](after/cars-320.jpg)   | [Before](before/cars-390.jpg)   | [After](after/cars-390.jpg)   |
| Import | [Before](before/import-320.jpg) | [After](after/import-320.jpg) | [Before](before/import-390.jpg) | [After](after/import-390.jpg) |

[Services reference](after/services-390.jpg) · [Desktop Home](after/desktop-home-1440.jpg)

This evidence covers local template source and its production preview. Template release selection, dealer deployment and owner visual acceptance remain separate.
