<script lang="ts">
	import { routeParts, isPublicPath } from '$lib/locale/core';
	import LocalePreferences from '$lib/locale/LocalePreferences.svelte';
	import { base } from '$app/paths';
	import '$lib/styles/app.css';
	import '$lib/styles/fonts.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { site } from '$lib/config/site';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import LegacyLayoutAssets from '$lib/components/layout/LegacyLayoutAssets.svelte';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import PublicErrorShell from '$lib/components/layout/PublicErrorShell.svelte';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';
	let { children } = $props();
	const garage = new GarageState();
	setGarageContext(garage);
	const nativeSite = $derived(Boolean(page.data.nativeSite));
	const legacyFullPage = $derived(Boolean(page.data.auxeroFullPage));
	const legacyStyles = $derived(
		Boolean((page.data as { pageDocument?: { headAssets?: unknown } }).pageDocument?.headAssets)
	);
	const detail = $derived(/^\/inventory\/[^/]+\/?$/.test(routeParts(page.url.pathname).path));
	const dashboard = $derived(
		/^\/(?:account|admin)(?:\/|$)/.test(routeParts(page.url.pathname).path)
	);
	$effect(() => {
		document.documentElement.lang = page.data.locale === 'en' ? 'en' : 'bg';
		document.documentElement.dir = 'ltr';
	});
	onMount(() => {
		garage.hydrateFromStorage();
		const cleanup = garage.watchExternalGarageState();
		document.documentElement.setAttribute('data-daynight-hydrated', 'true');
		window.dispatchEvent(new CustomEvent('daynight:hydrated'));
		return () => {
			cleanup();
			document.documentElement.removeAttribute('data-daynight-hydrated');
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={base + site.identity.favicon} type="image/svg+xml" />
</svelte:head>
{#if !nativeSite}<LegacyLayoutAssets enabled={legacyStyles} />{/if}
{#if nativeSite || legacyFullPage}
	{@render children()}
{:else if page.status >= 400 && isPublicPath(routeParts(page.url.pathname).path)}
	<PublicErrorShell pathname={page.url.pathname}>{@render children()}</PublicErrorShell>
{:else}
	<SiteHeader variant={page.url.pathname === '/' ? 'home' : 'light'} pathname={page.url.pathname} />
	{@render children()}
	<SiteFooter />
{/if}
{#if !nativeSite && routeParts(page.url.pathname).path.startsWith('/account')}
	<LocalePreferences />
{/if}
{#if !detail && (!dashboard || routeParts(page.url.pathname).path === '/account/favorites')}
	<MobileBottomNav pathname={routeParts(page.url.pathname).path} />
{/if}
