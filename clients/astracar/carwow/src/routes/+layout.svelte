<script lang="ts">
	import geistCyrillicFont from '@fontsource-variable/geist/files/geist-cyrillic-wght-normal.woff2?url';
	import geistLatinFont from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
	import { onMount } from 'svelte';
	import '$lib/styles/tokens.css';
	import '$lib/styles/storefront.css';
	// Native desktop chrome layer: re-emits the chrome's Tailwind utilities with
	// !important scoped to [data-daynight-site-chrome]/[data-daynight-footer] so they
	// win over the UNLAYERED base.css (Tailwind utilities live in @layer utilities,
	// which loses to unlayered CSS). Not legacy Auxero CSS — required, not a crutch.
	import '$lib/styles/storefront-chrome.css';
	import '$lib/styles/base.css';
	import '$lib/styles/daynight-mobile.css';
	import '$lib/styles/desktop-controls.css';
	import { page } from '$app/state';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import ScrollTop from '$lib/components/layout/ScrollTop.svelte';
	import RouteBodyClassRuntime from '$lib/components/layout/RouteBodyClassRuntime.svelte';
	import ChatWidget from '$lib/components/chat/ChatWidget.svelte';
	import JsonLdScript from '$lib/components/seo/JsonLdScript.svelte';
	import { setStorefrontInventorySummaryContext } from '$lib/components/layout/storefront-inventory-summary-context';
	import { getRouteBodyClasses, routeManagesOwnChrome } from '$lib/data/template-routes';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	let { children, data } = $props();
	const garage = new GarageState();
	const routeBodyClasses = $derived(getRouteBodyClasses(page.url.pathname));
	const usesRouteManagedChrome = $derived(routeManagesOwnChrome(page.url.pathname));
	const usesStandaloneAppChrome = $derived(page.url.pathname.startsWith('/admin'));
	// /favorites owns its responsive chrome inside the route, so the layout
	// fallback header/footer and global chat launcher stay out of its shell.
	const usesFavoritesRouteChrome = $derived(page.url.pathname.startsWith('/favorites'));
	// The global template header/footer depend on per-route body classes, which
	// error pages don't have — +error.svelte brings its own minimal chrome.
	const hidesGlobalChrome = $derived(
		usesRouteManagedChrome ||
			usesStandaloneAppChrome ||
			usesFavoritesRouteChrome ||
			page.error !== null
	);
	const showsChatWidget = $derived(
		!usesStandaloneAppChrome &&
			!usesFavoritesRouteChrome &&
			!page.url.pathname.startsWith('/presentation') &&
			page.error === null
	);
	setGarageContext(garage);
	setStorefrontInventorySummaryContext(() => data.storefrontInventorySummary);

	// Sitewide AutoDealer structured data (Google rich results for a dealership).
	const origin = $derived(page.url?.origin ?? '');
	const dealerJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'AutoDealer',
			name: daynightSite.name,
			alternateName: daynightSite.shortName,
			image: `${origin}/assets/astracar/astracar-logo.png`,
			logo: `${origin}/assets/astracar/astracar-logo.png`,
			url: `${origin}/`,
			telephone: '0899908040',
			...(daynightSite.email ? { email: daynightSite.email } : {}),
			address: {
				'@type': 'PostalAddress',
				streetAddress: 'гр. Варна, Цар Освободител 282, бул. „Цар Освободител“ 282',
				addressLocality: 'Варна',
				addressRegion: 'Варна',
				addressCountry: 'BG'
			},
			areaServed: 'BG',
			priceRange: '€€'
		}).replaceAll('<', '\\u003c')
	);

	onMount(() => {
		garage.hydrateFromStorage();
	});
</script>

<svelte:head>
	<link
		rel="preload"
		href={geistCyrillicFont}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
	<link rel="preload" href={geistLatinFont} as="font" type="font/woff2" crossorigin="anonymous" />
	<JsonLdScript json={dealerJsonLd} />
</svelte:head>

<a class="skip-to-content" href="#main-content">Към основното съдържание</a>

<RouteBodyClassRuntime bodyClasses={routeBodyClasses} />

{#if !hidesGlobalChrome}
	<SiteHeader variant="light" pathname={page.url.pathname} />
{/if}

{@render children()}

{#if !hidesGlobalChrome}
	<SiteFooter />
	<ScrollTop />
{/if}

{#if showsChatWidget}
	<ChatWidget />
{/if}

<style>
	:global(html) {
		scrollbar-gutter: stable;
	}

	:global(html.daynight-scroll-locked .header-wrapper.header-sticky),
	:global(html.daynight-scroll-locked .header.is-fixed),
	:global(html.daynight-scroll-locked .daynight-home-header.is-fixed) {
		width: calc(100% - var(--daynight-scrollbar-compensation, 0px)) !important;
	}

	.skip-to-content {
		position: fixed;
		top: 12px;
		left: 12px;
		z-index: 100000;
		padding: 10px 18px;
		border-radius: 10px;
		background: var(--sa-blue);
		color: var(--sa-surface);
		font-weight: 700;
		text-decoration: none;
		transform: translateY(-160%);
		transition: transform 0.16s ease;
	}

	.skip-to-content:focus {
		transform: translateY(0);
		outline: 3px solid var(--sa-surface);
		outline-offset: 2px;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.28);
	}
</style>
