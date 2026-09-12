<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
</script>

<section class="daynight-promo-band" aria-labelledby="daynight-promo-title">
	<div class="container">
		<div class="daynight-promo">
			<img
				class="daynight-promo__background"
				src="/assets/daynight/promo/premium-history-banner-v1.png"
				alt=""
				width="1672"
				height="941"
				loading="lazy"
				decoding="async"
				aria-hidden="true"
			/>
			<div class="daynight-promo__copy">
				<span class="daynight-promo__eyebrow">Подбрани автомобили</span>
				<h2 class="daynight-promo__title" id="daynight-promo-title">
					Премиум автомобили с изрядна история
				</h2>
				<p class="daynight-promo__text">
					Карфакс, сервизна история и личен оглед — потвърдени преди да платиш.
				</p>

				<div class="daynight-promo__actions">
					<a href={resolve('/inventory')} class="btn btn-small btn-primary-3 daynight-promo__cta">
						Виж наличните
						<ArrowRight size={17} aria-hidden="true" />
					</a>
					<a
						href={resolve('/calculator')}
						class="btn btn-small btn-line-style-2 daynight-promo__ghost">Калкулатор за внос</a
					>
				</div>
				<ul class="daynight-promo__proof" aria-label="Promosale Varna предимства">
					<li><strong>4.8</strong> · 157 отзива</li>
					<li>Карфакс + история</li>
					<li>Оглед във Варна</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	/* Desktop-only image-backed feature banner. The generated asset contains no
	   text or UI; all copy remains real DOM for crisp Bulgarian typography. */
	.daynight-promo-band {
		display: none;
	}

	@media (min-width: 768px) {
		.daynight-promo-band {
			display: block;
			background: var(--bc-bg);
			padding: 18px 0;
		}
	}

	.daynight-promo {
		position: relative;
		overflow: hidden;
		min-height: 360px;
		border-radius: 8px;
		border: 1px solid rgba(227, 6, 47, 0.34);
		box-shadow: 0 18px 44px rgba(0, 0, 0, 0.2);
		background: #050505;
	}

	.daynight-promo::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		content: '';
		background:
			linear-gradient(
				90deg,
				rgba(5, 5, 5, 0.98) 0%,
				rgba(5, 5, 5, 0.92) 34%,
				rgba(5, 5, 5, 0.48) 62%,
				rgba(5, 5, 5, 0.12) 100%
			),
			linear-gradient(180deg, rgba(227, 6, 47, 0.04), rgba(227, 6, 47, 0.16));
		pointer-events: none;
	}

	.daynight-promo__background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.daynight-promo__copy {
		position: relative;
		z-index: 2;
		display: flex;
		min-height: 360px;
		width: min(48%, 560px);
		flex-direction: column;
		justify-content: center;
		padding: 34px 0 34px 40px;
		min-width: 0;
	}

	.daynight-promo__eyebrow {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		min-height: 31px;
		margin-bottom: 20px;
		padding: 0 15px;
		border: 1px solid rgba(255, 255, 255, 0.36);
		border-radius: 999px;
		color: #ffffff;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.daynight-promo__title {
		margin: 0 0 16px;
		max-width: 540px;
		color: #ffffff;
		font-size: clamp(34px, 4.4vw, 55px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: 0;
	}

	.daynight-promo__text {
		margin: 0 0 28px;
		max-width: 440px;
		color: rgba(255, 255, 255, 0.82);
		font-size: 17px;
		line-height: 1.48;
	}

	.daynight-promo__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.daynight-promo__cta {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		gap: 9px;
		min-height: 52px;
		padding: 0 25px !important;
		border-radius: var(--bc-radius-control) !important;
		background: var(--bc-accent) !important;
		color: #ffffff !important;
		font-size: 16px !important;
		font-weight: 750 !important;
		line-height: 1 !important;
	}

	.daynight-promo__cta:focus-visible {
		background: #ffffff !important;
		color: #1c1c1c !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-promo__cta:hover {
			background: #ffffff !important;
			color: #1c1c1c !important;
		}
	}

	.daynight-promo__ghost {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		padding: 0 20px !important;
		border-color: rgba(255, 255, 255, 0.26) !important;
		border-radius: var(--bc-radius-control) !important;
		background: rgba(255, 255, 255, 0.03) !important;
		color: #ffffff !important;
		font-size: 15px !important;
		font-weight: 700 !important;
		line-height: 1 !important;
	}

	.daynight-promo__ghost:focus-visible {
		border-color: rgba(255, 255, 255, 0.64) !important;
		background: rgba(255, 255, 255, 0.1) !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-promo__ghost:hover {
			border-color: rgba(255, 255, 255, 0.64) !important;
			background: rgba(255, 255, 255, 0.1) !important;
		}
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.daynight-promo__cta:active,
	.daynight-promo__ghost:active {
		transform: translateY(1px);
	}

	.daynight-promo__proof {
		display: flex;
		flex-wrap: wrap;
		max-width: 430px;
		column-gap: 14px;
		row-gap: 9px;
		margin: 28px 0 0;
		padding: 0;
		color: rgba(255, 255, 255, 0.9);
		font-size: 13px;
		font-weight: 600;
		list-style: none;
	}

	.daynight-promo__proof li {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: rgba(255, 255, 255, 0.9);
	}

	.daynight-promo__proof li::before {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: var(--bc-accent);
		content: '';
	}

	.daynight-promo__proof strong {
		color: #ffffff;
	}

	@media (prefers-reduced-motion: reduce) {
		.daynight-promo__cta {
			transition: none;
		}
	}

	@media (max-width: 1199px) {
		.daynight-promo__copy {
			width: min(52%, 520px);
			padding-left: 32px;
		}
	}

	@media (max-width: 991px) {
		.daynight-promo {
			min-height: 330px;
		}

		.daynight-promo::before {
			background:
				linear-gradient(
					90deg,
					rgba(5, 5, 5, 0.98) 0%,
					rgba(5, 5, 5, 0.9) 42%,
					rgba(5, 5, 5, 0.46) 72%,
					rgba(5, 5, 5, 0.14) 100%
				),
				linear-gradient(180deg, rgba(227, 6, 47, 0.04), rgba(227, 6, 47, 0.16));
		}

		.daynight-promo__background {
			object-position: 61% center;
		}

		.daynight-promo__copy {
			min-height: 330px;
			width: min(62%, 500px);
		}

		.daynight-promo__text {
			max-width: 390px;
		}
	}
</style>
