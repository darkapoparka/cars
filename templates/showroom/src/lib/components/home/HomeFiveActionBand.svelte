<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	let {
		copy,
		primaryHref = '/services',
		secondaryHref = '/contact',
		compact = false
	}: {
		copy: Pick<HomePageCopy, 'actionBand'>;
		primaryHref?: '/services' | '/inventory';
		secondaryHref?: '/contact' | '/sell-your-car';
		compact?: boolean;
	} = $props();
</script>

<section class="eliqauto-action-band py-100" class:compact aria-label={copy.actionBand.importTitle}>
	<div class="container">
		<div class="eliqauto-action-grid wow fadeInUp" data-wow-delay="0.1s">
			<a class="eliqauto-action-card eliqauto-action-card--import" href={resolve(primaryHref)}>
				<span class="eliqauto-action-card__copy">
					<strong>{copy.actionBand.importTitle}</strong>
					<span class="eliqauto-action-card__body">{copy.actionBand.importBody}</span>
					<em class="eliqauto-action-card__cta">
						{copy.actionBand.importCta}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</em>
				</span>
				<img
					class="eliqauto-action-card__img"
					src="/assets/eliqauto/hero/home-hero-runway-car-black-v1.webp"
					alt=""
					width="838"
					height="492"
					loading="lazy"
					decoding="async"
				/>
			</a>

			<a
				class="eliqauto-action-card eliqauto-action-card--consultation"
				href={resolve(secondaryHref)}
			>
				<span class="eliqauto-action-card__copy">
					<strong>{copy.actionBand.buyTitle}</strong>
					<span class="eliqauto-action-card__body">{copy.actionBand.buyBody}</span>
					<em class="eliqauto-action-card__cta">
						{copy.actionBand.buyCta}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</em>
				</span>
				<img
					class="eliqauto-action-card__img eliqauto-action-card__img--consultant"
					src="/assets/eliqauto/hero/home-action-consultation-mercedes-gls-v1.webp"
					alt=""
					width="1774"
					height="887"
					loading="lazy"
					decoding="async"
				/>
			</a>
		</div>
	</div>
</section>

