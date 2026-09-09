<script lang="ts">
	import BlogTemplatePage from '$lib/components/blog/BlogTemplatePage.svelte';

	let { data } = $props();
</script>

<BlogTemplatePage
	blogPage={data.blogPage}
	pageDocument={data.pageDocument}
	posts={data.posts}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
