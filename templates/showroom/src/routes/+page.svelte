<script lang="ts">
	import HomeFiveTemplatePage from '$lib/components/home/HomeFiveTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeFiveTemplatePage
	brandCards={data.brandCards}
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
