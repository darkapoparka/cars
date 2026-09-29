<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config/site';
	import Action from '$lib/components/common/Action.svelte';
	const english = $derived(page.data.locale === 'en');
	const missing = $derived(page.status === 404);
	const title = $derived(
		missing
			? english
				? 'Page not found'
				: 'Страницата не е намерена'
			: english
				? 'Temporarily unavailable'
				: 'Временно недостъпно'
	);
</script>

<svelte:head
	><title>{title} — {site.identity.name}</title><meta
		name="robots"
		content="noindex"
	/></svelte:head
>
<main id="main-content" class="site-container site-section error-page">
	<h1>{title}</h1>
	<p>
		{missing
			? english
				? 'This address is no longer available. Browse our available cars or return home.'
				: 'Този адрес не е достъпен. Разгледай наличните автомобили или се върни в началото.'
			: english
				? 'Please try again shortly, or contact us by phone.'
				: 'Моля, опитай отново след малко или се свържи с нас по телефон.'}
	</p>
	<div>
		<Action href="/inventory">{english ? 'Browse cars' : 'Разгледай автомобили'}</Action><Action
			href="/"
			variant="secondary">{english ? 'Home' : 'Начало'}</Action
		>
	</div>
</main>

<style>
	.error-page {
		min-height: 60vh;
		display: grid;
		align-content: center;
		gap: var(--bc-space-5);
	}
	h1 {
		margin: 0;
		font-size: var(--bc-text-h2);
	}
	p {
		margin: 0;
		max-width: var(--bc-container-narrow);
		color: var(--bc-copy);
	}
	.error-page > div {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-3);
	}
</style>
