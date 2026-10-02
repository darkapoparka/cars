<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import Check from '@lucide/svelte/icons/check';
	import { daynightReviews } from '$lib/data/daynight-reviews';
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
		ctaLabel = i18n.t('copy.5701bc5c6a95')
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
			title: i18n.t('copy.e59363561d98'),
			balancedTitle: i18n.t('copy.2c7f964ab3f3'),
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
			ctaLabel: i18n.t('copy.c79b6820c344')
		},
		{
			id: 'sell-or-trade',
			modifier: 'sell',
			image: '/assets/images/home-promos/urus-rear-v4.webp',
			alt: 'Продай или замени автомобил',
			title: i18n.t('copy.3a5675b88f80'),
			balancedTitle: i18n.t('copy.3ba407bb3a13'),
			titleHref: '/sell-your-car',
			bullets: [
				'Изпратете снимки и данни за автомобила.',
				i18n.t('pattern.2a875564e65c', { v0: daynightSite.shortName }),
				'Обсъдете продажба, бартер и следващи стъпки.'
			],
			balancedBullets: [
				'Изпратете снимки и данни.',
				'Получете отговор от екипа.',
				'Обсъдете продажба или замяна.'
			],
			ctaHref: '/sell-your-car/request',
			ctaLabel: i18n.t('copy.e72ca6df1e26')
		}
	];
</script>

<section
	class="daynight-home-section daynight-home-section--reviews"
	class:daynight-home-section--reviews-with-banner={showReviews}
	class:daynight-home-section--actions={!showReviews && showActionCards}
	class:daynight-home-section--balanced-actions={balancedActionCards}
	aria-label={!showReviews && showActionCards ? i18n.t('copy.45fb1be3fa4b') : undefined}
