<script lang="ts">
	import { page as appPage } from '$app/state';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import MobileInventoryPage from '$lib/components/inventory/mobile/MobileInventoryPage.svelte';
	import type { InventoryPageData } from '$lib/types/storefront-page';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	import { provideDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import InventoryDesktopPage from './InventoryDesktopPage.svelte';
	import InventoryPreviewSettings from './InventoryPreviewSettings.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';

	let { page }: { page: InventoryPageData } = $props();
	const viewport = getViewportContext();
	const showMobileInventory = $derived(viewport.mobile);
	const showDesktopInventory = $derived(!viewport.mobile);

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

<RouteSeo title={page.title} description={page.description} />
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
