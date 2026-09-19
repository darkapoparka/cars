<script lang="ts">
	import { page } from '$app/state';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import DesktopContactPage from '$lib/components/contact/DesktopContactPage.svelte';
	import MobileContactPage from '$lib/components/contact/MobileContactPage.svelte';
	import MobileImportPage from '$lib/components/contact/MobileImportPage.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const showMobileShell = $derived(viewport.mobile);
	const showDesktopShell = $derived(!viewport.mobile);
	const isImport = $derived(page.url.searchParams.get('intent') === 'import');
	const currentSeo = $derived(data.seo);
</script>

<RouteSeo title={currentSeo.title} description={currentSeo.description} />

{#if showDesktopShell}
	<RouteImageBehavior />
{/if}

{#if showMobileShell}
	{#key page.url.search}
		{#if isImport}
			<MobileImportPage vehicles={data.importExamples} />
		{:else}
			<MobileContactPage />
		{/if}
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
