<script lang="ts">
	import BlogIndexPage from '$lib/components/blog/BlogIndexPage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

{#snippet content()}
	<main id="main-content" tabindex="-1">
		<BlogIndexPage articles={data.articles} filters={data.filters} />
	</main>
{/snippet}

{#if viewport.mobile}
	<RouteImageBehavior />
	{@render content()}
	<MobileBottomDock />
{:else}
	<PublicStorefrontRoute>{@render content()}</PublicStorefrontRoute>
{/if}
