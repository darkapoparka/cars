<script lang="ts">
	import type { AuxeroMessageThreadData } from '$lib/auxero/messages';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import MessageThreadContainer from './MessageThreadContainer.svelte';

	let {
		afterMessageHtml,
		beforeMessageHtml,
		messageHtml,
		pageDocument,
		thread
	}: {
		afterMessageHtml: string;
		beforeMessageHtml: string;
		messageHtml?: string;
		pageDocument: AuxeroPageDocument;
		thread: AuxeroMessageThreadData;
	} = $props();
</script>

<AuxeroDashboardSlotShell
	{pageDocument}
	beforeHtml={beforeMessageHtml}
	afterHtml={afterMessageHtml}
>
	{#if messageHtml}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html messageHtml}
	{:else}
		<MessageThreadContainer {thread} />
	{/if}
</AuxeroDashboardSlotShell>
