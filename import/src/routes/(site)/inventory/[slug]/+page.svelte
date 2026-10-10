<script lang="ts">
	
	import type { PageProps } from './$types';
	import VehicleDetailPage from '$lib/components/detail/VehicleDetailPage.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.detail.title} — {data.site.identity.name}</title>
	<meta
		name="description"
		content={data.detail.title +
			' · ' +
			data.detail.priceLabel +
			'. ' +
			data.detail.description.slice(0, 140)}
	/>
	
	
</svelte:head>
{#key data.detail.slug}
	<VehicleDetailPage
		detail={data.detail}
		price={data.price}
		related={data.related}
		english={data.locale === 'en'}
	/>
{/key}
