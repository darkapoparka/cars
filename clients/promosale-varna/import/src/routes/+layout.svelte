<script lang="ts">
	import '$lib/styles/daynight.css';
	// Auxero styles stay mounted but use a non-matching media query on clean routes. This
	// keeps the large theme isolated from clean pages while avoiding a short unstyled header
	// flash when client-side navigation enables the already-loaded sheet. Final deletion is Phase 6.
	import auxeroGuardsCssHref from './auxero-guards.css?url';
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
		document.documentElement.setAttribute('data-daynight-hydrated', 'true');
		window.dispatchEvent(new CustomEvent('daynight:hydrated'));

		return () => {
			stopGarageSync();
			document.documentElement.removeAttribute('data-daynight-hydrated');
		};
	});
	const auxeroStableStylesheetHrefs = [
		'/assets/scss/swiper/swiper-bundle.min.css',
		'/assets/app.css'
	];
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
		document.documentElement.classList.remove('daynight-route-nav-click');
		resetAuxeroTransientUi();
		requestAnimationFrame(resetAuxeroTransientUi);
	});

	$effect(() => {
		if (!isAuxeroFullPage) {
			document.body.className = '';
		}
	});
</script>

<svelte:head>
<meta name="robots" content="noindex,nofollow" />
	<link rel="stylesheet" href="/fonts/sofia-sans/fonts.css" data-daynight-fonts />
	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
	<link rel="apple-touch-icon" href="/dealer/logo.png" />
	{#each auxeroStableStylesheetHrefs as href (href)}
		<link
			rel="stylesheet"
			{href}
			media={isAuxeroTemplatePage ? 'all' : 'not all'}
			data-daynight-auxero-stable
		/>
	{/each}
	<!-- Override sheet: must remain after app.css so its guards win the cascade. -->
	<link
		rel="stylesheet"
		href={auxeroGuardsCssHref}
		media={isAuxeroTemplatePage ? 'all' : 'not all'}
		data-daynight-auxero-stable
	/>
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
