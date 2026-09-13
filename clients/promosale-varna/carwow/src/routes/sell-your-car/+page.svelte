<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DesktopSellYourCarPage from '$lib/components/sell/DesktopSellYourCarPage.svelte';
	import MobileSellYourCarPage from '$lib/components/sell/MobileSellYourCarPage.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const showMobileShell = $derived(viewport.mobile);
	const showDesktopShell = $derived(!viewport.mobile);
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#if showDesktopShell}
	<RouteImageBehavior />
{/if}

{#if showMobileShell}
	<MobileSellYourCarPage />
{/if}

{#if showDesktopShell}
	<StorefrontShell mobileReplaced>
		<SiteChrome />
		<DesktopSellYourCarPage />
		<DayNightFooter />
	</StorefrontShell>

	<DesktopHomeTrailingChrome />
{/if}

{#if showMobileShell}
	<MobileBottomDock />
{/if}
