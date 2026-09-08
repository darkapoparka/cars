# Bohemcars Svelte Finalization And Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current Bohemcars template adaptation into a proposal-ready SvelteKit product while preserving Auxero template fidelity.

**Architecture:** Use the current raw Auxero adapter as the visual contract, then migrate one route family at a time into typed SvelteKit pages and focused Svelte 5 components. Each migration must preserve the template DOM classes, typography, spacing, imagery, and responsive behavior before any cleanup or Bohemcars-specific improvements happen.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, server-only modules in `$lib/server`, feature components in `$lib/components`, Vitest, Playwright, Auxero static assets, Bohemcars data/assets.

---

## Current State Summary

The public routes currently render mostly through `src/lib/server/auxero-template.ts`, using raw HTML files from `.template-ref` plus server-side string adapters in `src/lib/server/auxero-*-data.ts`. The project also has an early Svelte component structure under `src/lib/components`, but the main public pages are not yet true Svelte page/component implementations.

The selected homepage source is `home-05.html`. `PROJECT_PLAN.md` now reflects this direction, replacing the older Homepage 09 decision.

The migration must not start by redesigning the site. The first success condition is exact visual stability, then modular Svelte architecture.

## Target File Structure

- Keep: `src/lib/server/auxero-template.ts` as the temporary compatibility renderer and template contract until each route family is migrated.
- Keep and narrow: `src/lib/server/auxero-home-data.ts`, `src/lib/server/auxero-listing-data.ts`, `src/lib/server/auxero-account-data.ts`, `src/lib/server/auxero-support-data.ts` while they still serve raw-template routes.
- Create: `src/lib/auxero/template-map.ts` for template-to-route source mapping.
- Create: `src/lib/auxero/fidelity.ts` for shared visual contract constants used by tests.
- Create: `src/lib/types/vehicle.ts`, `src/lib/types/agent.ts`, `src/lib/types/account.ts`.
- Create: `src/lib/components/auxero/AuxeroButton.svelte`, `src/lib/components/auxero/AuxeroSelect.svelte`, `src/lib/components/auxero/AuxeroTabs.svelte` only after repeated template controls prove they need reusable wrappers.
- Create or replace: `src/lib/components/home/HomeFiveHero.svelte`, `src/lib/components/home/HomeFiveSearch.svelte`, `src/lib/components/home/BrowseByType.svelte`.
- Keep and harden: `src/lib/components/layout/SiteHeader.svelte`, `src/lib/components/layout/SiteFooter.svelte`, `src/lib/state/garage.svelte.ts`.
- Convert routes gradually from `+server.ts` to `+page.server.ts` plus `+page.svelte` only after tests exist for the current rendered output.

## Template Source Map

| Product route                                                                                     | Template source                                                                 | Migration order |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------- |
| `/`                                                                                               | `home-05.html`                                                                  | 1               |
| `/inventory`                                                                                      | `listing-grid3-columns.html` plus `listing-grid4-columns.html` and map variants | 2               |
| `/inventory/[slug]`                                                                               | `listing-details-3.html`                                                        | 3               |
| `/compare`                                                                                        | `compare.html`                                                                  | 4               |
| `/agents` and `/agents/[slug]`                                                                    | `sale-agents.html`, `sale-agents-details.html`                                  | 5               |
| `/sell-your-car`, `/services`, `/contact`, `/about`, `/reviews`, `/calculator`, `/blog`, `/terms` | matching Auxero support pages                                                   | 6               |
| `/account/*`, `/admin/*`                                                                          | dashboard/account Auxero pages                                                  | 7               |

## Svelte 5 Rules For The Migration

- Use `$props()` for component inputs.
- Use `$derived` for values computed from props or state.
- Use `$state` only for UI state that actually updates rendered output.
- Use `$state.raw` for large reassigned data arrays if they ever become client-managed.
- Use keyed `{#each items as item (item.id)}` blocks for vehicle, brand, type, agent, and message lists.
- Use event attributes such as `onclick={handler}`, not legacy `on:click`.
- Use context for scoped garage/session UI state, not a global shared mutable module.
- Keep server-only modules under `$lib/server` so private/auth/data logic cannot leak to browser bundles.
- Avoid broad `:global` CSS overrides. If template CSS must be adjusted, scope it to a route body class or a component-owned wrapper.

---

### Task 1: Freeze The Visual Contract

**Files:**

- Modify: `docs/superpowers/plans/2026-05-26-auxero-template-fidelity-audit.md`
- Create: `docs/template-contract/route-source-map.md`
- Modify: `src/routes/project1.e2e.ts`

