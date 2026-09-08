# Bohemcars Phase 1 Mobile Inventory Navigation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the mobile inventory filter full-page reload path while preserving the current Auxero-faithful mobile inventory UI.

**Architecture:** Keep filter state in the URL, because inventory results are server-shaped and need to survive refreshes. Replace the imperative `window.location.assign()` call in the mobile inventory component with SvelteKit `goto(resolve(...), { noScroll: true })` so query changes reuse the current app shell, rerun route data through the URL change, keep scroll stable, and avoid duplicated legacy runtime startup. Add a Playwright regression that proves a mobile filter navigation does not unload the document.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Auxero template CSS/markup, Playwright, `@sveltejs/mcp` Svelte autofixer.

---

## Audit Decision

- Runtime JS risk: legacy Auxero scripts still replay and mutate DOM for body scripts, garage badges, favorites, compare tables, forms, and inventory URL state. Removing all of that at once would be high risk for a CEO demo.
- State risk: garage/compare currently has server defaults, client localStorage, direct DOM syncing, and compare-table local overrides. Consolidating it is valuable but broader than a safe same-day slice.
- CSS risk: `auxero-guards.css` remains broad. Scoping it further is useful, but it can change visible template behavior and needs screenshot diffing across many routes.
- Highest-confidence slice: mobile inventory filter application currently calls `window.location.assign()` in `InventoryMobilePage.svelte`. Replacing that one call removes a document reload without changing rendered structure, classes, spacing, images, colors, or Auxero card behavior.

## Files

- Modify: `M:/bohemcars-svelte/src/lib/components/inventory/InventoryMobilePage.svelte`
  - Import `goto` from `$app/navigation`.
  - Read the current query string from `$app/state` `page.url.search`.
  - Make `navigateToFilterDraft` async.
  - Close the drawer, build the same `/inventory?...` target, and call `goto(resolve(target), { noScroll: true })`.
- Modify: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`
  - Add a mobile inventory regression that sets a marker on `window`, applies a drawer filter, verifies the URL/results update, verifies the marker survives, and verifies the preloader remains hidden.

## Steps

- [x] **Step 1: Replace full reload with SvelteKit navigation**

In `src/lib/components/inventory/InventoryMobilePage.svelte`, add:

```ts
import { goto } from '$app/navigation';
import { page } from '$app/state';
```

Change:

```ts
const navigateToFilterDraft = (href = filterDraftHref()) => {
	const queryStart = href.indexOf('?');
	filterDrawerOpen = false;

	window.location.assign(
		`${resolve('/inventory')}${queryStart === -1 ? '' : href.slice(queryStart)}`
	);
};
```

to:

```ts
const navigateToFilterDraft = async (href = filterDraftHref()) => {
	const queryStart = href.indexOf('?');
	filterDrawerOpen = false;

	await goto(resolve(`/inventory${queryStart === -1 ? '' : href.slice(queryStart)}`), {
		noScroll: true
	});
};
```

Callers use `void navigateToFilterDraft(...)` because the async work is intentionally fire-and-forget from the click path.

- [x] **Step 2: Add the Playwright no-reload regression**

In `src/routes/project1.e2e.ts`, add a test near the mobile inventory coverage:

```ts
test('mobile inventory filter navigation keeps the SvelteKit document alive', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory');
	await expect(page.locator('.bohemcars-inventory-mobile-card').first()).toBeVisible();

	await page.evaluate(() => {
		(
			window as Window & { __bohemcarsMobileInventoryNavigationProbe?: string }
		).__bohemcarsMobileInventoryNavigationProbe = 'alive';
	});

	await page.locator('.bohemcars-inventory-mobile__tool-choice', { hasText: 'Марка' }).click();
	await expect(page.locator('#bohemcars-inventory-mobile-brand-drawer')).toBeVisible();
	await page
		.locator('#bohemcars-inventory-mobile-brand-drawer button', { hasText: 'Audi' })
		.click();
	await page.locator('.bohemcars-inventory-mobile-drawer__done').click();

	await expect(page).toHaveURL(/\/inventory\?brand=Audi$/);
	await expect(page.locator('.bohemcars-inventory-mobile-card').first()).toContainText('Audi');
	await expect(
		page.evaluate(
			() =>
				(window as Window & { __bohemcarsMobileInventoryNavigationProbe?: string })
					.__bohemcarsMobileInventoryNavigationProbe
		)
	).resolves.toBe('alive');
	await expect(page.locator('.preload')).toBeHidden();
});
```

The drawer action selector matches the current `InventoryMobilePage.svelte` markup.

- [x] **Step 3: Run Svelte autofixer**

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/components/inventory/InventoryMobilePage.svelte
```

Expected: no hard issues.

- [x] **Step 4: Run focused E2E**

```powershell
npx playwright test src/routes/project1.e2e.ts --grep "mobile inventory filter navigation" --reporter=line
```

Expected: the new regression passes and keeps the document-level probe value.

- [x] **Step 5: Run full verification**

```powershell
npm run lint
npm run check
npm run test:unit -- --run
npm run build
npm run test:e2e -- --reporter=line
```

Expected: all pass.

- [x] **Step 6: Browser screenshot QA**

Capture or inspect `/inventory` at 1440x1000 and 390x844 after the change. Verify no visible layout drift, no preloader, no broken images, and no drawer stuck open.
