<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import {
		reviewRoleCopy,
		reviewRatingPresentation,
		type ReviewRoleKind
	} from '$lib/content/reviews';
	type Review = {
		avatar?: string;
		name: string;
		role: string;
		roleKind?: ReviewRoleKind;
		rating?: number;
		excerpt?: string;
		text: string;
	};
	let {
		review,
		compactRole,
		compact = false,
		sample = false,
		english = false
	}: {
		review: Review;
		compactRole?: string;
		compact?: boolean;
		sample?: boolean;
		english?: boolean;
	} = $props();
	const rating = $derived(reviewRatingPresentation(english ? 'en' : 'bg', review.rating));
	const desktopRole = $derived(
		reviewRoleCopy[english ? 'en' : 'bg'][review.roleKind ?? 'customer']
	);
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

<figure class="review-card" class:review-card--compact={compact}>
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
				/>{#if sample}<span class="review-card__sample-initials">{initials}</span
					>{/if}{:else}{initials}{/if}
		</span>
		<span class="review-card__person"
			><strong>{review.name}</strong><span
				class="review-card__role-original"
				class:review-card__role-full={Boolean(compactRole) || compact}>{review.role}</span
			>{#if compact}<span class="review-card__meta">
					<span>{compactRole ?? desktopRole}</span>
					{#if rating}<span class="review-card__rating" aria-label={rating.accessibleLabel}>
							<span aria-hidden="true">★</span><span aria-hidden="true">{rating.label}</span>
						</span>{/if}
				</span>{:else if compactRole}<span class="review-card__role-compact">{compactRole}</span
				>{/if}<span class="review-card__role-desktop">{desktopRole}</span></span
		>
	</figcaption>
	<blockquote>
		{#if compact && review.excerpt}<span class="review-card__text-full">{review.text}</span>
			<span class="review-card__text-compact">{review.excerpt}</span>{:else}{review.text}{/if}
	</blockquote>
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
	.review-card__role-compact,
	.review-card__role-desktop,
	.review-card__meta,
	.review-card__text-compact,
	.review-card__sample-initials {
		display: none;
	}
	blockquote {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
	}
	@media (min-width: 768px) {
		.review-card__role-original {
			display: none;
		}
		.review-card__role-desktop {
			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.review-card {
			background: var(--bc-card-bg);
			border-radius: var(--bc-desktop-card-radius);
			box-shadow: var(--bc-editorial-shadow);
		}
		blockquote {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body);
		}
		.review-card__avatar {
			background: var(--bc-bg-strong);
		}
	}
	@media (max-width: 767.98px) {
		.review-card--compact .review-card__avatar {
			flex-basis: var(--bc-mobile-review-avatar-size);
			width: var(--bc-mobile-review-avatar-size);
			height: var(--bc-mobile-review-avatar-size);
			background: var(--bc-bg-strong);
			font: var(--bc-weight-heading) var(--bc-mobile-label)/var(--bc-mobile-label-leading)
				var(--bc-font-body);
		}
		.review-card--compact .review-card__avatar:has(.review-card__sample-initials) img,
		.review-card--compact .review-card__text-full {
			display: none;
		}
		.review-card--compact .review-card__sample-initials,
		.review-card--compact .review-card__text-compact {
			display: block;
		}
		.review-card--compact .review-card__person > .review-card__meta {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			column-gap: var(--bc-space-3);
			font: var(--bc-weight-body) var(--bc-mobile-meta)/var(--bc-mobile-meta-leading)
				var(--bc-font-body);
		}
		.review-card__rating {
			display: inline-flex;
			align-items: center;
			gap: var(--bc-space-1);
			color: var(--bc-ink);
			white-space: nowrap;
		}
		.review-card__role-full {
			display: none;
		}
		.review-card__role-compact {
			display: block;
		}
		.review-card {
			padding: var(--bc-space-5);
		}
		blockquote {
			font-size: var(--bc-text-body);
		}
	}
</style>
