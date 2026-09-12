<script lang="ts">
	import { resolve } from '$app/paths';
	import { buildVehicleContactHref } from '$lib/utils/contact-intent';
	import { fromAction } from 'svelte/attachments';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';

	type GalleryImage = {
		id: string;
		src: string;
		alt: string;
	};

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const imageFallbackAttachment = fromAction(daynightImageFallback);
	const imageSrc = (src: string) => (src.startsWith('/') ? resolve(src as `/${string}`) : src);
	const mainSlides = $derived.by<GalleryImage[]>(() =>
		(vehicle.gallery.length ? vehicle.gallery : [vehicle.image]).map((src, index) => ({
			id: `main-${index}-${src}`,
			src,
			alt: vehicle.shortTitle
		}))
	);
	const thumbSlides = $derived.by<GalleryImage[]>(() =>
		(vehicle.gallery.length ? vehicle.gallery : [vehicle.image]).map((src, index) => ({
			id: `thumb-${index}-${src}`,
			src,
			alt: `${vehicle.shortTitle} снимка ${index + 1}`
		}))
	);

	let activeImageIndex = $state(1);
	const lastSlideIndex = $derived(Math.max(mainSlides.length - 1, 0));
	const activeSlideIndex = $derived(Math.min(Math.max(activeImageIndex, 0), lastSlideIndex));
	const hasMultipleSlides = $derived(mainSlides.length > 1);

	function setActiveSlide(index: number) {
		activeImageIndex = Math.min(Math.max(index, 0), lastSlideIndex);
	}

	function showPreviousSlide() {
		if (!hasMultipleSlides) {
			return;
		}

		activeImageIndex = activeSlideIndex === 0 ? lastSlideIndex : activeSlideIndex - 1;
	}

	function showNextSlide() {
		if (!hasMultipleSlides) {
			return;
		}

		activeImageIndex = activeSlideIndex === lastSlideIndex ? 0 : activeSlideIndex + 1;
	}
</script>

{#snippet galleryActions()}
	<div class="listing-details-item--content">
		<a class="listing-details-item--button" href={resolve(buildVehicleContactHref(vehicle, 'video'))} title="Заяви видео преглед">
			<img
				src={resolve('/assets/icons/playcircle.svg')}
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
			Заяви видео преглед
		</a>
		<a class="listing-details-item--button" href={resolve(buildVehicleContactHref(vehicle, 'photos'))} title="Заяви още снимки">
			<img
				src={resolve('/assets/icons/view-all-photo.svg')}
				alt=""
				aria-hidden="true"
				data-daynight-img="1"
				decoding="async"
				loading="eager"
			/>
			Заяви още снимки
		</a>
	</div>
{/snippet}

{#snippet previousIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
			fill="white"
		/>
	</svg>
{/snippet}

{#snippet nextIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
			fill="white"
		/>
	</svg>
{/snippet}

<div class="swiper swiper-listing-details-main" data-daynight-native-gallery>
	<div class="swiper-wrapper">
		{#each mainSlides as slide, index (slide.id)}
			<div
				class={['swiper-slide', index === activeSlideIndex && 'swiper-slide-active']}
				aria-hidden={index !== activeSlideIndex}
			>
				<div class="listing-details-item main-item relative">
					<img
						class="img-main"
						src={imageSrc(slide.src)}
						alt={slide.alt}
						data-daynight-img="1"
						data-daynight-image-fallback
						decoding="async"
						loading="eager"
						{@attach imageFallbackAttachment}
					/>
					{@render galleryActions()}
				</div>
			</div>
		{/each}
	</div>

	<button
		type="button"
		class="swiper-button navigation-prev swiper-listing-details-main-prev"
		aria-label="Предишна снимка"
		disabled={!hasMultipleSlides}
		onclick={showPreviousSlide}
	>
		{@render previousIcon()}
	</button>
	<button
		type="button"
		class="swiper-button navigation-next swiper-listing-details-main-next"
		aria-label="Следваща снимка"
		disabled={!hasMultipleSlides}
		onclick={showNextSlide}
	>
		{@render nextIcon()}
	</button>
</div>

<div class="swiper swiper-listing-details-thumbs overflow-hidden pb-60">
	<div class="swiper-wrapper">
		{#each thumbSlides as thumb, index (thumb.id)}
			<div class={['swiper-slide', index === activeSlideIndex && 'swiper-slide-thumb-active']}>
				<button
					type="button"
					class={['listing-details-thumb', index === activeSlideIndex && 'is-active']}
					aria-label={`Покажи снимка ${index + 1}`}
					aria-current={index === activeSlideIndex ? 'true' : undefined}
					onclick={() => setActiveSlide(index)}
				>
					<img
						src={imageSrc(thumb.src)}
						alt={thumb.alt}
						data-daynight-img="1"
						data-daynight-image-fallback
						decoding="async"
						loading="eager"
						{@attach imageFallbackAttachment}
					/>
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.swiper-listing-details-main {
		overflow: hidden;
		position: relative;
	}

	.swiper-listing-details-main .swiper-wrapper {
		display: block;
		transform: none;
	}

	.swiper-listing-details-main .swiper-slide {
		display: none;
		width: 100%;
	}

	.swiper-listing-details-main .swiper-slide-active {
		display: block;
	}

	.swiper-listing-details-thumbs .swiper-wrapper {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		scrollbar-width: none;
		transform: none;
	}

	.swiper-listing-details-thumbs .swiper-wrapper::-webkit-scrollbar {
		display: none;
	}

	.swiper-listing-details-thumbs .swiper-slide {
		flex: 0 0 auto;
		width: auto;
	}

	.listing-details-thumb {
		background: transparent;
		border: 0;
		cursor: pointer;
		display: block;
		opacity: 0.72;
		padding: 0;
		transition: opacity 160ms ease;
	}

	.listing-details-thumb:hover,
	.listing-details-thumb:focus-visible,
	.listing-details-thumb.is-active {
		opacity: 1;
	}

	.swiper-button {
		border: 0;
		cursor: pointer;
		padding: 0;
	}

	.swiper-button:disabled {
		cursor: default;
		opacity: 0.45;
	}
</style>