- [x] **Step 1: Create the route-source map document**

  Create `docs/template-contract/route-source-map.md` with this exact route contract:

  ```markdown
  # Bohemcars Auxero Route Source Map

  | Bohemcars route       | Auxero source                                             | Fidelity rule                                                                                                                             |
  | --------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
  | `/`                   | `home-05.html`                                            | Preserve section order, top bars, hero/search composition, brand strip, type gallery, featured cars, reviews, news, CTA, and footer.      |
  | `/inventory`          | `listing-grid3-columns.html`                              | Preserve toolbar, filters, 3-card desktop grid rhythm, card image ratio, badges, meta row, price row, compare action, and details action. |
  | `/inventory?view=4`   | `listing-grid4-columns.html`                              | Preserve dense desktop grid behavior and shared filters.                                                                                  |
  | `/inventory?view=map` | `listing-gridstyle-halfmap.html` or `listing-topmap.html` | Preserve map/list split or top-map layout when map data is enabled.                                                                       |
  | `/inventory/[slug]`   | `listing-details-3.html`                                  | Preserve light detail typography, media layout, overview/sidebar structure, contact form, related cars.                                   |
  | `/compare`            | `compare.html`                                            | Preserve comparison table/card structure and remove only demo vehicles.                                                                   |
  | `/agents`             | `sale-agents.html`                                        | Preserve consultant card layout and contact affordances.                                                                                  |
  | `/agents/[slug]`      | `sale-agents-details.html`                                | Preserve agent detail/contact layout.                                                                                                     |
  | `/account/*`          | dashboard/account templates                               | Preserve dashboard sidebar, cards, tables, forms, and message layout.                                                                     |
  | `/admin/*`            | dashboard/account templates                               | Preserve dashboard shell and replace content with role-aware Bohemcars data.                                                              |
  ```

- [x] **Step 2: Add visual-contract test helpers**

  In `src/routes/project1.e2e.ts`, add helper functions near the top of the file:

  ```ts
  async function cssValue(locator: Locator, property: string) {
  	return locator.evaluate(
  		(node, prop) => getComputedStyle(node).getPropertyValue(prop),
  		property
  	);
  }

  async function boxRatio(locator: Locator) {
  	const box = await locator.boundingBox();
  	if (!box) throw new Error('Expected element to have a box');
  	return Number((box.width / box.height).toFixed(2));
  }
  ```

  Add the missing import if needed:

  ```ts
  import { expect, type Locator, test } from '@playwright/test';
  ```

- [x] **Step 3: Add Home 05 fidelity assertions**

  Extend the homepage e2e test to assert:

  ```ts
  await expect(page.locator('.out-brand-2')).toHaveCount(12);
  await expect(page.locator('.brand-item-style-2')).toHaveCount(6);
  await expect(page.locator('img[src*="/assets/images/card/card-37.jpg"]').first()).toBeVisible();
  await expect(page.locator('.search-cars, .search-form-widget').first()).toBeVisible();
  ```

- [x] **Step 4: Verify the contract tests**

  Run:

  ```bash
  npx playwright test src/routes/project1.e2e.ts
  ```

  Expected: all route fidelity tests pass before any Svelte migration begins.

- [ ] **Step 5: Commit**

  ```bash
  git add docs/template-contract/route-source-map.md src/routes/project1.e2e.ts docs/superpowers/plans/2026-05-26-auxero-template-fidelity-audit.md
  git commit -m "test: freeze auxero visual contract"
  ```

### Task 2: Extract Template Contract Types

**Files:**

- Create: `src/lib/auxero/template-map.ts`
- Create: `src/lib/auxero/fidelity.ts`
- Test: `src/lib/auxero/template-map.spec.ts`

- [x] **Step 1: Write the failing route map test**

  Create `src/lib/auxero/template-map.spec.ts`:

  ```ts
  import { describe, expect, it } from 'vitest';
  import { productRouteSources, sourceForProductRoute } from './template-map';

  describe('productRouteSources', () => {
  	it('locks Home 05 as the homepage source', () => {
  		expect(sourceForProductRoute('/')).toBe('home-05.html');
  	});

  	it('locks inventory and detail template sources', () => {
  		expect(sourceForProductRoute('/inventory')).toBe('listing-grid3-columns.html');
  		expect(sourceForProductRoute('/inventory/21779200396408437')).toBe('listing-details-3.html');
  	});

  	it('does not expose blocked shop templates as product routes', () => {
  		expect(productRouteSources.some((item) => item.source === 'shop.html')).toBe(false);
  		expect(productRouteSources.some((item) => item.source === 'check-out.html')).toBe(false);
  	});
  });
  ```

- [ ] **Step 2: Run the failing test**

  ```bash
  npm run test:unit -- src/lib/auxero/template-map.spec.ts --run
  ```

  Expected: fail because `src/lib/auxero/template-map.ts` does not exist.

- [x] **Step 3: Implement the route map**

  Create `src/lib/auxero/template-map.ts`:

  ```ts
  export type ProductRouteSource = {
  	route: string;
  	source: string;
  	notes: string;
  };

  export const productRouteSources: ProductRouteSource[] = [
  	{ route: '/', source: 'home-05.html', notes: 'Primary Bohemcars homepage' },
  	{ route: '/inventory', source: 'listing-grid3-columns.html', notes: 'Default inventory grid' },
  	{
  		route: '/inventory?view=4',
  		source: 'listing-grid4-columns.html',
  		notes: 'Dense grid variant'
  	},
  	{
  		route: '/inventory?view=map',
  		source: 'listing-gridstyle-halfmap.html',
  		notes: 'Map/list variant'
  	},
  	{ route: '/inventory/[slug]', source: 'listing-details-3.html', notes: 'Vehicle detail page' },
  	{ route: '/compare', source: 'compare.html', notes: 'Buyer comparison' },
  	{ route: '/agents', source: 'sale-agents.html', notes: 'Consultant list' },
  	{ route: '/agents/[slug]', source: 'sale-agents-details.html', notes: 'Consultant profile' },
  	{ route: '/sell-your-car', source: 'sell-your-car.html', notes: 'Sell-car intake' },
  	{ route: '/services', source: 'services-center.html', notes: 'Services overview' },
  	{ route: '/contact', source: 'contact-us.html', notes: 'Contact page' },
  	{ route: '/account/*', source: 'dashboard.html', notes: 'Account dashboard family' },
  	{ route: '/admin/*', source: 'dashboard.html', notes: 'Admin dashboard family' }
  ];

  export function sourceForProductRoute(route: string) {
  	const pathname = route.split('?')[0];

  	if (/^\/inventory\/[^/]+$/.test(pathname)) return 'listing-details-3.html';
  	if (pathname.startsWith('/account/')) return 'dashboard.html';
  	if (pathname.startsWith('/admin/')) return 'dashboard.html';

  	return productRouteSources.find((item) => item.route === route || item.route === pathname)
  		?.source;
  }
  ```

- [x] **Step 4: Add fidelity constants**

  Create `src/lib/auxero/fidelity.ts`:

  ```ts
  export const auxeroFidelity = {
  	home05: {
  		brandCards: 12,
  		typeCards: 6,
  		typeImagePrefix: '/assets/images/card/card-'
  	},
  	detail3: {
  		titleColor: 'rgb(28, 28, 28)',
  		bodyTextColor: 'rgb(75, 75, 75)',
  		titleFontSize: '40px'
  	},
  	inventoryGrid3: {
  		desktopColumns: 3,
  		cardImageMinRatio: 1.25,
  		cardImageMaxRatio: 1.6
  	}
  } as const;
  ```

- [ ] **Step 5: Verify and commit**

  ```bash
  npm run test:unit -- src/lib/auxero/template-map.spec.ts --run
  git add src/lib/auxero/template-map.ts src/lib/auxero/fidelity.ts src/lib/auxero/template-map.spec.ts
  git commit -m "chore: add auxero template contract"
  ```

### Task 3: Migrate Home 05 To Svelte Components

**Files:**

- Create: `src/routes/+page.server.ts`
- Create: `src/routes/+page.svelte`
- Create or modify: `src/lib/components/home/HomeFiveTemplatePage.svelte`
- Create or modify: `src/lib/components/home/HomeFiveHeader.svelte`
- Create or modify: `src/lib/components/home/HomeFiveHero.svelte`
- Create or modify: `src/lib/components/home/HomeFiveFeaturedVehicles.svelte`
- Create or modify: `src/lib/components/home/HomeFiveBrandStrip.svelte`
- Create or modify: `src/lib/components/home/HomeFiveTypeGallery.svelte`
- Create or modify: `src/lib/components/home/HomeFiveCompareSection.svelte`
- Create or modify: `src/lib/components/home/HomeFiveBudgetSection.svelte`
- Create or modify: `src/lib/components/home/HomeFiveReviewsSection.svelte`
- Create or modify: `src/lib/components/home/HomeFiveNewsSection.svelte`
- Create or modify: `src/lib/components/home/HomeFiveFooter.svelte`
- Create or modify: `src/lib/components/home/HomeFiveModals.svelte`
- Modify: `src/lib/data/bohemcars.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Capture the current Home 05 DOM contract**

  Run:

  ```bash
  npx playwright test src/routes/project1.e2e.ts --grep "home"
  ```

  Expected: existing Home 05 tests pass before migration.

- [ ] **Step 2: Create typed page data**

  Create `src/routes/+page.server.ts`:

  ```ts
  import type { PageServerLoad } from './$types';
  import { bohemcarsBrand, bohemcarsContact, homeHeroSlides } from '$lib/data/bohemcars';
  import { vehicles } from '$lib/data/vehicles';

  export const load: PageServerLoad = () => ({
  	brand: bohemcarsBrand,
  	contact: bohemcarsContact,
  	heroSlides: homeHeroSlides,
  	featuredVehicles: vehicles.slice(0, 6)
  });
  ```

- [x] **Step 3: Convert the route from raw server response to Svelte page**

  Remove the former root `+server.ts` endpoint only after `+page.svelte` renders the homepage. The root route must not have both a conflicting `+server.ts` response and the intended `+page.svelte` page for normal browser navigation.

  Current checkpoint: the temporary root legacy endpoint file has been removed; `/` now renders through `+page.server.ts` and `+page.svelte` using a split, trusted Auxero Home 05 document. Section-by-section Svelte component replacement remains pending under the existing fidelity tests.

  Brand strip checkpoint: `src/lib/components/home/HomeFiveBrandStrip.svelte` now renders the Home 05 `Explore Our Brands` section from shared `homeFiveBrandCards` data. The rest of the page still streams through trusted Auxero fragments until each section is replaced under visual tests.

  Browse By Type checkpoint: `src/lib/components/home/HomeFiveTypeGallery.svelte` now renders the Home 05 type gallery from shared `homeFiveTypeCards` data while preserving the template dark band, horizontal gallery structure, `card-37.jpg` through `card-42.jpg` image family, active second card, and white 20px CTA arrow. The page shell also guards against swallowing template scripts by emitting a real closing body-class script tag, with Playwright coverage for local jQuery initialization.

  Compare section checkpoint: `src/lib/components/home/HomeFiveCompareSection.svelte` now renders the Home 05 `Compare Top Rated Vehicles` section from typed `HomeFiveComparePair` data derived in `+page.server.ts`. The section keeps the template `card-box-style-4` structure, two comparison slides, four vehicle images, compare CTA styling, pagination wrapper, and surrounding `type -> compare -> budget` order.

  Budget section checkpoint: `src/lib/components/home/HomeFiveBudgetSection.svelte` now renders the Home 05 `Bohemcars by Budget` section from typed `HomeFiveVehicleCardData` rows derived in `+page.server.ts`. `HomeFiveVehicleCard.svelte` preserves the template `card-box card-box-style-1` structure, highlight tags, image overlay meta, style2 specs row, price/finance row, compare action, and details link; the section keeps 5 budget tabs and 9 cards.

  Featured vehicles checkpoint: `src/lib/components/home/HomeFiveFeaturedVehicles.svelte` now renders the Home 05 `New Vehicles` carousel from typed `HomeFiveVehicleCardData` rows and reuses `HomeFiveVehicleCard.svelte` without the budget `style2` spec row. The route keeps Home 05 server-rendered with `src/routes/+page.ts` `csr = false` so Auxero's Swiper scripts initialize the final carousel DOM instead of being undone by hydration; Playwright now guards the desktop carousel density in addition to the 6 cards, pagination, and CTA contract.

  Featured vehicles fidelity refresh, 2026-05-27: the first post-hero section title/CTA now follows the Home 05 `title-section mb-40`, `h2.capitalize`, and `btn btn-line-style-2 effect-line-primary btn-large hover-fill-white` pattern while keeping the Bohemcars Vehicles copy. The section also exposes the requested body-style pills directly under the title using Auxero `menu-tab-style2` / `car-box` sizing with only a narrow grey fill hover/active state, no shadows, transforms, or image zoom. Browser/Playwright evidence saved under `test-results/visual-contract/2026-05-27-home-pills-hover/`.

  Home hover fidelity refresh, 2026-05-27: vehicle cards, inventory raw-adapter cards, favorite cards, and article cards now use the `bohemcars-no-image-zoom` guard so Auxero card images stay still while the template compare button fill animation remains intact on the compare control itself. Brand cards and budget/vehicle pills keep the Auxero sizing/classes but use the project-approved soft grey fill hover instead of green border-only emphasis, and Home 05 compare-pair cards use a scoped `bohemcars-calm-hover` guard to prevent lift/shadow motion. Verification passed with Svelte autofixer on touched Svelte files, lint, check, full unit tests, project Playwright, build, Browser QA, direct Playwright hover checks, and desktop/mobile screenshots under `test-results/visual-contract/2026-05-27-home-hover-fidelity/`.

  Raw adapter hover fidelity refresh, 2026-05-27: the Home 05 compatibility adapter now uses the same `Bohemcars Vehicles` first-section copy, exposes the requested 4 body-style pills under the heading, and marks raw vehicle/news/blog cards with `bohemcars-no-image-zoom`. Support-page service imagery no longer emits the `image-effect-scale` zoom class. Verification passed with targeted server tests, lint, check, full unit tests, project Playwright, build, and Browser desktop/mobile QA for `/`, `/services`, and `/blog`; screenshots were saved under `test-results/visual-contract/2026-05-27-raw-adapter-hover-fidelity/`.

  Vehicle pill data boundary refresh, 2026-05-27: `src/lib/auxero/home-five.ts` now owns the Home 05 vehicle pill data as typed `HomeFiveVehiclePill` records. `/` passes those records through `+page.server.ts` into `HomeFiveTemplatePage.svelte` and `HomeFiveFeaturedVehicles.svelte`, while the raw Home 05 compatibility adapter renders the same data instead of maintaining a second local copy. Svelte autofixer, focused server/data tests, lint, check, full unit tests, project Playwright, and build passed. The in-app Browser loaded the route but timed out during screenshot capture, so Playwright fallback captured desktop/mobile screenshots under `test-results/visual-contract/2026-05-27-home-vehicle-pill-data-boundary/`.

  Global CSS guard refresh, 2026-05-27: `src/routes/+layout.svelte` now imports only `src/routes/auxero-guards.css` instead of the broad legacy `layout.css`, so Auxero's own `/assets/app.css` remains the source for template typography, buttons, cards, spacing, and header/footer rules. The retained guard stylesheet only disables Bohemcars-forbidden image zoom, card lift/shadow motion, and the related card image ratio rule. Browser QA confirmed the loaded CSS contains the guard selectors while the old `.site-header` and `.vehicle-card:hover` shell rules are absent, with screenshots saved under `test-results/visual-contract/2026-05-27-home-css-guard-scope/`.

  Hero/search checkpoint: `src/lib/components/home/HomeFiveHero.svelte` now renders the Home 05 `page-title-style-4` hero, Swiper background slides, synced text slides, tab row, primary search filters, advanced filter panel, and feature checks from typed `HomeFiveHeroData`. The route splits the exact `<!-- page-title -->` block before `New Vehicles`, preserving the Auxero first-viewport class structure while moving hero/search data shaping into `$lib/auxero/home-five.ts`.

  Reviews checkpoint: `src/lib/components/home/HomeFiveReviewsSection.svelte` now renders the Home 05 `Client Reviews` carousel from typed `HomeFiveReview` rows in `$lib/auxero/home-five.ts`. The split intentionally follows the post-processed Home 05 closing-comment markers, preserving the Auxero `swiper-testimonior`, `testimonior-box`, star icon, avatar, and pagination structure while keeping the section order `budget -> reviews -> news`.

  News checkpoint: `src/lib/components/home/HomeFiveNewsSection.svelte` now renders the Home 05 `Bohemcars notes` section from typed `HomeFiveNewsPost` rows derived from `$lib/data/blog`. The route now splits `<!-- News & Reviews -->` after the Svelte reviews band and preserves the Auxero `post-style-2` featured card, two `post-style-3` cards, post image ratios/classes, byline row, and footer handoff.

  Footer checkpoint: `src/lib/components/home/HomeFiveFooter.svelte` now renders the Home 05 footer from typed `HomeFiveFooterData`, preserving Auxero footer classes and column structure while replacing remaining template/footer contact and copyright data with Bohemcars values. The raw Home 05 tail now starts after the footer marker and still carries modals/scripts until their own migration pass.

  Header checkpoint: `src/lib/components/home/HomeFiveHeader.svelte` now renders the Home 05 public header from typed `HomeFiveHeaderData`, preserving Auxero header/topbar/nav/action classes and script hooks while replacing the raw header fragment in the root page split. The raw Home 05 body shell now keeps only the preload and wrapper opening before the Svelte header, with modals/scripts still carried by the post-footer compatibility tail.

  Header fidelity refresh, 2026-05-28: restored the Home 05 `header-blur`, `menu style-2`, and `btn-line-white` Sign In CTA after a Home 06-style white-header drift, and added regression coverage for the Svelte route and raw Home 05 compatibility header contracts.

  Modal checkpoint: `src/lib/components/home/HomeFiveModals.svelte` now renders the Home 05 Card, Login, Forgot Password, Search, Sign Up, and Compare modal stack from typed `HomeFiveModalsData`. The route split keeps the wrapper close before the Svelte modal component and the progress/script tail after it, preserving the Auxero post-footer order while replacing demo credentials and template-only links with Bohemcars product behavior.

- [x] **Step 4: Build `HomeFiveHero.svelte` with template classes**

  Implement with Svelte 5 props and keyed slides:

  ```svelte
  <script lang="ts">
  	type HeroSlide = {
  		src: string;
  		alt: string;
  		title: string;
  		subtitle: string;
  	};

  	let { slides }: { slides: HeroSlide[] } = $props();
  	let activeIndex = $state(0);
  	let activeSlide = $derived(slides[activeIndex] ?? slides[0]);

  	function showSlide(index: number) {
  		activeIndex = index;
  	}
  </script>

  <section class="slider home-five-slider">
  	{#if activeSlide}
  		<img src={activeSlide.src} alt={activeSlide.alt} class="slider__image" />
  		<div class="slider__content">
  			<h1>{activeSlide.title}</h1>
  			<p>{activeSlide.subtitle}</p>
  		</div>
  	{/if}

  	<div class="slider__dots" aria-label="Hero slides">
  		{#each slides as slide, index (slide.src)}
  			<button
  				type="button"
  				class={index === activeIndex ? 'active' : ''}
  				aria-label={`Show ${slide.alt}`}
  				onclick={() => showSlide(index)}
  			></button>
  		{/each}
  	</div>
  </section>
  ```

  Keep class names aligned with the real `home-05.html` section when implementing; the snippet defines the runes/event pattern, not a redesign.

- [x] **Step 5: Run Svelte autofixer**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveHero.svelte
  npx @sveltejs/mcp svelte-autofixer src/routes/+page.svelte
  ```

  Expected: no Svelte 5 syntax issues.

- [x] **Step 6: Verify visual fidelity**

  Run:

  ```bash
  npm run check
  npm run test:unit -- --run
  npx playwright test src/routes/project1.e2e.ts --grep "home"
  ```

  Expected: Home 05 card counts, search visibility, and key images match the raw-template baseline.

- [ ] **Step 7: Commit**

  ```bash
  git add src/routes/+page.server.ts src/routes/+page.svelte src/lib/components/home src/lib/data/bohemcars.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate home 05 to svelte"
  ```

### Task 4: Migrate Inventory Grid And Detail Route

**Files:**

- Create: `src/routes/inventory/+page.server.ts`
- Create: `src/routes/inventory/+page.svelte`
- Create: `src/routes/inventory/[slug]/+page.server.ts`
- Create: `src/routes/inventory/[slug]/+page.svelte`
- Modify: `src/lib/components/inventory/InventoryTemplatePage.svelte`
- Modify: `src/lib/components/inventory/AuxeroInventoryContent.svelte`
- Modify: `src/lib/components/inventory/AuxeroInventoryVehicleCard.svelte`
- Modify: `src/lib/components/detail/VehicleDetailTemplatePage.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleDetail.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleDetailGallery.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleFeatureTabs.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleDetailSidebar.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleOverview.svelte`
- Modify: `src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Add failing inventory card assertions before migration**

  Assert the current raw-template inventory page has visible filter button, sort select, three-card rhythm, image ratio, title, price, compare button, and details link.

  Inventory content checkpoint: `/inventory` now uses `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`, replacing only the generated inventory content block with `AuxeroInventoryContent.svelte` and `AuxeroInventoryVehicleCard.svelte`. The temporary legacy endpoint file has been removed after the SvelteKit route was verified. The test now guards the 3-column, dense 4-column, and half-map view contracts before the rest of the inventory page is migrated.

- [x] **Step 2: Move inventory filtering into typed server load**

  Inventory state extraction checkpoint: `src/lib/server/inventory-state.ts` now owns
  inventory view resolution, template mapping, query param aliases, filter normalization, and
  sorting. `src/routes/inventory/+page.server.ts` imports that server module directly, while
  `src/lib/server/auxero-listing-data.ts` reuses the same state for the temporary raw Auxero
  compatibility shell. Unit coverage in `src/lib/server/inventory-state.spec.ts` locks view
  aliases, filter aliases, and sorted selected vehicles.

  Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`,
  `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`. Browser DOM QA covered
  `/inventory`, `/inventory?view=4`, `/inventory?view=map`, and a filtered BMW/Petrol lowest-price
  route with no console errors or horizontal overflow. Desktop/mobile screenshots were saved under
  `test-results/visual-contract/2026-05-27-inventory-state-server-module/`.

- [x] **Step 3: Render inventory with keyed Auxero vehicle cards**

  Current checkpoint: `InventoryTemplatePage.svelte` uses `AuxeroPageShell`, `AuxeroInventoryContent.svelte`, and keyed `AuxeroInventoryVehicleCard.svelte` cards derived from typed inventory data while preserving the Auxero `listing-grid3-columns.html`, dense-grid, and map-view DOM contracts.

  Preserve the card internals and Auxero classes from `listing-grid3-columns.html`; do not reintroduce the removed custom `InventoryGrid.svelte` or `VehicleCard.svelte` components.

- [x] **Step 4: Render detail page from typed route data**

  `src/routes/inventory/[slug]/+page.server.ts` should load one vehicle and throw 404 when missing:

  ```ts
  import { error } from '@sveltejs/kit';
  import type { PageServerLoad } from './$types';
  import { vehicleBySlug, relatedVehiclesFor } from '$lib/server/inventory';

  export const load: PageServerLoad = ({ params }) => {
  	const vehicle = vehicleBySlug(params.slug);
  	if (!vehicle) error(404, 'Vehicle not found');

  	return {
  		vehicle,
  		relatedVehicles: relatedVehiclesFor(vehicle.slug)
  	};
  };
  ```

  Detail content checkpoint: `/inventory/[slug]` now uses `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`; the temporary legacy endpoint file has been removed after the SvelteKit route was verified. The route loads a real vehicle by slug, returns 404 for missing vehicles, splits the rendered Listing Details 3 document at `listing-details[data-bohemcars-detail]`, and renders the detail block through typed Auxero Svelte components.

  Detail state extraction checkpoint: `src/lib/server/vehicle-detail-state.ts` now owns detail
  slug lookup, deterministic fallback selection for raw template compatibility, and related-vehicle
  selection. `src/routes/inventory/[slug]/+page.server.ts` imports that server module directly,
  while `src/lib/server/auxero-listing-data.ts` reuses the same state for the temporary raw Auxero
  compatibility shell. Unit coverage in `src/lib/server/vehicle-detail-state.spec.ts` locks valid
  slug lookup, missing-slug fallback, and related vehicles that do not repeat the current detail car.
  Verification passed on 2026-05-27 with lint, check, full unit tests, project Playwright, build,
  Browser detail QA, and desktop/mobile screenshots for `/inventory/21764342419542174` plus the
  raw `listing-details-3.html` compatibility path under
  `test-results/visual-contract/2026-05-27-vehicle-detail-state-server-module/`.

- [x] **Step 5: Run Svelte autofixer on changed components**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/routes/inventory/+page.svelte
  npx @sveltejs/mcp svelte-autofixer src/routes/inventory/[slug]/+page.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/InventoryTemplatePage.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/AuxeroInventoryContent.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/AuxeroInventoryVehicleCard.svelte
  ```

  Current detail checkpoint autofixer targets were the new Auxero detail components: `AuxeroVehicleDetail.svelte`, `AuxeroVehicleDetailGallery.svelte`, `AuxeroVehicleFeatureTabs.svelte`, `AuxeroVehicleDetailSidebar.svelte`, `AuxeroVehicleOverview.svelte`, `AuxeroVehicleDetailStaticContent.svelte`, `VehicleDetailTemplatePage.svelte`, and the new route page.

- [x] **Step 6: Verify inventory and detail fidelity**

  ```bash
  npm run check
  npm run test:unit -- --run
  npx playwright test src/routes/project1.e2e.ts --grep "inventory|detail"
  ```

  Expected: inventory and detail still match template typography, card ratios, and route behavior.

  Detail checkpoint verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`. Browser DOM QA verified the Svelte detail block on desktop and mobile; Browser screenshot capture timed out, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-detail-content-svelte/`.

- [x] **Step 7: Commit**

  ```bash
  git add src/routes/inventory src/lib/components/inventory src/lib/components/detail src/lib/server/inventory.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate inventory and detail to svelte"
  ```

### Task 4A: Migrate Compare Page

**Checkpoint completed 2026-05-26:**

- `/compare` now uses `src/routes/compare/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page still renders the Auxero `compare.html` head, header, footer, modal stack, scripts, spacing, table classes, and responsive horizontal table behavior from the source template.
- The visible comparison table is rendered by `src/lib/components/compare/AuxeroCompareTable.svelte` from typed `AuxeroCompareVehicle` data in `src/lib/auxero/compare.ts`.
- `src/lib/server/auxero-page.ts` now has a generic element splitter so non-`div` Auxero slots, including compare tables, can be migrated safely.
- `src/routes/project1.e2e.ts` now freezes the compare table contract: visible Auxero table classes, 4 default columns, 12 rows, image/title cell structure, remove controls, and key spec rows.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/AuxeroCompareTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/CompareTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/compare/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified one visible compare table, 4 columns, 12 rows, header/footer visibility, Auxero body class, and no console errors. Browser screenshot capture timed out on the Auxero page, so Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-compare-content-svelte/`.

**Compare state extraction checkpoint completed 2026-05-27:**

- `src/lib/server/compare-state.ts` now owns public compare query parsing, valid vehicle selection, account compare garage fallback, and the four-vehicle cap.
- `/compare` and `/account/compare` import compare state directly instead of reaching into the raw Auxero listing adapter; `src/lib/server/auxero-listing-data.ts` reuses the same module only for the temporary compatibility renderer.
- `src/lib/server/compare-state.spec.ts` locks query aliases, requested order, invalid-id fallback, and account garage compare selection.
- Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`. Browser/Playwright QA covered public compare, query-id compare, and account compare with no console errors or horizontal document overflow; screenshots were saved under `test-results/visual-contract/2026-05-27-compare-state-server-module/`.

### Task 4B: Migrate Account Favorites Page

**Checkpoint completed 2026-05-26:**

- `/account/favorites` now uses `src/routes/account/favorites/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page still renders the Auxero `my-favorites.html` head, dashboard sidebar, account header, active menu item, pagination, modal stack, body classes, and script tail from the source template.
- The visible favorites grid is rendered by `src/lib/components/account/AccountFavoritesGrid.svelte` and `src/lib/components/account/AuxeroFavoriteVehicleCard.svelte` from typed `AuxeroFavoriteVehicleCard` data in `src/lib/auxero/favorites.ts`.
- `src/lib/server/garage.ts` now exposes favorite vehicles from the account garage state for route server loads without moving visual formatting into server-only code.
- `src/routes/project1.e2e.ts` now freezes the favorites page contract: visible Auxero 3-column grid, 3 saved cards, active dashboard menu item, active heart state, tag rows, compare actions, title/price classes, and detail links.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated `my-favorites.html` grid can be split without dropping dashboard chrome, pagination, modal markup, or the runtime favorites hook.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AuxeroFavoriteVehicleCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountFavoritesGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountFavoritesTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/favorites/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the account favorites route on desktop and mobile: 3 `card-box-style-1` favorites, 3 active hearts, 3 compare controls, `data-bohemcars-favorites-count="3"`, active Favorites sidebar item, Auxero dashboard body class, and no console errors. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-favorites-svelte/` after waiting for the favorites card selector.

### Task 4C: Migrate Account Compare Page

**Checkpoint completed 2026-05-26:**

- `/account/compare` now uses `src/routes/account/compare/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page reuses `CompareTemplatePage.svelte` and `AuxeroCompareTable.svelte`, but resolves the account session before selecting the saved garage compare vehicles.
- The page still renders the Auxero `compare.html` head, public compare header/footer, modal stack, body classes, table classes, and responsive horizontal table behavior from the source template.
- `src/routes/project1.e2e.ts` now freezes the account compare contract: visible Auxero compare table, 2 saved account columns, 12 rows, 2 remove controls, and Mileage row presence.
- `src/lib/server/auxero-page.spec.ts` now guards that the account compare table can be split from `compare.html` without dropping the page chrome or modal stack.
- The Auxero runtime now preserves the server-rendered account compare table when no stored compare list exists, so account pages do not get repainted with the public four-car fallback in storage-limited contexts.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/routes/account/compare/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the account compare route on desktop and mobile: 2 visible saved-compare columns, 12 table rows, 2 remove controls, the `card-details--table bohemcars-compare-table` classes, Auxero compare body class, and no console errors. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-account-compare-svelte/` after waiting for the compare table selector.

### Task 5: Normalize Data And Server Boundaries

**Files:**

- Create: `src/lib/types/vehicle.ts`
- Create: `src/lib/types/agent.ts`
- Create: `src/lib/types/account.ts`
- Modify: `src/lib/data/vehicles.ts`
- Modify: `src/lib/data/agents.ts`
- Modify: `src/lib/server/inventory.ts`
- Modify: `src/lib/server/agents.ts`
- Modify: `src/lib/server/auth.ts`
- Test: `src/lib/server/backend.spec.ts`
- Test: `src/lib/data/vehicles.spec.ts`

- [x] **Step 1: Create shared public types**

  `src/lib/types/vehicle.ts`:

  ```ts
  export type Vehicle = {
  	slug: string;
  	title: string;
  	brand: string;
  	model: string;
  	priceEur: number;
  	year: number;
  	mileageKm: number;
  	fuel: string;
  	transmission: string;
  	bodyType: string;
  	status: 'available' | 'new' | 'client' | 'reserved' | 'sold';
  	images: string[];
  	description: string;
  };
  ```

- [x] **Step 2: Use server-only modules for mutations**

  Keep create/update/delete helpers in `$lib/server/inventory.ts`; do not import server modules from `.svelte` files. Client components receive data from `load` or call `/api/*` endpoints.

- [x] **Step 3: Test filters and sorting**

  Add tests that verify:

  ```ts
  expect(filterVehicles({ brand: 'BMW' }).every((vehicle) => vehicle.brand === 'BMW')).toBe(true);
  expect(sortVehicles(vehicles, 'price-asc')[0].priceEur).toBeLessThanOrEqual(
  	sortVehicles(vehicles, 'price-asc')[1].priceEur
  );
  ```

- [x] **Step 4: Verify**

  ```bash
  npm run test:unit -- src/lib/server/backend.spec.ts src/lib/data/vehicles.spec.ts --run
  npm run check
  ```

- [x] **Step 5: Commit**

  ```bash
  git add src/lib/types src/lib/data src/lib/server src/lib/**/*.spec.ts
  git commit -m "refactor: normalize bohemcars data boundaries"
  ```

**Checkpoint completed 2026-05-27:**

- Added shared public type modules in `src/lib/types/vehicle.ts`, `src/lib/types/agent.ts`, and `src/lib/types/account.ts`.
- `src/lib/data/vehicles.ts` and `src/lib/data/agents.ts` now consume and re-export those shared domain types instead of owning duplicate interfaces.
- Server account/auth/db/garage modules now use the shared account/session record types while keeping mutations in `$lib/server`.
- Focused verification passed with `npm run test:unit -- src/lib/data/vehicles.spec.ts src/lib/server/backend.spec.ts --run` and `npm run check`.

### Task 6: Migrate Header, Footer, Garage State, And Forms

**Files:**

- Modify: `src/lib/components/layout/SiteHeader.svelte`
- Modify: `src/lib/components/layout/SiteFooter.svelte`
- Modify: `src/lib/state/garage.svelte.ts`
- Create: `src/lib/components/forms/InquiryForm.svelte`
- Create: `src/lib/components/forms/AuthModal.svelte`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Keep header behavior under tests**

  Assert:

  ```ts
  await expect(page.getByRole('link', { name: /inventory/i })).toBeVisible();
  await expect(
  	page.getByRole('button', { name: /sign in/i }).or(page.getByRole('link', { name: /sign in/i }))
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /add listing/i })).toHaveCount(0);
  ```

- [x] **Step 2: Keep scoped state in context**

  `GarageState` should continue using Svelte 5 class fields:

  ```ts
  favorites = $state<string[]>([]);
  compare = $state<string[]>([]);
  ```

  Computed state should use methods or `$derived` in consuming components, not `$effect`.

- [x] **Step 3: Convert forms to reusable Svelte components**

  `InquiryForm.svelte` should submit through a handler or enhanced form and show a local status message with `$state`.

- [x] **Step 4: Verify**

  ```bash
  npx @sveltejs/mcp svelte-autofixer src/lib/components/layout/SiteHeader.svelte
  npx @sveltejs/mcp svelte-autofixer src/lib/components/forms/InquiryForm.svelte
  npm run check
  npx playwright test src/routes/project1.e2e.ts --grep "header|garage|inquiry"
  ```

- [x] **Step 5: Commit**

  ```bash
  git add src/lib/components/layout src/lib/components/forms src/lib/state src/routes/project1.e2e.ts
  git commit -m "refactor: modularize layout and forms"
  ```

**Checkpoint completed 2026-05-27:**

- Added `src/lib/components/forms/InquiryForm.svelte` and `src/lib/components/forms/AuthModal.svelte` while preserving Auxero form/modal classes and markup rhythm.
- Contact, services, and sell-your-car forms now share the reusable inquiry form with local `$state` status copy aligned to the existing Bohemcars form script.
- Home 05 login, forgot-password, and signup modal bodies are extracted into `AuthModal.svelte`; the visible modal structure and template classes are preserved.
- Added Playwright coverage for buyer header behavior, scoped local garage state, and inquiry submission without polluting later admin dashboard assertions.
- Verification passed: Svelte autofixer on changed Svelte components, `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts --grep "header|garage|inquiry"`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Visual QA screenshots saved under `test-results/visual-contract/2026-05-27-task6-forms/` for contact desktop/mobile, services desktop, sell-your-car mobile, and the Home 05 login modal.

### Task 7: Migrate Support, Agent, Account, And Admin Pages

**Files:**

- Create or modify: `src/routes/agents/+page.server.ts`
- Create or modify: `src/routes/agents/+page.svelte`
- Create or modify: `src/routes/agents/[slug]/+page.server.ts`
- Create or modify: `src/routes/agents/[slug]/+page.svelte`
- Create or modify: `src/routes/services/+page.svelte`
- Create or modify: `src/routes/sell-your-car/+page.svelte`
- Create or modify: `src/routes/contact/+page.svelte`
- Create or modify: `src/routes/account/+layout.svelte`
- Create or modify: `src/routes/admin/+layout.svelte`
- Modify: `src/lib/server/auth.ts`
- Modify: `src/lib/server/roles.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Migrate agents first**

  Agents are smaller than account/admin and prove the template card/detail pattern.

