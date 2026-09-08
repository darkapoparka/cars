<script lang="ts">
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';
	import AuxeroAgentCard from './AuxeroAgentCard.svelte';

	let { cards, management = false }: { cards: AuxeroAgentCardData[]; management?: boolean } =
		$props();
</script>

<div
	class="sm-grid-cols-1 lg-grid-cols-2 xl-gap-16 daynight-agent-grid grid grid-cols-4 gap-30"
	data-daynight-agent-management={management ? 'true' : 'false'}
>
	{#each cards as card (card.slug)}
		<AuxeroAgentCard {card} />
	{/each}
</div>

<style>
	:global(.daynight-agent-grid .sale-agent-box:hover .sale-agent-title),
	:global(.daynight-agent-grid .sale-agent-box.active .sale-agent-title) {
		text-decoration: none;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.daynight-agent-grid .sale-agent-social li a:hover),
		:global(.daynight-agent-grid .sale-agent-box .card-bottom .contact li a:hover) {
			border-color: #d6dbd1 !important;
			background-color: #eef0ec !important;
		}
	}
</style>
