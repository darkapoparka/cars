<script lang="ts">
	import BlogIndexPage from '$lib/components/blog/BlogIndexPage.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

<PublicStorefrontRoute>
	<main id="main-content" tabindex="-1">
		<BlogIndexPage articles={data.articles} filters={data.filters} />
	</main>
</PublicStorefrontRoute>
