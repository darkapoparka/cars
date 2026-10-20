# Desktop specification cards

Основни данни and Детайли now use compact specification lists. Their 20px headings use the body font, alternating grey row bands connect labels to values, and all values share a right edge. Labels and values stay at 16px, including the stock number. Columns size themselves from their content instead of fixed field widths; cards fit their row counts instead of stretching to equal heights.

`VehicleInformationSection.svelte` provides a typed specifications variant. Its default equipment presentation is preserved. `VehicleFacts.svelte` continues to render the existing server fields and grouping; no vehicle copy or values changed. Both components are rendered only in the desktop branch of `VehicleDetailPage.svelte`.

## Evidence and checks

- [Before at 1440 × 1000](before-1440.jpg), [after at 1440 × 1000](after-1440.jpg), both at scroll position 808 on `/bg/inventory/21778067767337633`.
- [After at 768 × 1000](after-768.jpg).
- [Browser measurements](verification.json): three separate information cards, nine fields/icons, aligned values, no field overlap or horizontal overflow at 768, 1024 and 1440px. All BG values fit on one line at these widths.
- EN at 768px: all localized labels and nine values retained, without overlap or horizontal overflow.
- Equipment disclosure expands from six to eighteen items and collapses back to six.
- Svelte check passes with zero errors and warnings; scoped ESLint and Prettier checks pass. Architecture check passes with 57 native route modules and 215 reachable modules.
- Fresh browser session records zero console errors or warnings.
- Mobile at 320 and 390px renders its independent PDP with no desktop facts markup or horizontal overflow. Mobile sources were unchanged. Historical screenshot hashes differ, so those captures are not treated as pixel-equality evidence.
- Cars workspace doctor fetched current main with no integration drift. Unrelated dirty work and other tasks' commits were preserved.

These are focused local development checks. A production build, template release and dealer deployment were not performed for this styling correction; owner visual acceptance remains separate.
