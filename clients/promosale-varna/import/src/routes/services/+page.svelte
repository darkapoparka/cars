<script lang="ts">
	import ServicesTemplatePage from '$lib/components/services/ServicesTemplatePage.svelte';

	let { data } = $props();
</script>

<ServicesTemplatePage
	form={data.form}
	pageDocument={data.pageDocument}
	services={data.services}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
