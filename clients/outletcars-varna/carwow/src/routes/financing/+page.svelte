<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DesktopFinancingPage from '$lib/components/financing/DesktopFinancingPage.svelte';
	import MobileFinancingPage from '$lib/components/financing/MobileFinancingPage.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import RouteAccordionBehavior from '$lib/components/layout/RouteAccordionBehavior.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { isDesktopOrServerViewport, isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const showMobileShell = $derived(isPhoneViewport());
	const showDesktopShell = $derived(isDesktopOrServerViewport());
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#if showDesktopShell}
	<RouteImageBehavior />
	<RouteAccordionBehavior />
{/if}

{#if showMobileShell}
	<MobileFinancingPage />
{/if}

<StorefrontShell mobileReplaced>
	<SiteChrome />
	<DesktopFinancingPage />
	<DayNightFooter />
</StorefrontShell>

<DesktopHomeTrailingChrome />

{#if showMobileShell}
	<MobileBottomDock />
{/if}
