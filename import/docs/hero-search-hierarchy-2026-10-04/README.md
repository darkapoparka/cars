# Desktop hero search hierarchy — 4 October 2026

Home, Cars and Services now share a quieter search field. Home's long make/model hint is replaced with “Търси автомобил…” / “Search cars…”, while the full accessible label remains. The field is 48px high, with 18px regular text, a muted hint and a 36px black circular search surface within a 44px click target. Entered values remain dark. The quick filter pills retain their existing icons, stronger borders and selected states.

The existing white panel, artwork, tabs and hero background are retained. The softer panel border alias and field adjustments apply from 768px. Native GET forms, query names, Home filter handoff and localized action names remain intact.

## Matched desktop views

All screenshots below are actual local preview captures at 1440 × 1000, with the same viewport for each before/after pair.

| Route    | Before                        | After BG                    | After EN                         |
| -------- | ----------------------------- | --------------------------- | -------------------------------- |
| Home     | [Before](before-home.png)     | [After](after-home.png)     | [English](after-home-en.png)     |
| Cars     | [Before](before-cars.png)     | [After](after-cars.png)     | [English](after-cars-en.png)     |
| Services | [Before](before-services.png) | [After](after-services.png) | [English](after-services-en.png) |

## Verification

- Svelte check: 0 errors, 0 warnings. Isolated production build passed with Node 24.21.0 and the retained npm lockfile.
- Scoped source ESLint and source/document Prettier passed. Native architecture and local asset checks passed: 57 routes, 230 reachable components, one Tailwind entry, 955 local images.
- The six existing desktop search journeys passed against the live 6790 preview, including focus and accessibility, make selection, canonical query submission, unavailable counts, header search and Home filter handoff.
- Sixteen rendered BG/EN desktop cases passed: Home at 768/1024/1440/1920px, Cars and Services at 768/1440px. Each had a 48px field, 18px/400 entry, 44px icon with a localized accessible name, and no horizontal overflow.
- Cars and Services input placeholders were separately inspected as `rgb(105, 112, 120)`. A Cars icon search for `BMW` retained the entered value and existing sort/view query fields, showing 15 matching vehicles. Services icon search for `VIN` submitted `q=VIN` and showed one matching service.
- Matched BG Home and Services checks at 320/390px retained all 40 inspected first-viewport text and control geometries/styles. This is focused mobile preservation evidence, not a full-page or all-locale audit. Mobile screenshots remain in ignored `runtime/hero-search-hierarchy-2026-10-04/`.
- The pending desktop font preload follow-up is included in the verified source: the earlier four cold BG/EN desktop/mobile font checks passed. The settled typeface and weights are unchanged.

[Structured local verification](verification.json) records dimensions and source hashes. Build/check/search logs remain in ignored `runtime/hero-search-hierarchy-2026-10-04/`; the prior font checks remain in `runtime/desktop-title-hierarchy-2026-10-04/`.

These checks establish the reusable source and local preview. They do not select a template release or refresh dealer deployments. Unrelated Import assets, ignore-file edits and other template work are preserved.

The compact-button follow-up reran the three existing desktop focus, Home query and public-action checks successfully, including the retained 44px click target. All 16 desktop shape cases were reinspected; BG/EN Home and Services at 320/390px showed no overflow and no visible desktop search control. The black surface uses a full pill radius and 4px inset, keeping it round and visibly smaller than the field.