>
	{#if showReviews}
		<div class="daynight-home-container home-reviews-panel">
			<div class="home-reviews-heading">
				<DesktopSectionHeading
					title={i18n.t('copy.93b3d88de23a')}
					href={i18n.href(showHeaderCta ? resolve('/reviews') : undefined)}
					label={ctaLabel}
				/>
			</div>
			<div class="daynight-home-section-panel daynight-home-section-panel--reviews">
				<div class="daynight-home-review-grid">
					<div class="daynight-home-review-grid__items">
						{#each reviews as review (review.id)}
							<div class="daynight-home-review-grid__item">
								<a href={i18n.href(resolve('/reviews'))} class="daynight-home-review-card">
									<div class="daynight-home-review-card__rating">
										{#each starIds.slice(0, review.rating) as star (star)}
											<img src={i18n.asset('/assets/icons/star.svg')} alt="" aria-hidden="true" />
										{/each}
									</div>
									<p class="daynight-home-review-card__description">{i18n.text(review.text)}</p>
									<div class="daynight-home-review-card__user">
										<img
											class="daynight-home-review-card__avatar"
											src={i18n.asset(desktopOnlyImagePlaceholder)}
											srcset={desktopOnlySrcset(review.avatar, 160)}
											sizes={desktopOnlySizes('56px')}
											alt={i18n.text(review.name)}
											width="48"
											height="48"
											loading="lazy"
											decoding="async"
										/>
										<div class="daynight-home-review-card__user-content">
											<p class="daynight-home-review-card__name">{i18n.text(review.name)}</p>
											<p class="daynight-home-review-card__meta">{i18n.text(review.label)}</p>
										</div>
									</div>
								</a>
							</div>
						{/each}
					</div>
				</div>
				{#if showBelowCta}
					<div class="daynight-home-reviews__browse-cta">
						<DesktopBrowseLink href={i18n.href(resolve('/reviews'))} label={i18n.text(ctaLabel)} />
					</div>
				{/if}
			</div>
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
								src={i18n.asset(desktopOnlyImagePlaceholder)}
								srcset={desktopOnlySrcset(card.image, 1536)}
								sizes={desktopOnlySizes('44vw')}
								alt={i18n.text(card.alt)}
								loading="lazy"
								decoding="async"
								width="1536"
								height="1024"
							/>
							<div class="daynight-home-action-card__content">
								<p class="daynight-home-action-card__heading">
									<a
										href={i18n.href(resolve(card.titleHref))}
										class="daynight-home-action-card__title"
									>
										{balancedActionCards ? card.balancedTitle : card.title}
									</a>
								</p>
								<ul class="daynight-home-action-card__list">
									{#each balancedActionCards ? card.balancedBullets : card.bullets as bullet (bullet)}
										<li>
											<Check size={15} strokeWidth={2} aria-hidden="true" />{i18n.text(bullet)}
										</li>
									{/each}
								</ul>
								<div class="home-action-button">
									<DesktopBrowseLink
										href={i18n.href(resolve(card.ctaHref))}
										label={card.ctaLabel}
										tone={card.modifier === 'inventory' ? 'dark' : 'brand'}
									/>
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
	/* This desktop component owns both promotional panels and customer reviews. */
	.daynight-home-action-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}
	.daynight-home-action-grid__item {
		min-width: 0;
	}
	.daynight-home-action-card {
		--banner-foreground: var(--desktop-action);
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		min-height: 272px;
		height: 100%;
		overflow: hidden;
		border-radius: 12px;
		background: var(--sa-yellow);
	}
	.daynight-home-action-card--sell {
		--banner-foreground: #fff;
		--desktop-focus: #fff;
		background: var(--sa-red-strong);
	}
	.daynight-home-action-card__image {
		grid-column: 2;
		grid-row: 1;
		display: block;
		width: 100%;
		height: 100%;
		min-height: 0;
		object-fit: contain;
		object-position: center;
	}
	.daynight-home-action-card__content {
		grid-column: 1;
		grid-row: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
		padding: 28px 0 28px 28px;
	}
	.daynight-home-action-card__heading {
		margin: 0 0 16px;
	}
	.daynight-home-action-card__title {
		color: var(--banner-foreground);
		font: var(--sa-weight-heading) var(--sa-text-panel-title)/1.15 var(--sa-font);
		letter-spacing: -0.025em;
	}
	.daynight-home-action-card__list {
		display: grid;
		gap: 8px;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.daynight-home-action-card__list li {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		color: var(--banner-foreground);
		font: var(--sa-weight-regular) var(--sa-text-control)/1.45 var(--sa-font);
	}
	.daynight-home-action-card__list :global(svg),
	.daynight-home-action-card__list :global(svg *) {
		color: var(--banner-foreground);
		stroke: currentColor;
	}
	.daynight-home-action-card__list :global(svg) {
		flex-shrink: 0;
		margin-top: 3px;
	}
	.home-action-button {
		padding-top: 24px;
		margin-top: auto;
	}
	.home-action-button :global(.desktop-browse-link) {
		max-width: 100%;
		white-space: normal;
		text-align: center;
	}
	.home-action-button :global(.desktop-browse-link svg),
	.home-action-button :global(.desktop-browse-link svg *) {
		color: inherit;
		stroke: currentColor;
	}
	.daynight-home-action-spacer {
		height: 32px;
	}
	.home-reviews-panel {
		height: 100%;
		padding: 28px;
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		background: #fff;
	}
	.home-reviews-heading {
		margin-bottom: 24px;
	}
	.home-reviews-heading :global(.desktop-section-heading) {
		margin-bottom: 0;
	}
	.daynight-home-review-grid__items {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 20px;
	}
	.daynight-home-review-grid__item {
		min-width: 0;
	}
	.daynight-home-review-card {
		display: flex;
		flex-direction: column;
		min-height: 248px;
		height: 100%;
		padding: 20px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: var(--discovery-muted-surface);
		text-decoration: none;
	}
	.daynight-home-review-card:hover {
		border-color: var(--discovery-border-hover);
	}
	.daynight-home-review-card__rating {
		display: flex;
		gap: 4px;
		margin-bottom: 14px;
	}
	.daynight-home-review-card__rating img {
		width: 18px;
		height: 18px;
	}
	.daynight-home-review-card__description {
		color: var(--sa-ink);
		font: var(--sa-weight-regular) var(--sa-text-control)/1.6 var(--sa-font);
		margin: 0 0 24px;
	}
	.daynight-home-review-card__user {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: auto;
	}
	.daynight-home-review-card__avatar {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		border-radius: 50%;
		object-fit: cover;
	}
	.daynight-home-review-card__name {
		color: var(--sa-ink);
		font: var(--sa-weight-semibold) var(--sa-text-control)/1.4 var(--sa-font);
		margin: 0;
	}
	.daynight-home-review-card__meta {
		color: var(--sa-ink-soft);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
		margin: 4px 0 0;
	}
	.daynight-home-reviews__browse-cta {
		display: flex;
		justify-content: center;
		margin-top: 24px;
	}
	@media (max-width: 1199px) {
		.daynight-home-action-grid {
			gap: 16px;
		}
		.daynight-home-action-card {
			grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
		}
		.daynight-home-action-card__content {
			padding: 24px 0 24px 24px;
		}
		.home-reviews-panel {
			padding: 24px;
		}
		.daynight-home-review-grid__items {
			gap: 16px;
		}
	}
</style>
