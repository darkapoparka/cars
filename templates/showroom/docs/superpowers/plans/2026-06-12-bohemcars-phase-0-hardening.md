# Bohemcars Phase 0 Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the Bohemcars CEO/demo surface without starting the larger architecture refactor.

**Architecture:** Phase 0 fixes only high-confidence presentation, route-state, media, and verification issues. It preserves Auxero as the visual source of truth and avoids broad rewrites of the runtime bridge, account/admin architecture, or inventory state model until Phase 1.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, Auxero template CSS/markup, Playwright, Vitest, Prettier, `@sveltejs/mcp` Svelte autofixer.

---

## File Structure

- Modify: `M:/bohemcars-svelte/.prettierignore`
  - Keep generated local audit artifacts out of `npm run lint`.
- Modify: `M:/bohemcars-svelte/src/lib/data/vehicles.ts`
  - Add the currently blocked BMW X5 Black Vermilion image to the local fallback map.
- Modify: `M:/bohemcars-svelte/src/lib/styles/bohemcars.css`
  - Scope global heading typography so it does not override Auxero template pages.
- Modify: `M:/bohemcars-svelte/src/lib/components/home/HomeFiveVehicleCard.svelte`
  - Restore Auxero vehicle-card action row semantics.
- Modify: `M:/bohemcars-svelte/src/lib/components/detail/AuxeroVehicleMobileIsland.svelte`
  - Key mobile PDP by `detail.slug`.
- Modify: `M:/bohemcars-svelte/src/lib/components/detail/VehicleDetailTemplatePage.svelte`
  - Key desktop detail block by `detail.slug`.
- Modify: `M:/bohemcars-svelte/src/routes/admin/inventory/edit/[id]/+page.svelte`
  - Key admin listing editor by `listing.id`.
- Modify: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`
  - Align stale assertions with current approved behavior, and add same-route stale-state coverage where practical.

Do not modify these in Phase 0:

- `M:/bohemcars-svelte/src/lib/server/auxero-template.ts`
- `M:/bohemcars-svelte/src/routes/auxero-guards.css`
- `M:/bohemcars-svelte/src/lib/state/garage.svelte.ts`
- broad account/admin auth architecture
- raw template catch-all behavior

Those are Phase 1/2 work.

---

### Task 1: Lint Hygiene For Local Audit Artifacts

**Files:**

- Modify: `M:/bohemcars-svelte/.prettierignore`
- Verify: `M:/bohemcars-svelte/src/lib/components/compare/AuxeroCompareTable.svelte`
- Verify: `M:/bohemcars-svelte/src/lib/components/home/HomeFiveReviewsSection.svelte`
- Verify: `M:/bohemcars-svelte/src/lib/components/sell-your-car/SellYourCarMobilePage.svelte`

- [ ] **Step 1: Add `.audit-desktop/` to Prettier ignore**

Add this line under the existing local audit artifact ignores:

```gitignore
/.audit-desktop/
```

- [ ] **Step 2: Run focused Prettier writes for known source offenders**

Run:

```powershell
npx prettier --write src/lib/components/compare/AuxeroCompareTable.svelte src/lib/components/home/HomeFiveReviewsSection.svelte src/lib/components/sell-your-car/SellYourCarMobilePage.svelte .prettierignore
```

Expected: Prettier rewrites only these files and `.prettierignore`.

- [ ] **Step 3: Run Svelte autofixer on changed Svelte files**

Run:

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/AuxeroCompareTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveReviewsSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/sell-your-car/SellYourCarMobilePage.svelte
```

Expected: no hard issues. If suggestions appear, only apply them when they are mechanical and do not alter Auxero visual behavior.

- [ ] **Step 4: Verify lint no longer fails because of audit artifacts**

Run:

```powershell
npm run lint
```

Expected: either PASS, or a smaller ESLint-only failure list unrelated to `.audit-desktop/` and the three known Prettier offenders.

---

### Task 2: Vehicle Image Reliability Patch

**Files:**

