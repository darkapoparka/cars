<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { daynightReviews, daynightReviewDisclosure } from '$lib/data/daynight-reviews';
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import { resolve } from '$app/paths';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	let {
		showReviews = true,
		showActionCards = true,
		showHeaderCta = true,
		showBelowCta = false,
		balancedActionCards = false,
		ctaLabel = 'Виж всички'
	}: {
		showReviews?: boolean;
		showActionCards?: boolean;
		showHeaderCta?: boolean;
		showBelowCta?: boolean;
		balancedActionCards?: boolean;
		ctaLabel?: string;
	} = $props();

	type ReviewRoute = '/reviews' | '/inventory' | '/sell-your-car' | '/sell-your-car/request';

	type ActionCard = {
		id: string;
		modifier: string;
		image: string;
		alt: string;
		title: string;
		balancedTitle: string;
		titleHref: ReviewRoute;
		bullets: string[];
		balancedBullets: string[];
		ctaHref: ReviewRoute;
		ctaLabel: string;
	};

	const starIds = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'] as const;

	const reviews = daynightReviews.slice(0, 3);

	const actionCards: ActionCard[] = [
		{
			id: 'buy-confidently',
			modifier: 'inventory',
			image: '/assets/images/home-promos/gclass-urus-pair-v4.webp',
			alt: 'Mercedes-Benz G-Class и Lamborghini Urus',
			title: 'Купи автомобил уверено',
			balancedTitle: 'Купи автомобил',
			titleHref: '/inventory',
			bullets: [
				'Прегледайте актуалната наличност.',
				'Филтрирайте по марка, цена, гориво и пробег.',
				'Получете съдействие за оглед и проверка.'
			],
			balancedBullets: [
				'Вижте актуалната наличност.',
				'Филтрирайте по цена и пробег.',
				'Уговорете оглед с екипа.'
			],
			ctaHref: '/inventory',
			ctaLabel: 'Разгледай автомобилите'
		},
		{
			id: 'sell-or-trade',
			modifier: 'sell',
			image: '/assets/images/home-promos/urus-rear-v4.webp',
			alt: 'Продай или замени автомобил',
			title: 'Продай или замени лесно',
			balancedTitle: 'Продай или замени',
			titleHref: '/sell-your-car',
			bullets: [
				'Изпратете снимки и данни за автомобила.',
				'Получете обратна връзка от екипа на Автосалон Тодоров.',
				'Обсъдете продажба, бартер и следващи стъпки.'
			],
			balancedBullets: [
				'Изпратете снимки и данни.',
				'Получете отговор от екипа.',
				'Обсъдете продажба или замяна.'
			],
			ctaHref: '/sell-your-car/request',
			ctaLabel: 'Продай автомобил'
		}
	];
</script>

<section
	class="daynight-home-section daynight-home-section--reviews"
	class:daynight-home-section--reviews-with-banner={showReviews}
	class:daynight-home-section--actions={!showReviews && showActionCards}
	class:daynight-home-section--balanced-actions={balancedActionCards}
	aria-label={!showReviews && showActionCards ? 'Купи или продай' : undefined}
