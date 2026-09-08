<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DesktopAboutPage from '$lib/components/about/DesktopAboutPage.svelte';
	import MobileAboutPage from '$lib/components/about/MobileAboutPage.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
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
{/if}

{#if showMobileShell}
	<MobileAboutPage />
{/if}

{#if showDesktopShell}
	<StorefrontShell mobileReplaced>
		<span id="main-content" tabindex="-1" class="sr-only"></span>
		<SiteChrome />
		<DesktopAboutPage />
		<DayNightFooter />
	</StorefrontShell>

	<DesktopHomeTrailingChrome />
{/if}

{#if showMobileShell}
	<MobileBottomDock />
{/if}
