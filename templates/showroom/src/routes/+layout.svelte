<script lang="ts">
	import '@fontsource-variable/geist/index.css';
	import '$lib/styles/eliqauto.css';
	import '$lib/styles/eliqauto.type-contract.css';
	// The legacy template and its route adapters share one cascade-layered runtime.
	// Svelte component styles stay unlayered, so they can own their visuals without
	// specificity escalation or `` chains.
	import auxeroRuntimeCssHref from './auxero-runtime.css?url';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import ScrollTop from '$lib/components/layout/ScrollTop.svelte';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';

	type AuxeroTemplatePageData = {
		pageDocument?: {
			headAssets?: unknown;
		};
	};

	let { children } = $props();
	const garage = new GarageState();
	setGarageContext(garage);
	onMount(() => {
		garage.hydrateFromStorage();
		const stopGarageSync = garage.watchExternalGarageState();
		// Lets any route-owned Auxero runtime wait until Svelte has hydrated the DOM.
		document.documentElement.setAttribute('data-eliqauto-hydrated', 'true');
		window.dispatchEvent(new CustomEvent('eliqauto:hydrated'));

		return () => {
			stopGarageSync();
			document.documentElement.removeAttribute('data-eliqauto-hydrated');
		};
	});
	let isAuxeroFullPage = $derived(Boolean(page.data.auxeroFullPage));
	let isAuxeroTemplatePage = $derived(
		Boolean((page.data as AuxeroTemplatePageData).pageDocument?.headAssets)
	);
	let isInventoryDetailPage = $derived(/^\/inventory\/[^/]+\/?$/.test(page.url.pathname));
	let isDashboardArea = $derived(/^\/(?:account|admin)(?:\/|$)/.test(page.url.pathname));
	let allowsBottomNavInDashboard = $derived(page.url.pathname === '/account/favorites');

	const resetAuxeroTransientUi = () => {
		for (const element of document.querySelectorAll<HTMLElement>(
			'.modal.active, .search-modal.active, .core-dropdown.active'
		)) {
			element.classList.remove('active');
		}

		document.body.classList.remove('modal-open', 'overflow-hidden');
		document.body.style.removeProperty('overflow');
	};

	afterNavigate(() => {
		resetAuxeroTransientUi();
		requestAnimationFrame(resetAuxeroTransientUi);
	});

	$effect(() => {
		if (!isAuxeroTemplatePage) {
			document.body.className = '';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/assets/images/favicon.png" />
	{#if isAuxeroTemplatePage}
		<link rel="stylesheet" href={auxeroRuntimeCssHref} data-eliqauto-auxero-stable />
	{/if}
</svelte:head>
{#if isAuxeroFullPage}
	{@render children()}
{:else}
	<SiteHeader variant={page.url.pathname === '/' ? 'home' : 'light'} pathname={page.url.pathname} />
	{@render children()}
	<SiteFooter />
	<ScrollTop />
{/if}
{#if !isInventoryDetailPage && (!isDashboardArea || allowsBottomNavInDashboard)}
	<MobileBottomNav pathname={page.url.pathname} />
{/if}
