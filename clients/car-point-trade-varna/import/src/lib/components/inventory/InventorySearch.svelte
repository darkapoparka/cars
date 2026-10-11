<script lang="ts">
	import { page } from '$app/state';
	import DesktopSearchControl from '$lib/components/common/DesktopSearchControl.svelte';
	import {
		inventoryDesktopControlsCopy,
		inventoryDialogCopy
	} from '$lib/content/inventory-desktop-controls';
	import { parseInventoryQuery, serializeInventoryQuery } from '$lib/domain/inventory-query';
	import { linkHref } from '$lib/utils/links';
	let { english, resultCount }: { english: boolean; resultCount: number } = $props();
	const copy = $derived(inventoryDialogCopy[english ? 'en' : 'bg']);
	const controlsCopy = $derived(inventoryDesktopControlsCopy[english ? 'en' : 'bg']);
	const state = $derived(parseInventoryQuery(page.url.searchParams));
	const params = $derived.by(() => {
		const value = serializeInventoryQuery(state, page.url.searchParams);
		value.delete('keyword');
		value.delete('page');
		return value;
	});
	let keyword = $derived(state.filters.keyword ?? '');
</script>

<form
	class="inventory-search"
	role="search"
	aria-label={copy.searchTitle}
	action={linkHref('/inventory')}
	method="get"
>
	{#each [...params] as [name, value], index (index)}
		<input type="hidden" {name} {value} />
	{/each}
	<DesktopSearchControl
		bind:value={keyword}
		label={copy.keyword}
		placeholder={controlsCopy.searchPlaceholder(resultCount)}
		actionLabel={copy.search}
		controls="inventory-results"
	/>
</form>

<style>
	.inventory-search {
		width: 100%;
		min-width: 0;
		margin: 0;
	}
</style>
