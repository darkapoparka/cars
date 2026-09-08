<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) — scoped to this route's CSS chunk,
	// the proven per-route pattern (Preflight stays off the Auxero pages until Phase 6).
	import '$lib/styles/daynight.tailwind-entry.css';
	import TermsCleanPage from '$lib/components/terms/TermsCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Общи условия — Day Night Auto</title>
	<meta
		name="description"
		content="Условия за използване на Day Night Auto — информация за автомобилите, процес на внос, разходи и калкулатор, огледи, клиентски автомобили и контакт."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
</svelte:head>

<TermsCleanPage
	title={data.title}
	sections={data.sections}
	header={data.header}
	footer={data.footer}
/>
