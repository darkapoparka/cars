<script lang="ts">
	import BlogDetailTemplatePage from '$lib/components/blog/BlogDetailTemplatePage.svelte';

	let { data } = $props();
</script>

<BlogDetailTemplatePage
	content={data.content}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
