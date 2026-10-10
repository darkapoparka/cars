# Desktop PDP statistics restoration

The previous desktop facts revision removed the stat icons and reduced labels to 14px with an 8px row gap. This correction restores the nine icons, 16px labels and a 16px row gap in `VehicleFacts.svelte`, using the existing type and spacing tokens.

The three outlined cards remain: Основни данни, Детайли and Оборудване. The two facts cards share a row when there is room and stack at narrower desktop widths; equipment follows below. The existing field grouping, values, description, title actions, purchase column, calculator and equipment disclosure are preserved. Mobile uses its independent PDP component.

## Visual evidence

- [Before, 1440 × 1000](before-1440.jpg) and [after, 1440 × 1000](after-1440.jpg), both at scroll position 808 on `/bg/inventory/21778067767337633`.
- [After at 768 × 1000](after-768.jpg).
- [Recorded browser checks](verification.json).

## Verification

- Svelte check: zero errors and warnings.
- Scoped ESLint and Prettier checks passed.
- Architecture checks passed: 57 native route modules, 214 reachable modules, one Tailwind generation entry.
- BG desktop at 768, 1024 and 1440: three cards, nine facts and icons, 16px labels and row gaps, no horizontal overflow.
- EN desktop: localized field labels and all nine values retained.
- BG mobile at 320 and 390: independent mobile PDP, no desktop facts markup or horizontal overflow. Screenshot SHA-256 hashes match the prior captures in `docs/desktop-pdp-readable-2026-10-02/` exactly.
- The existing browser session contained a hot-reload error from `VehicleCard.svelte`. That source was unchanged by this task. A fresh page load produced zero console errors or warnings and did not reproduce the error.
- Cars workspace doctor fetched current main and found no source drift. Unrelated dirty work was preserved.

These are local development checks. This correction does not select a template release or deploy dealers; visual acceptance remains with the owner.
