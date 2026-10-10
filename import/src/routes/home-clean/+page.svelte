<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) scoped to this route's CSS chunk — the
	// proven per-route pattern (Preflight stays off the Auxero pages until Phase 6).
	import '$lib/styles/daynight.tailwind-entry.css';
	import HomeCleanPage from '$lib/components/home/clean/HomeCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.copy.seo.title}</title>
	<meta name="description" content={data.copy.seo.description} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
	<link
		rel="preload"
		as="image"
		fetchpriority="high"
		href="/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp"
		type="image/webp"
	/>
</svelte:head>

<HomeCleanPage
	copy={data.copy}
	header={data.header}
	footer={data.footer}
	hero={data.hero}
	featuredVehicles={data.featuredVehicles}
	vehiclePills={data.vehiclePills}
	brandCards={data.brandCards}
	typeCards={data.typeCards}
	comparePairs={data.comparePairs}
	reviews={data.reviews}
	newsPosts={data.newsPosts}
/>
