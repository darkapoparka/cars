<script lang="ts">
	import CalculatorContent from '$lib/components/calculator/CalculatorContent.svelte';
	import PublicStorefrontRoute from '$lib/components/layout/PublicStorefrontRoute.svelte';
	import RouteSeo from '$lib/components/seo/RouteSeo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<RouteSeo title={data.seo.title} description={data.seo.description} />

<PublicStorefrontRoute>
	<main id="main-content" tabindex="-1">
		<CalculatorContent />
	</main>
</PublicStorefrontRoute>
