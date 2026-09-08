<script lang="ts">
	import type { AuxeroAgentDetailContent } from '$lib/auxero/agent-detail';
	import AuxeroInventoryVehicleCard from '$lib/components/inventory/AuxeroInventoryVehicleCard.svelte';

	let { detail }: { detail: AuxeroAgentDetailContent } = $props();
</script>

<div class="innerpage__content md-mb-30">
	<img class="radius-16 mb-35 w-full" src={detail.image} alt={detail.name} />
	<h2 class="mb-12">{detail.name}</h2>
	<div class="flex">
		<div class="verify mb-16">
			<img src="/assets/icons/SealCheck.svg" alt="verified" />
			<p class="text-highlight text-sm">{detail.verifiedLabel}</p>
		</div>
	</div>
	<p class="text-secondary mb-4">{detail.bio}</p>
	<p class="text-secondary mb-40">{detail.summary}</p>
	<div class="divider mb-40 w-full"></div>
	<p class="h4 mb-16">{detail.inventoryHeading}</p>
	<div class="eliqauto-agent-inventory mb-40 grid grid-cols-1 gap-20">
		{#each detail.inventoryCards as card (card.slug)}
			<AuxeroInventoryVehicleCard {card} variant="list" />
		{/each}
	</div>
</div>
