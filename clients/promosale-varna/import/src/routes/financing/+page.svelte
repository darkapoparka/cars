<script lang="ts">
	import FinancingTemplatePage from '$lib/components/financing/FinancingTemplatePage.svelte';

	let { data } = $props();
</script>

<FinancingTemplatePage
	initialPrice={data.financing.price}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
