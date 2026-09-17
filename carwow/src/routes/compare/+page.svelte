<script lang="ts">
	import MobileComparePage from '$lib/components/compare/MobileComparePage.svelte';
	import CompareContent from '$lib/components/compare/CompareContent.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const showMobileChrome = $derived(viewport.mobile);
	const showDesktopChrome = $derived(!viewport.mobile);
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#if showMobileChrome}
	<MobileComparePage catalogue={data.vehicles} />
{/if}
{#if showDesktopChrome}
	<PublicStorefrontRoute mainContentAnchor mobileReplaced>
		<CompareContent catalogue={data.vehicles} />
	</PublicStorefrontRoute>
{/if}
