<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import guards from '../../../routes/auxero-guards.css?url';
	let { enabled }: { enabled: boolean } = $props();
	const reset = () => {
		for (const element of document.querySelectorAll(
			'.modal.active, .search-modal.active, .core-dropdown.active'
		))
			element.classList.remove('active');
		document.body.classList.remove('modal-open', 'overflow-hidden');
		document.body.style.removeProperty('overflow');
	};
	afterNavigate(() => {
		document.documentElement.classList.remove('daynight-route-nav-click');
		reset();
	});
	onDestroy(() => {
		if (!browser) return;
		reset();
		for (const name of [...document.body.classList])
			if (name.startsWith('auxero-template-') || name === 'daynight-inventory-template')
				document.body.classList.remove(name);
	});
</script>

<svelte:head>
	{#if enabled}
		<link rel="stylesheet" href="/assets/scss/swiper/swiper-bundle.min.css" data-legacy-styles />
		<link rel="stylesheet" href="/assets/app.css" data-legacy-styles />
		<link rel="stylesheet" href={guards} data-legacy-styles />
	{/if}
</svelte:head>
