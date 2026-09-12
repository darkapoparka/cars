<script lang="ts">
	import BlogArticlePage from '$lib/components/blog/BlogArticlePage.svelte';
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import MobileHeader from '$lib/components/home/mobile/MobileHeader.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import StorefrontShell from '$lib/components/layout/StorefrontShell.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import { isPhoneViewport } from '$lib/hooks/is-mobile.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const showMobileChrome = $derived(isPhoneViewport());
</script>

<RouteSeo
	title={data.seo.title}
	description={data.seo.description}
	ogImage={data.article.image}
	ogType="article"
/>

<RouteImageBehavior />
{#if showMobileChrome}
	<MobileHeader searchHref="/inventory" />
{/if}

<StorefrontShell>
	<span id="main-content" tabindex="-1" class="sr-only"></span>
	<SiteChrome />
	<BlogArticlePage article={data.article} articles={data.articles} />
	<DayNightFooter />
</StorefrontShell>

<DesktopHomeTrailingChrome />

{#if showMobileChrome}
	<MobileBottomDock />
{/if}
