<script lang="ts">
	import InventoryMapPageShell from '$lib/components/inventory/desktop/InventoryMapPageShell.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import MobileInventoryPage from '$lib/components/inventory/mobile/MobileInventoryPage.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const showMobileMap = $derived(viewport.mobile);
	const showDesktopMap = $derived(!viewport.mobile);
</script>

{#if showMobileMap}
	<RouteSeo title={data.page.title} description={data.page.description} />
	<MobileInventoryPage vehicles={data.page.vehicles} mode="map" />
{/if}
{#if showDesktopMap}
	<InventoryMapPageShell page={data.page} />
{/if}
