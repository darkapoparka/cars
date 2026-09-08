<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) — scoped to this route's CSS chunk,
	// same proven pattern the admin/account areas already use.
	import '$lib/styles/eliqauto.tailwind-entry.css';
	import CompareCleanPage from '$lib/components/compare/CompareCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Сравни автомобили — Eliqauto (clean)</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
</svelte:head>

<CompareCleanPage
	footer={data.footer}
	header={data.header}
	locale={data.locale}
	vehicles={data.vehicles}
/>
