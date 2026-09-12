<script lang="ts">
	import InventoryMapPageShell from '$lib/components/inventory/desktop/InventoryMapPageShell.svelte';
	import MobileInventoryPage from '$lib/components/inventory/mobile/MobileInventoryPage.svelte';
	import { isDesktopOrServerViewport, isPhoneOrServerViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const showMobileMap = $derived(isPhoneOrServerViewport());
	const showDesktopMap = $derived(isDesktopOrServerViewport());
</script>

{#if showMobileMap}
	<MobileInventoryPage vehicles={data.page.vehicles} mode="map" />
{/if}
{#if showDesktopMap}
	<InventoryMapPageShell page={data.page} />
{/if}
