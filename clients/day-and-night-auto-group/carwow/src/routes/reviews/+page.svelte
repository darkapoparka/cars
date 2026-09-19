<script lang="ts">
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import ReviewsContent from '$lib/components/reviews/ReviewsContent.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

<PublicStorefrontRoute mainContentAnchor>
	<ReviewsContent />
</PublicStorefrontRoute>