- [x] **Step 2: Migrate public support pages**

  Convert one page at a time. Keep template class names and section order from the mapped Auxero source page.

- [x] **Step 3: Migrate account/admin shells last**

  Keep role checks server-side and preserve dashboard/sidebar layout. Public users must not access admin routes.

- [x] **Step 4: Verify role behavior**

  ```bash
  npx playwright test src/routes/project1.e2e.ts --grep "account|admin|agents"
  npm run test:unit -- src/lib/server/backend.spec.ts --run
  ```

- [x] **Step 5: Commit**

  ```bash
  git add src/routes/agents src/routes/services src/routes/sell-your-car src/routes/contact src/routes/account src/routes/admin src/lib/server/auth.ts src/lib/server/roles.ts src/routes/project1.e2e.ts
  git commit -m "refactor: migrate secondary routes to svelte"
  ```

**Checkpoint completed 2026-05-27:**

- Added `src/lib/components/layout/AuxeroPageShell.svelte` to centralize the repeated Auxero head, body-class script, and before/after HTML chrome used by one-slot template pages.
- Migrated account/admin one-slot template wrappers to the shared shell: dashboard recent boxes, messages, listings, favorites, users, profile, password, and add/edit listing forms.
- Confirmed account wrappers no longer duplicate `pageDocument.headHtml` / `bodyClassScript`; those raw template adapter boundaries are now constrained to the shared shell for this dashboard slice.
- Verification passed with Svelte autofixer on the new shell and migrated wrappers, `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts --grep "account|admin"`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Visual QA screenshots saved under `test-results/visual-contract/2026-05-27-auxero-shell-account/` for account dashboard desktop, account messages mobile, admin inventory desktop, and admin users mobile; no console or page errors were collected.

