<script lang="ts">
	import CompareTemplatePage from '$lib/components/compare/CompareTemplatePage.svelte';

	let { data } = $props();
</script>

<CompareTemplatePage
	afterCompareHtml={data.afterCompareHtml}
	allVehicles={data.allVehicles}
	beforeCompareHtml={data.beforeCompareHtml}
	dashboardShell={data.dashboardShell}
	locale={data.locale}
	pageDocument={data.pageDocument}
	vehicles={data.vehicles}
/>
