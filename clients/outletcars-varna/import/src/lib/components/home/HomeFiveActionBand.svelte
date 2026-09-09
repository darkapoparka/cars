<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';

	let { copy, variant = 'guidance' }: { copy: HomePageCopy; variant?: 'guidance' | 'ownership' } =
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
	aria-labelledby={`daynight-action-band-${variant}-title`}
>
	<h2 id={`daynight-action-band-${variant}-title`} class="sr-only">
		{firstTitle} · {secondTitle}
	</h2>
	<div class="container">
		<div class="daynight-action-grid wow fadeInUp" data-wow-delay="0.1s">
			<a
				class="daynight-action-card daynight-action-card--import"
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
						: '/dealer/logo.png'}
					alt=""
					width={ownership ? 1881 : 1774}
					height={ownership ? 836 : 887}
					loading="lazy"
					decoding="async"
				/>
			</a>

			<a
				class="daynight-action-card daynight-action-card--consultation"
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
						: '/dealer/logo.png'}
					alt=""
					width={ownership ? 2172 : 1774}
					height={ownership ? 724 : 887}
					loading="lazy"
					decoding="async"
				/>
			</a>
		</div>
	</div>
</section>

<style>
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
		color: #ffffff;
	}

	.daynight-action-card--import:focus-visible {
		background: var(--bc-accent);
		color: #ffffff;
	}

	.daynight-action-card--consultation {
		background: linear-gradient(135deg, #1c1c1c 0%, #050505 100%);
		color: #ffffff;
	}

	.daynight-action-card--consultation:focus-visible {
		background: linear-gradient(135deg, #1c1c1c 0%, #050505 100%);
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-action-card:hover {
			box-shadow: none;
			transform: none;
		}

		.daynight-action-card--import:hover {
			background: var(--bc-accent);
			color: #ffffff;
		}

		.daynight-action-card--consultation:hover {
			background: linear-gradient(135deg, #1c1c1c 0%, #050505 100%);
			color: #ffffff;
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
		background: #ffffff;
		color: #101010;
	}

	.daynight-action-card--consultation .daynight-action-card__cta {
		background: var(--bc-accent);
		color: #ffffff;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-action-card--import:hover .daynight-action-card__cta {
			background: #f0f0f0;
			color: #101010;
		}

		.daynight-action-card--consultation:hover .daynight-action-card__cta {
			background: var(--bc-accent-hover);
			color: #ffffff;
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
			padding-top: 18px;
			padding-bottom: 22px;
		}

		.daynight-action-grid {
			gap: 14px;
		}
	}

	@media (max-width: 575px) {
		.daynight-action-card {
			min-height: 204px;
			padding: 20px 22px;
			border-radius: 8px;
		}

		/* Title runs full width across the top; only the sub-copy sits in a
		   left column so the car can take the whole right side of the card. */
		.daynight-action-card__copy {
			width: auto;
			max-width: 100%;
			gap: 7px;
		}

		.daynight-action-card--consultation .daynight-action-card__copy {
			width: auto;
			max-width: 100%;
		}

		.daynight-action-card__title {
			max-width: 220px;
			font-size: 28px;
		}

		.daynight-action-card__body {
			max-width: 52%;
			font-size: 16px;
		}

		.daynight-action-card__cta {
			width: max-content;
			min-width: 184px;
			height: 54px;
			min-height: 54px;
			margin-top: 14px;
			padding: 0 20px;
			font-size: 16px;
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

		.daynight-action-band:not(.daynight-action-band--ownership)
			.daynight-action-card--import
			.daynight-action-card__img {
			top: auto;
			bottom: 0;
			height: 94%;
		}

		.daynight-action-band:not(.daynight-action-band--ownership)
			.daynight-action-card--consultation
			.daynight-action-card__img {
			top: 6%;
		}
	}

	@media (max-width: 575px) {
		.daynight-action-card .daynight-action-card__img {
			top: auto;
			bottom: 0;
			right: -16px;
			height: 68%;
		}
	}
</style>
