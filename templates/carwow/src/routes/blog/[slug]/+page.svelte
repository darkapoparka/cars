<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import BlogArticlePage from '$lib/components/blog/BlogArticlePage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';
	import MobileBlogArticle from '$lib/components/blog/MobileBlogArticle.svelte';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import RouteImageBehavior from '$lib/components/layout/RouteImageBehavior.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo
	title={i18n.text(data.article.title)}
	description={i18n.text(data.article.description)}
	ogImage={data.article.image}
	ogType="article"
/>

{#if viewport.mobile}
	<RouteImageBehavior />
	{#key data.article.slug}<MobileBlogArticle
			article={data.article}
			articles={data.articles}
		/>{/key}
	<MobileBottomDock />
{:else}
	<PublicStorefrontRoute mainContentAnchor>
		<BlogArticlePage article={data.article} articles={data.articles} />
	</PublicStorefrontRoute>
{/if}
