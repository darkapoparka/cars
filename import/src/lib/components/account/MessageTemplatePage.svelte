<script lang="ts">
	import type { AuxeroMessageThreadData } from '$lib/auxero/messages';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AccountMessagesMobilePage from './AccountMessagesMobilePage.svelte';
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

<div class="daynight-messages-mobile-slot">
	<AccountMessagesMobilePage {thread} />
</div>

<div class="daynight-messages-desktop-slot">
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
</div>

<style>
	.daynight-messages-mobile-slot {
		display: none;
	}

	@media (max-width: 767.98px) {
		.daynight-messages-mobile-slot {
			display: block;
		}

		.daynight-messages-desktop-slot {
			display: none;
		}
	}
</style>
