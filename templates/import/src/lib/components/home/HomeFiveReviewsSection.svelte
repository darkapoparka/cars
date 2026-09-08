<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import { loadAuxeroSwiper, type AuxeroSwiperInstance } from '$lib/auxero/swiper-loader';
	import { daynightAssets } from '$lib/data/daynight';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import { onMount, tick } from 'svelte';
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

	const initReviewsSwiper = async () => {
		const carousel = document.querySelector('[data-daynight-home-reviews-carousel]');

		if (!carousel) return undefined;

		if (window.matchMedia('(max-width: 767px)').matches) {
			carousel.classList.add('daynight-native-scroll');
			return undefined;
		}

		const Swiper = await loadAuxeroSwiper();

		return new Swiper(carousel, {
			freeMode: true,
			pagination: {
				clickable: true,
				el: '.pagination-swiper-testimonior'
			},
			slidesPerGroup: 1,
			slidesPerView: 1,
			spaceBetween: 30,
			speed: 800,
			breakpoints: {
				0: {
					slidesPerGroup: 1,
					slidesPerView: 1
				},
				400: {
					slidesPerGroup: 1,
					slidesPerView: 1
				},
				767: {
					slidesPerGroup: 2,
					slidesPerView: 2
				},
				991: {
					slidesPerGroup: 3,
					slidesPerView: 3
				}
			}
		});
	};

	onMount(() => {
		let cancelled = false;
		let reviewsSwiper: AuxeroSwiperInstance | undefined;

		tick().then(async () => {
			if (cancelled) return;

			try {
				reviewsSwiper = await initReviewsSwiper();
			} catch {
				reviewsSwiper = undefined;
			}
		});

		return () => {
			cancelled = true;
			reviewsSwiper?.destroy?.(true, true);
		};
	});
</script>