**Public shell checkpoint completed 2026-05-27:**

- Migrated the remaining public one-slot template wrappers to `AuxeroPageShell`: about, terms, FAQs, services, sell-your-car, inventory, vehicle detail, reviews, agents, agent detail, calculator, blog, blog detail, contact, and compare.
- Confirmed only `AuxeroPageShell.svelte` and the intentionally multi-slot `HomeFiveTemplatePage.svelte` still own raw `pageDocument.headHtml` / `bodyClassScript` output boundaries.
- Verification passed with Svelte autofixer on all touched Svelte wrappers, `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Product and matching Auxero source screenshots were captured at desktop and mobile for all 15 touched public routes under `test-results/visual-contract/2026-05-27-auxero-shell-public/`; `report.json` recorded no product console errors and no horizontal overflow.

**Route loader helper checkpoint completed 2026-05-27:**

- Added `renderAuxeroPageDocument` and `renderAuxeroPageSlot` in `src/lib/server/auxero-page.ts` so page server loads no longer duplicate raw template render, document split, marked slot lookup, and 500 error handling.
- Refactored Home 05 plus public, account, and admin `+page.server.ts` loaders through the shared server-only helper while preserving each template filename, route path, slot marker, slot tag, and route data shape.
- Added unit coverage for the helper against the compare template slot contract.
- Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser smoke screenshots for `/`, `/inventory`, `/inventory/[slug]`, `/compare`, `/account?role=customer`, and `/admin?role=admin` were saved under `test-results/visual-contract/2026-05-27-route-loader-helper/`; `report.json` recorded no product console errors and no horizontal overflow.

**Protected session helper checkpoint completed 2026-05-27:**

- Added `requireBohemcarsPageSession` in `src/lib/server/auth.ts` so protected page loaders share one server-only 401/403 role guard.
- Refactored account and admin page loaders to use the helper while preserving route paths, render options, template slots, and Svelte page data.
- Added unit coverage for missing account sessions, denied customer admin access, and allowed agent inquiry access.
- Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser smoke screenshots for allowed account/admin routes and status checks for denied routes were saved under `test-results/visual-contract/2026-05-27-protected-session-helper/`; `report.json` recorded no status mismatches, no unexpected console errors, and no horizontal overflow.

**Legacy route endpoint cleanup checkpoint completed 2026-05-27:**

- Removed the stale `*.legacy.ts` route adapter files for `/`, `/inventory`, and `/inventory/[slug]` now that the SvelteKit `+page.server.ts` and `+page.svelte` routes own those pages.
- Kept the compatibility renderer only as the documented Auxero source contract, shared page-shell boundary, and catch-all template route, not as duplicate route endpoints.
- Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser smoke screenshots for `/`, `/inventory`, and `/inventory/[slug]` at desktop and mobile were saved under `test-results/visual-contract/2026-05-27-remove-legacy-route-files/`; `report.json` recorded no console errors, no page errors, no non-200 statuses, and no horizontal overflow.

**Admin agents route checkpoint completed 2026-05-27:**

- Added a protected `/admin/agents` SvelteKit page route so the planned agent-management surface no longer depends on the raw catch-all template endpoint.
- Reused the existing Auxero `sale-agents.html` shell and `AgentsTemplatePage`/`AuxeroAgentsGrid` components, adding typed managed-agent metadata and actions while preserving the consultant card classes, image structure, social row, contact controls, and calm Auxero button styling.
- Updated the route-source contract so `/admin/agents` maps to `sale-agents.html` instead of the generic dashboard family.
- Verification passed with Svelte autofixer on the touched agent components and route page, `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser smoke screenshots for `/admin/agents?role=admin` at desktop and mobile were saved under `test-results/visual-contract/2026-05-27-admin-agents-svelte-route/`; `report.json` recorded 3 cards, 3 status rows, 3 lead links, 3 message links, no console errors, no page errors, and no horizontal overflow.

