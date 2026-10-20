<script lang="ts">
	import { assetHref, emptyImage } from '$lib/utils/assets';
	let {
		steps,
		horizontal = false,
		mobilePanel = false,
		mobileBanners = false,
		editorial = false
	}: {
		steps: readonly {
			title: string;
			text: string;
			mobileText?: string;
			artwork?: { src: string };
		}[];
		horizontal?: boolean;
		mobilePanel?: boolean;
		mobileBanners?: boolean;
		editorial?: boolean;
	} = $props();
</script>

<ol
	class="process-steps"
	class:process-steps--horizontal={horizontal}
	class:process-steps--mobile-panel={mobilePanel}
	class:process-steps--mobile-banners={mobileBanners}
	class:desktop-process={editorial}
	class:process-steps--banners={(editorial || mobileBanners) && steps.some((step) => step.artwork)}
	style:--step-count={steps.length}
>
	{#each steps as step, index (step.title)}<li>
			{#if (editorial || mobileBanners) && step.artwork}
				<picture class="process-steps__artwork">
					<source
						media={mobileBanners ? '(max-width: 767.98px)' : '(min-width: 768px)'}
						srcset={assetHref(step.artwork.src)}
					/>
					<img src={emptyImage} alt="" width="900" height="600" loading="lazy" />
				</picture>
			{/if}
			<span class="process-steps__number" aria-hidden="true"
				>{editorial || mobileBanners ? String(index + 1).padStart(2, '0') : index + 1}</span
			>
			<div>
				<h3>{step.title}</h3>
				<p>{mobilePanel || editorial ? (step.mobileText ?? step.text) : step.text}</p>
			</div>
		</li>{/each}
</ol>

<style>
	.process-steps {
		display: grid;
		gap: var(--bc-space-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.process-steps__artwork {
		display: none;
	}
	li {
		display: grid;
		grid-template-columns: var(--bc-control-height-secondary) minmax(0, 1fr);
		align-items: start;
		gap: var(--bc-space-3);
	}
	.process-steps__number {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-secondary);
		height: var(--bc-control-height-secondary);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-surface);
		color: var(--bc-accent);
		font-weight: var(--bc-weight-heading);
	}
	h3 {
		margin: 0 0 var(--bc-space-1);
		font: var(--bc-weight-heading) var(--bc-text-h5)/1.35 var(--bc-font-heading);
	}
	p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
	.process-steps--horizontal {
		grid-template-columns: repeat(var(--step-count), minmax(0, 1fr));
	}
	.process-steps--horizontal li {
		grid-template-columns: 1fr;
		text-align: start;
		padding: var(--bc-space-6);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface);
	}
	.process-steps--horizontal .process-steps__number {
		background: var(--bc-white);
		color: var(--bc-ink);
	}
	.process-steps--horizontal p {
		font-size: var(--bc-text-body-lg);
	}
	@media (max-width: 1023px) {
		.process-steps--horizontal {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 768px) {
		.process-steps--horizontal {
			gap: var(--bc-space-4);
		}
		.process-steps--horizontal li {
			gap: var(--bc-space-2);
			padding: var(--bc-space-5);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-desktop-editorial-radius);
			background: var(--bc-card-bg);
			box-shadow: var(--bc-desktop-editorial-shadow);
			grid-template-rows: auto auto 1fr;
			align-content: start;
		}
		.process-steps--horizontal li > div {
			display: contents;
		}
		.process-steps--horizontal .process-steps__number {
			width: var(--bc-space-8);
			height: var(--bc-space-8);
			margin-bottom: var(--bc-space-2);
			background: var(--bc-desktop-editorial-canvas);
			color: var(--bc-desktop-editorial-muted);
			font-size: var(--bc-text-body);
			font-weight: var(--bc-weight-body);
			line-height: var(--bc-leading-h5);
			font-variant-numeric: tabular-nums;
		}
		.process-steps--horizontal h3 {
			margin: 0;
			font-family: var(--bc-font-body);
			font-size: var(--bc-text-control);
		}
		.process-steps--horizontal p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body-lg);
		}
		.process-steps--banners li {
			position: relative;
			gap: 0;
			padding: 0;
			overflow: hidden;
			grid-template-rows: auto auto 1fr;
			border-color: var(--bc-ink);
			background: var(--bc-ink);
			color: var(--bc-white);
		}
		.process-steps--banners .process-steps__artwork {
			display: block;
		}
		.process-steps__artwork img {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 3 / 2;
			object-fit: cover;
		}
		.process-steps--banners .process-steps__number {
			position: absolute;
			top: var(--bc-space-3);
			left: var(--bc-space-3);
			margin: 0;
			background: var(--bc-white);
			color: var(--bc-ink);
		}
		.process-steps--banners h3 {
			padding: var(--bc-space-4) var(--bc-space-4) var(--bc-space-2);
			font-size: var(--bc-text-cta);
			line-height: var(--bc-leading-h5);
		}
		.process-steps--banners p {
			padding: 0 var(--bc-space-4) var(--bc-space-4);
			color: var(--bc-white);
			line-height: var(--bc-leading-body);
		}
	}
	@media (min-width: 768px) and (max-width: 1199px) {
		.process-steps--banners {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 575px) {
		.process-steps--horizontal {
			grid-template-columns: 1fr;
		}
		.process-steps--horizontal li {
			grid-template-columns: var(--bc-control-height-secondary) minmax(0, 1fr);
			padding: var(--bc-space-4);
		}
		.process-steps--horizontal p {
			font-size: var(--bc-text-body);
		}
	}
	@media (max-width: 767.98px) {
		.process-steps--mobile-panel {
			grid-template-columns: 1fr;
			gap: var(--bc-space-4);
			padding: var(--bc-space-4);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-section);
			background: var(--bc-white);
			box-shadow: var(--bc-editorial-shadow);
		}
		.process-steps--mobile-panel li {
			grid-template-columns: var(--bc-space-8) minmax(0, 1fr);
			padding: 0;
			background: transparent;
		}
		.process-steps--mobile-panel .process-steps__number {
			width: var(--bc-space-8);
			height: var(--bc-space-8);
			background: var(--bc-control);
		}
		.process-steps--mobile-panel h3 {
			font-family: var(--bc-font-body);
			font-size: var(--bc-mobile-card-title);
			line-height: var(--bc-mobile-card-title-leading);
		}
		.process-steps--mobile-panel p {
			font-size: var(--bc-mobile-body);
			line-height: var(--bc-mobile-body-leading);
		}
		.process-steps--mobile-banners {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--bc-space-3);
			padding: 0;
			border: 0;
			background: transparent;
			box-shadow: none;
		}
		.process-steps--mobile-banners li {
			position: relative;
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
			gap: 0;
			overflow: hidden;
			border-radius: var(--bc-radius-panel);
			background: var(--bc-ink);
			color: var(--bc-white);
		}
		.process-steps--mobile-banners .process-steps__artwork {
			display: block;
		}
		.process-steps--mobile-banners .process-steps__artwork img {
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 3 / 2;
			object-fit: cover;
		}
		.process-steps--mobile-banners .process-steps__number {
			position: absolute;
			top: var(--bc-space-2);
			left: var(--bc-space-2);
			background: var(--bc-white);
			color: var(--bc-ink);
			font-variant-numeric: tabular-nums;
		}
		.process-steps--mobile-banners li > div {
			display: grid;
			align-content: start;
			gap: var(--bc-space-2);
			padding: var(--bc-space-3);
		}
		.process-steps--mobile-banners h3 {
			margin: 0;
		}
		.process-steps--mobile-banners p {
			color: var(--bc-white);
		}
	}
</style>
