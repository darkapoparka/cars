<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import BlogArticlePage from '$lib/components/blog/BlogArticlePage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo
	title={i18n.text(data.article.title)}
	description={i18n.text(data.article.description)}
	ogImage={data.article.image}
	ogType="article"
/>

<PublicStorefrontRoute mainContentAnchor>
	<BlogArticlePage article={data.article} articles={data.articles} />
</PublicStorefrontRoute>
