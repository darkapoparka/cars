<script lang="ts">
	import { resolve } from '$app/paths';
	import { desktopOnlyImagePlaceholder } from '$lib/utils/desktop-only-assets';

	let {
		variant = 'cars',
		panelWidth = 720
	}: {
		variant?: 'cars' | 'services';
		panelWidth?: number;
	} = $props();

	// Alpha bounds keep the visible vehicle fronts outside the task panel.
	const cars = [
		{ side: 'left', file: 'hero-car-left-profile-v1.webp', bounds: [7, 112, 995, 542] },
		{ side: 'right', file: 'hero-car-right-profile-v1.webp', bounds: [18, 156, 983, 495] }
	] as const;
</script>

{#if variant === 'services'}
	<div class="desktop-hero-scene" aria-hidden="true">
		<picture>
			<source
				media="(min-width: 992px)"
				srcset={resolve('/assets/desktop/heroes/services-studio-desktop.webp')}
			/>
			<img src={desktopOnlyImagePlaceholder} alt="" width="1920" height="640" decoding="async" />
		</picture>
	</div>
{:else}
	<div
		class="desktop-hero-cars"
		class:desktop-hero-cars--wide={panelWidth > 720}
		style:--hero-panel-width={`${panelWidth}px`}
		aria-hidden="true"
	>
		{#each cars as car (car.side)}
			{@const bodyHeight = car.bounds[3] - car.bounds[1]}
			<div
				class="desktop-hero-cars__car desktop-hero-cars__car--{car.side}"
				style:--art-width-ratio={1000 / bodyHeight}
				style:--art-height-ratio={667 / bodyHeight}
				style:--art-bottom-ratio={car.bounds[3] / bodyHeight}
				style:--art-front-ratio={(1000 - car.bounds[0]) / bodyHeight}
			>
				<picture>
					<source
						media={panelWidth > 720 ? '(min-width: 1600px)' : '(min-width: 1200px)'}
						srcset={resolve(`/assets/desktop/heroes/${car.file}`)}
					/>
					<img
						src={desktopOnlyImagePlaceholder}
						alt=""
						width="1000"
						height="667"
						decoding="async"
					/>
				</picture>
			</div>
		{/each}
	</div>
{/if}

<style>
	.desktop-hero-scene,
	.desktop-hero-cars {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}
	.desktop-hero-scene {
		background: #141719;
	}
	.desktop-hero-scene::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgb(15 20 23 / 0.15), rgb(15 20 23 / 0.3));
	}
	picture {
		display: contents;
	}
	.desktop-hero-scene img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	.desktop-hero-cars {
		display: none;
	}
	@media (min-width: 1200px) {
		.desktop-hero-cars {
			--car-height: clamp(144px, 11vw, 190px);
			--car-baseline: calc(100% - 32px);
			--side-room: calc((100% - var(--hero-panel-width)) / 2 - 24px);
			display: block;
		}
		.desktop-hero-cars__car {
			position: absolute;
			top: calc(var(--car-baseline) - var(--car-height) * var(--art-bottom-ratio));
			width: calc(var(--car-height) * var(--art-width-ratio));
			height: calc(var(--car-height) * var(--art-height-ratio));
		}
		.desktop-hero-cars__car--left {
			left: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio));
			transform: scaleX(-1);
		}
		.desktop-hero-cars__car--right {
			right: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio));
		}
		.desktop-hero-cars img {
			width: 100%;
			height: 100%;
			max-width: none;
		}
	}
	@media (max-width: 1599px) {
		.desktop-hero-cars--wide {
			display: none;
		}
	}
</style>
