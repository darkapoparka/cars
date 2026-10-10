# Mobile price and filter release — 10 October 2026

The owner requested committing and pushing the price/filter polish and deploying the existing Mobile template project to Vercel. Showroom card prices now use weight 600. Empty range inputs use localized From/To placeholders without a duplicate visible label or Any placeholder. Desktop range fields have an 8px gap and individual borders.

## Delivery

| Boundary | Verified result |
| --- | --- |
| Cars source | `b118edf7da44c8dcd8591f5cd93649d963694514`, pushed to `darkapoparka/cars` main |
| Publishing mirror | `a3d4927f1e5424be4877862c5374d0e76aae8ea2`, pushed to `darkapoparka/cars-template-mobile` main |
| Export digest | `210ec1eca539325856759af4e657e13c98ac78dc68c53efd7a28d09efd7897f7` under `cars-source-v1` |
| Vercel production | `dpl_6en8pa6bXp5P3Aa6DSTDZqfMEbEJ`, READY, Git SHA matches the publishing mirror |
| Public alias | [cars-template-mobile.vercel.app](https://cars-template-mobile.vercel.app/) points to that deployment |
| Immutable deployment | [cars-template-mobile-n067kggit-tyj5.vercel.app](https://cars-template-mobile-n067kggit-tyj5.vercel.app/) |

The publishing mirror matched its previous recorded Cars source before synchronization; no independent source changes were found. This scoped commit contains the two changed components and their matched evidence. Other active drafts in the shared checkout were preserved. Publication does not update the dealer fleet or approved template lock.

## Validation

The exact committed Mobile snapshot passed lint, TypeScript checking, all 156 domain tests and one production build using Node 22.20.0. The export digest was checked again against the final source and mirror commits. `workspace-doctor.mjs --fetch` also completed before publication.

The built snapshot and hosted public alias were checked at 320px, 390px and 1440px. Home prices render at weight 600 with no narrow viewport overflow. The desktop modal shows all six `От` / `До` placeholders with 8px gaps. Entering price bounds 10000/60000 updates the matching count to 10; clearing restores 16. The 320px price inputs fit and show the new placeholders. Home, the desktop filter route and `/vehicle/bmw-x6` returned HTTP 200 with the existing `noindex, nofollow` response header.

## Retained evidence

- [Price before/after comparison](../templates/mobile/docs/price-weight-2026-10-10/result.md): mobile and desktop pairs establish the typography-only change.
- [Filter spacing metrics](../templates/mobile/docs/range-field-spacing-2026-10-10/result.json) and [placeholder comparison](../templates/mobile/docs/range-field-spacing-2026-10-10/placeholder-result.md): the two desktop pairs record the separately requested spacing and placeholder corrections.
- [Hosted desktop filter modal](mobile-price-filter-release-20261010/hosted-desktop-filters.jpg) and [hosted mobile home](mobile-price-filter-release-20261010/hosted-mobile-home.jpg): final deployment confirmation.

The owner-scoped production preview on 6475 was stopped after verification; the original 6474 development preview remained running. Automatic approval review rejected deletion of the temporary source/build output, alternate indices and logs as "blocked by policy," including a narrower attempt limited to the generated build. These remain under the ignored owner output `runtime/mobile-price-filter-release-20261010`, alongside compact checks, publication receipts and the stale empty index-lock audit. No cleanup was performed after those rejections; the dependency junction and shared installation remain intact.
