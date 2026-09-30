# Hugeicons mobile navigation

The mobile header, dock, menu and inventory toolbar use the official MIT-licensed `@hugeicons/core-free-icons` package, version 4.3.5, retrieved 30 September 2026 from the npm registry. Library documentation: https://github.com/hugeicons/hugeicons. Package integrity: `sha512-Sv+NjHRPnQk+yZsGCMcGznCHdTfJR9PMMOEKcJYAQU4gy90dmlc9PwdtvYOImBZIjiheMsTLL5eMn2DmHxUiUg==`.

`hugeicons-mobile.ts` contains the selected unmodified Stroke Rounded SVG geometry: Home01, Car01, SaleTag01, Globe02, DashboardSquare01, Location01, Call02, Search01, FilterHorizontal, ArrowUpDown, Cancel01, News01, Building03 and ArrowRight01. Camel-case SVG attribute names are converted to their standard attribute spelling. `MobileActionIcon.svelte` renders native SVG elements without raw HTML, an icon font or a runtime package. CSS selects a 1.8px stroke for legibility; viewBoxes and geometry remain unchanged. Mobile inventory search renders at 22px; dock glyphs at 24px.

The matching upstream MIT notice is retained in `hugeicons-LICENSE.txt`. All glyphs are decorative; localized links and buttons supply their accessible names. The renderer is used only in mobile surfaces so desktop icon consumers retain their presentation.
