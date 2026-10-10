# Mobile quick-filter corner comparison

The mobile quick-filter rows on Home, Cars, Import and Services use the existing `--bc-radius-control` token, which resolves to 12px. Four CSS declarations replace the full-pill radius. This provides the requested live comparison without changing control height, spacing, typography, selection, scrolling or destinations.

The rendered owners are `HomeFiveHero.svelte`, `InventoryMobilePage.svelte`, `ImportBrowseControls.svelte` and the mobile filter rule in `src/routes/(site)/services/+page.svelte`.

## Visual evidence

Original browser JPEG captures from port 6790, at matching 320 × 844 and 390 × 844 viewports:

| Page     | Full pills at 320px               | 12px at 320px                   | Full pills at 390px               | 12px at 390px                   |
| -------- | --------------------------------- | ------------------------------- | --------------------------------- | ------------------------------- |
| Home     | [Before](before/home-320.jpg)     | [After](after/home-320.jpg)     | [Before](before/home-390.jpg)     | [After](after/home-390.jpg)     |
| Cars     | [Before](before/cars-320.jpg)     | [After](after/cars-320.jpg)     | [Before](before/cars-390.jpg)     | [After](after/cars-390.jpg)     |
| Import   | [Before](before/import-320.jpg)   | [After](after/import-320.jpg)   | [Before](before/import-390.jpg)   | [After](after/import-390.jpg)   |
| Services | [Before](before/services-320.jpg) | [After](after/services-320.jpg) | [Before](before/services-390.jpg) | [After](after/services-390.jpg) |

`measurements.json` records all four mobile rows at 320px: every control retains its 44px height, resolves to a 12px radius, and the document does not overflow horizontally. Desktop Services still uses its existing full-pill controls at 1440 × 1000; see [desktop capture](after/services-desktop-1440.jpg).

Home was left open in the in-app browser with the normal viewport restored. Screenshots are unedited and are independent of the frozen production-preview test results.

## Source verification

The frozen candidate has its own build output and the retained Node 24.21.0/npm lockfile. `source-snapshot.json` records its source digest; `verified-files.json` confirms the four edited source files match the candidate.

- Scoped Prettier and ESLint checks passed for all four source files.
- `npm run check`: zero errors and zero warnings.
- `npm run build`: exit 0, with the retained nonfatal CSS/build warnings.
- Existing Services search/filter regressions run against the frozen preview on port 6795, covering both locales and the 320px, 360px, 375px and 390px card layouts.
- Result: **2 passed**, with **2 existing desktop skips** for these mobile-only cases.

Local template polish does not promote a release or deploy dealer copies. Visual acceptance remains with the owner.