**Unused pre-Auxero component cleanup checkpoint completed 2026-05-27:**

- Removed unused custom Svelte components from the older non-Auxero/Home 09 direction so future work cannot accidentally reintroduce bespoke cards, zooming vehicle images, or custom home/detail layouts outside the selected Auxero source pages.
- Updated `PROJECT_PLAN.md` so the component inventory reflects the actual Home 05, inventory, and detail components that remain in the SvelteKit architecture.
- Verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser DOM QA covered `/`, `/inventory`, `/inventory/21764342419542174`, and `/agents` with no console errors; desktop/mobile screenshots were saved under `test-results/visual-contract/2026-05-27-unused-component-cleanup/`.

### Task 7A: Migrate Agents Listing Page

**Checkpoint completed 2026-05-26:**

- `/agents` now uses `src/routes/agents/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `sale-agents.html` head, header, breadcrumb, section heading, footer, modal stack, body classes, grid classes, card structures, image ratios, social controls, and contact controls.
- The visible consultant grid is rendered by `src/lib/components/agents/AuxeroAgentsGrid.svelte` and `src/lib/components/agents/AuxeroAgentCard.svelte` from typed `AuxeroAgentCard` data in `src/lib/auxero/agents.ts`.
- `src/routes/project1.e2e.ts` now freezes the agents listing contract: visible public agent grid, 3 `sale-agent-box` cards, one active card, 3 title links, 3 social rows, 6 contact controls, and the Bohemcars sales route link.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated public agents grid can be split without dropping page chrome, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/agents/AuxeroAgentCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/agents/AuxeroAgentsGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/agents/AgentsTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/agents/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the agents listing on desktop and mobile: 3 consultant cards, one active card, 3 social rows, 6 contact controls, preserved `grid-cols-4 sm-grid-cols-1 lg-grid-cols-2` grid classes, Auxero agents body class, and no console errors. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-agents-listing-svelte/` after waiting for the agent card selector.

**Checkpoint refreshed 2026-05-27:**

- Tightened the scoped `.bohemcars-agent-grid` hover override so consultant social/contact controls use the project-approved grey fill hover instead of a template-specific translucent hover.
- Added Playwright assertions that consultant images keep an identity transform on hover and social controls use the grey fill/border hover state.
- Visual QA screenshots saved under `test-results/visual-contract/2026-05-27-agent-hover/` for agents desktop hover, agents mobile, and agent detail desktop; no console or page errors were collected.

### Task 7B: Migrate Agent Detail Page

**Checkpoint completed 2026-05-26:**

- `/agents/[slug]` now uses `src/routes/agents/[slug]/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `sale-agents-details.html` head, header, breadcrumb, location/sidebar card, inquiry form, footer, modal stack, body classes, profile image ratio, verification row, copy spacing, and one-column inventory list.
- The detail profile/inventory block is rendered by `src/lib/components/agents/AgentDetailMainContent.svelte` inside `AgentDetailTemplatePage.svelte`, using typed `AuxeroAgentDetailContent` data from `src/lib/auxero/agent-detail.ts`.
- The agent inventory cards reuse `src/lib/components/inventory/AuxeroInventoryVehicleCard.svelte` with the existing `card-box card-box-style-9` list variant, keeping the template card structure and compare/detail affordances.
- `src/routes/project1.e2e.ts` now freezes the agent detail contract: visible profile content, verification badge, 3 list cards, 3 compare controls, 3 detail links, and preserved `send-inquiry` sidebar form.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated agent detail main content can be split without dropping sidebar, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/agents/AgentDetailMainContent.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/agents/AgentDetailTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/agents/[slug]/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the agent detail page on desktop and mobile: one `.innerpage__content md-mb-30` profile block, 3 `card-box-style-9` inventory cards, 3 compare actions, 3 detail links, one preserved `form.send-inquiry`, footer chrome, Auxero agent detail body class, no console errors, and no mobile horizontal overflow. Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-26-agent-detail-svelte/` after waiting for the agent inventory selector.

