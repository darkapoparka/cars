<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DesktopContactPage from '$lib/components/contact/DesktopContactPage.svelte';
	import MobileContactPage from '$lib/components/contact/MobileContactPage.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { isDesktopOrServerViewport, isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const showMobileShell = $derived(isPhoneViewport());
	const showDesktopShell = $derived(isDesktopOrServerViewport());
	const currentSeo = $derived(
		browser && page.url.searchParams.get('intent') === 'import'
			? {
					title: 'Внос на автомобил | Plus Auto Русе',
					description:
						'Изпратете обява или опишете желания автомобил и получете конкретни варианти за внос от Plus Auto.'
				}
			: data.seo
	);
</script>

<RouteSeo title={currentSeo.title} description={currentSeo.description} />

{#if showDesktopShell}
	<RouteImageBehavior />
{/if}

{#if showMobileShell}
	{#key page.url.search}
		<MobileContactPage />
	{/key}
{/if}

{#if showDesktopShell}
	<StorefrontShell mobileReplaced>
		<SiteChrome />
		{#key page.url.search}
			<DesktopContactPage />
		{/key}
		<DayNightFooter />
	</StorefrontShell>

	<DesktopHomeTrailingChrome />
{/if}

{#if showMobileShell}
	<MobileBottomDock />
{/if}
