<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) — scoped to this route's CSS chunk,
	// the proven per-route pattern (Preflight stays off the Auxero pages until Phase 6).
	import '$lib/styles/daynight.tailwind-entry.css';
	import ReviewsCleanPage from '$lib/components/reviews/ReviewsCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Отзиви — OUTLETCARS.BG — Варна</title>
	<meta
		name="description"
		content="Отзиви от клиенти на OUTLETCARS.BG — Варна — реални истории за покупка и внос на автомобили: ясен процес, уговорени срокове и без скрити такси."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
</svelte:head>

<ReviewsCleanPage
	cards={data.cards}
	reviewsPage={data.reviewsPage}
	header={data.header}
	footer={data.footer}
/>
