# Desktop Svelte Migration Status And Fallbacks

Date: 2026-06-06

This note records the desktop rendering status after the public and support/content migration passes
from `2026-06-05-desktop-svelte-migration-design.md`.

## Svelte-rendered public routes

These routes render their visible desktop page bodies with Svelte components. Auxero raw HTML is
retained only for shared head/runtime assets, header/footer chrome, modals, and script bootstrapping
through `AuxeroPublicShell`.

- `/`
- `/inventory`
- `/inventory/[slug]`
- `/compare`
- `/agents`
- `/services`
- `/sell-your-car`
- `/contact`

Evidence:

- `src/lib/components/home/HomeFiveTemplatePage.svelte` renders the Home 05 hero, action band,
  featured vehicles, browse, compare, reviews, and news sections as Svelte sections.
- `src/lib/components/inventory/InventoryTemplatePage.svelte` renders the desktop inventory banner,
  filters, toolbar, results, and map fallback through Svelte components.
- `src/lib/components/detail/VehicleDetailTemplatePage.svelte` renders the vehicle detail body
  through `AuxeroVehicleDetail` inside `AuxeroPublicShell`.
- `src/lib/components/compare/CompareTemplatePage.svelte` and
  `src/lib/components/agents/AgentsTemplatePage.svelte` use `AuxeroPublicShell` for their public
  branches; their `AuxeroPageShell` branches remain for account/admin shell parity only.
- `src/lib/components/services/ServicesTemplatePage.svelte`,
  `src/lib/components/sell-your-car/SellYourCarTemplatePage.svelte`, and
  `src/lib/components/contact/ContactTemplatePage.svelte` render public desktop content as Svelte
  sections.

## Svelte-rendered support/content bodies

These routes use `AuxeroPageShell` to preserve the Auxero support header, breadcrumb/footer chrome,
body class, head, runtime scripts, and modal tail. The visible page body between those shell slots is
now Svelte-rendered.

- `/about`
- `/reviews`
- `/calculator`
- `/faqs`
- `/blog`
- `/blog/[slug]`
- `/terms`
- `/import`
- `/agents/[slug]`

Evidence:

- `AboutTemplatePage.svelte`, `FaqsTemplatePage.svelte`, and `ImportRequestTemplatePage.svelte`
  render Svelte body components inside `AuxeroPageShell`.
- `ReviewsTemplatePage.svelte`, `CalculatorTemplatePage.svelte`, `BlogTemplatePage.svelte`,
  `BlogDetailTemplatePage.svelte`, `TermsTemplatePage.svelte`, and
  `AgentDetailTemplatePage.svelte` render full body sections through Svelte components.
- Their route servers split Auxero reference pages with `renderAuxeroPageSlot(...)` only to preserve
  before/after shell chrome and to keep the reference template as the parity source.

## Account/admin retained shell fallbacks

Account and admin routes render their form/list/message bodies with Svelte components, but they
intentionally retain `AuxeroPageShell` dashboard chrome for sidebar, dashboard wrapper, body class,
modal/runtime, and in some dashboard routes the reference chart shell. This is the documented
fallback boundary for the dashboard wave.

- `/account`
- `/account/profile`
- `/account/listings`
- `/account/messages`
- `/account/password`
- `/account/favorites`
- `/account/compare`
- `/admin`
- `/admin/agents`
- `/admin/inventory`
- `/admin/inventory/new`
- `/admin/inventory/edit/[id]`
- `/admin/inquiries`
- `/admin/messages`
- `/admin/users`

Evidence:

- Account/admin template components in `src/lib/components/account` render typed Svelte children
  such as `AccountProfileForm`, `AccountListingsTemplatePage`, `MessageTemplatePage`,
  `UserManagementTemplatePage`, and `AccountListingFormTemplatePage`.
- `DashboardRecentTemplatePage.svelte` still preserves the Auxero dashboard chart shell by splitting
  the slot around `dashboard-box car-views-chart`; this is intentionally retained for dashboard
  visual parity until the dashboard shell wave.

## Other desktop routes

- `/home2` is a non-priority alternate homepage. Its visible body is Svelte component structured,
  while `HomeTwoTemplatePage.svelte` keeps direct raw head/runtime injection for template assets.
- `/offer` is a standalone Svelte proposal page and does not depend on Auxero raw body rendering.
- `src/routes/[...templatePath]/+server.ts` remains a raw Auxero reference/debug endpoint, not a
  migrated desktop app route.

## Raw boundary audit

Current direct `{@html}` usage in `src/routes` and `src/lib/components` is limited to:

- `src/lib/components/layout/AuxeroPublicShell.svelte` for Auxero `headHtml` and `runtimeHtml`.
- `src/lib/components/layout/AuxeroPageShell.svelte` for Auxero head/body class and documented
  before/after shell slots.
- `src/lib/components/home2/HomeTwoTemplatePage.svelte` for alternate-template head/runtime assets.

The latest audit command was:

```powershell
rg -n "\{@html" src/routes src/lib/components
```

## Verification evidence

- `npm run check`
- `npm run lint`
- `npm run test:unit -- --run`
- `npm run build`
- `npx playwright test src/routes/project1.e2e.ts --grep "homepage preserves|inventory supports|vehicle detail uses|compare and consultants|planned public support routes"`
- `npx playwright test src/routes/project1.e2e.ts --grep "account and admin routes are role-aware and branded"`
- Desktop screenshots: `.codex-artifacts/desktop-svelte-migration/2026-06-06/*.png`