<style>
	.eliqauto-action-band {
		background: var(--bc-bg);
		padding-top: 38px;
		padding-bottom: 30px;
	}

	.eliqauto-action-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.eliqauto-action-card {
		align-items: stretch;
		border-radius: 8px;
		display: grid;
		isolation: isolate;
		min-height: 188px;
		overflow: hidden;
		padding: 30px 34px;
		position: relative;
		font-family: var(--bc-font-body);
		transition: color 0.2s ease;
	}

	.eliqauto-action-card::before {
		display: none;
	}

	.eliqauto-action-card--import::before {
		display: none;
	}

	.eliqauto-action-card--consultation::before {
		display: none;
	}

	.eliqauto-action-card:focus-visible {
		box-shadow: none;
		outline: none;
		transform: none;
	}

	.eliqauto-action-card--import {
		background: #a51717;
		color: #ffffff;
	}

	.eliqauto-action-card--import:focus-visible {
		background: #a51717;
		color: #ffffff;
	}

	.eliqauto-action-card--consultation {
		background: #181414;
		color: #ffffff;
	}

	.eliqauto-action-card--consultation:focus-visible {
		background: #181414;
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-action-card:hover {
			box-shadow: none;
			outline: none;
			transform: none;
		}

		.eliqauto-action-card--import:hover {
			background: #a51717;
			color: #ffffff;
		}

		.eliqauto-action-card--consultation:hover {
			background: #181414;
			color: #ffffff;
		}
	}

	.eliqauto-action-card__copy {
		color: inherit;
		display: grid;
		gap: 10px;
		width: min(62%, 400px);
		max-width: none;
		position: relative;
		z-index: 2;
	}

	.eliqauto-action-card--consultation .eliqauto-action-card__copy {
		width: min(68%, 440px);
		max-width: none;
	}

	.eliqauto-action-card__copy strong {
		color: inherit;
		font-size: clamp(26px, 2vw, 34px);
		font-weight: var(--bc-weight-bold);
		letter-spacing: -0.015em;
		line-height: 1.1;
	}

	.eliqauto-action-card__body {
		color: inherit;
		font-size: 17px;
		font-weight: var(--bc-weight-medium);
		line-height: 1.45;
		opacity: 0.82;
	}

	@media (min-width: 576px) {
		.eliqauto-action-card__copy {
			grid-template-rows: auto minmax(66px, auto) auto;
		}

		.eliqauto-action-card--import .eliqauto-action-card__body {
			max-width: min(360px, 100%);
		}

		.eliqauto-action-card--consultation .eliqauto-action-card__body {
			max-width: min(390px, 100%);
		}
	}

	.eliqauto-action-card__cta {
		align-items: center;
		display: inline-flex;
		justify-content: center;
		width: 172px;
		height: 44px;
		min-height: 44px;
		margin-top: 12px;
		padding: 0 18px;
		border-radius: 999px;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-control);
		font-style: normal;
		font-weight: var(--bc-weight-semibold);
		gap: 8px;
		line-height: 20px;
		transition: background-color 0.18s ease;
		white-space: nowrap;
	}

	.eliqauto-action-card--import .eliqauto-action-card__cta {
		background: #ffffff;
		color: var(--bc-accent);
	}

	.eliqauto-action-card--import:focus-visible .eliqauto-action-card__cta {
		background: var(--bc-surface-soft);
		color: var(--bc-accent-hover);
	}

	.eliqauto-action-card--consultation .eliqauto-action-card__cta {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-action-card--consultation:focus-visible .eliqauto-action-card__cta {
		background: var(--bc-accent-hover);
		color: var(--bc-accent-contrast);
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-action-card--import:hover .eliqauto-action-card__cta {
			background: var(--bc-surface-soft);
			color: var(--bc-accent-hover);
		}

		.eliqauto-action-card--consultation:hover .eliqauto-action-card__cta {
			background: var(--bc-accent-hover);
			color: var(--bc-accent-contrast);
		}
	}

	.eliqauto-action-card__cta :global(svg) {
		display: block;
		width: 18px;
		height: 18px;
		flex: 0 0 18px;
		color: currentColor;
		stroke: currentColor;
		transition: transform 0.2s ease;
	}

	.eliqauto-action-card__cta :global(path),
	.eliqauto-action-card__cta :global(line),
	.eliqauto-action-card__cta :global(polyline) {
		stroke: currentColor;
	}

	.eliqauto-action-card:focus-visible .eliqauto-action-card__cta :global(svg) {
		transform: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-action-card:hover .eliqauto-action-card__cta :global(svg) {
			transform: none;
		}
	}

	.eliqauto-action-card__img {
		bottom: -56px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -86px;
		width: 500px;
		z-index: 0;
		filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.24));
	}

	.eliqauto-action-card__img--consultant {
		right: -86px;
		bottom: -56px;
		top: auto;
		width: 500px;
	}

	@media (max-width: 991px) {
		.eliqauto-action-grid {
			grid-template-columns: 1fr;
		}

		.eliqauto-action-card__copy {
			width: min(62%, 400px);
			max-width: none;
		}

		.eliqauto-action-card--consultation .eliqauto-action-card__copy {
			width: min(72%, 440px);
			max-width: none;
		}
	}

	@media (max-width: 767px) {
		.eliqauto-action-band {
			background: #ffffff;
			padding-top: 18px;
			padding-bottom: 22px;
		}

		.eliqauto-action-grid {
			gap: 14px;
		}
	}

	@media (max-width: 575px) {
		.eliqauto-action-card {
			min-height: 184px;
			padding: 20px 22px;
			border-radius: 8px;
		}

		/* Title runs full width across the top; only the sub-copy sits in a
		   left column so the car can take the whole right side of the card. */
		.eliqauto-action-card__copy {
			width: auto;
			max-width: 100%;
			gap: 7px;
		}

		.eliqauto-action-card--consultation .eliqauto-action-card__copy {
			width: auto;
			max-width: 100%;
		}

		.eliqauto-action-card__copy strong {
			font-size: 24px;
		}

		.eliqauto-action-card--consultation .eliqauto-action-card__copy strong {
			white-space: normal;
		}

		.eliqauto-action-card__body {
			max-width: 52%;
			font-size: 14px;
		}

		.eliqauto-action-card__cta {
			width: 164px;
			height: 44px;
			min-height: 44px;
			margin-top: 14px;
			padding: 0 16px;
			font-size: 14px;
		}

		/* Large cutout anchored into the bottom-right corner (clipped by the
		   card's rounded overflow) so it fills the side, no empty gap, no FX. */
		.eliqauto-action-card__img {
			opacity: 1;
			right: -112px;
			bottom: -20px;
			width: 330px;
		}

		.eliqauto-action-card__img--consultant {
			right: -96px;
			bottom: -16px;
			top: auto;
			width: 318px;
		}
	}
	.eliqauto-action-band.compact {
		padding-block: 0;
		background: transparent;
	}
</style>
