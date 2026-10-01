<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	import type { HomeBrandStripItem } from '$lib/data/home-brand-strip';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	let {
		brands,
		title = i18n.t('copy.3e94445966d1'),
		ctaLabel = i18n.t('copy.bb31879737a7'),
		showHeading = true,
		layout = 'section'
	}: {
		brands: HomeBrandStripItem[];
		title?: string;
		ctaLabel?: string;
		showHeading?: boolean;
		layout?: 'section' | 'strip';
	} = $props();

	const isStrip = $derived(layout === 'strip');
	const headingVisible = $derived(showHeading && !isStrip);
</script>

<section
	class={[
		'daynight-home-section',
		'daynight-home-section--light',
		'daynight-home-brand-section',
		isStrip && 'daynight-home-brand-section--strip'
	]}
	aria-label={headingVisible ? undefined : title}
>
	{#if headingVisible}
		<div class="daynight-home-container home-browse-heading">
			<DesktopSectionHeading {title} centered />
		</div>
	{/if}
	<div class="daynight-home-section-content daynight-home-container">
		<div class="daynight-brand-grid">
			<div class="daynight-brand-grid__items">
				{#each isStrip ? brands : brands.slice(0, 11) as brand (brand.id)}
					<div class="daynight-brand-grid__item">
						<a
							href={i18n.href(
								resolve(
									`/inventory?brand=${encodeURIComponent(brand.brand)}` as `/inventory?brand=${string}`
								)
							)}
							class="daynight-brand-card"
							data-brand-id={brand.id}
							aria-label={`${brand.name}, ${Number.isFinite(Number.parseInt(brand.countLabel)) ? i18n.count(Number.parseInt(brand.countLabel)) : i18n.text(brand.countLabel)}`}
						>
							<span class="daynight-brand-card__logo" aria-hidden="true">
								<img
									class="daynight-brand-card__image"
									src={i18n.asset(desktopOnlyImagePlaceholder)}
									srcset={desktopOnlySrcset(brand.image, 200)}
									sizes={desktopOnlySizes('64px')}
									alt=""
									loading="lazy"
									decoding="async"
								/>
							</span>
							{#if !isStrip}
								<p class="daynight-brand-card__name">
									{brand.name}
								</p>
								<p class="daynight-brand-card__count">
									{Number.isFinite(Number.parseInt(brand.countLabel))
										? i18n.count(Number.parseInt(brand.countLabel))
										: i18n.text(brand.countLabel)}
								</p>
							{/if}
						</a>
					</div>
				{/each}
				{#if !isStrip}
					<div class="daynight-brand-grid__item">
						<a
							href={i18n.href(resolve('/inventory'))}
							class="daynight-brand-card desktop-browse-all"
							aria-label={ctaLabel}
						>
							<ArrowRight size={40} strokeWidth={1.5} aria-hidden="true" />
							<span>{i18n.t('copy.5701bc5c6a95')}</span>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.home-browse-heading {
		padding-top: 36px;
	}
	/* Brand strip layout is owned by this Svelte section. */
	.daynight-brand-grid,
	.daynight-brand-grid__items {
		transform: none !important;
	}

	.daynight-brand-grid__items {
		display: grid !important;
		gap: 12px !important;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		justify-content: stretch !important;
		width: 100% !important;
	}

	.daynight-brand-grid__item {
		height: auto !important;
		margin: 0 !important;
		max-width: none !important;
		min-width: 0;
		width: 100% !important;
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card {
		align-items: center !important;
		background: #fff !important;
		border: 1px solid var(--discovery-control-border) !important;
		border-radius: 12px;
		box-shadow: none !important;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		height: 144px;
		min-height: 144px;
		padding: 14px 12px;
		text-align: center !important;
		transform: none !important;
		transition: background-color 0.14s ease;
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card:hover,
	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card:focus-visible {
		background: var(--sa-yellow) !important;
		border-color: var(--sa-yellow) !important;
		box-shadow: none !important;
		transform: none !important;
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 2px;
	}

	.daynight-brand-grid .daynight-brand-card__logo {
		align-items: center;
		display: flex;
		height: 58px;
		justify-content: center !important;
		margin-bottom: 8px;
		width: 100%;
	}

	.daynight-brand-grid .daynight-brand-card__image {
		display: block;
		height: auto;
		max-height: 54px;
		max-width: 92px;
		object-fit: contain;
		width: auto;
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card__name {
		color: #151923 !important;
		font-size: var(--sa-text-lg) !important;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.2;
		margin: 0 0 3px;
	}

	.daynight-brand-grid .daynight-brand-card[data-brand-id='audi'] .daynight-brand-card__image,
	.daynight-brand-grid .daynight-brand-card[data-brand-id='ford'] .daynight-brand-card__image,
	.daynight-brand-grid .daynight-brand-card[data-brand-id='hyundai'] .daynight-brand-card__image,
	.daynight-brand-grid .daynight-brand-card[data-brand-id='kia'] .daynight-brand-card__image {
		max-height: 42px;
		max-width: 106px;
		transform: scale(1.8);
		transform-origin: center center;
	}

	.daynight-brand-grid .daynight-brand-card[data-brand-id='kia'] .daynight-brand-card__image {
		mix-blend-mode: multiply;
	}

	.daynight-brand-grid .daynight-brand-card[data-brand-id='tesla'] .daynight-brand-card__image,
	.daynight-brand-grid .daynight-brand-card[data-brand-id='ferrari'] .daynight-brand-card__image {
		max-height: 62px;
		max-width: 74px;
	}

	.daynight-brand-grid .daynight-brand-card[data-brand-id='volvo'] .daynight-brand-card__image {
		max-height: 60px;
		max-width: 92px;
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card__count {
		color: #475569 !important;
		font-size: var(--sa-text-caption) !important;
		line-height: 1.3;
		margin: 0;
		text-align: center;
	}

	.daynight-home-brand-section--strip .daynight-home-section-content {
		padding: 0;
	}

	.daynight-home-brand-section--strip .daynight-brand-grid__items {
		grid-template-columns: repeat(9, minmax(0, 1fr));
		gap: 8px !important;
	}

	:global(body.daynight-home-page)
		.daynight-home-brand-section--strip
		.daynight-brand-grid
		.daynight-brand-card {
		height: 72px;
		min-height: 72px;
		padding: 10px 8px;
		border-radius: 10px;
	}

	.daynight-home-brand-section--strip .daynight-brand-grid .daynight-brand-card__logo {
		height: 48px;
		margin-bottom: 0;
	}

	.daynight-home-brand-section--strip .daynight-brand-grid .daynight-brand-card__image {
		max-height: 40px;
		max-width: 72px;
	}

	.daynight-home-brand-section--strip
		.daynight-brand-grid
		.daynight-brand-card[data-brand-id='audi']
		.daynight-brand-card__image,
	.daynight-home-brand-section--strip
		.daynight-brand-grid
		.daynight-brand-card[data-brand-id='ford']
		.daynight-brand-card__image,
	.daynight-home-brand-section--strip
		.daynight-brand-grid
		.daynight-brand-card[data-brand-id='hyundai']
		.daynight-brand-card__image,
	.daynight-home-brand-section--strip
		.daynight-brand-grid
		.daynight-brand-card[data-brand-id='kia']
		.daynight-brand-card__image {
		max-height: 28px;
		max-width: 72px;
		transform: scale(1.45);
	}

	@media (max-width: 1199px) {
		.daynight-brand-grid__items {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.daynight-home-brand-section--strip .daynight-brand-grid__items {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	@media (max-width: 991px) {
		.daynight-brand-grid__items {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 575px) {
		.daynight-brand-grid__items {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	:global(body.daynight-home-page) .daynight-brand-grid .daynight-brand-card.desktop-browse-all {
		justify-content: center;
		gap: 12px;
		background: var(--sa-yellow) !important;
		border-color: var(--sa-yellow) !important;
		color: var(--sa-ink);
		font: var(--sa-weight-strong) var(--sa-text-lg)/1.3 var(--sa-font);
	}
</style>
