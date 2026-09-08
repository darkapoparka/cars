<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import {
		desktopDetailRatingRows,
		desktopDetailReviews,
		desktopDetailStarIndexes
	} from './desktop-detail-reviews-data';
</script>

<div class="mb-16 flex items-center justify-between gap-16">
	<p class="h4">Отзиви от клиенти</p>
</div>

<div class="rating-box mb-40">
	<div class="rating-box__content">
		<div class="rating-box__overview">
			<div class="rating-box__average">
				<span class="rating-box__score">—</span>
				<div class="rating-box__stars">
					{#each desktopDetailStarIndexes as starIndex (starIndex)}
						<img
							src="/assets/icons/star-2.svg"
							alt=""
							aria-hidden="true"
							data-daynight-img="1"
							decoding="async"
							loading="lazy"
						/>
					{/each}
				</div>
				<p class="rating-box__count">({daynightSite.reviewCountLabel})</p>
			</div>
		</div>
		<div class="rating-box__distribution">
			{#each desktopDetailRatingRows as rating (rating.id)}
				<div class="rating-box__bar-item">
					<p class="rating-box__bar-label">
						<span class="text">{rating.label}</span>
						<img
							src="/assets/icons/star-2.svg"
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
			<a href="#reviewForm" class="sa-cta sa-cta-primary sa-cta-compact">
				Добавете отзив
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
							src={review.avatar}
							alt={review.name}
							data-daynight-img="1"
							decoding="async"
							loading="lazy"
						/>
					</div>
				{:else}
					<div class="comment-box__avatar guest">
						{review.initials}
					</div>
				{/if}
				<div>
					<div class="text-secondary mb-8 flex items-center gap-4">
						<p class="h5">{review.name}</p>
						<span class="text-secondary text-sm">-</span>
						<span class="text-secondary text-sm">{review.date}</span>
					</div>

					<div class="flex items-center">
						{#each desktopDetailStarIndexes as starIndex (starIndex)}
							<img
								src="/assets/icons/star-2.svg"
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
			<p class="text-secondary">{review.text}</p>
		</div>
	{/each}

	<p>
		<a href={resolve('/reviews')} class="text-underline font-weight-600 capitalize">
			{daynightSite.reviewLinkLabel}
		</a>
	</p>
</div>

<div id="reviewForm">
	<p class="h4 mb-8 capitalize">Добавете отзив</p>
	<p class="mb-20">Имейлът няма да бъде публикуван</p>

	<a
		href={resolve('/contact?intent=review')}
		class="sa-cta sa-cta-primary sa-cta-compact"
		title="Отзивите се потвърждават от екипа преди публикуване."
	>
		Изпратете отзив
	</a>
</div>
