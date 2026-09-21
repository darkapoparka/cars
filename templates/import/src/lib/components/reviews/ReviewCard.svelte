<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	type Review = { avatar?: string; name: string; role: string; text: string };
	let { review }: { review: Review } = $props();
	let failed = $state(false);
	const initials = $derived(
		review.name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
	);
	const recoverAvatar = (image: HTMLImageElement) => {
		if (image.complete && image.naturalWidth === 0) failed = true;
	};
</script>

<figure class="review-card">
	<figcaption>
		<span class="review-card__avatar" aria-hidden="true">
			{#if review.avatar && !failed}<img
					src={assetHref(review.avatar)}
					alt=""
					width="52"
					height="52"
					loading="lazy"
					decoding="async"
					onerror={() => (failed = true)}
					use:recoverAvatar
				/>{:else}{initials}{/if}
		</span>
		<span class="review-card__person"><strong>{review.name}</strong><span>{review.role}</span></span
		>
	</figcaption>
	<blockquote>{review.text}</blockquote>
</figure>

<style>
	.review-card {
		min-width: 0;
		margin: 0;
		padding: var(--bc-space-6);
		display: flex;
		flex-direction: column;
		gap: var(--bc-space-5);
		background: var(--bc-surface);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
	}
	figcaption {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		min-width: 0;
	}
	.review-card__avatar {
		display: grid;
		place-items: center;
		flex: 0 0 52px;
		width: 52px;
		height: 52px;
		overflow: hidden;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-weight: var(--bc-weight-heading);
	}
	.review-card__avatar img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.review-card__person {
		display: grid;
		gap: var(--bc-space-1);
		min-width: 0;
	}
	.review-card__person strong {
		color: var(--bc-ink);
		font-size: var(--bc-text-body-lg);
		line-height: 1.25;
		overflow-wrap: anywhere;
	}
	.review-card__person > span {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-label);
	}
	blockquote {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	@media (max-width: 767.98px) {
		.review-card {
			padding: var(--bc-space-5);
		}
		blockquote {
			font-size: var(--bc-text-body);
		}
	}
</style>
