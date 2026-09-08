<script lang="ts">
	import type { AuxeroAgentDetailContent } from '$lib/auxero/agent-detail';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AgentDetailMainContent from './AgentDetailMainContent.svelte';
	import AgentDetailSidebar from './AgentDetailSidebar.svelte';

	let {
		detail,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		detail: AuxeroAgentDetailContent;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Консултанти — Eliqauto"
>
	<div class="innerpage-container container">
		<AgentDetailMainContent {detail} />
		<AgentDetailSidebar sidebar={detail.sidebar} />
	</div>
</AuxeroPublicShell>
