<script lang="ts">
	import AboutTemplatePage from '$lib/components/about/AboutTemplatePage.svelte';

	let { data } = $props();
</script>

<AboutTemplatePage
	about={data.about}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
