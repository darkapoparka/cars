<script lang="ts">
	import MessageTemplatePage from '$lib/components/account/MessageTemplatePage.svelte';

	let { data } = $props();
</script>

<MessageTemplatePage
	afterMessageHtml={data.afterMessageHtml}
	beforeMessageHtml={data.beforeMessageHtml}
	messageHtml={data.messageHtml}
	pageDocument={data.pageDocument}
	thread={data.thread}
/>
