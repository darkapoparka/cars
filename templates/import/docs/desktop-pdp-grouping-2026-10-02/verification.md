# Desktop PDP information and purchase columns

Baseline: `b8e0bb8359808b254832cb1a860477d668f9e01c`. Local Import development server: `http://127.0.0.1:6790`, Node 24.21.0.

The left column now contains the title/actions row, gallery, Description, Basic details, and equipment. The right column contains the purchase panel, finance calculator, and dealer banner. The existing calculator anchor and financing enquiry route are retained.

Changed source:

- `src/lib/components/detail/VehicleDetailPage.svelte`: moves facts directly below Description and the calculator directly below the purchase panel. Keys the calculator by vehicle slug so inputs reset when changing vehicles.
- `src/lib/components/detail/VehicleFacts.svelte`: uses two fact columns when the panel has enough room; narrower panels retain one column.
- `src/lib/components/financing/FinanceEstimator.svelte`: adds an opt-in sidebar layout. Money fields span the sidebar width; term and rate use shared grid rows to align inputs when labels wrap. Compact summary typography and a stacked monthly estimate fit the sidebar. The existing full layout remains the default.
- `docs/ARCHITECTURE.md`: records the component and column ownership.

Verification:

- `svelte-check --tsconfig ./tsconfig.json --fail-on-warnings`: zero errors or warnings.
- Scoped ESLint: pass for all three components. Prettier: pass for the components and architecture document.
- Final sidebar component compiled with Svelte after its grid refinement: zero warnings.
- `git diff --check`: pass.
- Bulgarian BMW X4 at 768, 1024, 1440, and 1920px: title and purchase panel remain level; facts directly follow Description; calculator directly follows the purchase panel with a 24px gap. No horizontal page or calculator overflow. Term and rate inputs share the same vertical position at every tested width.
- Facts use one column at 768/1024px and two at 1440/1920px.
- English Mercedes-Benz PDP at 768px: one calculator, correct column grouping, aligned term/rate inputs, and no horizontal overflow.
- Changing the BMW down payment from 0 to 8700 updates the monthly estimate from 604 € to 483 €; restoring 0 returns 604 €.
- The purchase panel's Calculate payment link reaches `#vehicle-finance`, with the calculator 24px below the viewport top.
- Fresh SPA navigation from Mercedes-Benz to BMW X4 resets the modified down payment to 0 and the vehicle price to 43500. Exactly one PDP and one calculator remain mounted.
- Mobile PDP at 320/390px: independent mobile composition, no desktop facts/sidebar calculator, and no horizontal overflow. The mobile branch is unchanged from baseline and the mobile component has no diff.
- Shared Financing route at 390/1440px: retains the default full calculator layout without the sidebar class; no horizontal overflow.

The first navigation following development hot reload retained the outgoing page DOM. Reloading the test tab and repeating navigation from a fresh page passed. This was development verification; no production build, template promotion, or dealer deployment was performed.

Screenshots at a 1440×1000 viewport override:

- [Before](before-bg-1440.jpg)
- [After](after-bg-1440.jpg)
- [Description, Basic details, and finance calculator](after-bg-lower-1440.jpg)

Other Cars work was preserved. Workspace and browser evidence is in the ignored `runtime/desktop-pdp-grouping-2026-10-02/` directory.
