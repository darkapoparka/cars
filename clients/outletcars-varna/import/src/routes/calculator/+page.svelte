<script lang="ts">
	import CalculatorTemplatePage from '$lib/components/calculator/CalculatorTemplatePage.svelte';

	let { data } = $props();
</script>

<CalculatorTemplatePage
	budgetLinks={data.budgetLinks}
	calculator={data.calculator}
	faqs={data.faqs}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
