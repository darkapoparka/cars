<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	let {
		copy,
		variant = 'guidance'
	}: { copy: HomePageCopy; variant?: 'guidance' | 'ownership' | 'selection' | 'consultation' } =
		$props();
	const ownership = $derived(variant === 'ownership');
	const english = $derived(copy.actionBand.importTitle === 'Import From Europe');
	const firstTitle = $derived(
		ownership ? (english ? 'Sell your car' : 'Продай автомобила си') : copy.actionBand.importTitle
	);
	const secondTitle = $derived(
		ownership
			? english
				? 'Finance your next car'
				: 'Автомобил на лизинг'
			: copy.actionBand.buyTitle
	);
	const firstBody = $derived(
		ownership
			? english
				? 'Send us your car details and photos for a valuation.'
				: 'Изпрати ни данни и снимки за оценка.'
			: copy.actionBand.importBody
	);
	const secondBody = $derived(
		ownership
			? english
				? 'Estimate a monthly payment for your next car.'
				: 'Изчисли ориентировъчна месечна вноска.'
			: copy.actionBand.buyBody
	);
	const firstCta = $derived(
		ownership ? (english ? 'Request a valuation' : 'Заяви оценка') : copy.actionBand.importCta
	);
	const secondCta = $derived(
		ownership ? (english ? 'Calculate payment' : 'Изчисли вноска') : copy.actionBand.buyCta
	);
</script>

<section
	class="daynight-action-band py-100"
	class:daynight-action-band--ownership={ownership}
	class:daynight-action-band--guidance={variant === 'guidance'}
	class:daynight-action-band--selection={variant === 'selection'}
	class:daynight-action-band--consultation={variant === 'consultation'}
	aria-labelledby={`daynight-action-band-${variant}-title`}