>
	{#if showReviews}
		<div class="daynight-home-container home-reviews-heading">
			<DesktopSectionHeading
				title="Отзиви от клиенти"
				href={showHeaderCta ? resolve('/reviews') : undefined}
				label={ctaLabel}
			/>
			<p class="home-reviews-disclosure">{daynightReviewDisclosure}</p>
		</div>
		<div
			class="daynight-home-container daynight-home-section-panel daynight-home-section-panel--reviews"
		>
			<div class="daynight-home-review-grid">
				<div class="daynight-home-review-grid__items">
					{#if daynightReviews.length === 0}<div class="testimonior-box"><p>Няма добавени клиентски мнения в този преглед. Вместо примерни оценки показваме само данните от публичните обяви.</p><a href="https://todorovauto.mobile.bg/" target="_blank" rel="noreferrer">Публичен профил</a></div>{/if}
{#each reviews as review (review.id)}
						<div class="daynight-home-review-grid__item">
							<a href={resolve('/reviews')} class="daynight-home-review-card">
								<div class="daynight-home-review-card__rating">
									{#each starIds.slice(0, review.rating) as star (star)}
										<img src="/assets/icons/star.svg" alt="" aria-hidden="true" />
									{/each}
								</div>
								<p class="daynight-home-review-card__description">{review.text}</p>
								<div class="daynight-home-review-card__user">
									<img
										class="daynight-home-review-card__avatar"
										src={desktopOnlyImagePlaceholder}
										srcset={desktopOnlySrcset(review.avatar, 160)}
										sizes={desktopOnlySizes('56px')}
										alt={review.name}
									/>
									<div class="daynight-home-review-card__user-content">
										<p class="daynight-home-review-card__name">{review.name}</p>
										<p class="daynight-home-review-card__meta">{review.label}</p>
									</div>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
			{#if showBelowCta}
				<div class="daynight-home-reviews__browse-cta">
					<a href={resolve('/reviews')} class="daynight-home-reviews__browse-cta-link">
						{ctaLabel}
					</a>
				</div>
			{/if}
		</div>
	{/if}
	{#if showReviews && showActionCards}
		<div class="daynight-home-action-spacer"></div>
	{/if}
	{#if showActionCards}
		<div class="daynight-home-container">
			<div class="daynight-home-action-grid">
				{#each actionCards as card (card.id)}
					<div class="daynight-home-action-grid__item">
						<div class={`daynight-home-action-card daynight-home-action-card--${card.modifier}`}>
							<img
								class="daynight-home-action-card__image"
								src={desktopOnlyImagePlaceholder}
								srcset={desktopOnlySrcset(card.image, 1536)}
								sizes={desktopOnlySizes('44vw')}
								alt={card.alt}
							/>
							<div class="daynight-home-action-card__content">
								<p class="daynight-home-action-card__heading">
									<a href={resolve(card.titleHref)} class="daynight-home-action-card__title">
										{balancedActionCards ? card.balancedTitle : card.title}
									</a>
								</p>
								<ul class="daynight-home-action-card__list">
									{#each balancedActionCards ? card.balancedBullets : card.bullets as bullet (bullet)}
										<li><Check size={15} strokeWidth={2} aria-hidden="true" />{bullet}</li>
									{/each}
								</ul>
								<div class="home-action-button">
									{#if card.modifier === 'inventory'}<DesktopBrowseLink
											href={resolve(card.ctaHref)}
											label={card.ctaLabel}
											tone="dark"
										/>{:else}<a href={resolve(card.ctaHref)} class="daynight-home-action-card__cta"
											>{card.ctaLabel}</a
										>{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</section>

<style>
	.home-reviews-disclosure { margin: 12px 0 0; color: var(--sa-ink-soft); font: 500 var(--sa-text-sm)/1.5 var(--sa-font); }
	.home-action-button {
		margin-top: 22px;
		display: flex;
		align-items: center;
	}
	.home-reviews-heading {
		padding-top: 36px;
	}
	:global(body.daynight-home-page) .daynight-home-action-grid {
		gap: 16px !important;
	}

	:global(body.daynight-home-page) .daynight-home-action-card {
		--banner-foreground: var(--desktop-action);
		background: var(--sa-yellow);
		border: 0 !important;
		border-radius: 16px !important;
		box-shadow: none !important;
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		height: 300px;
		isolation: isolate;
		max-height: none;
		overflow: hidden;
		transform: none !important;
	}

	:global(body.daynight-home-page) .daynight-home-action-card--sell {
		--banner-foreground: #fff;
		background: var(--sa-red-strong);
	}

	:global(body.daynight-home-page) .daynight-home-action-card::before {
		content: none !important;
		display: none !important;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__image {
		grid-column: 2;
		grid-row: 1;
		height: 100% !important;
		object-fit: contain;
		object-position: center;
		padding: 8px;
		box-sizing: border-box;
		width: 100%;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__content {
		align-items: flex-start;
		background: transparent !important;
		bottom: auto;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		grid-column: 1;
		grid-row: 1;
		justify-content: flex-start;
		left: auto;
		padding: 28px 8px 28px 32px !important;
		position: relative;
		width: auto;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__heading {
		margin: 0 0 14px;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__title {
		color: var(--banner-foreground) !important;
		font-size: clamp(23px, 1.8vw, 28px);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.12;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__list {
		margin: 0 0 22px;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__list li {
		color: var(--banner-foreground);
		font-size: 14px;
		font-weight: 550;
		gap: 8px;
		line-height: 1.35;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__list li:not(:last-child) {
		margin-bottom: 7px;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__list :global(svg) {
		color: inherit;
		flex: 0 0 auto;
		height: 15px;
		width: 15px;
	}
	:global(body.daynight-home-page) .daynight-home-action-card__list :global(svg *),
	:global(body.daynight-home-page) .daynight-home-action-card__list :global(svg) {
		color: var(--banner-foreground) !important;
		stroke: currentColor !important;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__cta {
		align-items: center;
		background: #111827 !important;
		border: 0 !important;
		border-radius: 8px !important;
		box-shadow: none !important;
		color: #fff !important;
		display: inline-flex;
		font-size: 15px;
		font-weight: 700;
		height: 44px;
		justify-content: center;
		margin-top: auto;
		padding: 0 18px !important;
		transition: background-color 0.14s ease;
	}

	:global(body.daynight-home-page)
		.daynight-home-action-card--sell
		.daynight-home-action-card__cta {
		background: var(--desktop-secondary) !important;
		color: var(--desktop-action) !important;
	}

	:global(body.daynight-home-page)
		.daynight-home-action-card--inventory
		.daynight-home-action-card__cta:hover,
	:global(body.daynight-home-page)
		.daynight-home-action-card--inventory
		.daynight-home-action-card__cta:focus-visible {
		background: var(--desktop-action-hover) !important;
	}

	:global(body.daynight-home-page)
		.daynight-home-action-card--sell
		.daynight-home-action-card__cta:hover,
	:global(body.daynight-home-page)
		.daynight-home-action-card--sell
		.daynight-home-action-card__cta:focus-visible {
		background: var(--desktop-secondary-hover) !important;
	}

	:global(body.daynight-home-page) .daynight-home-action-card__cta:focus-visible {
		outline: 2px solid #111827;
		outline-offset: 3px;
	}

	:global(body.daynight-home-page)
		.daynight-home-section--balanced-actions
		:global(.daynight-home-action-card__content) {
		display: flex;
		height: 100%;
		min-height: 0;
		padding-left: 28px !important;
		padding-right: 4px !important;
	}

	.daynight-home-section--balanced-actions :global(.daynight-home-action-card__heading) {
		margin-bottom: 12px;
	}

	.daynight-home-section--balanced-actions :global(.daynight-home-action-card__title),
	.daynight-home-section--balanced-actions :global(.daynight-home-action-card__list li) {
		white-space: nowrap;
	}

	:global(body.daynight-home-page)
		.daynight-home-section--balanced-actions
		:global(.daynight-home-action-card__title) {
		font-size: clamp(25px, 2.1vw, 29px);
	}

	:global(body.daynight-home-page)
		.daynight-home-section--balanced-actions
		:global(.daynight-home-action-card__list li) {
		font-size: 15px;
		font-weight: 500;
		line-height: 1.4;
	}

	.daynight-home-section--balanced-actions :global(.daynight-home-action-card__list) {
		align-self: start;
		margin-bottom: 0;
	}

	:global(body.daynight-home-page)
		.daynight-home-section--balanced-actions
		:global(.daynight-home-action-card__cta) {
		align-self: flex-start;
		font-size: 16px;
		justify-self: start;
		margin: auto 0 0;
	}

	.daynight-home-reviews__browse-cta {
		display: flex;
		justify-content: center;
		margin-top: 24px;
	}

	:global(body.daynight-home-page) .daynight-home-reviews__browse-cta-link {
		align-items: center;
		background: transparent;
		border: 1px solid #c91620;
		border-radius: 8px;
		box-sizing: border-box;
		color: #c91620;
		display: inline-flex;
		font-size: 15px;
		font-weight: 650;
		justify-content: center;
		min-height: 42px;
		padding: 0 18px;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(body.daynight-home-page) .daynight-home-reviews__browse-cta-link:hover,
	:global(body.daynight-home-page) .daynight-home-reviews__browse-cta-link:focus-visible {
		background: #c91620;
		border-color: #c91620;
		color: #fff;
	}

	@media (max-width: 1199px) and (min-width: 992px) {
		:global(body.daynight-home-page) .daynight-home-action-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
