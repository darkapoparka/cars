<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import MobileHeader from '$lib/components/home/mobile/MobileHeader.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import FaqContent from '$lib/components/faq/FaqContent.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	// Native storefront route. The FAQ accordion state lives in FaqContent; this
	// page only composes route SEO, chrome, and scoped image behavior.

	let { data }: { data: PageData } = $props();

	const showMobileChrome = $derived(isPhoneViewport());
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

<RouteImageBehavior />
{#if showMobileChrome}
	<MobileHeader searchHref="/inventory" />
{/if}

<StorefrontShell>
	<span id="main-content" tabindex="-1" class="sr-only"></span>
	<SiteChrome />
	<FaqContent />
	<DayNightFooter />
</StorefrontShell>

<DesktopHomeTrailingChrome />

{#if showMobileChrome}
	<MobileBottomDock />
{/if}
