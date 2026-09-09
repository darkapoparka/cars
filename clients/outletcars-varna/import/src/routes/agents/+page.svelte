<script lang="ts">
	import AgentsTemplatePage from '$lib/components/agents/AgentsTemplatePage.svelte';

	let { data } = $props();
</script>

<AgentsTemplatePage
	cards={data.cards}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
