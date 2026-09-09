<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) — scoped to this route's CSS chunk,
	// the proven per-route pattern (Preflight stays off the Auxero pages until Phase 6).
	import '$lib/styles/daynight.tailwind-entry.css';
	import FaqsCleanPage from '$lib/components/faqs/FaqsCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Често задавани въпроси — OUTLETCARS.BG — Варна</title>
	<meta
		name="description"
		content="Отговори на често задавани въпроси за вноса на автомобили от Европа с OUTLETCARS.BG — Варна — проверки, срокове, разходи, документи, гаранция, продажба и огледи."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
</svelte:head>

<FaqsCleanPage
	groups={data.groups}
	header={data.header}
	footer={data.footer}
/>
