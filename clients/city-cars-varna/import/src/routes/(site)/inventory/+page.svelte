<script lang="ts">
	import InventoryPage from '$lib/components/inventory/InventoryPage.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title>{data.desktop.title} — {data.site.identity.name}</title><meta
		name="description"
		content={data.desktop.subtitle}
	/></svelte:head
>
<InventoryPage
	cards={data.cards}
	desktop={data.desktop}
	mobile={data.mobile}
	copy={data.copy}
	locale={data.locale}
/>
