<script lang="ts">
	import type { AuxeroReviewCard as AuxeroReviewCardData } from '$lib/auxero/reviews';
	import AuxeroReviewCard from './AuxeroReviewCard.svelte';

	let { cards }: { cards: AuxeroReviewCardData[] } = $props();
</script>

<div
	class="lg-grid-cols-2 md-grid-cols-1 mb-40 grid grid-cols-3 gap-x-30 gap-y-38"
	data-daynight-reviews-grid
>
	{#each cards as card (card.id)}
		<AuxeroReviewCard {card} />
	{/each}
</div>
