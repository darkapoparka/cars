<script lang="ts">
	import Home1TemplatePage from '$lib/components/home1/Home1TemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<Home1TemplatePage
	brandCards={data.brandCards}
	comparePairs={data.comparePairs}
	copy={data.copy}
	featuredVehicles={data.featuredVehicles}
	footer={data.footer}
	header={data.header}
	hero={data.hero}
	modals={data.modals}
	newsPosts={data.newsPosts}
	pageDocument={data.pageDocument}
	reviews={data.reviews}
	runtimeHtml={data.runtimeHtml}
	seoTitle={data.copy.seo.title}
	typeCards={data.typeCards}
	vehiclePills={data.vehiclePills}
/>