**Agent state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/agent-detail-state.ts` now owns public consultant listing, detail slug lookup, deterministic raw-template fallback selection, and agent inventory selection.
- `/agents` and `/agents/[slug]` import the server module directly; the detail route now returns a 404 for unknown consultant slugs instead of silently rendering the first consultant.
- `src/lib/server/auxero-listing-data.ts` reuses the same state for the temporary raw `sale-agents.html` and `sale-agents-details.html` compatibility paths, preserving the first-consultant fallback only where the raw template shell needs it.
- Unit coverage in `src/lib/server/agent-detail-state.spec.ts` locks consultant listing, valid slug lookup, fallback behavior, and the 3-card agent inventory limit.
- Verification passed with lint, check, full unit tests, project Playwright, build, Browser QA, and desktop/mobile screenshots for `/agents`, `/agents/bohemcars-import`, raw `sale-agents-details.html`, and `/agents/missing-consultant` under `test-results/visual-contract/2026-05-27-agent-state-server-module/`.

### Task 7C: Migrate Contact Form Card

**Checkpoint completed 2026-05-26:**

- `/contact` now uses `src/routes/contact/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `contact-us.html` head, header, map band, contact info card, footer, modal stack, body classes, section spacing, form-card classes, input classes, field ids/names, and local contact form runtime.
- The contact form card is rendered by `src/lib/components/contact/ContactFormCard.svelte` inside `ContactTemplatePage.svelte`, using typed `AuxeroContactFormData` from `src/lib/auxero/contact.ts`.
- `src/routes/project1.e2e.ts` now freezes the contact contract: map iframe, info card, `radius-20` form card, 4 Auxero inputs, message textarea, and successful local form status.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated contact form card can be split without dropping the map, info panel, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/contact/ContactFormCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/contact/ContactTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/contact/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the contact page on desktop and mobile: one Svelte `contact-page-form` card, 4 `input-large` controls, one message textarea, preserved `widget-gg-map` iframe, `contact-page-info`, footer chrome, Auxero contact body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-26-contact-form-svelte/`.

### Task 7D: Migrate Services Form Card

**Checkpoint completed 2026-05-26:**

- `/services` now uses `src/routes/services/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `services-center.html` head, header, breadcrumb, service overview, featured service grid, parallax contact band, contact info panel, footer, modal stack, body classes, form-card classes, input/select classes, and local service form runtime.
- The schedule-service form card is rendered by `src/lib/components/services/ServiceFormCard.svelte` inside `ServicesTemplatePage.svelte`, using typed `AuxeroServiceFormData` from `src/lib/auxero/services.ts`.
- `src/routes/project1.e2e.ts` now freezes the services contract: 6 service boxes, `services-center-info`, `radius-20` form card, 5 Auxero inputs, one `select-style-2` control, and the schedule submit button.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated services form card can be split without dropping service sections, contact info, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/services/ServiceFormCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/services/ServicesTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/services/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the services page on desktop and mobile: 6 service boxes, one `services-center-info` panel, one Svelte `services-center-form` card, 5 `input-large` controls, one select with 6 options, footer chrome, Auxero services body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-26-services-form-svelte/`.

**Data boundary refreshed 2026-05-27:**

- `src/lib/auxero/services.ts` now owns typed service card records, and `serviceFormData.serviceOptions` derives from those card titles so the raw service grid and Svelte service form stay aligned.
- `src/lib/auxero/sell-your-car.ts` now owns typed sell-your-car workflow steps, and `src/lib/server/auxero-support-data.ts` renders those records instead of keeping local raw-adapter data copies.
- Focused unit coverage locks the six service cards, service form option alignment, four sell workflow steps, and sell form submit label before the raw template adapter renders them.

### Task 7E: Migrate Sell Your Car Form

**Checkpoint completed 2026-05-26:**

- `/sell-your-car` now uses `src/routes/sell-your-car/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `sell-your-car.html` head, header, breadcrumb, hero copy, tab strip, how-it-works steps, why-choose card, CTA band, FAQ, footer, modal stack, body classes, form-card classes, input classes, field ids/names, and local sell-car form runtime.
- The sell-car intake form is rendered by `src/lib/components/sell-your-car/SellCarForm.svelte` inside `SellYourCarTemplatePage.svelte`, using typed `AuxeroSellCarFormData` from `src/lib/auxero/sell-your-car.ts`.
- `src/routes/project1.e2e.ts` now freezes the sell-your-car contract: 4 step boxes, one active step, visible `calculate-form bohemcars-sell-form`, 4 Auxero inputs, and successful local form status.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated sell-your-car form can be split without dropping the tab strip, follow-up sections, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/sell-your-car/SellCarForm.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/sell-your-car/SellYourCarTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/sell-your-car/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the sell-your-car page on desktop and mobile: 4 step boxes, one active step, one Svelte `calculate-form bohemcars-sell-form`, 4 `input-large` controls, footer chrome, Auxero sell-your-car body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-26-sell-your-car-form-svelte/`.

### Task 7F: Migrate Reviews Grid

**Checkpoint completed 2026-05-26:**

- `/reviews` now uses `src/routes/reviews/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `clients-reviews.html` head, header, breadcrumb, page heading, pagination, footer, modal stack, body classes, testimonial card classes, star icon row, avatar sizing, and responsive grid classes.
- The review grid is rendered by `src/lib/components/reviews/AuxeroReviewsGrid.svelte` and `AuxeroReviewCard.svelte` inside `ReviewsTemplatePage.svelte`, using typed `AuxeroReviewCard` data from `src/lib/auxero/reviews.ts`.
- `src/lib/server/auxero-support-data.ts` now consumes the same shared review-card data for raw-template fallback output, keeping the compatibility adapter and Svelte route aligned.
- `src/routes/project1.e2e.ts` now freezes the reviews contract: visible `data-bohemcars-reviews-grid`, 6 testimonial cards, 6 avatars, preserved 3-column grid class, and the first public review name.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated reviews grid can be split without dropping the page heading, pagination, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/reviews/AuxeroReviewCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/reviews/AuxeroReviewsGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/reviews/ReviewsTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/reviews/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the reviews page on desktop and mobile: 6 testimonial cards, 30 star icons, 6 avatars, one pagination row, footer chrome, Auxero reviews body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-26-reviews-grid-svelte/`.

### Task 7G: Migrate Calculator Estimator

**Checkpoint completed 2026-05-27:**

- `/calculator` now uses `src/routes/calculator/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `calculator.html` head, header, breadcrumb, page heading, calculator grid classes, input classes, summary card, budget cards, FAQ band, footer, modal stack, body classes, and local calculator runtime hooks.
- The estimator grid is rendered by `src/lib/components/calculator/CalculatorEstimator.svelte` inside `CalculatorTemplatePage.svelte`, using typed `AuxeroCalculatorData` from `src/lib/auxero/calculator.ts`.
- `src/lib/server/auxero-support-data.ts` now consumes the same calculator data/formatting helpers for raw-template fallback output, keeping the compatibility adapter and Svelte route aligned.
- `src/routes/project1.e2e.ts` now freezes the calculator contract: visible `data-bohemcars-calculator`, 5 calculator inputs, initial total `38 640 EUR`, and live price recalculation to `45 240 EUR`.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated calculator estimator can be split without dropping the budget cards, calculator FAQ, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/calculator/CalculatorEstimator.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/calculator/CalculatorTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/calculator/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the calculator page on desktop and mobile: one Svelte `data-bohemcars-calculator` estimator grid, 5 inputs, 7 outputs, live total update from `38 640 EUR` to `45 240 EUR`, preserved budget and FAQ follow-up sections, footer chrome, Auxero calculator body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-calculator-estimator-svelte/`.

### Task 7H: Migrate Terms Content

**Checkpoint completed 2026-05-27:**

- `/terms` now uses `src/routes/terms/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `terms.html` head, header, breadcrumb, page heading, `term-page` wrapper, sticky nav classes, content section classes, footer, modal stack, body classes, and local script tail.
- The terms block is rendered by `src/lib/components/terms/TermsContent.svelte` inside `TermsTemplatePage.svelte`, using typed `AuxeroTermsSection` data from `src/lib/auxero/terms.ts`.
- `src/lib/server/auxero-support-data.ts` now consumes the same shared terms sections for raw-template fallback output, keeping the compatibility adapter and Svelte route aligned.
- `src/routes/project1.e2e.ts` now freezes the terms contract: visible `data-bohemcars-terms`, 6 sticky-nav links, 6 content sections, first section heading, and final payment-safety copy.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated terms content can be split without dropping the page heading, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/terms/TermsContent.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/terms/TermsTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/terms/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the terms page on desktop and mobile: one Svelte `data-bohemcars-terms` content block, 6 nav links, 6 content sections, preserved `term-page` class, footer chrome, Auxero terms body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-terms-content-svelte/`.

### Task 7I: Migrate Blog Listing Grid

**Checkpoint completed 2026-05-27:**

- `/blog` now uses `src/routes/blog/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `blog-grid-style-1.html` head, header, breadcrumb, page heading, `post-style-6` cards, image wrappers, metadata row, pagination, footer, modal stack, body classes, and local script tail.
- The blog grid is rendered by `src/lib/components/blog/BlogListGrid.svelte` and `BlogListCard.svelte` inside `BlogTemplatePage.svelte`, using existing typed `BlogPost` data from `src/lib/data/blog.ts`.
- `src/lib/server/auxero-support-data.ts` now marks the generated raw blog grid with `data-bohemcars-blog-grid` for safe route splitting while preserving fallback markup.
- `src/routes/project1.e2e.ts` now freezes the blog listing contract: visible `data-bohemcars-blog-grid`, 3 `post-style-6` cards, 3 post images, preserved 3-column grid class, and the first detail link.
- `src/lib/server/auxero-page.spec.ts` now guards that the generated blog grid can be split without dropping the page heading, pagination, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/blog/BlogListCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/blog/BlogListGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/blog/BlogTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/blog/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the blog listing page on desktop and mobile: one Svelte `data-bohemcars-blog-grid`, 3 `post-style-6` cards, 3 images, first detail link preserved, pagination and footer chrome, Auxero blog body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-blog-list-svelte/`.

### Task 7J: Migrate Blog Detail Article Column

**Checkpoint completed 2026-05-27:**

- `/blog/[slug]` now uses `src/routes/blog/[slug]/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `blog-details-1.html` head, header, breadcrumb, hero banner, sidebar, related posts band, footer, modal stack, body classes, and local script tail.
- The article column is rendered by `src/lib/components/blog/BlogDetailMainContent.svelte` inside `BlogDetailTemplatePage.svelte`, using typed `AuxeroBlogDetailContent` data from `src/lib/auxero/blog-detail.ts`.
- `src/routes/project1.e2e.ts` freezes the detail contract: visible `innerpage__content`, post image, quote block, previous/next links, and the Bohemcars comment form success state.
- `src/lib/server/auxero-page.spec.ts` guards that the generated blog detail article column can be split without dropping sidebar, related posts, footer, or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/blog/BlogDetailMainContent.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/blog/BlogDetailTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/blog/[slug]/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the blog detail page on desktop and mobile: one Svelte `innerpage__content md-mb-30` article column, one `innerpage__sidebar`, one post image, one quote block, 2 previous/next links, 2 related post cards, the Bohemcars comment form success state, preserved Auxero blog detail body class, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-blog-detail-svelte/`.

**Blog state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/blog-state.ts` owns the public blog list, detail lookup, related-post selection, and deterministic raw-template fallback.
- `/blog` and `/blog/[slug]` import the shared server state module directly; the detail route still returns a 404 for unknown slugs instead of falling back to the first article.
- `src/lib/auxero/blog-detail.ts` now only shapes Auxero detail content from already-resolved blog state, keeping data lookup out of the visual adapter.
- `src/lib/server/auxero-support-data.ts` reuses the same state for raw `blog-grid-style-1.html` and `blog-details-1.html` compatibility rendering.
- Unit and Playwright coverage now lock blog listing order, detail lookup, fallback behavior, related posts, comment form behavior, and the `/blog/missing-post` 404.
- Verification passed with lint, check, full unit tests, project Playwright, build, Browser QA, and screenshots for `/blog`, `/blog/vnos-ot-kanada-proverka`, raw `blog-details-1.html`, and `/blog/missing-post` under `test-results/visual-contract/2026-05-27-blog-state-server-module/`.

### Task 7K: Migrate FAQ Accordions

**Checkpoint completed 2026-05-27:**

- `/faqs` now uses `src/routes/faqs/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `faqs.html` head, header, breadcrumb, footer, modal stack, body classes, and local script tail.
- The FAQ accordion section is rendered by `src/lib/components/faqs/FaqsContent.svelte`, `FaqAccordion.svelte`, and `FaqAccordionItem.svelte`, using typed FAQ groups from `src/lib/auxero/faqs.ts`.
- `src/routes/project1.e2e.ts` freezes the FAQ contract: visible `data-bohemcars-faqs` section, 4 accordion groups, 12 FAQ toggles, 4 active toggles, and the public group headings.
- `src/lib/server/auxero-page.spec.ts` guards that the generated FAQ section can be split without dropping footer or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/faqs/FaqAccordionItem.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/faqs/FaqAccordion.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/faqs/FaqsContent.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/faqs/FaqsTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/faqs/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the FAQ page on desktop and mobile: one Svelte `data-bohemcars-faqs` section, 4 accordions, 12 toggles, 4 active toggles/titles, preserved Auxero FAQ body class, footer/modal chrome, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-faqs-svelte/`.

