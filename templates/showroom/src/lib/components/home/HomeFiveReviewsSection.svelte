<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, reviews }: { copy: HomePageCopy; reviews: HomeFiveReview[] } = $props();

	const reviewsHref = resolve('/reviews');
	const isEnglish = $derived(copy.reviewsTitle === 'Client Reviews');
	const starsLabel = $derived(isEnglish ? '5 out of 5 stars' : '5 от 5 звезди');
	let duplicatedReviews = $derived([...reviews, ...reviews]);
	let moreCardReviews = $derived(reviews.slice(0, 3));
	let moreReviewsLabel = $derived(isEnglish ? 'View all reviews' : 'Виж всички отзиви');
	let moreReviewsHint = $derived(
		isEnglish ? 'Read more client stories' : 'Прочети още реални истории'
	);
</script>

{#if reviews.length}
	<section class="eliqauto-home-reviews py-100">
		<div class="container">
			<div class="eliqauto-reviews-panel">
				<div
					class="title-section eliqauto-reviews-banner wow fadeInDown mb-38"
					data-wow-delay="0.1s"
				>
					<h2>{copy.reviewsTitle}</h2>
					<HomeSectionCta href="/reviews" label={copy.commonCta} />
				</div>
				<div
					class="swiper-container swiper-testimonior eliqauto-native-scroll wow fadeIn"
					data-eliqauto-home-reviews-carousel
					data-wow-delay="0.1s"
				>
					<div class="swiper-wrapper">
						{#each duplicatedReviews as review, index (`${review.name}-${index}`)}
							<div class="swiper-slide" class:eliqauto-review-extra={index >= reviews.length}>
								<a href={reviewsHref} class="testimonior-box">
									<div class="eliqauto-review-stars mb-16" role="img" aria-label={starsLabel}></div>
									<p class="testimonior-box--desc mb-16">{review.text}</p>
									<div class="testimonior-box--user">
										<img
											class="testimonior--img"
											src={review.avatar}
											alt={review.name}
											width="64"
											height="64"
											loading="lazy"
											decoding="async"
										/>
										<div class="testimonior-box--user-content">
											<p class="h5 title">{review.name}</p>
											<p class="desc">{review.role}</p>
										</div>
									</div>
								</a>
							</div>
						{/each}
						<div class="swiper-slide eliqauto-review-more-slide">
							<a href={reviewsHref} class="eliqauto-review-more-card">
								<span class="eliqauto-review-more-card__topline">
									<img
										class="eliqauto-review-more-card__brand"
										src={eliqautoAssets.logoLight}
										alt="Eliqauto"
										width="220"
										height="58"
										loading="lazy"
										decoding="async"
									/>
								</span>
								<span class="eliqauto-review-more-card__eyebrow">{copy.reviewsTitle}</span>
								<span class="eliqauto-review-more-card__proof" aria-hidden="true">
									<span class="eliqauto-review-more-card__avatars">
										{#each moreCardReviews as review (review.name)}
											<img
												src={review.avatar}
												alt=""
												width="48"
												height="48"
												loading="lazy"
												decoding="async"
											/>
										{/each}
									</span>
									<span class="eliqauto-review-more-card__stars">★★★★★</span>
								</span>
								<span class="eliqauto-review-more-card__title">{moreReviewsLabel}</span>
								<span class="eliqauto-review-more-card__meta">{moreReviewsHint}</span>
								<span class="eliqauto-review-more-card__cta">
									<span>{copy.commonCta}</span>
									<span class="eliqauto-review-more-card__icon" aria-hidden="true">
										<ArrowRight size={16} strokeWidth={2.7} />
									</span>
								</span>
							</a>
						</div>
					</div>
					<div
						class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"
					></div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	@media (min-width: 768px) {
		.eliqauto-home-reviews .swiper-wrapper {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 24px;
			transform: none;
		}

		.eliqauto-home-reviews .swiper-slide {
			min-width: 0;
			height: auto;
		}

		.eliqauto-home-reviews .eliqauto-review-extra,
		.eliqauto-home-reviews .eliqauto-review-more-slide,
		.eliqauto-home-reviews .pagination-swiper-testimonior {
			display: none;
		}
	}

	.eliqauto-home-reviews {
		background-color: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.eliqauto-reviews-panel {
		background: transparent;
		border-radius: 0;
		padding: 0;
	}

	.eliqauto-reviews-banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		border: 1px solid #2e2e34;
		border-radius: 8px;
		background: #18181b;
		box-shadow: none;
		min-height: 104px;
		padding: 28px 32px;
	}

	.eliqauto-reviews-banner h2 {
		margin: 0;
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: 40px;
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.eliqauto-reviews-banner :global(.eliqauto-section-cta) {
		flex: 0 0 auto;
		min-height: 46px;
		padding-inline: 20px;
		font-size: 16px;
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
	}

	.eliqauto-home-reviews :global(.swiper-testimonior) {
		margin: 0;
		padding: 0;
	}

	.eliqauto-home-reviews :global(.testimonior-box) {
		background: var(--bc-surface-raised);
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		min-height: 292px;
		transition:
			background-color 0.18s ease,
			border-color 0.18s ease;
	}

	.eliqauto-home-reviews :global(.testimonior-box--user) {
		margin-top: auto;
	}

	.eliqauto-home-reviews :global(.testimonior-box) {
		transform: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-home-reviews :global(.testimonior-box:hover) {
			transform: none;
		}

		.eliqauto-home-reviews :global(.testimonior-box:hover) {
			background: var(--bc-surface-raised);
			border-color: var(--bc-border-strong);
			box-shadow: none;
		}
	}

	.eliqauto-review-stars {
		position: relative;
		min-height: 20px;
	}

	.eliqauto-review-stars::before {
		content: '★★★★★';
		color: #a51717;
		font-size: 18px;
		letter-spacing: 2px;
		line-height: 20px;
	}

	.eliqauto-review-more-slide {
		display: none;
	}

	.eliqauto-review-more-card {
		display: flex;
		min-height: 100%;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 8px;
		background: #18181b;
		color: #ffffff;
		isolation: isolate;
		overflow: hidden;
		padding: 22px;
		position: relative;
	}

	.eliqauto-review-more-card::after {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
		background-size: 18px 18px;
		content: '';
		opacity: 0.24;
		pointer-events: none;
		z-index: -1;
	}

	.eliqauto-review-more-card,
	.eliqauto-review-more-card:focus-visible {
		color: #ffffff;
		transform: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-review-more-card:hover {
			color: #ffffff;
			transform: none;
		}
	}

	.eliqauto-review-more-card__eyebrow {
		color: var(--bc-accent-on-dark);
		font-size: var(--bc-text-micro);
		font-weight: 700;
		letter-spacing: 0;
		line-height: 16px;
		text-transform: uppercase;
	}

	.eliqauto-review-more-card__topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.eliqauto-review-more-card__brand {
		display: block;
		width: min(148px, 48%);
		height: auto;
		box-sizing: border-box;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.92);
		padding: 6px 9px;
	}

	.eliqauto-review-more-card__cta span {
		color: inherit;
	}

	.eliqauto-review-more-card__title {
		display: block;
		margin-top: 44px;
		color: #ffffff;
		font-size: 22px;
		font-weight: 700;
		line-height: 28px;
	}

	.eliqauto-review-more-card__meta {
		color: rgb(255 255 255 / 0.72);
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	@media (max-width: 767px) {
		.eliqauto-home-reviews {
			background-color: #ffffff;
			padding-top: 28px;
			padding-bottom: 30px;
		}

		.eliqauto-reviews-panel {
			margin-inline: -16px;
			border-radius: 0;
			background: transparent;
			padding: 0 0 0 16px;
		}

		.eliqauto-home-reviews :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 16px;
			padding-right: 16px;
			text-align: left;
		}

		.eliqauto-reviews-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			min-height: 0;
			padding: 0 16px 0 0;
		}

		.eliqauto-home-reviews :global(.title-section h2) {
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.eliqauto-home-reviews :global(.title-section .eliqauto-section-cta) {
			display: none;
		}

		.eliqauto-home-reviews :global(.swiper-testimonior) {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			overscroll-behavior-x: contain;
			padding: 0 16px 2px 0;
			scroll-padding-left: 0;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
			touch-action: pan-x;
		}

		.eliqauto-home-reviews :global(.swiper-testimonior::-webkit-scrollbar) {
			display: none;
		}

		.eliqauto-home-reviews :global(.swiper-wrapper) {
			display: flex;
			width: max-content;
			gap: 12px;
			transform: none;
		}

		.eliqauto-home-reviews :global(.swiper-slide) {
			flex: 0 0 min(78vw, 292px);
			width: min(78vw, 292px);
			height: auto;
			scroll-snap-align: start;
		}

		.eliqauto-home-reviews :global(.swiper-slide.eliqauto-review-extra) {
			display: none;
		}

		.eliqauto-review-more-slide {
			display: block;
		}

		.eliqauto-home-reviews :global(.testimonior-box) {
			min-height: 224px;
			background: var(--bc-surface);
			border: 1px solid var(--bc-border);
			padding: 18px;
		}

		.eliqauto-review-stars {
			min-height: 18px;
		}

		.eliqauto-review-stars::before {
			font-size: 16px;
			letter-spacing: 0;
			line-height: 18px;
		}

		.eliqauto-home-reviews :global(.testimonior-box--desc) {
			margin-bottom: 18px;
			font-size: 14px;
			line-height: 21px;
		}

		.eliqauto-home-reviews :global(.testimonior--img) {
			width: 42px;
			height: 42px;
		}

		.eliqauto-home-reviews :global(.testimonior-box--user .title) {
			font-size: 16px;
			line-height: 21px;
		}

		.eliqauto-home-reviews :global(.testimonior-box--user .desc) {
			font-size: var(--bc-text-micro);
			line-height: 16px;
		}

		.eliqauto-review-more-card {
			height: 100%;
			min-height: 232px;
			border: 0;
			background: #18181b;
			color: #ffffff;
			padding: 18px 20px;
		}

		.eliqauto-review-more-card,
		.eliqauto-review-more-card:focus-visible {
			color: #ffffff;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-review-more-card:hover {
				color: #ffffff;
			}
		}

		.eliqauto-review-more-card__eyebrow {
			display: block;
			margin-top: 12px;
			color: var(--bc-accent-on-dark);
			font-size: var(--bc-text-micro);
			font-weight: 700;
			line-height: 15px;
			text-transform: uppercase;
		}

		.eliqauto-review-more-card__topline {
			align-items: center;
			justify-content: flex-start;
		}

		.eliqauto-review-more-card__brand {
			width: 132px;
			max-width: 56%;
			padding: 5px 9px;
		}

		.eliqauto-review-more-card__proof {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-top: 11px;
		}

		.eliqauto-review-more-card__avatars {
			display: flex;
			align-items: center;
		}

		.eliqauto-review-more-card__avatars img {
			display: block;
			width: 32px;
			height: 32px;
			border: 2px solid #ffffff;
			border-radius: 50%;
			object-fit: cover;
		}

		.eliqauto-review-more-card__avatars img + img {
			margin-left: -10px;
		}

		.eliqauto-review-more-card__stars {
			color: #a51717;
			font-size: 14px;
			letter-spacing: 1px;
			line-height: 16px;
			white-space: nowrap;
		}

		.eliqauto-review-more-card__title {
			margin-top: 12px;
			color: #ffffff;
			font-size: 22px;
			line-height: 28px;
		}

		.eliqauto-review-more-card__meta {
			color: rgb(255 255 255 / 0.72);
			font-size: 14px;
			line-height: 18px;
		}

		.eliqauto-review-more-card__cta {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 9px;
			margin-left: auto;
			border-radius: 999px;
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
			font-size: 14px;
			font-weight: 700;
			line-height: 20px;
			padding: 7px 8px 7px 14px;
		}

		.eliqauto-review-more-card__icon {
			display: inline-flex;
			width: 22px;
			height: 22px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #2a0c0c;
			color: #ffffff;
		}

		.eliqauto-review-more-card__icon :global(svg) {
			display: block;
			width: 14px;
			height: 14px;
		}

		.eliqauto-review-more-card__icon :global(svg),
		.eliqauto-review-more-card__icon :global(path),
		.eliqauto-review-more-card__icon :global(line),
		.eliqauto-review-more-card__icon :global(polyline) {
			color: #ffffff;
			stroke: #ffffff;
		}

		.eliqauto-home-reviews :global(.pagination-swiper-testimonior) {
			display: none;
		}
	}

	.eliqauto-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet) {
		width: 10px;
		height: 10px;
		margin: 0 5px;
		background: #1c1c1c;
		opacity: 0.25;
		transition:
			width 0.2s ease,
			opacity 0.2s ease,
			background-color 0.2s ease;
	}

	.eliqauto-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet-active) {
		width: 22px;
		border-radius: 999px;
		background: #a51717;
		opacity: 1;
	}
</style>
