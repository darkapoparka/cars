<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileComparePage from '$lib/components/compare/MobileComparePage.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import CompareContent from '$lib/components/compare/CompareContent.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { isPhoneViewport, isDesktopOrServerViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	// Separate mobile and desktop compositions share the garage selection.

	let { data }: { data: PageData } = $props();

	const showMobileChrome = $derived(isPhoneViewport());
	const showDesktopChrome = $derived(isDesktopOrServerViewport());
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#if showMobileChrome}
	<MobileComparePage />
{/if}
{#if showDesktopChrome}
	<RouteImageBehavior />
	<StorefrontShell mobileReplaced>
		<span id="main-content" tabindex="-1" class="sr-only"></span>
		<SiteChrome />
		<CompareContent />
		<DayNightFooter />
	</StorefrontShell>
	<DesktopHomeTrailingChrome />
{/if}
