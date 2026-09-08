<script lang="ts">
	import { daynightSite } from '$lib/data/daynight-site';
	import type { HomeDesktopVehicle } from '$lib/types/home';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';
	import DesktopHomeSearchPanel from './DesktopHomeSearchPanel.svelte';

	let {
		vehicles,
		variant = 'photo'
	}: {
		vehicles: HomeDesktopVehicle[];
		variant?: 'photo' | 'cutouts';
	} = $props();

	const leftCarSrc =
		'/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/audi-q5-silver-right-hero-1400.webp';
	const rightCarSrc =
		'/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/bmw-x5-dark-grey-left-hero-1400.webp';

	function openMap() {
		window.open(daynightSite.mapUrl, '_blank', 'noopener,noreferrer');
	}
</script>

{#if variant === 'cutouts'}
	<section
		class="daynight-home-hero daynight-home-hero--cutouts"
		aria-labelledby="daynight-home-hero-title"
	>
		<img
			class="daynight-home-hero__car daynight-home-hero__car--left"
			src={desktopOnlyImagePlaceholder}
			srcset={desktopOnlySrcset(leftCarSrc, 1400)}
			sizes={desktopOnlySizes('36vw')}
			alt=""
			width="1400"
			height="933"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>
		<img
			class="daynight-home-hero__car daynight-home-hero__car--right"
			src={desktopOnlyImagePlaceholder}
			srcset={desktopOnlySrcset(rightCarSrc, 1400)}
			sizes={desktopOnlySizes('36vw')}
			alt=""
			width="1400"
			height="933"
			loading="eager"
			decoding="async"
			aria-hidden="true"
		/>
		<div class="daynight-home-hero__stage">
			<h1 id="daynight-home-hero-title" class="daynight-home-hero__title">
				Разгледай. Купи. Продай. На едно място.
			</h1>
			<DesktopHomeSearchPanel
				{vehicles}
				showCondition={false}
				showSearchCopy={false}
				showKeywordSearch
			/>
		</div>
	</section>
{:else}
	<section class="daynight-home-hero">
		<div class="daynight-home-hero__visual" aria-hidden="true">
			<img
				class="daynight-home-hero__photo"
				src={desktopOnlyImagePlaceholder}
				srcset={desktopOnlySrcset(
					'/assets/images/home2/daynight-hero-cutoff-imagegen-v1.webp',
					1983
				)}
				sizes={desktopOnlySizes('100vw')}
				alt=""
				loading="eager"
				decoding="async"
			/>
		</div>

		<div class="daynight-home-hero__content">
			<div class="daynight-home-hero__stage-content daynight-home-container">
				<div class="daynight-home-hero__location-wrap">
					<button
						type="button"
						class="daynight-home-hero__location"
						aria-describedby="daynight-home-hero-map-preview"
						onclick={openMap}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<circle cx="12" cy="9" r="2.3" stroke="currentColor" stroke-width="1.8" />
						</svg>
						<span>м-т Пчелина · ул. Прилеп 74А</span>
					</button>
					<button
						type="button"
						id="daynight-home-hero-map-preview"
						class="daynight-home-hero__location-preview"
						aria-label="Отвори Google Maps до ELIT AUTO"
						onclick={openMap}
					>
						<span class="daynight-home-hero__location-map" aria-hidden="true">
							<span class="daynight-home-hero__location-road daynight-home-hero__location-road--a"
							></span>
							<span class="daynight-home-hero__location-road daynight-home-hero__location-road--b"
							></span>
							<span class="daynight-home-hero__location-road daynight-home-hero__location-road--c"
							></span>
							<span class="daynight-home-hero__location-pin"></span>
							<span class="daynight-home-hero__location-map-label">ELIT AUTO IMPORT EXPORT</span>
						</span>
						<span class="daynight-home-hero__location-preview-copy">
							<strong>ELIT AUTO Варна</strong>
							<span>гр. Варна, м-т Пчелина, ул. Прилеп 74А</span>
							<em>Отвори Google Maps</em>
						</span>
					</button>
				</div>
				<h1 class="daynight-home-hero__title">
					<span class="daynight-home-hero__title-text">
						<span>Автомобили по обяви.</span>
						<strong>Ясни условия.</strong>
					</span>
				</h1>
				<p class="daynight-home-hero__subtitle">
					Разгледай наличността по марка, модел, пробег и бюджет.
				</p>
			</div>
		</div>
		<div class="daynight-home-hero__buy-rail">
			<div class="daynight-home-container">
				<DesktopHomeSearchPanel {vehicles} />
			</div>
		</div>
	</section>
{/if}