- Modify: `M:/bohemcars-svelte/src/lib/data/vehicles.ts`
- Test: `M:/bohemcars-svelte/src/lib/data/vehicles.spec.ts`
- Test: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`

- [ ] **Step 1: Write/extend the unit test**

Add this test to `src/lib/data/vehicles.spec.ts` near the existing vehicle mapping assertions:

```ts
it('uses a local fallback for the BMW X5 Black Vermilion blocked hotlink', () => {
	const vehicle = getVehicleBySlug('21779118142363481');

	expect(vehicle?.title).toBe('BMW X5 40i Black Vermilion');
	expect(vehicle?.image).toBe('/assets/images/card/card-48.jpg');
	expect(vehicle?.images).toEqual(['/assets/images/card/card-48.jpg']);
	expect(vehicle?.gallery[0]).toBe('/assets/images/card/card-48.jpg');
});
```

- [ ] **Step 2: Run the test and confirm it fails before implementation**

Run:

```powershell
npm run test:unit -- --run src/lib/data/vehicles.spec.ts
```

Expected before code change: FAIL because `21779118142363481` still resolves to the remote `cdn2.focus.bg` image.

- [ ] **Step 3: Add the fallback map entry**

In `src/lib/data/vehicles.ts`, update `knownBrokenImageFallbacks`:

```ts
const knownBrokenImageFallbacks: Record<string, string> = {
	'21764342419542174': '/assets/images/card/card-48.jpg',
	'21778067767337633': '/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp',
	'21778068579001193': '/assets/images/card/card-55.jpg',
	'21779200396408437': '/assets/images/card/card-38.jpg',
	'21779118142363481': '/assets/images/card/card-48.jpg',
	'21779117876725419': '/assets/images/card/card-3.jpg',
	'21750419064369634': '/assets/images/card/card-48.jpg',
	'11766312659396823': '/assets/images/card/card-6.jpg',
	'11768743659815066': '/assets/images/card/card-5.jpg',
	'11775058343987884': '/assets/images/card/card-5.jpg',
	'21741178468686255': '/assets/images/card/card-48.jpg'
};
```

- [ ] **Step 4: Verify the test passes**

Run:

```powershell
npm run test:unit -- --run src/lib/data/vehicles.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run the client-nav broken-image audit**

Run:

```powershell
@'
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:4197';
const routes = ['/inventory', '/compare', '/agents', '/services', '/sell-your-car', '/contact', '/about', '/reviews', '/calculator', '/faqs', '/terms', '/blog', '/blog/vnos-ot-kanada-proverka', '/'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`${base}/`, { waitUntil: 'load' });
for (const route of routes) {
	await page.evaluate((href) => {
		const anchor = document.createElement('a');
		anchor.href = href;
		anchor.textContent = 'route probe';
		anchor.style.position = 'fixed';
		anchor.style.left = '-9999px';
		document.body.append(anchor);
		anchor.click();
	}, route);
	await page.waitForURL(`${base}${route}`, { waitUntil: 'load' });
	await page.waitForTimeout(300);
}
const broken = await page.evaluate(() =>
	Array.from(document.images)
		.filter((image) => image.complete && image.naturalWidth === 0)
		.map((image) => image.currentSrc || image.src)
);
await browser.close();
console.log(JSON.stringify(broken, null, 2));
'@ | node --input-type=module -
```

Expected after implementation: `[]`.

---

### Task 3: Auxero Typography And Vehicle Card Fidelity

**Files:**

- Modify: `M:/bohemcars-svelte/src/lib/styles/bohemcars.css`
- Modify: `M:/bohemcars-svelte/src/lib/components/home/HomeFiveVehicleCard.svelte`
- Test: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`

- [ ] **Step 1: Scope heading typography away from Auxero template pages**

Replace the global heading block in `src/lib/styles/bohemcars.css` with:

```css
/* Restore the Bohemcars display font only on non-Auxero surfaces.
   Auxero template pages keep the template typography contract. */
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h1,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h2,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h3,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h4,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h5,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) h6,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h1,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h2,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h3,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h4,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h5,
body:not([class*='auxero-template-']):not(.bohemcars-inventory-template) .h6 {
	font-family: var(--bc-font-heading);
}
```

- [ ] **Step 2: Restore the Home 05 vehicle action row**

In `src/lib/components/home/HomeFiveVehicleCard.svelte`, add `GitCompare` to the icon import:

```ts
import { Calendar, Cog, Fuel, GitCompare } from '@lucide/svelte';
```

Then add this action row after the price paragraph inside `.content`:

```svelte
<div class="divider mb-15"></div>
<div class="bohemcars-card-actions flex justify-between">
	<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
	<p
		class="compare-details btn btn-small open-modal"
		data-modal-id="#CompareModal"
		data-bohemcars-compare={vehicle.slug}
		role="button"
		tabindex="0"
	>
		<GitCompare size={18} strokeWidth={1.8} aria-hidden="true" />
		{copy.compare}
	</p>
	<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)} class="view-details">
		{copy.viewDetails}
		<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
	</a>
