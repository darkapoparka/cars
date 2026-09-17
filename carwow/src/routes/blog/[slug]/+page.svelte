<script lang="ts">
	import BlogArticlePage from '$lib/components/blog/BlogArticlePage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo
	title={data.seo.title}
	description={data.seo.description}
	ogImage={data.article.image}
	ogType="article"
/>

<PublicStorefrontRoute mainContentAnchor>
	<BlogArticlePage article={data.article} articles={data.articles} />
</PublicStorefrontRoute>
