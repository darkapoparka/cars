<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let {
		brandCards,
		copy,
		typeCards
	}: {
		brandCards: HomeFiveBrandCard[];
		copy: HomePageCopy;
		typeCards: HomeFiveTypeCard[];
	} = $props();

	const mobileBrandTitle = $derived(copy.brandTitle === 'Explore Our Brands' ? 'Brands' : 'Марки');
	const mobileTypeTitle = $derived(copy.typeTitle === 'Browse By Type' ? 'Body type' : 'Категория');
</script>

<section class="daynight-browse-section py-100">
	<div class="container">
		<div class="daynight-browse-section__surface">
			<div class="daynight-brand-strip">
				<div
					class="title-section daynight-section-banner daynight-section-banner--brand wow fadeInDown mb-34"
					data-wow-delay="0.1s"
				>
					<h2 class="daynight-mobile-title-swap">
						<span class="daynight-title-desktop">{copy.brandTitle}</span>
						<span class="daynight-title-mobile">{mobileBrandTitle}</span>
					</h2>
					<HomeSectionCta href="/inventory" label={copy.brandCta} />
				</div>
				<div
					class="swiper-container swiper-outbrand-3 wow fadeIn"
					data-wow-delay="0.1s"
					data-daynight-brand-carousel
				>
					<div class="swiper-wrapper">
						{#each brandCards as brand, index (brand.name)}
							<div class="swiper-slide">
								<a
									href={resolve(
										(brand.href ?? `/inventory?brand=${encodeURIComponent(brand.query)}`) as '/'
									)}
									class={index === 0 ? 'out-brand-2 ' : 'out-brand-2'}
								>
									<span class="daynight-brand-logo-frame">
										{#if brand.allTile}
											<img
												class="daynight-brand-all-logo"
												src="/assets/daynight/brand/daynight-dn-monogram-bold-v1.png"
												alt=""
												width="96"
												height="96"
												loading="lazy"
												decoding="async"
											/>
										{:else}
											<img
												class="out-brand--img"
												src={brand.image}
												alt=""
												width="120"
												height="80"
												loading="lazy"
												decoding="async"
											/>
										{/if}
									</span>
									<p class="h5">{brand.name}</p>
									<p class="text-muted text-sm">{brand.count}</p>
								</a>
							</div>
						{/each}
					</div>
					<div
						class="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-3 mt-35"
					></div>
				</div>
			</div>

			<div class="daynight-type-gallery">
				<div
					class="title-section daynight-section-banner daynight-section-banner--type wow fadeInDown mb-42"
					data-wow-delay="0.1s"
				>
					<h2 class="daynight-mobile-title-swap">
						<span class="daynight-title-desktop">{copy.typeTitle}</span>
						<span class="daynight-title-mobile">{mobileTypeTitle}</span>
					</h2>
					<HomeSectionCta href="/inventory?view=4" label={copy.typeCta} />
				</div>
				<div class="daynight-type-gallery__grid">
					{#each typeCards as typeCard (typeCard.image)}
						<a
							class={[
								'daynight-type-card',
								typeCard.href === '/inventory' && 'daynight-type-card--all'
							]}
							href={resolve(typeCard.href)}
						>
							<span class="daynight-type-card__image">
								<img
									src={typeCard.image}
									alt={typeCard.label}
									width="360"
									height="220"
									loading="lazy"
									decoding="async"
								/>
							</span>
							<span class="daynight-type-card__label">{typeCard.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.daynight-browse-section {
		overflow: hidden;
		background-color: var(--bc-bg) !important;
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.daynight-browse-section__surface {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	.daynight-brand-strip,
	.daynight-type-gallery {
		background: transparent;
	}

	.daynight-browse-section :global(.title-section) {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.daynight-section-banner {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #1c1c1c 0%, #101010 58%, #050505 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.daynight-section-banner h2 {
		color: #ffffff;
		font-size: 42px;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.15;
		margin: 0;
	}

	.daynight-mobile-title-swap .daynight-title-desktop,
	.daynight-mobile-title-swap .daynight-title-mobile {
		font: inherit;
		letter-spacing: inherit;
	}

	.daynight-title-desktop {
		color: #ffffff;
	}

	.daynight-title-mobile {
		display: none;
	}

	.daynight-section-banner--brand {
		margin-bottom: 26px !important;
	}

	.daynight-section-banner--type {
		margin-bottom: 30px !important;
	}

	.daynight-browse-section :global(.swiper-outbrand-3) {
		margin: 0;
		overflow: visible;
		padding: 0;
	}

	.daynight-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
		display: grid !important;
		gap: 22px 30px;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		transform: none !important;
		width: 100% !important;
	}

	.daynight-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
		flex: none !important;
		height: auto !important;
		margin-right: 0 !important;
		margin-top: 0 !important;
		width: auto !important;
	}

	.daynight-browse-section :global(.out-brand-2) {
		background-color: var(--bc-surface) !important;
		border: 0;
		border-radius: 8px;
		box-shadow: none !important;
		min-height: 168px;
	}

	.daynight-brand-logo-frame {
		display: grid;
		height: 82px;
		margin-bottom: 10px;
		place-items: center;
		width: 112px;
	}

	.daynight-brand-logo-frame :global(.out-brand--img) {
		display: block;
		height: 80px !important;
		margin: 0 !important;
		max-height: 80px;
		max-width: 112px;
		object-fit: contain;
		width: 112px !important;
	}

	.daynight-brand-all-logo {
		display: block;
		height: 96px;
		width: 96px;
		mix-blend-mode: multiply;
		object-fit: contain;
	}

	.daynight-browse-section :global(.out-brand-2 .text-muted) {
		color: var(--bc-muted) !important;
	}

	.daynight-browse-section :global(.out-brand-2.active) {
		background-color: #ffffff !important;
		border-color: var(--bc-accent) !important;
		box-shadow: none !important;
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.daynight-browse-section :global(.out-brand-2:active) {
		transform: translateY(1px);
	}

	.daynight-browse-section :global(.out-brand-2:focus-visible .h5) {
		color: #1c1c1c !important;
	}

	.daynight-browse-section :global(.out-brand-2:focus-visible .text-muted) {
		color: var(--bc-muted) !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-browse-section :global(.out-brand-2:hover) {
			background-color: #ffffff !important;
			border-color: var(--bc-accent) !important;
			box-shadow: none !important;
		}

		.daynight-browse-section :global(.out-brand-2:hover .h5) {
			color: #1c1c1c !important;
		}

		.daynight-browse-section :global(.out-brand-2:hover .text-muted) {
			color: var(--bc-muted) !important;
		}
	}

	.daynight-browse-section :global(.pagination-swiper-outbrand-3) {
		display: none !important;
	}

	.daynight-type-gallery {
		margin-top: 42px;
	}

	.daynight-type-gallery__grid {
		display: grid;
		gap: 22px 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.daynight-type-card {
		align-items: center;
		background: var(--bc-surface);
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-height: 218px;
		overflow: hidden;
		padding: 8px 10px 0;
		text-align: center;
		border-radius: 8px;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.daynight-type-card:focus-visible {
		background-color: #f4f4f4;
		color: #1c1c1c;
		transform: none;
	}

	.daynight-type-card:focus-visible .daynight-type-card__label {
		color: #1c1c1c;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-type-card:hover {
			background-color: #f4f4f4;
			color: #1c1c1c;
			transform: none;
		}

		.daynight-type-card:hover .daynight-type-card__label {
			color: #1c1c1c;
		}
	}

	.daynight-type-card:active {
		transform: translateY(1px);
	}

	.daynight-type-card__image {
		align-items: flex-end;
		display: flex;
		flex: 1 1 auto;
		height: 150px;
		justify-content: center;
		margin-bottom: 14px;
		position: relative;
		width: 100%;
	}

	.daynight-type-card__image::after {
		background: radial-gradient(ellipse at center, rgba(28, 28, 28, 0.2), transparent 68%);
		bottom: 2px;
		content: '';
		height: 16px;
		left: 12%;
		position: absolute;
		right: 12%;
		z-index: 0;
	}

	.daynight-type-card__image img {
		display: block;
		width: 94%;
		max-height: 146px;
		max-width: 94%;
		object-fit: contain;
		position: relative;
		transform: none !important;
		z-index: 1;
	}

	/* The view-all cutout is a 3/4 view (taller aspect): fill the image box
	   height so it carries the same visual weight as the side-view cutouts. */
	.daynight-type-card--all .daynight-type-card__image img {
		width: auto;
		height: 100%;
		max-height: 146px;
	}

	.daynight-type-card__label {
		display: block;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		overflow-wrap: anywhere;
	}

	@media (max-width: 767px) {
		.daynight-browse-section {
			background-color: var(--bc-bg) !important;
			padding-top: 12px;
			padding-bottom: 26px;
		}

		.daynight-browse-section :global(.title-section) {
			align-items: center;
			display: flex !important;
			justify-content: flex-start;
			margin-bottom: 12px !important;
			text-align: left;
		}

		.daynight-section-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.daynight-section-banner h2 {
			color: #1c1c1c;
		}

		.daynight-mobile-title-swap {
			width: 100%;
			margin: 0;
			color: #1c1c1c;
			font-size: 28px;
			font-weight: 650;
			letter-spacing: -0.02em;
			line-height: 34px;
			text-align: left;
			white-space: nowrap;
		}

		.daynight-mobile-title-swap .daynight-title-desktop {
			display: none;
		}

		.daynight-mobile-title-swap .daynight-title-mobile {
			display: inline;
			font-size: inherit;
			font-weight: inherit;
			line-height: inherit;
			letter-spacing: inherit;
		}

		.daynight-browse-section :global(.daynight-section-cta) {
			display: none !important;
		}

		.daynight-brand-strip {
			margin-bottom: 30px;
		}

		.daynight-browse-section :global(.swiper-outbrand-3) {
			margin: 0;
			overflow: visible;
			padding: 0;
		}

		.daynight-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			display: grid !important;
			width: 100% !important;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			transform: none !important;
		}

		.daynight-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
			width: auto !important;
			flex: none !important;
			height: auto !important;
			margin-right: 0 !important;
			margin-top: 0 !important;
		}

		.daynight-browse-section :global(.out-brand-2) {
			min-height: 132px;
			border: 0 !important;
			border-radius: 8px;
			background-color: var(--bc-surface) !important;
			padding: 12px 8px !important;
		}

		.daynight-brand-logo-frame {
			height: 56px;
			margin-bottom: 10px;
			width: 88px;
		}

		.daynight-brand-logo-frame :global(.out-brand--img) {
			height: 52px !important;
			max-height: 52px;
			max-width: 88px;
			width: 88px !important;
		}

		.daynight-brand-all-logo {
			height: 64px;
			width: 64px;
		}

		.daynight-browse-section :global(.out-brand-2 .h5) {
			display: grid;
			min-height: 40px;
			align-items: center;
			overflow: visible;
			max-width: 100%;
			margin: 0;
			font-size: 15px;
			font-weight: 600;
			line-height: 20px;
			letter-spacing: -0.01em;
			overflow-wrap: anywhere;
			text-overflow: clip;
			white-space: normal;
		}

		.daynight-browse-section :global(.out-brand-2 .text-muted) {
			font-size: 13px;
			font-weight: 450;
			line-height: 18px;
			white-space: nowrap;
		}

		.daynight-browse-section :global(.pagination-swiper-outbrand-3) {
			display: none !important;
		}

		.daynight-type-gallery {
			margin-top: 0;
		}

		.daynight-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			margin-inline: 0;
			overflow: visible;
			padding-inline: 0;
		}

		.daynight-type-card {
			min-height: 118px;
			align-items: flex-start;
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
			text-align: left;
		}

		.daynight-type-card__image {
			height: 68px;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 8px;
		}

		.daynight-type-card__image::after {
			display: none;
		}

		.daynight-type-card__image img {
			max-width: 100%;
			max-height: 62px;
		}

		.daynight-type-card__label {
			font-size: 17px;
			font-weight: 600;
			line-height: 23px;
			letter-spacing: -0.01em;
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		.daynight-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.daynight-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
