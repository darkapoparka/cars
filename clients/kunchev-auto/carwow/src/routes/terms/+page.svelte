<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import MobileHeader from '$lib/components/home/mobile/MobileHeader.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import TermsContent from '$lib/components/terms/TermsContent.svelte';
	import { isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	// Native storefront route: route-level chrome and terms content are all Svelte
	// components, with mobile header/dock added only for phone layouts.

	let { data }: { data: PageData } = $props();

	const showMobileChrome = $derived(isPhoneViewport());
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

<RouteImageBehavior />
{#if showMobileChrome}
	<MobileHeader searchHref="/inventory" />
{/if}

<StorefrontShell>
	<SiteChrome />
	<main id="main-content" tabindex="-1">
		<TermsContent />
	</main>
	<DayNightFooter />
</StorefrontShell>

<DesktopHomeTrailingChrome />

{#if showMobileChrome}
	<MobileBottomDock />
{/if}
