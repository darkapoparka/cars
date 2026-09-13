<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroDashboardSlotShell from '$lib/components/layout/AuxeroDashboardSlotShell.svelte';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroAgentsGrid from './AuxeroAgentsGrid.svelte';

	let {
		afterAgentsHtml = '',
		beforeAgentsHtml = '',
		cards,
		dashboardShell = false,
		management = false,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml = ''
	}: {
		afterAgentsHtml?: string;
		beforeAgentsHtml?: string;
		cards: AuxeroAgentCard[];
		dashboardShell?: boolean;
		management?: boolean;
		pageDocument: AuxeroPageDocument;
		shellCopy?: HomePageCopy;
		shellFooter?: HomeFiveFooterData;
		shellHeader?: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml?: string;
	} = $props();
</script>

{#if dashboardShell}
	<AuxeroDashboardSlotShell
		{pageDocument}
		beforeHtml={beforeAgentsHtml}
		afterHtml={afterAgentsHtml}
		title="Agents"
	>
		<div class="dashboard-box daynight-dashboard-agents bg-white">
			<AuxeroAgentsGrid {cards} {management} />
		</div>
	</AuxeroDashboardSlotShell>
{:else if shellCopy && shellFooter && shellHeader}
	<AuxeroPublicShell
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		{pageDocument}
		runtimeHtml={shellRuntimeHtml}
		title="Консултанти — Day Night Auto"
	>
		<section class="daynight-agents-hero background-light py-80">
			<div class="container">
				<div class="title-section mb-0 flex justify-between gap-30">
					<div>
						<p class="text-highlight font-weight-600 mb-8">Day Night Auto екип</p>
						<h1 class="h2 mb-12">Консултанти на Day Night Auto</h1>
						<p class="text-secondary h7">
							Продажби и огледи, подбор на автомобили, документи и предаване с ясен следващ ход.
						</p>
					</div>
					<a href={resolve('/contact')} class="btn btn-primary btn-large font-weight-600 max-w-min">
						Запази консултация
					</a>
				</div>
			</div>
		</section>
		<section class="daynight-agents-page pt-64 pb-100">
			<div class="container">
				<AuxeroAgentsGrid {cards} {management} />
			</div>
		</section>
	</AuxeroPublicShell>
{/if}

<style>
	:global(body.auxero-template-sale-agents-html section.pb-100 h1),
	:global(body.auxero-template-sale-agents-html section.pb-100 h2),
	:global(body.auxero-template-sale-agents-html section.pb-100 h2 + p) {
		color: #1c1c1c !important;
	}

	:global(.daynight-agents-page .daynight-agent-grid) {
		max-width: 1080px;
		margin-inline: auto;
	}

	:global(.daynight-dashboard-agents .daynight-agent-grid) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 1399px) {
		:global(.daynight-dashboard-agents .daynight-agent-grid) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		:global(.daynight-dashboard-agents .daynight-agent-grid) {
			grid-template-columns: 1fr;
		}
	}
</style>
