<script lang="ts">
	import { page as appPage } from '$app/state';
	import StorefrontPageHead from '$lib/components/seo/StorefrontPageHead.svelte';
	import MobileInventoryPage from '$lib/components/inventory/mobile/MobileInventoryPage.svelte';
	import type { InventoryTemplatePage } from '$lib/types/template-page';
	import type { HomeInitialViewport } from '$lib/types/home';
	import { MOBILE_SHELL_MAX_WIDTH } from '$lib/hooks/is-mobile.svelte';
	import { provideDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import InventoryDesktopPage from './InventoryDesktopPage.svelte';
	import InventoryPreviewSettings from './InventoryPreviewSettings.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';

	let {
		page,
		initialViewport
	}: { page: InventoryTemplatePage; initialViewport: HomeInitialViewport } = $props();

	// UA-based SSR: the server already rendered only the layout the device needs
	// (decided from the request User-Agent), so phones never ship/hydrate the
	// desktop inventory shell + its inline template head styles. Hydration starts
	// from the same guess (no mismatch); bind:innerWidth corrects a wrong UA guess
	// after mount. 991px matches the CSS breakpoint where the layouts swap.
	let viewportWidth = $state<number | undefined>();
	const isMobileViewport = $derived(
		viewportWidth === undefined
			? initialViewport === 'mobile'
			: viewportWidth <= MOBILE_SHELL_MAX_WIDTH
	);
	const showMobileInventory = $derived(isMobileViewport);
	const showDesktopInventory = $derived(!isMobileViewport);

	// Reactive source of truth for the desktop grid + every filter control,
	// hydrated from the deep-link query (home hero -> /inventory?brand=...&model=...).
	// Provided via context so the controls drive it without prop-threading. Created
	// per mount (never a module singleton) so SSR never leaks filters across requests.
	const inventoryVehicles = $derived(page.vehicles);
	const inventoryQuickFilters = $derived(page.quickFilters);
	provideDesktopInventoryContext(
		() => inventoryVehicles,
		appPage.url.searchParams,
		() => inventoryQuickFilters
	);

	let activeGridIndex = $state(3);
	let layoutMode = $state<InventoryLayoutMode>('grid');
	const defaultGridIndex = $derived(page.gridDefinitions[3] ? 3 : page.gridDefinitions.length - 1);
	// The left filter panel eats ~300px, so the sidebar layout caps the grid at 4
	// columns (index 2); the column toggles still pick 2/3/4 within that cap.
	const SIDEBAR_MAX_GRID_INDEX = 2;
	const resolvedGridIndex = $derived(
		page.gridDefinitions[activeGridIndex] ? activeGridIndex : defaultGridIndex
	);
	const activeGridPanelIndex = $derived(
		layoutMode === 'sidebar'
			? Math.min(resolvedGridIndex, SIDEBAR_MAX_GRID_INDEX)
			: resolvedGridIndex
	);
	const activeGrid = $derived(page.gridDefinitions[activeGridPanelIndex]);
	const inventoryViewportClass = $derived(
		`daynight-inventory-viewport daynight-inventory-viewport--${layoutMode}`
	);

	function setActiveGridIndex(index: number) {
		// Column toggles set the density in BOTH layouts (don't bounce back to grid).
		if (page.gridDefinitions[index]) {
			activeGridIndex = index;
		}
	}

	function toggleSidebarLayout() {
		layoutMode = layoutMode === 'sidebar' ? 'grid' : 'sidebar';
	}

	function setLayoutMode(nextLayoutMode: InventoryLayoutMode) {
		layoutMode = nextLayoutMode;
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<StorefrontPageHead
	title={page.title}
	scriptSrcs={showDesktopInventory ? page.scriptSrcs : []}
	description={page.description}
/>
{#if showMobileInventory}
	<MobileInventoryPage vehicles={page.vehicles} />
{/if}

{#if showDesktopInventory}
	<InventoryDesktopPage
		{page}
		{layoutMode}
		filterUxMode="modal"
		{inventoryViewportClass}
		activeGridIndex={activeGridPanelIndex}
		grid={activeGrid}
		onSidebarChange={toggleSidebarLayout}
	/>
	<InventoryPreviewSettings
		{layoutMode}
		activeGridIndex={resolvedGridIndex}
		onLayoutChange={setLayoutMode}
		onGridChange={setActiveGridIndex}
	/>
{/if}
