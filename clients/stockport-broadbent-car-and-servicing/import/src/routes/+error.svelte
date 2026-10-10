<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/config/site';
	import Action from '$lib/components/common/Action.svelte';
	import { errorPageCopy } from '$lib/content/error-page';
	import { isPublicPath, routeParts } from '$lib/locale/core';
	const copy = $derived(errorPageCopy[page.data.locale === 'en' ? 'en' : 'bg']);
	const missing = $derived(page.status === 404);
	const title = $derived(missing ? copy.missing : copy.unavailable);
</script>

<svelte:head
	><title>{title} — {site.identity.name}</title><meta
		name="robots"
		content="noindex"
	/></svelte:head
>
<main
	id="main-content"
	class="site-container site-section error-page"
	class:error-page--public={isPublicPath(routeParts(page.url.pathname).path)}
>
	<h1>{title}</h1>
	<p>{missing ? copy.missingDescription : copy.unavailableDescription}</p>
	<div>
		<Action href="/inventory">{copy.browse}</Action><Action href="/" variant="secondary"
			>{copy.home}</Action
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
	@media (min-width: 768px) {
		.error-page--public {
			align-content: start;
			justify-items: center;
			gap: var(--bc-desktop-hero-gap);
			padding-top: var(--bc-desktop-hero-padding-start);
			text-align: center;
		}
		.error-page--public h1 {
			max-width: var(--bc-desktop-hero-title-width);
			font-size: var(--bc-desktop-hero-title);
			line-height: 1.12;
			text-wrap: balance;
		}
	}
</style>
