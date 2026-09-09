<script lang="ts">
	let {
		image,
		leftImage,
		rightImage,
		portraitSide = 'right'
	}: {
		image: string;
		leftImage?: string;
		rightImage?: string;
		portraitSide?: 'left' | 'right';
	} = $props();
</script>

<div
	class="daynight-route-hero-media"
	data-portrait-side={portraitSide}
	class:daynight-route-hero-media--separate={Boolean(leftImage || rightImage)}
	aria-hidden="true"
>
	<div class="daynight-route-hero-media__edge daynight-route-hero-media__edge--left">
		<img src={leftImage || image} alt="" decoding="async" fetchpriority="high" />
	</div>
	<div class="daynight-route-hero-media__edge daynight-route-hero-media__edge--right">
		<img src={rightImage || image} alt="" decoding="async" fetchpriority="high" />
	</div>
</div>

<style>
	.daynight-route-hero-media {
		position: absolute;
		z-index: 0;
		inset: 0;
		width: calc(100% - 64px);
		max-width: var(--bc-page-width);
		margin-inline: auto;
		overflow: hidden;
		pointer-events: none;
	}
	.daynight-route-hero-media__edge {
		position: absolute;
		inset-block: 0;
		width: min(22vw, 330px);
		overflow: hidden;
	}
	.daynight-route-hero-media__edge--left {
		left: 0;
	}
	.daynight-route-hero-media__edge--right {
		right: 0;
	}
	.daynight-route-hero-media__edge img {
		position: absolute;
		bottom: -12px;
		display: block;
		width: 220%;
		height: auto;
		max-width: none;
	}
	.daynight-route-hero-media__edge--left img {
		left: 0;
		clip-path: inset(0 50% 0 0);
	}
	.daynight-route-hero-media__edge--right img {
		right: 0;
		clip-path: inset(0 0 0 50%);
	}
	.daynight-route-hero-media--separate .daynight-route-hero-media__edge img {
		width: 100%;
		height: 100%;
		bottom: 0;
		clip-path: none;
		object-fit: contain;
		object-position: left bottom;
	}
	.daynight-route-hero-media--separate[data-portrait-side='right']
		.daynight-route-hero-media__edge--right,
	.daynight-route-hero-media--separate[data-portrait-side='left']
		.daynight-route-hero-media__edge--left {
		width: min(21vw, 300px);
	}
	.daynight-route-hero-media--separate[data-portrait-side='right']
		.daynight-route-hero-media__edge--right
		img,
	.daynight-route-hero-media--separate[data-portrait-side='left']
		.daynight-route-hero-media__edge--left
		img {
		object-fit: cover;
		object-position: center top;
		mask-image: linear-gradient(to right, transparent, #000 12%, #000 88%, transparent);
	}

	.daynight-route-hero-media--separate[data-portrait-side='left']
		.daynight-route-hero-media__edge--left
		img {
		object-position: center 12%;
		transform: scaleX(-1);
	}

	@media (max-width: 1199px) {
		.daynight-route-hero-media {
			display: none;
		}
	}
</style>
