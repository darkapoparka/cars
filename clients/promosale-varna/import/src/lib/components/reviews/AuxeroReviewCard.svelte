<script lang="ts">
	import type { AuxeroReviewCard } from '$lib/auxero/reviews';

	let { card }: { card: AuxeroReviewCard } = $props();

	const starIcons = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'];
</script>

<div class="testimonior-box">
	<div class="mb-16 flex items-center gap-4" role="img" aria-label={`${card.stars} от 5 звезди`}>
		{#each starIcons.slice(0, card.stars) as star (star)}
			<img src="/assets/icons/star-6.svg" alt="" />
		{/each}
	</div>
	<p class="testimonior-box--desc mb-16">{card.text}</p>
	<div class="testimonior-box--user">
		<img class="testimonior--img" src={card.avatar} alt={card.name} />
		<div class="testimonior-box--user-content">
			<p class="h5 title">{card.name}</p>
			<p class="desc">{card.role}</p>
		</div>
	</div>
</div>

<style>
	.testimonior-box {
		border-color: var(--bc-border);
		background: var(--bc-surface);
	}

	.testimonior-box:hover {
		transform: none;
		box-shadow: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.testimonior-box:hover {
			background: var(--bc-surface-hover);
			border-color: var(--bc-hover-border);
		}
	}

	@media (max-width: 767.98px) {
		.testimonior-box {
			border-radius: 8px;
		}
	}
</style>
