<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadAuxeroSwiper, type AuxeroSwiperInstance } from '$lib/auxero/swiper-loader';
	import type { DetailCopy } from '$lib/i18n/messages';
	import { onMount, tick } from 'svelte';

	let {
		copy,
		hasVideo = false,
		images,
		title
	}: { copy: DetailCopy; hasVideo?: boolean; images: string[]; title: string } = $props();
	const contactHref = resolve('/contact');
	const initialSlide = 0;

	let galleryHydrated = $state(false);

	const initGallerySwiper = async () => {
		const Swiper = await loadAuxeroSwiper();
		const main = document.querySelector('[data-eliqauto-pdp-gallery-main]');
		const thumbs = document.querySelector('[data-eliqauto-pdp-gallery-thumbs]');

		if (!main || !thumbs) return {};

		const thumbsSwiper = new Swiper(thumbs, {
			freeMode: false,
			slidesPerView: 'auto',
			spaceBetween: 12,
			watchSlidesProgress: true
		});

		const mainSwiper = new Swiper(main, {
			initialSlide,
			loop: false,
			navigation: {
				nextEl: main.querySelector('.navigation-next'),
				prevEl: main.querySelector('.navigation-prev')
			},
			slidesPerView: 1,
			spaceBetween: 16,
			speed: 500,
			thumbs: {
				swiper: thumbsSwiper
			}
		});
		const isBulgarian = document.documentElement.lang === 'bg';
		main
			.querySelector('.navigation-prev')
			?.setAttribute('aria-label', isBulgarian ? 'Предишна снимка' : 'Previous photo');
		main
			.querySelector('.navigation-next')
			?.setAttribute('aria-label', isBulgarian ? 'Следваща снимка' : 'Next photo');

		return { mainSwiper, thumbsSwiper };
	};

	onMount(() => {
		let cancelled = false;
		let initialized = false;
		let mainSwiper: AuxeroSwiperInstance | undefined;
		let thumbsSwiper: AuxeroSwiperInstance | undefined;
		const desktopMedia = window.matchMedia('(min-width: 768px)');

		const setupGallery = async () => {
			if (cancelled || initialized || !desktopMedia.matches) return;

			initialized = true;
			galleryHydrated = true;
			await tick();

			if (cancelled) return;
			try {
				({ mainSwiper, thumbsSwiper } = await initGallerySwiper());
			} catch {
				if (!cancelled) galleryHydrated = false;
			}
		};

		desktopMedia.addEventListener('change', setupGallery);
		void setupGallery();

		return () => {
			cancelled = true;
			desktopMedia.removeEventListener('change', setupGallery);
			mainSwiper?.destroy?.(true, true);
			thumbsSwiper?.destroy?.(true, true);
		};
	});
</script>

{#snippet galleryButtons()}
	<div class="listing-details-item--content">
		{#if hasVideo}
			<a class="listing-details-item--button" href={contactHref}>
				<img src="/assets/icons/playcircle.svg" alt="play" />
				{copy.playVideo}
			</a>
		{/if}
		<a
			class="listing-details-item--button"
			href="#eliqauto-pdp-gallery-thumbs"
			aria-controls="eliqauto-pdp-gallery-thumbs"
		>
			<img src="/assets/icons/view-all-photo.svg" alt="" aria-hidden="true" />
			{copy.viewAllPhoto}
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

<div
	class={['swiper', 'eliqauto-pdp-gallery-main', galleryHydrated && 'swiper-listing-details-main']}
	data-eliqauto-pdp-gallery-main
>
	<div class="swiper-wrapper">
		{#each images as image, index (index)}
			<div class="swiper-slide">
				<div class="listing-details-item main-item relative">
					<img
						class="img-main"
						src={image}
						alt={title}
						width="900"
						height="600"
						loading={index === initialSlide ? 'eager' : 'lazy'}
						decoding="async"
						fetchpriority={index === initialSlide ? 'high' : 'auto'}
					/>
					{@render galleryButtons()}
				</div>
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="swiper-button navigation-prev swiper-listing-details-main-prev"
		aria-label="Предишна снимка"
	>
		{@render previousIcon()}
	</button>
	<button
		type="button"
		class="swiper-button navigation-next swiper-listing-details-main-next"
		aria-label="Следваща снимка"
	>
		{@render nextIcon()}
	</button>
</div>

<div
	id="eliqauto-pdp-gallery-thumbs"
	class={[
		'swiper',
		'eliqauto-pdp-gallery-thumbs',
		galleryHydrated && 'swiper-listing-details-thumbs',
		'overflow-hidden pb-60'
	]}
	data-eliqauto-pdp-gallery-thumbs
>
	<div class="swiper-wrapper">
		{#each images as image, index (index)}
			<button
				type="button"
				class="swiper-slide eliqauto-pdp-gallery-thumb-button"
				aria-label={`Покажи снимка ${index + 1} от ${images.length}`}
			>
				<div class="listing-details-thumb">
					<img
						src={image}
						alt={`${title} снимка ${index + 1}`}
						width="180"
						height="120"
						loading="lazy"
						decoding="async"
					/>
				</div>
			</button>
		{/each}
	</div>
</div>

<style>
	.eliqauto-pdp-gallery-main {
		overflow: hidden;
	}

	.eliqauto-pdp-gallery-main:not(.swiper-listing-details-main) .swiper-wrapper {
		display: block;
		transform: none;
	}

	.eliqauto-pdp-gallery-main:not(.swiper-listing-details-main) .swiper-slide {
		display: none;
	}

	.eliqauto-pdp-gallery-main:not(.swiper-listing-details-main) .swiper-slide:first-child {
		display: block;
	}

	.eliqauto-pdp-gallery-main:not(.swiper-listing-details-main) .swiper-slide:only-child {
		display: block;
	}

	.eliqauto-pdp-gallery-main:not(.swiper-listing-details-main) .listing-details-item {
		width: 100%;
	}

	.eliqauto-pdp-gallery-main .swiper-button {
		border: 0;
		padding: 0;
		cursor: pointer;
	}

	.eliqauto-pdp-gallery-main .swiper-button:focus-visible {
		outline: 3px solid #ffffff;
		outline-offset: 3px;
	}

	.eliqauto-pdp-gallery-thumb-button {
		border: 0;
		background: transparent;
		padding: 0;
		text-align: inherit;
		cursor: pointer;
	}

	.eliqauto-pdp-gallery-thumb-button:focus-visible {
		border-radius: 8px;
		outline: 3px solid #a51717;
		outline-offset: 3px;
	}
</style>
