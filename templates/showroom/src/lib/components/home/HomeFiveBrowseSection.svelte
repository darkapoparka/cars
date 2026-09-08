<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
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

<section class="eliqauto-browse-section py-100">
	<div class="container">
		<div class="eliqauto-browse-section__surface">
			<div class="eliqauto-brand-strip">
				<div
					class="title-section eliqauto-section-banner eliqauto-section-banner--brand wow fadeInDown mb-34"
					data-wow-delay="0.1s"
				>
					<h2 class="eliqauto-mobile-title-swap">
						<span class="eliqauto-title-desktop">{copy.brandTitle}</span>
						<span class="eliqauto-title-mobile">{mobileBrandTitle}</span>
					</h2>
					<HomeSectionCta href="/inventory" label={copy.brandCta} />
				</div>
				<div
					class="swiper-container swiper-outbrand-3 wow fadeIn"
					data-wow-delay="0.1s"
					data-eliqauto-brand-carousel
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
									<span class="eliqauto-brand-logo-frame">
										{#if brand.allTile}
											<span class="eliqauto-brand-all-glyph" aria-hidden="true">
												<ArrowRight size={20} strokeWidth={2} />
											</span>
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

			<div class="eliqauto-type-gallery">
				<div
					class="title-section eliqauto-section-banner eliqauto-section-banner--type wow fadeInDown mb-42"
					data-wow-delay="0.1s"
				>
					<h2 class="eliqauto-mobile-title-swap">
						<span class="eliqauto-title-desktop">{copy.typeTitle}</span>
						<span class="eliqauto-title-mobile">{mobileTypeTitle}</span>
					</h2>
					<HomeSectionCta href="/inventory?view=4" label={copy.typeCta} />
				</div>
				<div class="eliqauto-type-gallery__grid">
					{#each typeCards as typeCard (typeCard.image)}
						<a
							class={[
								'eliqauto-type-card',
								typeCard.href === '/inventory' && 'eliqauto-type-card--all'
							]}
							href={resolve(typeCard.href)}
						>
							<span class="eliqauto-type-card__image">
								<img
									src={typeCard.image}
									alt=""
									width="360"
									height="220"
									loading="lazy"
									decoding="async"
								/>
							</span>
							<span class="eliqauto-type-card__label">{typeCard.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.eliqauto-browse-section {
		overflow: hidden;
		background-color: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.eliqauto-browse-section__surface {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	.eliqauto-brand-strip,
	.eliqauto-type-gallery {
		background: transparent;
	}

	.eliqauto-browse-section :global(.title-section) {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.eliqauto-section-banner {
		position: relative;
		overflow: hidden;
		border: 1px solid #2e2e34;
		border-radius: 8px;
		background: #18181b;
		box-shadow: none;
		min-height: 104px;
		padding: 28px 32px;
	}

	.eliqauto-section-banner h2 {
		margin: 0;
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: 40px;
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.eliqauto-section-banner :global(.eliqauto-section-cta) {
		flex: 0 0 auto;
		min-height: 46px;
		padding-inline: 20px;
		font-size: 16px;
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
	}

	/* Real desktop/mobile heading text (no font-size:0 + ::before hack).
	   font:inherit makes each span take the h2's size, beating the template's
	   `h2 span` rule (which otherwise forces 16px/400). */
	.eliqauto-mobile-title-swap .eliqauto-title-desktop,
	.eliqauto-mobile-title-swap .eliqauto-title-mobile {
		font: inherit;
		letter-spacing: inherit;
	}

	/* The visible heading text lives in these spans, not directly in the h2.
	   The global `* { color:#1c1c1c }` rule sets the span dark, so the banner's
	   white h2 color never reaches it. The desktop span is display:none at ≤767px,
	   so forcing it white is desktop-only and safe. */
	.eliqauto-title-desktop {
		color: #ffffff;
	}

	.eliqauto-title-mobile {
		display: none;
	}

	.eliqauto-section-banner--brand {
		margin-bottom: 26px;
	}

	.eliqauto-section-banner--type {
		margin-bottom: 30px;
	}

	.eliqauto-browse-section :global(.swiper-outbrand-3) {
		margin: 0;
		overflow: visible;
		padding: 0;
	}

	.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
		display: grid;
		gap: 22px 30px;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		transform: none;
		width: 100%;
	}

	.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
		flex: none;
		height: auto;
		margin-right: 0;
		margin-top: 0;
		width: auto;
	}

	.eliqauto-browse-section :global(.out-brand-2) {
		background-color: #ffffff;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		box-shadow: none;
		min-height: 168px;
	}

	.eliqauto-browse-section :global(.out-brand-2 .h5) {
		margin: 0;
		color: #18181b;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 22px;
	}

	.eliqauto-browse-section :global(.out-brand-2 .text-muted) {
		margin: 4px 0 0;
		color: #52525b;
		font-family: var(--bc-font-body);
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}

	.eliqauto-brand-logo-frame {
		display: grid;
		height: 82px;
		margin-bottom: 10px;
		place-items: center;
		width: 112px;
	}

	.eliqauto-brand-logo-frame :global(.out-brand--img) {
		display: block;
		height: 80px;
		margin: 0;
		max-height: 80px;
		max-width: 112px;
		object-fit: contain;
		width: 112px;
	}

	/* Same monochrome line-art register as the brand logos around it. */
	.eliqauto-brand-all-glyph {
		display: grid;
		height: 46px;
		width: 46px;
		border: 1.5px solid #1c1c1c;
		border-radius: 999px;
		background: transparent;
		place-items: center;
	}

	/* Global ink rule would dim the stroke; pin it (see icon-color footgun). */
	.eliqauto-brand-all-glyph :global(svg) {
		color: #1c1c1c;
		stroke: #1c1c1c;
	}

	.eliqauto-browse-section :global(.out-brand-2.active),
	.eliqauto-browse-section :global(.out-brand-2:focus-visible) {
		background-color: #ffffff;
		border-color: #d4d4d8;
		box-shadow: none;
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.eliqauto-browse-section :global(.out-brand-2:active) {
		transform: none;
	}

	.eliqauto-browse-section :global(.out-brand-2:focus-visible .h5) {
		color: #1c1c1c;
	}

	.eliqauto-browse-section :global(.out-brand-2:focus-visible .text-muted) {
		color: var(--bc-muted);
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-browse-section :global(.out-brand-2:hover) {
			background-color: #ffffff;
			border-color: #d4d4d8;
			box-shadow: none;
		}

		.eliqauto-browse-section :global(.out-brand-2:hover .h5) {
			color: #1c1c1c;
		}

		.eliqauto-browse-section :global(.out-brand-2:hover .text-muted) {
			color: var(--bc-muted);
		}
	}

	.eliqauto-browse-section :global(.pagination-swiper-outbrand-3) {
		display: none;
	}

	.eliqauto-type-gallery {
		margin-top: 42px;
	}

	.eliqauto-type-gallery__grid {
		display: grid;
		gap: 22px 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.eliqauto-type-card {
		align-items: center;
		background: #ffffff;
		color: #18181b;
		display: flex;
		flex-direction: column;
		min-height: 218px;
		overflow: hidden;
		padding: 8px 10px 0;
		text-align: center;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
	}

	.eliqauto-type-card:focus-visible {
		background-color: #ffffff;
		border-color: #d4d4d8;
		color: #18181b;
		transform: none;
	}

	.eliqauto-type-card:focus-visible .eliqauto-type-card__label {
		color: #1c1c1c;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-type-card:hover {
			background-color: #ffffff;
			border-color: #d4d4d8;
			color: #18181b;
			transform: none;
		}

		.eliqauto-type-card:hover .eliqauto-type-card__label {
			color: #1c1c1c;
		}
	}

	.eliqauto-type-card:active {
		transform: none;
	}

	.eliqauto-type-card__image {
		align-items: flex-end;
		display: flex;
		flex: 1 1 auto;
		height: 150px;
		justify-content: center;
		margin-bottom: 14px;
		position: relative;
		width: 100%;
	}

	.eliqauto-type-card__image::after {
		background: radial-gradient(ellipse at center, rgba(28, 28, 28, 0.2), transparent 68%);
		bottom: 2px;
		content: '';
		height: 16px;
		left: 12%;
		position: absolute;
		right: 12%;
		z-index: 0;
	}

	.eliqauto-type-card__image img {
		display: block;
		width: 94%;
		max-height: 146px;
		max-width: 94%;
		object-fit: contain;
		position: relative;
		transform: none;
		z-index: 1;
	}

	/* The view-all cutout is a 3/4 view (taller aspect): fill the image box
	   height so it carries the same visual weight as the side-view cutouts. */
	.eliqauto-type-card--all .eliqauto-type-card__image img {
		width: auto;
		height: 100%;
		max-height: 146px;
	}

	.eliqauto-type-card__label {
		display: block;
		color: #18181b;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 22px;
		white-space: nowrap;
	}

	@media (min-width: 768px) {
		.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			gap: 16px;
		}

		.eliqauto-browse-section :global(.out-brand-2) {
			min-height: 0;
			padding: 16px 8px;
		}

		.eliqauto-brand-logo-frame {
			height: 64px;
			margin-bottom: 8px;
			max-width: 100%;
		}

		.eliqauto-brand-logo-frame :global(.out-brand--img) {
			height: 64px;
			max-height: 64px;
			max-width: 100%;
		}

		.eliqauto-type-gallery {
			margin-top: 48px;
		}

		.eliqauto-type-gallery__grid {
			gap: 16px;
		}

		.eliqauto-type-card {
			min-height: 0;
			padding: 16px;
		}

		.eliqauto-type-card__image {
			height: 128px;
			flex: 0 0 128px;
			margin-bottom: 8px;
		}

		.eliqauto-type-card__image img,
		.eliqauto-type-card--all .eliqauto-type-card__image img {
			max-height: 128px;
		}
	}

	@media (min-width: 768px) and (max-width: 1023px) {
		.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}

		.eliqauto-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.eliqauto-browse-section {
			background-color: #ffffff;
			padding-top: 12px;
			padding-bottom: 26px;
		}

		.eliqauto-browse-section :global(.title-section) {
			align-items: center;
			display: flex;
			justify-content: flex-start;
			margin-bottom: 12px;
			text-align: left;
		}

		.eliqauto-section-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			min-height: 0;
			padding: 0;
		}

		.eliqauto-section-banner h2 {
			color: #1c1c1c;
		}

		.eliqauto-mobile-title-swap {
			width: 100%;
			margin: 0;
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
			white-space: nowrap;
		}

		.eliqauto-mobile-title-swap .eliqauto-title-desktop {
			display: none;
		}

		.eliqauto-mobile-title-swap .eliqauto-title-mobile {
			display: inline;
			font-size: 24px;
			font-weight: 700;
			line-height: 30px;
			letter-spacing: 0;
		}

		.eliqauto-browse-section :global(.eliqauto-section-cta) {
			display: none;
		}

		.eliqauto-brand-strip {
			margin-bottom: 30px;
		}

		.eliqauto-browse-section :global(.swiper-outbrand-3) {
			margin: 0;
			overflow: visible;
			padding: 0;
		}

		.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			transform: none;
		}

		.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
			width: auto;
			flex: none;
			height: auto;
			margin-right: 0;
			margin-top: 0;
		}

		.eliqauto-browse-section :global(.out-brand-2) {
			min-height: 116px;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			background-color: #f3f4f6;
			padding: 12px 8px;
		}

		.eliqauto-brand-logo-frame {
			height: 44px;
			margin-bottom: 10px;
			width: 76px;
		}

		.eliqauto-brand-logo-frame :global(.out-brand--img) {
			height: 40px;
			max-height: 40px;
			max-width: 76px;
			width: 76px;
		}

		.eliqauto-browse-section :global(.out-brand-2 .h5) {
			overflow: hidden;
			max-width: 100%;
			margin: 0;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			letter-spacing: 0;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.eliqauto-browse-section :global(.out-brand-2 .text-muted) {
			font-size: var(--bc-text-micro);
			font-weight: 500;
			line-height: 16px;
			white-space: nowrap;
		}

		.eliqauto-browse-section :global(.pagination-swiper-outbrand-3) {
			display: none;
		}

		.eliqauto-type-gallery {
			margin-top: 0;
		}

		.eliqauto-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			margin-inline: 0;
			overflow: visible;
			padding-inline: 0;
		}

		.eliqauto-type-card {
			min-height: 118px;
			align-items: flex-start;
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
			text-align: left;
		}

		.eliqauto-type-card__image {
			height: 68px;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 8px;
		}

		.eliqauto-type-card__image::after {
			display: none;
		}

		.eliqauto-type-card__image img {
			max-width: 100%;
			max-height: 62px;
		}

		.eliqauto-type-card__label {
			font-size: 16px;
			font-weight: 600;
			line-height: 22px;
			letter-spacing: 0;
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		.eliqauto-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.eliqauto-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
