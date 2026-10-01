<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	// Hidden desktop compositions must not download decorative vehicle artwork on phones.
	const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
</script>

<div class="hero-cars" aria-hidden="true">
	<picture>
		<source
			media="(min-width: 768px)"
			srcset={assetHref('/assets/daynight/banners/hero-car-left-v1.webp')}
		/>
		<img
			class="hero-cars__left"
			src={emptyImage}
			alt=""
			width="960"
			height="640"
			decoding="async"
		/>
	</picture>
	<picture>
		<source
			media="(min-width: 768px)"
			srcset={assetHref('/assets/daynight/banners/hero-car-right-v1.webp')}
		/>
		<img
			class="hero-cars__right"
			src={emptyImage}
			alt=""
			width="960"
			height="640"
			decoding="async"
		/>
	</picture>
</div>

<style>
	picture {
		display: contents;
	}
	.hero-cars {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}
	img {
		position: absolute;
		top: 50%;
		width: clamp(360px, 34vw, 640px);
		max-width: none;
		height: auto;
	}
	.hero-cars__left {
		left: 0;
		transform: translate(-28%, -50%);
	}
	.hero-cars__right {
		right: 0;
		transform: translate(28%, -50%);
	}
	@media (max-width: 1199px) {
		img {
			opacity: 0.55;
		}
		.hero-cars__left {
			transform: translate(-55%, -50%);
		}
		.hero-cars__right {
			transform: translate(55%, -50%);
		}
	}
	@media (max-width: 767.98px) {
		.hero-cars {
			display: none;
		}
	}
</style>
