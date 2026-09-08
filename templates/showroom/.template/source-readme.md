# Bohemcars Svelte rebuild

SvelteKit 2 / Svelte 5 rebuild of the Bohemcars site using the Auxero car dealer template as the visual source. The project preserves the selected Auxero pages 1:1 and rebrands/wires them with Bohemcars inventory, contact data, consultants, account/admin surfaces, compare, support pages, and local prototype interactions.

## Source of truth

- Rebuild plan: `PROJECT_PLAN.md`
- Route and visual contract: `docs/template-contract/route-source-map.md`
- Proposal QA checklist: `docs/QA_CHECKLIST.md`
- Brand and inventory source: `M:\bohemcars-final`
- Primary template surfaces: Home 05, Listing Grid 3 Columns, Listing Grid 4 Columns, Half Map/Top Map, Listing Details 3, Compare, Sale Agents, Sale Agents Detail, dashboard/account pages, and matching Auxero support pages

## Commands

```sh
npm install
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

For local browser review:

```sh
npm run dev -- --host 127.0.0.1 --port 5199
```

## Route shape

Product routes use SvelteKit `+page.server.ts` / `+page.svelte` pages with typed Svelte 5 components replacing the selected Auxero sections. A narrow compatibility renderer still preserves the original Auxero document shell, head assets, body classes, modals, and script tail while each route family is decomposed safely.

Branded routes include `/`, `/inventory`, `/inventory/[slug]`, `/compare`, `/agents`, `/agents/[slug]`, `/services`, `/sell-your-car`, `/about`, `/reviews`, `/calculator`, `/faqs`, `/blog`, `/blog/[slug]`, `/contact`, `/terms`, `/account/*`, and `/admin/*`.

Shop/cart/checkout/product/coming-soon pages are intentionally blocked from public routing.
