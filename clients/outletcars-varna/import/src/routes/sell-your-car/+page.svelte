<script lang="ts">
	import SellYourCarTemplatePage from '$lib/components/sell-your-car/SellYourCarTemplatePage.svelte';

	let { data } = $props();
</script>

<SellYourCarTemplatePage
	form={data.form}
	hero={data.hero}
	mobileCopy={data.mobileCopy}
	mobileSteps={data.mobileSteps}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
	steps={data.steps}
/>
