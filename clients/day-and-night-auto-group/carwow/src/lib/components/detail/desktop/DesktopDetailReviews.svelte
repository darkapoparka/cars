<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import { daynightReviewAverage, daynightReviewDisclosure } from '$lib/data/daynight-reviews';
	import {
		desktopDetailRatingRows,
		desktopDetailReviews,
		desktopDetailStarIndexes
	} from './desktop-detail-reviews-data';
</script>

<div class="mb-16 flex items-center justify-between gap-16">
	<h2 class="h4">{i18n.t('copy.93b3d88de23a')}</h2>
</div>

<p class="text-secondary mb-20">{i18n.text(daynightReviewDisclosure)}</p>

<div class="rating-box mb-40">
	<div class="rating-box__content">
		<div class="rating-box__overview">
			<div class="rating-box__average">
				<span class="rating-box__score">{daynightReviewAverage.toFixed(1)}</span>
				<div class="rating-box__stars">
					{#each desktopDetailStarIndexes as starIndex (starIndex)}
						<img
							src={i18n.asset('/assets/icons/star-2.svg')}
							alt=""
							aria-hidden="true"
							data-daynight-img="1"
							decoding="async"
							loading="lazy"
						/>
					{/each}
				</div>
				<p class="rating-box__count">
					({i18n.t('reviews.sampleCount', { count: daynightSite.reviewCountLabel.split(' ')[0] })})
				</p>
			</div>
		</div>
		<div class="rating-box__distribution">
			{#each desktopDetailRatingRows as rating (rating.id)}
				<div class="rating-box__bar-item">
					<p class="rating-box__bar-label">
						<span class="text">{rating.label}</span>
						<img
							src={i18n.asset('/assets/icons/star-2.svg')}
							alt=""
							aria-hidden="true"
							data-daynight-img="1"
							decoding="async"
							loading="lazy"
						/>
					</p>
					<div class="rating-box__bar-wrapper">
						<div class="rating-box__bar" style:width={rating.percent}></div>
					</div>
					<span class="rating-box__bar-percent">{rating.percent}</span>
				</div>
			{/each}
		</div>
		<div class="rating-box__button">
			<a href="#reviewForm" class="sa-cta-compact sa-cta sa-cta-primary">
				{i18n.t('copy.e096f5f9573d')}
			</a>
		</div>
	</div>
</div>

<div class="comments mb-40">
	{#each desktopDetailReviews as review (review.id)}
		<div class="comment-box">
			<div class="comment-box__header mb-20">
				{#if review.avatar}
					<div class="comment-box__avatar">
						<img
							src={i18n.asset(review.avatar)}
							alt={i18n.text(review.name)}
							data-daynight-img="1"
							decoding="async"
							loading="lazy"
						/>
					</div>
				{/if}
				<div>
					<div class="text-secondary mb-8 flex items-center gap-4">
						<p class="h5">{i18n.text(review.name)}</p>
						<span class="text-secondary text-sm">-</span>
						<span class="text-secondary text-sm">{i18n.text(review.label)}</span>
					</div>

					<div class="flex items-center">
						{#each desktopDetailStarIndexes.slice(0, review.rating) as starIndex (starIndex)}
							<img
								src={i18n.asset('/assets/icons/star-2.svg')}
								alt=""
								aria-hidden="true"
								data-daynight-img="1"
								decoding="async"
								loading="lazy"
							/>
						{/each}
					</div>
				</div>
			</div>
			<p class="text-secondary">{i18n.text(review.text)}</p>
		</div>
	{/each}

	<p>
		<a href={i18n.href(resolve('/reviews'))} class="text-underline font-weight-600 capitalize">
			{i18n.t('reviews.viewSamples', { count: daynightSite.reviewCountLabel.split(' ')[0] })}
		</a>
	</p>
</div>

<div id="reviewForm">
	<h2 class="h4 mb-8 capitalize">{i18n.t('copy.e096f5f9573d')}</h2>
	<p class="mb-20">{i18n.t('copy.36ae34022405')}</p>

	<a
		href={i18n.href(resolve('/contact?intent=review'))}
		class="sa-cta-compact sa-cta sa-cta-primary"
		title={i18n.t('copy.da2ef4dff29f')}
	>
		{i18n.t('copy.64468baea324')}
	</a>
</div>