</div>
```

- [ ] **Step 3: Add focused CSS that preserves Auxero fill behavior**

Append inside the component `<style>`:

```css
.bohemcars-card-actions {
	align-items: center;
	gap: 16px;
	margin-top: auto;
}

.bohemcars-card-actions :global(.compare-details) {
	align-items: center;
	display: inline-flex;
	gap: 6px;
}

.bohemcars-card-actions :global(.view-details) {
	align-items: center;
	display: inline-flex;
	white-space: nowrap;
}
```

Do not add `::before`, `::after`, transform, scale, glow, border-only, or global `.btn` overrides.

- [ ] **Step 4: Run Svelte autofixer**

Run:

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveVehicleCard.svelte
```

Expected: no hard issues.

- [ ] **Step 5: Update the E2E contract**

In `src/routes/project1.e2e.ts`, add assertions after the featured card count:

```ts
await expect(featuredGrid.locator('.compare-details.btn.btn-small.open-modal')).toHaveCount(8);
await expect(featuredGrid.locator('.view-details')).toHaveCount(8);
```

Replace the stale pill-image assertion:

```ts
await expect(homeFeaturedSection.locator('.bohemcars-pill-image--spec')).toHaveCount(0);
```

Keep:

```ts
await expect(homeFeaturedSection.locator('.bohemcars-pill-image--brand')).toHaveCount(3);
```

- [ ] **Step 6: Run focused E2E**

Run with an already-running preview/dev server:

```powershell
$env:PLAYWRIGHT_SKIP_WEBSERVER='1'; $env:PLAYWRIGHT_PORT='4197'; npx playwright test src/routes/project1.e2e.ts --grep "homepage preserves Home 05" --reporter=line
```

Expected: the homepage test passes.

---

### Task 4: Same-Route PDP And Admin Editor State Reset

**Files:**

