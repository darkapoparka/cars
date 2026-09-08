# Bohemcars Finalization Goal Prompt

Use this prompt when starting a focused `/goal` run for the full product migration:

```text
/goal Finalize the Bohemcars SvelteKit website into a proposal-ready product for Bohemcars. Keep the Auxero template visually 1:1 where it is the chosen source of truth, especially Home 05, Listing Grid 3 Columns, Listing Details 3, Compare, Agents, dashboard/account/admin pages, and support pages. Replace template/demo identity with Bohemcars logo, lime branding, copy, inventory data, generated/real vehicle imagery, contacts, Bulgarian business context, and production-direction user flows.

Before changing code, read:
- PROJECT_PLAN.md
- docs/superpowers/plans/2026-05-26-auxero-template-fidelity-audit.md
- docs/superpowers/plans/2026-05-26-bohemcars-svelte-finalization-and-refactor.md

Use the svelte-core-bestpractices and svelte-code-writer skills for every Svelte component or .svelte.ts change. Refactor the project from raw template HTML adapters into proper SvelteKit/Svelte 5 architecture route by route, but keep the rendered DOM/classes/spacing/typography/image choices faithful to the template until a deliberate design decision says otherwise.

Primary product objectives:
- Preserve Home 05 as the homepage source.
- Preserve /inventory from listing-grid3-columns.html, with 4-column and map variants as supported view modes.
- Preserve /inventory/[slug] from listing-details-3.html.
- Preserve Compare, Agents, Sell Your Car, Services, Contact, account, and admin flows.
- Keep the public site proposal-ready on desktop and mobile.
- Keep account/admin/agent features credible as a production-direction prototype.
- Remove fake template identity, raw demo credentials, broken links, and obviously unfinished copy.
- Keep Bohemcars logo/assets professional and aligned with the template.

Architecture objectives:
- Move toward typed route data, focused Svelte components, server-only data modules, and Svelte 5 runes where client reactivity is actually needed.
- Avoid broad global CSS overrides that damage template typography.
- Prefer keyed each blocks, $derived for computed state, event handlers for user actions, and context for scoped shared state.
- Keep server-only auth, inventory, inquiry, user, and message logic in $lib/server.
- Keep public reusable components in $lib/components grouped by feature.
- Keep data transformation separate from visual components.

Verification for every meaningful pass:
- npm run lint
- npm run check
- npm run test:unit -- --run
- npx playwright test src/routes/project1.e2e.ts
- Browser or Playwright screenshots for pages touched, compared against the matching template page when visual fidelity matters.

Commit in small, meaningful checkpoints. Do not redesign for taste until the 1:1 template baseline is stable and screenshots prove it.
```