### Task 7L: Migrate About Page Content

**Checkpoint completed 2026-05-27:**

- `/about` now uses `src/routes/about/+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero `about-us.html` head, header, breadcrumb, intro split, testimonial carousel structure, why-choose card, counter row, consultant card grid, footer, modal stack, body classes, and local script tail.
- The about content is rendered by focused Svelte components in `src/lib/components/about/`, using typed data from `src/lib/auxero/about.ts`.
- `src/routes/project1.e2e.ts` freezes the about contract: visible `data-bohemcars-about`, intro images, 4 testimonial cards, why-choose block, 4 counters, 3 consultant cards, and the first consultant detail link.
- `src/lib/server/auxero-page.spec.ts` guards that the generated about block can be split without dropping footer or modal markup.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutIntroSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutReviewsSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutChecklist.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutStatsGrid.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutWhyChooseSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutConsultantsSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutContent.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/about/AboutTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/about/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the about page on desktop and mobile: one Svelte `data-bohemcars-about` block, one intro main image, one intro sub-image, 4 review boxes, 4 counter items, 3 consultant cards, preserved Auxero about body class, footer/modal chrome, no console errors, and no mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-about-svelte/`.

### Task 7M: Migrate Dashboard Recent Activity Boxes

**Checkpoint completed 2026-05-27:**

- `/account` and `/admin` now use SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` routes with `csr = false`.
- The pages preserve the Auxero dashboard sidebar, header, stat cards, chart, listing/submission tables, modal stack, body classes, and local script tail.
- The recent dashboard activity box is rendered by `DashboardRecentBox.svelte` inside `DashboardRecentTemplatePage.svelte`, using typed `AuxeroDashboardRecentData` from `src/lib/auxero/dashboard.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes the same typed recent data for the Svelte routes and marks the raw fallback recent box with `data-bohemcars-dashboard-recent`.
- `src/routes/project1.e2e.ts` freezes the dashboard contract: customer recent messages, admin recent inquiries, real Bohemcars activity content, and no leaked demo review copy like `Great Experience!`.
- `src/lib/server/auxero-page.spec.ts` guards that both account and admin dashboard recent boxes can be split without dropping dashboard chrome, modals, or runtime script tail.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/DashboardRecentBox.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/DashboardRecentTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified the account and admin dashboard roots on desktop and mobile: one Svelte `data-bohemcars-dashboard-recent` box per page, customer recent messages, admin recent inquiries, preserved dashboard stat cards and listing tables, preserved dashboard body class, no demo review copy, no console errors, and no page-level mobile horizontal overflow. Full-page Playwright screenshots were saved under `test-results/visual-contract/2026-05-27-dashboard-recent-svelte/`.

**Dashboard state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-dashboard-state.ts` owns dashboard route context, role-aware dashboard stat data, recent activity data, account avatars, and dashboard date formatting.
- `src/lib/server/auxero-account-data.ts` now reuses that server state for raw `dashboard.html` compatibility rendering while keeping only the Auxero shell/string replacement work in the adapter.
- `/account` and `/admin` still render the same Svelte dashboard recent component data, but that data no longer originates inside the raw adapter.
- Unit coverage now locks route activity resolution, customer/admin stat identities, recent activity headings/content, helper alignment, and invalid-date fallback behavior.
- Verification passed with lint, check, full unit tests, project Playwright, build, Browser QA, and desktop/mobile screenshots for `/account?role=customer` and `/admin?role=admin` under `test-results/visual-contract/2026-05-27-account-dashboard-state-module/`.
- Route boundary refresh, 2026-05-28: `/account` and `/admin` now import `getAccountDashboardRecentData` directly from `account-dashboard-state.ts`; the raw adapter keeps only compatibility rendering for `dashboard.html`. A route architecture spec guards against reintroducing `auxero-account-data` as the SvelteKit dashboard data source.
- Adapter API cleanup, 2026-05-28: removed the stale exported `getAuxero...` route-data facades from `auxero-account-data.ts`, leaving account dashboard data ownership in `account-dashboard-state.ts` and raw template ownership in `applyAccountTemplateData`. Browser DOM QA plus screenshot fallback evidence was saved under `test-results/visual-contract/2026-05-28-account-adapter-api-cleanup/`.

### Task 7N: Migrate Account/Admin Message Threads

**Checkpoint completed 2026-05-27:**

- `/account/messages`, `/admin/messages`, and `/admin/inquiries` now use SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` routes with `csr = false`.
- The pages preserve the Auxero dashboard shell, role-aware sidebar/header, message search, contacts column, chat header, message bubbles, dropdown controls, message input/action row, modal stack, body classes, and local script tail.
- The message container is rendered by `MessageThreadContainer.svelte` inside `MessageTemplatePage.svelte`, using typed `AuxeroMessageThreadData` from `src/lib/auxero/messages.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes the same typed message data for Svelte routes and replaces the whole raw message container with `data-bohemcars-message-container`, preventing the previous partial-adapter leak of demo contacts.
- `src/routes/project1.e2e.ts` freezes the message contract: visible Svelte message containers, sidebar/chat regions, seeded Bohemcars sales and inquiry content, and no raw `data-contact="john"` or `Bohemcars follow-up is ready` demo text.
- `src/lib/server/auxero-page.spec.ts` and `src/lib/server/auxero-template.spec.ts` guard that account/admin message containers can be split without dropping dashboard chrome, modals, or runtime script tail.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/MessageThreadContainer.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/MessageTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/messages/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/messages/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inquiries/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified `/account/messages`, `/admin/messages`, and `/admin/inquiries` on desktop and mobile: one Svelte `data-bohemcars-message-container` per page, preserved message contacts/header/body/action structure, seeded customer and admin inquiry content, no demo contact leakage, no console errors, and no page-level horizontal overflow. The in-app Browser screenshot command timed out on this dashboard view, so full-page Playwright fallback screenshots were saved under `test-results/visual-contract/2026-05-27-message-thread-svelte/`.

**Message state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-message-state.ts` owns role-aware message contacts, active-contact selection, inquiry/customer thread messages, fallback messages, and context links for account/admin message surfaces.
- `src/lib/server/auxero-account-data.ts` now reuses that server state for raw `message.html` compatibility rendering while keeping only Auxero message-container markup functions in the adapter.
- `/account/messages`, `/admin/messages`, and `/admin/inquiries` still feed the same `MessageThreadContainer.svelte` data shape, but the thread state no longer originates inside the raw adapter.
- Unit coverage now locks customer contacts, customer thread context, admin inquiry threads, agent-scoped admin messaging, helper alignment, and absence of old demo message/contact leakage.
- Verification passed with lint, check, full unit tests, project Playwright, build, Browser QA, and screenshots for `/account/messages?role=customer`, `/admin/messages?role=admin`, and `/admin/inquiries?role=agent` under `test-results/visual-contract/2026-05-27-account-message-state-module/`.
- Route boundary refresh, 2026-05-28: `/account/messages`, `/admin/messages`, and `/admin/inquiries` now import `getAccountMessageThreadData` directly from `account-message-state.ts`; the raw adapter remains the compatibility renderer for `message.html`. A route architecture spec locks those route imports to the server state module.
- Adapter API cleanup, 2026-05-28: removed the stale exported `getAuxero...` route-data facades from `auxero-account-data.ts`, so message routes cannot depend on the raw adapter for typed thread state. Browser DOM QA plus screenshot fallback evidence was saved under `test-results/visual-contract/2026-05-28-account-adapter-api-cleanup/`.

### Task 7O: Migrate Account Listings And Admin Inventory Tables

**Checkpoint completed 2026-05-27:**

- `/account/listings` and `/admin/inventory` now use SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` routes with `csr = false`.
- The pages preserve the Auxero dashboard shell, role-aware sidebar/header, search/sort controls, table header rhythm, cart item classes, pagination/footer region, modal stack, body classes, and local script tail.
- The listings table is rendered by `AccountListingsTable.svelte` inside `AccountListingsTemplatePage.svelte`, using typed `AuxeroAccountListingsData` from `src/lib/auxero/account-listings.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes the same typed account listings data for Svelte routes and marks the raw fallback table with `data-bohemcars-account-listings` for safe splitting.
- `src/routes/project1.e2e.ts` freezes the table contract: customer submission rows and action counts, admin inventory rows, seeded BMW X5 content, clean resolved admin edit paths without encoded slashes, and remove actions.
- `src/lib/server/auxero-page.spec.ts` guards that customer listings and admin inventory tables can be split without dropping dashboard chrome, modals, or runtime script tail.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountListingsTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountListingsTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/listings/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified `/account/listings?role=customer` and `/admin/inventory?role=admin` on desktop and mobile: one Svelte `data-bohemcars-account-listings` table per page, 2 seeded customer submission rows in the clean browser state, 5 admin inventory rows, preserved 6-column headers, expected edit/message/remove action counts, clean admin edit hrefs with no `%2F` encoding, no console errors, and no horizontal overflow. Browser screenshots were saved under `test-results/visual-contract/2026-05-27-account-listings-svelte/`.

**Listings state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-listings-state.ts` now owns admin inventory rows, customer sell-your-car submission rows, headers, pagination labels, footer copy, and route-friendly `getAccountListingsData`.
- `/account/listings` and `/admin/inventory` page loaders import the server-only listings state directly, while the raw `my-listings.html` compatibility adapter reuses the same state to render its fallback table.
- `src/lib/server/auxero-account-data.ts` now keeps only Auxero account-listing table markup helpers for raw compatibility instead of shaping account/admin listings data inline.
- Focused unit coverage locks admin inventory action hrefs without `%2F`, customer submission action kinds, header/pagination shape, and helper alignment.
- Verification passed with lint, check, full unit tests, project Playwright, build, Browser QA, and hover-fidelity screenshots captured in the same 2026-05-27 verification pass.

### Task 7P: Migrate Admin Users Table

**Checkpoint completed 2026-05-27:**

- `/admin/users` now uses SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The page preserves the Auxero dashboard shell, role-aware sidebar/header, user management stats, cart table classes, role access notes, modal stack, body classes, and local script tail.
- The user table is rendered by `UserManagementTable.svelte` inside `UserManagementTemplatePage.svelte`, using typed `AuxeroUserManagementData` from `src/lib/auxero/user-management.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes typed user management data and marks the raw fallback table with `data-bohemcars-users-table` for safe splitting.
- `src/routes/project1.e2e.ts` freezes the users table contract: visible Svelte table, 6-column header, admin/lead rows, seeded customer email and Canada import lead content, one message and review action per row, and preserved role notes.
- `src/lib/server/auxero-page.spec.ts` guards that the admin users table can be split without dropping dashboard chrome, role notes, modals, or runtime script tail.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/UserManagementTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/UserManagementTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/users/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser DOM QA verified `/admin/users?role=admin` on desktop and mobile: one Svelte `data-bohemcars-users-table`, 6 user rows, 1 admin row, 3 lead rows, preserved 6-column headers, 6 message links, 6 inquiry/review links, role notes present, seeded customer and Canada import lead content, no `%2F` encoded links, no console errors, and no horizontal overflow. Browser screenshots were saved under `test-results/visual-contract/2026-05-27-admin-users-svelte/`.