- Modify: `M:/bohemcars-svelte/src/lib/components/detail/VehicleDetailTemplatePage.svelte`
- Modify: `M:/bohemcars-svelte/src/lib/components/detail/AuxeroVehicleMobileIsland.svelte`
- Modify: `M:/bohemcars-svelte/src/routes/admin/inventory/edit/[id]/+page.svelte`
- Test: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`

- [ ] **Step 1: Key the desktop PDP content**

In `VehicleDetailTemplatePage.svelte`, replace:

```svelte
<AuxeroVehicleDetail {detail} />
```

with:

```svelte
{#key detail.slug}
	<AuxeroVehicleDetail {detail} />
{/key}
```

- [ ] **Step 2: Key the mobile PDP island**

In `AuxeroVehicleMobileIsland.svelte`, replace:

```svelte
<AuxeroVehicleMobilePdp {detail} />
```

with:

```svelte
{#key detail.slug}
	<AuxeroVehicleMobilePdp {detail} />
{/key}
```

- [ ] **Step 3: Key the admin listing editor**

In `src/routes/admin/inventory/edit/[id]/+page.svelte`, replace:

```svelte
<AdminListingEditor
	{listing}
	{form}
	notice={data.notice}
	submitLabel={listing.source === 'admin-listing' ? 'Save changes' : 'Save draft copy'}
/>
```

with:

```svelte
{#key listing.id}
	<AdminListingEditor
		{listing}
		{form}
		notice={data.notice}
		submitLabel={listing.source === 'admin-listing' ? 'Save changes' : 'Save draft copy'}
	/>
{/key}
```

- [ ] **Step 4: Run Svelte autofixer**

Run:

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/components/detail/VehicleDetailTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/detail/AuxeroVehicleMobileIsland.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/edit/[id]/+page.svelte
```

Expected: no hard issues.

- [ ] **Step 5: Add a PDP same-route regression test**

Add a focused Playwright test to `src/routes/project1.e2e.ts` near the detail route tests:

```ts
test('vehicle detail resets mobile PDP state when navigating between slugs', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/inventory/21764342419542174');
	await expect(page.locator('.bohemcars-pdp-mobile')).toContainText(
		'BMW X5 40i M Sport Shadow Line'
	);

	await page.goto('/inventory/21778068579001193');
	await expect(page.locator('.bohemcars-pdp-mobile')).toContainText('BMW X4 M Competition');
	await expect(page.locator('.bohemcars-pdp-mobile')).not.toContainText(
		'BMW X5 40i M Sport Shadow Line'
	);
});
```

- [ ] **Step 6: Add an admin editor same-route regression test**

Add a focused test near the admin inventory tests:

```ts
test('admin listing editor resets fields when navigating between edit records', async ({
	page
}) => {
	await page.goto('/admin/inventory/edit/21764342419542174?role=admin');
	await expect(page.locator('#title')).toHaveValue(/BMW X5/);

	await page.goto('/admin/inventory/edit/21778068579001193?role=admin');
	await expect(page.locator('#title')).toHaveValue(/BMW X4/);
	await expect(page.locator('#title')).not.toHaveValue(/BMW X5/);
});
```

- [ ] **Step 7: Run focused E2E**

Run:

```powershell
$env:PLAYWRIGHT_SKIP_WEBSERVER='1'; $env:PLAYWRIGHT_PORT='4197'; npx playwright test src/routes/project1.e2e.ts --grep "vehicle detail resets|admin listing editor resets" --reporter=line
```

Expected: both tests pass.

---

### Task 5: Align Stale Viewport Contract And Full Phase 0 Verification

**Files:**

- Modify: `M:/bohemcars-svelte/src/routes/project1.e2e.ts`
- Verify: all changed files

- [ ] **Step 1: Update viewport assertion**

In `src/routes/project1.e2e.ts`, replace:

```ts
viewport: 'width=device-width, initial-scale=1, viewport-fit=cover';
```

with:

```ts
viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content';
```

- [ ] **Step 2: Run Svelte autofixer on all touched Svelte files**

Run:

```powershell
npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveVehicleCard.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/detail/VehicleDetailTemplatePage.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/detail/AuxeroVehicleMobileIsland.svelte
npx @sveltejs/mcp svelte-autofixer src/routes/admin/inventory/edit/[id]/+page.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/compare/AuxeroCompareTable.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/home/HomeFiveReviewsSection.svelte
npx @sveltejs/mcp svelte-autofixer src/lib/components/sell-your-car/SellYourCarMobilePage.svelte
```

Expected: no hard issues.

- [ ] **Step 3: Run core verification**

Run:

```powershell
npm run lint
npm run check
npm run test:unit -- --run
npm run build
```

Expected: all pass.

- [ ] **Step 4: Run project Playwright against preview/dev server**

Run:

```powershell
$env:PLAYWRIGHT_SKIP_WEBSERVER='1'; $env:PLAYWRIGHT_PORT='4197'; npx playwright test src/routes/project1.e2e.ts --reporter=line
```

Expected: no Phase 0-related failures. If account favorites still fails due prototype garage sync, record it as Phase 1 unless it blocks the CEO demo route scope.

- [ ] **Step 5: Capture fresh screenshots**

Run:

```powershell
@'
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base = 'http://127.0.0.1:4197';
const out = 'outputs/qa/2026-06-12-phase-0-hardening';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const shots = [
	{ name: 'home-desktop.png', route: '/', viewport: { width: 1440, height: 1000 } },
	{ name: 'inventory-desktop.png', route: '/inventory', viewport: { width: 1440, height: 1000 } },
	{ name: 'pdp-mobile.png', route: '/inventory/21764342419542174', viewport: { width: 390, height: 844 } },
	{ name: 'home-mobile.png', route: '/', viewport: { width: 390, height: 844 } },
	{ name: 'inventory-mobile.png', route: '/inventory', viewport: { width: 390, height: 844 } }
];
for (const shot of shots) {
	const page = await browser.newPage({ viewport: shot.viewport });
	await page.goto(`${base}${shot.route}`, { waitUntil: 'load' });
	await page.waitForTimeout(700);
	await page.screenshot({ path: `${out}/${shot.name}`, fullPage: false });
	await page.close();
}
await browser.close();
console.log(JSON.stringify(shots.map((shot) => `${out}/${shot.name}`), null, 2));
'@ | node --input-type=module -
```

Expected: screenshots are written under ignored `outputs/`.

---

## Subagent Execution Map

Use subagent-driven development with three disjoint worker scopes:

1. **Worker A: Demo/Test Hygiene**
   - Owns `.prettierignore` and known Prettier offenders.
   - Does not touch visual component implementation.

2. **Worker B: Media + Auxero Fidelity**
   - Owns `vehicles.ts`, `vehicles.spec.ts`, `bohemcars.css`, and `HomeFiveVehicleCard.svelte`.
   - Does not touch PDP/admin state.

3. **Worker C: Same-Route State**
   - Owns PDP/admin keyed reset implementation changes.
   - Does not touch global CSS or vehicle imagery.

Main session owns `src/routes/project1.e2e.ts` to avoid merge conflicts across workers.
After each worker returns, review diffs locally, integrate the E2E contract updates, run the relevant
focused checks, then run the full Phase 0 verification gate.