{#if reviews.length}
	<section class="daynight-home-reviews py-100">
		<div class="container">
			<div class="daynight-reviews-panel">
				<div
					class="title-section daynight-reviews-banner wow fadeInDown mb-38"
					data-wow-delay="0.1s"
				>
					<h2>{copy.reviewsTitle}</h2>
					<HomeSectionCta href="/reviews" label={copy.commonCta} />
				</div>
				<div
					class="swiper-container swiper-testimonior wow fadeIn"
					data-daynight-home-reviews-carousel
					data-wow-delay="0.1s"
				>
					<div class="swiper-wrapper">
						{#each duplicatedReviews as review, index (`${review.name}-${index}`)}
							<div class="swiper-slide" class:daynight-review-extra={index >= reviews.length}>
								<a href={reviewsHref} class="testimonior-box">
									<div class="daynight-review-stars mb-16" role="img" aria-label={starsLabel}></div>
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
						<div class="swiper-slide daynight-review-more-slide">
							<a href={reviewsHref} class="daynight-review-more-card">
								<span class="daynight-review-more-card__topline">
									<img
										class="daynight-review-more-card__brand"
										src={daynightAssets.logoLight}
										alt="Day Night Auto"
										width="220"
										height="58"
										loading="lazy"
										decoding="async"
									/>
								</span>
								<span class="daynight-review-more-card__eyebrow">{copy.reviewsTitle}</span>
								<span class="daynight-review-more-card__proof" aria-hidden="true">
									<span class="daynight-review-more-card__avatars">
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
									<span class="daynight-review-more-card__stars">★★★★★</span>
								</span>
								<span class="daynight-review-more-card__title">{moreReviewsLabel}</span>
								<span class="daynight-review-more-card__meta">{moreReviewsHint}</span>
								<span class="daynight-review-more-card__cta">
									<span>{copy.commonCta}</span>
									<span class="daynight-review-more-card__icon" aria-hidden="true">
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
	.daynight-home-reviews {
		background-color: var(--bc-bg) !important;
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.daynight-reviews-panel {
		background: transparent;
		border-radius: 0;
		padding: 0;
	}

	.daynight-reviews-banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #1c1c1c 0%, #101010 58%, #050505 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.daynight-reviews-banner h2 {
		color: #ffffff;
		margin: 0;
	}

	.daynight-home-reviews :global(.swiper-testimonior) {
		margin: 0;
		padding: 0;
	}

	.daynight-home-reviews :global(.testimonior-box) {
		background: var(--bc-surface);
		border: 0;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		min-height: 292px;
		transition: background-color 0.18s ease;
	}

	.daynight-home-reviews :global(.testimonior-box--user) {
		margin-top: auto;
	}

	.daynight-home-reviews :global(.testimonior-box) {
		transform: none !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-home-reviews :global(.testimonior-box:hover) {
			transform: none !important;
		}

		.daynight-home-reviews :global(.testimonior-box:hover) {
			background: var(--bc-surface-hover);
			box-shadow: none;
		}
	}

	.daynight-review-stars {
		position: relative;
		min-height: 20px;
	}

	.daynight-review-stars::before {
		content: '★★★★★';
		color: var(--bc-accent);
		font-size: 18px;
		letter-spacing: 2px;
		line-height: 20px;
	}

	.daynight-review-more-slide {
		display: none;
	}

	.daynight-review-more-card {
		display: flex;
		min-height: 100%;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(227, 6, 47, 0.16), transparent 34%),
			linear-gradient(135deg, #1c1c1c 0%, #101010 66%, #050505 100%);
		color: #ffffff;
		isolation: isolate;
		overflow: hidden;
		padding: 22px;
		position: relative;
	}

	.daynight-review-more-card::after {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
		background-size: 18px 18px;
		content: '';
		opacity: 0.24;
		pointer-events: none;
		z-index: -1;
	}

	.daynight-review-more-card,
	.daynight-review-more-card:focus-visible {
		color: #ffffff;
		transform: none !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-review-more-card:hover {
			color: #ffffff;
			transform: none !important;
		}
	}

	.daynight-review-more-card__eyebrow {
		color: #ffffff;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 16px;
		text-transform: uppercase;
	}

	.daynight-review-more-card__topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.daynight-review-more-card__brand {
		display: block;
		width: min(148px, 48%);
		height: auto;
		box-sizing: border-box;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.92);
		padding: 6px 9px;
	}

	.daynight-review-more-card__cta span {
		color: inherit;
	}

	.daynight-review-more-card__title {
		display: block;
		margin-top: 44px;
		color: #ffffff;
		font-size: 22px;
		font-weight: 700;
		line-height: 28px;
	}

	.daynight-review-more-card__meta {
		color: rgb(255 255 255 / 0.72);
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	@media (max-width: 767px) {
		.daynight-home-reviews {
			background-color: var(--bc-bg) !important;
			padding-top: 28px !important;
			padding-bottom: 30px !important;
		}

		.daynight-reviews-panel {
			margin-inline: -16px;
			border-radius: 0;
			background: transparent !important;
			padding: 0 0 0 16px;
		}

		.daynight-home-reviews :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 16px !important;
			padding-right: 16px;
			text-align: left;
		}

		.daynight-reviews-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0 16px 0 0;
		}

		.daynight-home-reviews :global(.title-section h2) {
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.daynight-home-reviews :global(.title-section .daynight-section-cta) {
			display: none !important;
		}

		.daynight-home-reviews :global(.swiper-testimonior) {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			overscroll-behavior-x: contain;
			padding: 0 16px 2px 0;
			scroll-padding-left: 0;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
			touch-action: pan-x;
		}

		.daynight-home-reviews :global(.swiper-testimonior::-webkit-scrollbar) {
			display: none;
		}

		.daynight-home-reviews :global(.swiper-wrapper) {
			display: flex !important;
			width: max-content !important;
			gap: 12px;
			transform: none !important;
		}

		.daynight-home-reviews :global(.swiper-slide) {
			flex: 0 0 min(78vw, 292px);
			width: min(78vw, 292px) !important;
			height: auto !important;
			scroll-snap-align: start;
		}

		.daynight-home-reviews :global(.swiper-slide.daynight-review-extra) {
			display: none !important;
		}

		.daynight-review-more-slide {
			display: block !important;
		}

		.daynight-home-reviews :global(.testimonior-box) {
			min-height: 224px;
			background: var(--bc-surface);
			padding: 18px !important;
		}

		.daynight-review-stars {
			min-height: 18px;
		}

		.daynight-review-stars::before {
			font-size: 16px;
			letter-spacing: 0;
			line-height: 18px;
		}

		.daynight-home-reviews :global(.testimonior-box--desc) {
			margin-bottom: 18px !important;
			font-size: 14px;
			line-height: 21px;
		}

		.daynight-home-reviews :global(.testimonior--img) {
			width: 42px;
			height: 42px;
		}

		.daynight-home-reviews :global(.testimonior-box--user .title) {
			font-size: 16px;
			line-height: 21px;
		}

		.daynight-home-reviews :global(.testimonior-box--user .desc) {
			font-size: 12px;
			line-height: 16px;
		}

		.daynight-review-more-card {
			height: 100%;
			min-height: 232px;
			border: 0;
			background:
				linear-gradient(135deg, rgba(227, 6, 47, 0.2), transparent 38%),
				linear-gradient(135deg, #1c1c1c 0%, #101010 70%, #050505 100%);
			color: #ffffff;
			padding: 18px 20px;
		}

		.daynight-review-more-card,
		.daynight-review-more-card:focus-visible {
			color: #ffffff;
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-review-more-card:hover {
				color: #ffffff;
			}
		}

		.daynight-review-more-card__eyebrow {
			display: block;
			margin-top: 12px;
			color: #ffffff;
			font-size: 12px;
			font-weight: 700;
			line-height: 15px;
			text-transform: uppercase;
		}

		.daynight-review-more-card__topline {
			align-items: center;
			justify-content: flex-start;
		}

		.daynight-review-more-card__brand {
			width: 132px;
			max-width: 56%;
			padding: 5px 9px;
		}

		.daynight-review-more-card__proof {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-top: 11px;
		}

		.daynight-review-more-card__avatars {
			display: flex;
			align-items: center;
		}

		.daynight-review-more-card__avatars img {
			display: block;
			width: 32px;
			height: 32px;
			border: 2px solid #ffffff;
			border-radius: 50%;
			object-fit: cover;
		}

		.daynight-review-more-card__avatars img + img {
			margin-left: -10px;
		}

		.daynight-review-more-card__stars {
			color: var(--bc-accent);
			font-size: 14px;
			letter-spacing: 1px;
			line-height: 16px;
			white-space: nowrap;
		}

		.daynight-review-more-card__title {
			margin-top: 12px;
			color: #ffffff;
			font-size: 22px;
			line-height: 28px;
		}

		.daynight-review-more-card__meta {
			color: rgb(255 255 255 / 0.72);
			font-size: 14px;
			line-height: 18px;
		}

		.daynight-review-more-card__cta {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 9px;
			margin-left: auto;
			border-radius: 999px;
			background: var(--bc-accent);
			color: #ffffff;
			font-size: 14px;
			font-weight: 700;
			line-height: 20px;
			padding: 7px 8px 7px 14px;
		}

		.daynight-review-more-card__icon {
			display: inline-flex;
			width: 22px;
			height: 22px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: var(--bc-accent-hover);
			color: #ffffff;
		}

		.daynight-review-more-card__icon :global(svg) {
			display: block;
			width: 14px;
			height: 14px;
		}

		.daynight-review-more-card__icon :global(svg),
		.daynight-review-more-card__icon :global(path),
		.daynight-review-more-card__icon :global(line),
		.daynight-review-more-card__icon :global(polyline) {
			color: #ffffff !important;
			stroke: #ffffff !important;
		}

		.daynight-home-reviews :global(.pagination-swiper-testimonior) {
			display: none !important;
		}
	}

	.daynight-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet) {
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

	.daynight-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet-active) {
		width: 22px;
		border-radius: 999px;
		background: var(--bc-accent);
		opacity: 1;
	}

	.daynight-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet::before),
	.daynight-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet::after) {
		content: none !important;
		display: none !important;
	}
	.daynight-home-reviews :global(.pagination-swiper-testimonior .swiper-pagination-bullet) {
		border: 0 !important;
		box-shadow: none !important;
		outline: none;
	}
	.daynight-home-reviews
		:global(.pagination-swiper-testimonior .swiper-pagination-bullet:focus-visible) {
		outline: 2px solid #202326;
		outline-offset: 4px;
	}
</style>
