# Mobile Home car title

`HomeFiveVehicleCard.svelte` renders the full vehicle title as a single block with `white-space: nowrap`, hidden overflow and an ellipsis on mobile. The two-line clamp is removed. The vehicle name, accessible link label, tooltip and destination retain their full values.

## Visual evidence

| Width | Two-line baseline             | Single-line result          |
| ----- | ----------------------------- | --------------------------- |
| 320px | [Before](before/home-320.jpg) | [After](after/home-320.jpg) |
| 390px | [Before](before/home-390.jpg) | [After](after/home-390.jpg) |

These are original JPEG captures from the live development server on port 6790. At both widths, all eight card titles occupy one 22px line and their link targets remain 44px high. The Mercedes title overflows its available width and uses an ellipsis; its accessible name remains `Mercedes-Benz GLA 45 AMG 4M AMG Night Package`. The document does not overflow horizontally. See `measurements.json` for the recorded values.

The title link opened `/bg/inventory/21754658377544573`, and browser Back returned to `/bg`. [Desktop Home at 1440px](after/desktop-home-1440.jpg) retains its existing separate composition. The mobile-only CSS change does not alter vehicle data or quick-filter styling.

## Source verification

The frozen QA candidate uses Node 24.21.0, the retained npm lockfile and separate build output. `source-snapshot.json` records its source digest; `verified-files.json` confirms the edited component matches it. Local source and browser evidence do not promote a release or deploy dealer copies.

- Scoped Prettier and ESLint checks passed for the component.
- `npm run check`: zero errors and zero warnings.
- `npm run build`: exit 0, with the retained nonfatal CSS/build warnings.
- Existing mobile Home financing regressions run in both locales against the frozen preview on port 6795 to verify the full vehicle title, selected vehicle and price survive navigation.
- Result: **2 passed**.