**Users state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-users-state.ts` now owns managed-user rows, admin user stats, role access notes, table headers, footer copy, and action hrefs for the admin users surface.
- `/admin/users` imports the server-only user-management state directly, while the raw `dashboard.html` compatibility adapter renders the same typed records for its fallback table, stats, and role-note blocks.
- `src/lib/server/auxero-account-data.ts` now keeps only Auxero user-management markup helpers for raw compatibility instead of shaping admin user data inline.
- `UserManagementTable.svelte` renders action links from typed data instead of hardcoding message/review route decisions in the visual component.
- Long email/context cells use Auxero's existing `clamp-1 clamp` utility classes in both Svelte and raw fallback rendering so Bohemcars account data does not visually collide inside the fixed dashboard table rhythm.
- Focused unit and Playwright coverage locks admin rows, action hrefs, lead/customer content, stats, role notes, helper alignment, clamp classes, and the agents hover transition wait.

### Task 7Q: Migrate Account Profile And Password Forms

**Checkpoint completed 2026-05-27:**

- `/account/profile` and `/account/password` now use SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The pages preserve the Auxero dashboard shell, role-aware sidebar/header, active menu state, profile card stack, password card, upload previews, social inputs, map block, modal stack, body classes, and local script tail.
- The profile and password forms are rendered by `AccountProfileForm.svelte` and `AccountPasswordForm.svelte` inside focused template page components, using typed shared data from `src/lib/auxero/account-forms.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes typed profile/password data and marks the raw fallback forms with `data-bohemcars-profile-form` and `data-bohemcars-password-form` for safe splitting.
- `src/routes/project1.e2e.ts` freezes the account forms contract: visible Svelte forms, active profile/password menu items, seeded customer values, empty password fields, profile submit status, password submit status, preserved map/avatar/poster assets, and no demo text leakage.
- `src/lib/server/auxero-page.spec.ts` guards that both forms can be split without dropping dashboard chrome, modals, or runtime script tail.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountProfileForm.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountPasswordForm.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountProfileTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountPasswordTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/profile/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/account/password/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser QA verified `/account/profile?role=customer` and `/account/password?role=customer` on desktop and mobile: correct form markers, active menu states, customer field values, visible profile avatar/poster/map, empty password fields, no `Lorem ipsum`, no `themesflat@gmail.com`, no `themesflat@2026`, no console errors, and no horizontal overflow. Browser screenshots were saved under `test-results/visual-contract/2026-05-27-account-profile-password-svelte/`.

**Profile/password state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-profile-state.ts` now owns role-aware profile form data, profile map options, social link defaults, avatar/poster assets, and password form identity data.
- `/account/profile` and `/account/password` page loaders import the server-only profile/password state directly, while the raw `my-profile.html` and `change-password.html` compatibility adapters reuse the same state.
- `src/lib/server/auxero-account-data.ts` now keeps only Auxero profile/password form marking and demo-text replacement helpers for raw compatibility instead of shaping profile/password data inline.
- Focused unit coverage locks customer profile values, social link defaults, map options, absence of template demo names/passwords, role-aware password identity data, and helper alignment.

### Task 7R: Migrate Admin Add And Edit Listing Forms

**Checkpoint completed 2026-05-27:**

- `/admin/inventory/new` and `/admin/inventory/edit/[id]` now use SvelteKit `+page.server.ts`, `+page.svelte`, and `+page.ts` with `csr = false`.
- The pages preserve the Auxero dashboard shell, title/action bar, role-aware sidebar/header, active Add Listing menu state, Gallery, Car Details, Features, Car Price, Location, Video, Attachments section order, modal stack, body classes, and local script tail.
- The form is rendered by `AccountListingForm.svelte` inside `AccountListingFormTemplatePage.svelte`, using typed shared data from `src/lib/auxero/account-listing-form.ts`.
- `src/lib/server/auxero-account-data.ts` now exposes typed add/edit listing form data and marks the raw fallback form with `data-bohemcars-add-listing-form` for safe splitting.
- `src/routes/project1.e2e.ts` freezes the admin form contract: visible Svelte form, create and clone-static modes, hidden source id on static edits, 7 dashboard boxes, 7 gallery items, 25 feature checks, map iframe, action buttons, and draft-save status.
- A focused debugging pass fixed the root cause where the exported form-data wrapper dropped `options`, causing edit pages to keep the raw Edit heading while the Svelte form fell back to create mode.

Verification passed with:

```bash
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountListingForm.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/account/AccountListingFormTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/new/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/edit/[id]/+page.svelte
npm run lint
npm run check
npm run test:unit -- --run
npx playwright test src/routes/project1.e2e.ts
npm run build
```

Browser QA verified `/admin/inventory/new?role=admin` and `/admin/inventory/edit/21764342419542174?role=admin` on desktop and mobile: correct form markers and modes, active Add Listing menu, 7 dashboard boxes, 7 gallery items, 25 feature checks, 2 local action buttons, visible map iframe, no `Lorem ipsum`, no console errors, and no horizontal overflow. Browser screenshots were saved under `test-results/visual-contract/2026-05-27-admin-listing-form-svelte/`.

**Listing form state extraction checkpoint refreshed 2026-05-27:**

- `src/lib/server/account-listing-form-state.ts` now owns role-aware add/edit listing form data, edit route slug resolution, static inventory clone mode, gallery/attachment defaults, feature groups, map options, hidden workflow fields, and field-value lookup.
- `/admin/inventory/new` and `/admin/inventory/edit/[id]` page loaders import the server-only listing form state directly, while the raw `add-listings-2.html` compatibility adapter reuses the same state.
- `src/lib/server/auxero-account-data.ts` now keeps only Auxero add-listing demo replacement and form marking helpers for raw compatibility instead of shaping listing form data inline.
- Focused unit coverage locks create-mode admin hidden fields, static edit clone mode, requested-route vehicle values, demo-text absence, and helper alignment.
- Verification refreshed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser QA refreshed `/admin/inventory/new?role=admin` and `/admin/inventory/edit/21764342419542174?role=admin` on desktop and mobile: form marker visible, modes `create` and `clone-static`, Bohemcars vehicle values present, 7 dashboard boxes, 7 gallery items, map iframe visible, no `Lorem ipsum`, no Peachtree demo address, no console errors, and no horizontal overflow. Screenshots were saved under `test-results/visual-contract/2026-05-27-account-listing-form-state-module/`.

### Task 8: Final Product Polish And Proposal Readiness

**Files:**

- Modify: `README.md`
- Modify: `PROJECT_PLAN.md`
- Create: `docs/QA_CHECKLIST.md`
- Modify: `src/routes/sitemap.xml/+server.ts`
- Modify: `src/lib/data/bohemcars.ts`
- Test: `src/routes/sitemap.xml/sitemap.spec.ts`
- Test: `src/routes/project1.e2e.ts`

- [x] **Step 1: Add QA checklist**

  Create `docs/QA_CHECKLIST.md`:

  ```markdown
  # Bohemcars Proposal QA Checklist

  - [ ] Homepage desktop matches Home 05 baseline.
  - [ ] Homepage mobile has no text overlap.
  - [ ] Inventory desktop has correct card rhythm and filters.
  - [ ] Vehicle detail typography is dark Manrope on light template page.
  - [ ] Header logo is crisp and aligned with controls.
  - [ ] Compare/favorites work without login.
  - [ ] Inquiry forms show a success state.
  - [ ] Account/admin protected pages respond with correct role behavior.
  - [ ] Sitemap contains public proposal routes.
  - [ ] No ThemeForest/Aurexo/demo credentials remain visible.
  ```

- [x] **Step 2: Audit visible copy**

  Search:

  ```bash
  rg -n "Aurexo|ThemeForest|Super Admin|themesflat|dummy|lorem|password:|Username:" src static docs README.md PROJECT_PLAN.md
  ```

  Expected: only intentional template-source documentation references remain.

- [x] **Step 3: Run final verification**

  ```bash
  npm run lint
  npm run check
  npm run test:unit -- --run
  npm run build
  npx playwright test src/routes/project1.e2e.ts
  ```

- [x] **Step 4: Save final screenshots**

  Save desktop and mobile screenshots for:

  ```text
  /
  /inventory
  /inventory/21779200396408437
  /compare
  /agents
  /sell-your-car
  /contact
  /account
  /admin
  ```

- [x] **Step 5: Commit**

  ```bash
  git add README.md PROJECT_PLAN.md docs/QA_CHECKLIST.md src/routes/sitemap.xml src/lib/data/bohemcars.ts src/routes/project1.e2e.ts
  git commit -m "chore: finalize bohemcars proposal readiness"
  ```

**Checkpoint completed 2026-05-27:**

- Added `docs/QA_CHECKLIST.md` and updated README/PROJECT_PLAN handoff copy so the project now points to Home 05 and describes the SvelteKit component migration accurately.
- Added `src/lib/auxero/sitemap.ts` with shared public sitemap route data, tightened `src/routes/sitemap.xml/+server.ts`, expanded sitemap unit coverage, and added a Playwright route guard that public sitemap entries exclude account/admin surfaces and blocked commerce templates.
- Updated Bohemcars brand metadata to remove launch-uncertain wording from the proposal data layer.
- Final verification passed with `npm run lint`, `npm run check`, `npm run test:unit -- --run`, `npx playwright test src/routes/project1.e2e.ts`, and `npm run build`.
- Browser QA swept the key proposal pages with no console errors, no visible demo/template leaks, and no horizontal overflow. Desktop/mobile screenshots were saved under `test-results/visual-contract/2026-05-27-final-proposal-readiness/`.

---

## Completion Criteria

- Home 05 is the stable homepage and is recognizably the Auxero template with Bohemcars branding.
- Public routes are SvelteKit pages/components rather than raw HTML responses, except where a deliberate compatibility adapter remains documented.
- Svelte files pass `svelte-autofixer`, `npm run check`, and the project lint/test suite.
- Visual fidelity tests cover the pages that previously regressed: homepage sections, inventory cards, detail typography, and header/logo alignment.
- The site is credible enough to show Bohemcars as a working proposal prototype, not a loose template demo.
