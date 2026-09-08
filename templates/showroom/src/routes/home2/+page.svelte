<script lang="ts">
	import HomeTwoTemplatePage from '$lib/components/home2/HomeTwoTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeTwoTemplatePage
	brandCards={data.brandCards}
	budgetTiles={data.homeTwoBudgetTiles}
	copy={data.copy}
	footer={data.footer}
	header={data.header}
	hero={data.hero}
	modals={data.modals}
	pageDocument={data.pageDocument}
	runtimeHtml={data.runtimeHtml}
	typeCards={data.typeCards}
	vehiclePills={data.vehiclePills}
/>
