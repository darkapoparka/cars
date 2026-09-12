<script lang="ts">
	import ImportRequestTemplatePage from '$lib/components/services/ImportRequestTemplatePage.svelte';

	let { data } = $props();
</script>

<ImportRequestTemplatePage
	serviceVehicles={data.serviceVehicles}
	form={data.form}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
