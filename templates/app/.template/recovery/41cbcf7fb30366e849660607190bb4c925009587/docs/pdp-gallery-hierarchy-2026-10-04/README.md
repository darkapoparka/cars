# PDP photo previews and stat hierarchy — 4 October 2026

The latest correction trims the exterior/interior/details previews from 76 to 74px high, keeping the same three columns, imagery, readable labels and photo counts. Mileage, gearbox and fuel return to a single muted text line with middle-dot separators. Removing the grey badge backgrounds gives the segmented information controls a clearer role as the interactive row. The compact “Подобни” / “Similar” control from the preceding correction is retained.

| Element | Before | After |
| --- | --- | --- |
| Photo category previews | 76px tall | 74px tall |
| Mileage, gearbox, fuel | Three grey 26px badges | One muted 20px text line |
| Similar action | 28px visible pill, 44px target | Same sizes and existing drawer |
| Photo counter | 24px tall | Same size and 1 / 18 count |

| Matched view | Before | After |
| --- | --- | --- |
| Bulgarian 390 × 844, scroll 0 | [Before](bg-390-before.jpg) | [After](bg-390-after.jpg) |
| Bulgarian 1440 × 900, scroll 270 | [Before](bg-1440-before.jpg) | [After](bg-1440-after.jpg) |

Focused browser checks cover Bulgarian 320/390/768/1440px and English 320/390/1440px. All photos loaded, the three preview controls stayed in one row, and the stats stayed on one line without horizontal overflow. Keyboard activation opened the exterior photo viewer with all six photos; Escape dismissed it and restored focus. The exterior information tab selected correctly, and returning to the information tab restored the overview. See [before geometry](before-geometry.json), [verification results](verification.json) and [English mobile](en-390-after.jpg).

`npm run check` passed on Node 22.20.0: ESLint, TypeScript and the isolated Webpack production build (407 pages). No browser console errors were recorded. The live preview's type references were restored after the build.

This correction supersedes the badge trial in [the preceding comparison](../pdp-gallery-facts-2026-10-04/README.md). Its screenshots and measured results are retained as historical evidence.