>
	<h2 id={`daynight-action-band-${variant}-title`} class="sr-only">
		{#if variant === 'selection'}{firstTitle}{:else if variant === 'consultation'}{secondTitle}{:else}{firstTitle}
			· {secondTitle}{/if}
	</h2>
	<div class="container">
		<div class="daynight-action-grid wow fadeInUp" data-wow-delay="0.1s">
			{#if variant !== 'consultation'}
				<a
					class="daynight-action-card daynight-action-card--import"
					class:daynight-action-card--photo={!ownership}
					href={resolve(ownership ? '/sell-your-car' : '/services')}
				>
					<div class="daynight-action-card__copy">
						<h3 class="daynight-action-card__title">{firstTitle}</h3>
						<p class="daynight-action-card__body">{firstBody}</p>
						<span class="daynight-action-card__cta">
							{firstCta}
							<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
						</span>
					</div>
					<img
						class="daynight-action-card__img daynight-action-card__img--specialist"
						src={ownership
							? '/assets/daynight/banners/home-gclass-v1.png'
							: '/assets/daynight/banners/home-selection-v2.webp'}
						alt=""
						width={ownership ? 1881 : 1536}
						height={ownership ? 836 : 512}
						loading="lazy"
						decoding="async"
					/>
				</a>
			{/if}
			{#if variant !== 'selection'}
				<a
					class="daynight-action-card daynight-action-card--consultation"
					class:daynight-action-card--photo={!ownership}
					href={resolve(ownership ? '/financing' : '/contact')}
				>
					<div class="daynight-action-card__copy">
						<h3 class="daynight-action-card__title">{secondTitle}</h3>
						<p class="daynight-action-card__body">{secondBody}</p>
						<span class="daynight-action-card__cta">
							{secondCta}
							<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
						</span>
					</div>
					<img
						class="daynight-action-card__img daynight-action-card__img--consultant"
						src={ownership
							? '/assets/daynight/banners/home-urus-v1.png'
							: '/assets/daynight/banners/home-consultation-v2.webp'}
						alt=""
						width={ownership ? 2172 : 1536}
						height={ownership ? 724 : 512}
						loading="lazy"
						decoding="async"
					/>
				</a>
			{/if}
		</div>
	</div>
</section>

<style>
	.daynight-action-band--selection,
	.daynight-action-band--consultation {
		display: none;
	}
	@media (max-width: 767px) {
		.daynight-action-band--selection,
		.daynight-action-band--consultation {
			display: block;
		}
		.daynight-action-band--selection .daynight-action-grid,
		.daynight-action-band--consultation .daynight-action-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	.daynight-action-band {
		background: var(--bc-bg);
		padding-top: 38px;
		padding-bottom: 30px;
	}

	.daynight-action-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.daynight-action-card {
		align-items: stretch;
		border: 1px solid transparent;
		border-radius: 8px;
		display: grid;
		isolation: isolate;
		min-height: 284px;
		overflow: hidden;
		padding: 34px 36px;
		position: relative;
	}

	.daynight-action-card:focus-visible {
		transform: none;
	}

	.daynight-action-card--import {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	.daynight-action-card--import:focus-visible {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	.daynight-action-card--consultation {
		background: linear-gradient(135deg, var(--bc-ink) 0%, var(--bc-showcase-dark-panel) 100%);
		color: var(--bc-white);
	}

	.daynight-action-card--consultation:focus-visible {
		background: linear-gradient(135deg, var(--bc-ink) 0%, var(--bc-showcase-dark-panel) 100%);
		color: var(--bc-white);
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-action-card:hover {
			box-shadow: none;
			transform: none;
		}

		.daynight-action-card--import:hover {
			background: var(--bc-accent);
			color: var(--bc-white);
		}

		.daynight-action-card--consultation:hover {
			background: linear-gradient(135deg, var(--bc-ink) 0%, var(--bc-showcase-dark-panel) 100%);
			color: var(--bc-white);
		}
	}

	.daynight-action-card__copy {
		align-content: start;
		color: inherit;
		display: grid;
		gap: 10px;
		max-width: 430px;
		position: relative;
		z-index: 2;
	}

	.daynight-action-card--consultation .daynight-action-card__copy {
		max-width: 460px;
	}

	.daynight-action-card__title {
		margin: 0;
		color: inherit;
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.12;
	}

	.daynight-action-card__body {
		margin: 0;
		color: inherit;
		font-size: 18px;
		font-weight: 450;
		line-height: 1.5;
		opacity: 0.9;
	}

	.daynight-action-card__cta {
		align-items: center;
		display: inline-flex;
		justify-content: center;
		width: max-content;
		min-width: 190px;
		height: 56px;
		min-height: 56px;
		margin-top: 14px;
		padding: 0 24px;
		border-radius: var(--bc-radius-control);
		font-size: 18px;
		font-weight: 600;
		gap: 10px;
		letter-spacing: 0;
		line-height: 1.1;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
		white-space: nowrap;
	}

	.daynight-action-card--import .daynight-action-card__cta {
		background: var(--bc-white);
		color: var(--bc-ink);
	}

	.daynight-action-card--consultation .daynight-action-card__cta {
		background: var(--bc-accent);
		color: var(--bc-white);
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-action-card--import:hover .daynight-action-card__cta {
			background: var(--bc-surface);
			color: var(--bc-ink);
		}

		.daynight-action-card--consultation:hover .daynight-action-card__cta {
			background: var(--bc-accent-hover);
			color: var(--bc-white);
		}
	}

	.daynight-action-card__cta :global(svg) {
		display: block;
		width: 22px;
		height: 22px;
		flex: 0 0 22px;
		transition: none;
	}

	.daynight-action-card__cta :global(svg),
	.daynight-action-card__cta :global(svg *) {
		color: currentColor !important;
		stroke: currentColor !important;
	}

	.daynight-action-card__img {
		bottom: -44px;
		height: auto;
		max-width: none;
		position: absolute;
		right: -70px;
		width: 540px;
		z-index: 1;
	}

	.daynight-action-card__img--consultant {
		right: 12px;
		bottom: 0;
		width: auto;
		height: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.daynight-action-card__img--specialist {
		right: -190px;
		bottom: 0;
		width: auto;
		height: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	@media (min-width: 1180px) {
		.daynight-action-card__copy,
		.daynight-action-card--consultation .daynight-action-card__copy {
			width: min(68%, 460px);
		}

		.daynight-action-card__title {
			white-space: nowrap;
		}

		.daynight-action-card .daynight-action-card__body {
			max-width: 330px;
			min-height: 4.5em;
		}
	}

	@media (max-width: 1179px) {
		.daynight-action-grid {
			grid-template-columns: 1fr;
		}

		.daynight-action-card__copy {
			max-width: min(62%, 460px);
		}

		.daynight-action-card--consultation .daynight-action-card__copy {
			max-width: min(68%, 460px);
		}
	}

	@media (max-width: 767px) {
		.daynight-action-band {
			padding-top: 0;
			padding-bottom: 0;
		}

		.daynight-action-grid {
			gap: 12px;
		}
	}

	@media (max-width: 575px) {
		.daynight-action-card {
			min-height: 136px;
			padding: 16px 18px;
			border: 1px solid rgb(255 255 255 / 0.08);
			border-radius: 12px;
		}

		/* Title runs full width across the top; only the sub-copy sits in a
		   left column so the car can take the whole right side of the card. */
		.daynight-action-card__copy {
			width: auto;
			max-width: 68%;
			gap: 0;
		}

		.daynight-action-card--consultation .daynight-action-card__copy {
			width: auto;
			max-width: 68%;
		}

		.daynight-action-card__title {
			max-width: 100%;
			color: var(--bc-white);
			font-size: clamp(19.5px, 5.4vw, 22px);
			line-height: 1.1;
			white-space: nowrap;
		}

		.daynight-action-card__body {
			display: none;
		}

		.daynight-action-card__cta {
			width: max-content;
			min-width: 142px;
			height: 44px;
			min-height: 44px;
			margin-top: 18px;
			padding: 0 15px;
			border-radius: 10px;
			font-size: 14px;
		}

		.daynight-action-card--import .daynight-action-card__cta {
			background: var(--bc-showcase-dark-panel);
			color: var(--bc-white);
		}

		.daynight-action-card--consultation .daynight-action-card__cta {
			background: var(--bc-accent);
			color: var(--bc-white);
		}

		/* Large cutout anchored into the bottom-right corner (clipped by the
		   card's rounded overflow) so it fills the side, no empty gap, no FX. */
		.daynight-action-card__img {
			opacity: 1;
			right: -90px;
			bottom: -24px;
			width: 340px;
			filter: none;
		}

		.daynight-action-card__img--consultant {
			right: -38px;
			bottom: 0;
			width: auto;
			height: 100%;
			max-height: 100%;
		}

		.daynight-action-card__img--specialist {
			right: -174px;
			bottom: 0;
			width: auto;
			height: 100%;
			max-height: 100%;
		}
	}

	.daynight-action-band--ownership .daynight-action-card__img {
		width: 48%;
		height: auto;
		right: -20px;
		bottom: 16px;
	}
	.daynight-action-band--ownership .daynight-action-card__copy {
		width: 62%;
		max-width: 350px;
	}
	.daynight-action-band--ownership .daynight-action-card__title {
		white-space: normal;
	}
	.daynight-action-band--ownership .daynight-action-card__body {
		min-height: 0;
		max-width: 260px;
	}
	@media (max-width: 767px) {
		.daynight-action-band--ownership {
			display: none;
		}
	}
	/* Keep generated subjects at their native proportions, anchored to the right.
	   Empty image space sits behind the HTML copy rather than stretching faces. */
	.daynight-action-card .daynight-action-card__img {
		top: 0;
		right: 0;
		bottom: auto;
		width: auto;
		height: 100%;
		max-height: none;
		object-fit: contain;
		mask-image: linear-gradient(to right, transparent, black 18%);
	}
	@media (min-width: 576px) {
		.daynight-action-band--ownership
			.daynight-action-card--consultation
			.daynight-action-card__img {
			top: auto;
			bottom: 7%;
			right: 8px;
			height: 84%;
			mask-image:
				linear-gradient(to right, transparent, black 18%, black 98%, transparent),
				linear-gradient(to bottom, transparent, black 12%, black 96%, transparent);
			mask-composite: intersect;
		}
	}

	@media (max-width: 575px) {
		.daynight-action-card .daynight-action-card__img {
			top: 0;
			right: 0;
			bottom: auto;
			width: 92%;
			height: 100%;
			object-fit: cover;
			object-position: right center;
			-webkit-mask-image: linear-gradient(
				to right,
				transparent 0 36%,
				var(--bc-showcase-dark-panel) 58% 100%
			);
			mask-image: linear-gradient(
				to right,
				transparent 0 36%,
				var(--bc-showcase-dark-panel) 58% 100%
			);
		}
	}

	.daynight-action-card.daynight-action-card--photo {
		background: var(--bc-ink);
		border: 0;
		border-radius: var(--bc-radius-card);
	}
	.daynight-action-card--photo .daynight-action-card__img {
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		mask-image: none;
		-webkit-mask-image: none;
	}
	.daynight-action-card--photo .daynight-action-card__copy {
		width: 56%;
		max-width: 56%;
		align-content: center;
		gap: 12px;
	}
	.daynight-action-card--photo .daynight-action-card__title {
		white-space: normal;
		text-wrap: balance;
	}
	.daynight-action-card--photo .daynight-action-card__body {
		display: none;
	}
	.daynight-action-card--photo .daynight-action-card__cta,
	.daynight-action-card--photo:hover .daynight-action-card__cta {
		background: transparent;
		color: var(--bc-white);
		padding: 0;
		min-width: 0;
		width: fit-content;
		justify-content: start;
		font-size: 16px;
		height: auto;
		min-height: 0;
		margin-top: 0;
	}
	@media (max-width: 767px) {
		.daynight-action-card.daynight-action-card--photo {
			min-height: 144px;
			padding: 20px;
		}
		.daynight-action-card--photo .daynight-action-card__copy {
			width: 56%;
			max-width: 56%;
		}
		.daynight-action-card--photo .daynight-action-card__title {
			font-size: 22px;
			line-height: 25px;
		}
		.daynight-action-card--photo .daynight-action-card__cta {
			font-size: 14px;
			gap: 8px;
		}
	}
</style>
