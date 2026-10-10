<script lang="ts">
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ImportCostEstimator from '$lib/components/calculator/ImportCostEstimator.svelte';
	let { data }: PageProps = $props();
</script>

<svelte:head
	><title
		>{data.locale === 'en' ? 'Import cost calculator' : 'Калкулатор за внос'} — {data.site.identity
			.name}</title
	><meta
		name="description"
		content={pageDescriptions.calculator[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={data.locale === 'en' ? 'Import cost calculator' : 'Калкулатор за внос'} />
	<div class="site-section site-container">
		<ImportCostEstimator english={data.locale === 'en'} />
	</div>
</main>
