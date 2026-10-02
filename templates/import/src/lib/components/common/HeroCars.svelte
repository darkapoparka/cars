<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { desktopHeroArtwork } from '$lib/content/desktop-hero-artwork';
	// Hidden desktop compositions must not download decorative vehicle artwork on phones.
	const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
</script>

<div class="hero-cars" aria-hidden="true">
	{#each desktopHeroArtwork as artwork (artwork.side)}
		{@const bodyHeight = artwork.bounds[3] - artwork.bounds[1]}
		<div
			class="hero-cars__car hero-cars__car--{artwork.side}"
			class:hero-cars__car--mirrored={artwork.mirrored}
			style:--art-width-ratio={artwork.width / bodyHeight}
			style:--art-height-ratio={artwork.height / bodyHeight}
			style:--art-bottom-ratio={artwork.bounds[3] / bodyHeight}
			style:--art-front-ratio={(artwork.width - artwork.bounds[0]) / bodyHeight}
		>
			<picture>
				<source media="(min-width: 1200px)" srcset={assetHref(artwork.src)} />
				<img
					src={emptyImage}
					alt=""
					width={artwork.width}
					height={artwork.height}
					decoding="async"
				/>
			</picture>
		</div>
	{/each}
</div>

<style>
	picture {
		display: contents;
	}
	.hero-cars {
		display: none;
	}
	@media (min-width: 1200px) {
		.hero-cars {
			--car-height: clamp(120px, 11.111vw, 190px);
			--car-baseline: calc(100% - var(--bc-space-8));
			--side-room: calc((100% - var(--bc-desktop-discovery-width)) / 2 - var(--bc-space-6));
			display: block;
			position: absolute;
			inset: 0;
			z-index: -1;
			overflow: hidden;
			pointer-events: none;
		}
		.hero-cars__car {
			position: absolute;
			top: calc(var(--car-baseline) - var(--car-height) * var(--art-bottom-ratio));
			width: calc(var(--car-height) * var(--art-width-ratio));
			height: calc(var(--car-height) * var(--art-height-ratio));
		}
		.hero-cars__car--left {
			left: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio));
		}
		.hero-cars__car--right {
			right: calc(var(--side-room) - var(--car-height) * var(--art-front-ratio));
		}
		.hero-cars__car--mirrored {
			transform: scaleX(-1);
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
