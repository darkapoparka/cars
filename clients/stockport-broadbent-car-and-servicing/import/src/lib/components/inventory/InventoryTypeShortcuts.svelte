<script lang="ts">
	import { page } from '$app/state';
	import ModeTabs from '$lib/components/common/MobileModeTabs.svelte';
	import {
		inventoryCategories,
		inventoryDesktopControlsCopy
	} from '$lib/content/inventory-desktop-controls';
	import { parseInventoryQuery, serializeInventoryQuery } from '$lib/domain/inventory-query';
	import { linkHref } from '$lib/utils/links';
	let { english }: { english: boolean } = $props();
	const state = $derived(parseInventoryQuery(page.url.searchParams));
	const copy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	function typeHref(value: string) {
		const params = serializeInventoryQuery(
			{ ...state, filters: { ...state.filters, bodyType: value || undefined } },
			page.url.searchParams
		);
		params.delete('page');
		return linkHref('/inventory?' + params.toString());
	}
	const options = $derived(
		inventoryCategories.map((category) => ({
			value: category.value,
			label: category.label[english ? 'en' : 'bg'],
			artwork: category.artwork,
			href: typeHref(category.value)
		}))
	);
</script>

<ModeTabs
	class="inventory-types"
	surface="light"
	appearance="segmented"
	navigation
	value={state.filters.bodyType ?? ''}
	label={copy.typeNavigation}
	{options}
/>

<style>
	@media (min-width: 768px) {
		:global(.inventory-types) {
			--mode-tab-font-size: var(--bc-text-body);
		}
	}
</style>
