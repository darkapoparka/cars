<script lang="ts">
	import AgentDetailTemplatePage from '$lib/components/agents/AgentDetailTemplatePage.svelte';

	let { data } = $props();
</script>

<AgentDetailTemplatePage
	detail={data.detail}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
