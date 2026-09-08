<script lang="ts">
	import { resolve } from '$app/paths';
	import HomeSectionCta from './HomeSectionCta.svelte';
</script>

<section class="eliqauto-promo-band" aria-labelledby="eliqauto-promo-title">
	<div class="container">
		<div class="eliqauto-promo">
			<img
				class="eliqauto-promo__background"
				src="/assets/eliqauto/promo/premium-history-banner-v1.png"
				alt=""
				width="1672"
				height="941"
				loading="lazy"
				decoding="async"
				aria-hidden="true"
			/>
			<div class="eliqauto-promo__copy">
				<span class="eliqauto-promo__eyebrow">Внос и лизинг</span>
				<h2 class="eliqauto-promo__title" id="eliqauto-promo-title">
					Премиум автомобили с изрядна история
				</h2>
				<p class="eliqauto-promo__text">
					Карфакс, сервизна история и личен оглед — потвърдени преди да платиш.
				</p>

				<div class="eliqauto-promo__actions">
					<HomeSectionCta href="/inventory" label="Виж наличните" />
					<a href={resolve('/calculator')} class="eliqauto-promo__ghost">Калкулатор за внос</a>
				</div>
				<ul class="eliqauto-promo__proof" aria-label="Предимства на Eliq Auto">
					<li><strong>4.8</strong> · 157 отзива</li>
					<li>Карфакс + история</li>
					<li>Оглед в Пазарджик</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	/* Desktop-only image-backed feature banner. The generated asset contains no
	   text or UI; all copy remains real DOM for crisp Bulgarian typography. */
	.eliqauto-promo-band {
		display: none;
	}

	@media (min-width: 768px) {
		.eliqauto-promo-band {
			display: block;
			background: var(--bc-bg);
			padding: 18px 0;
		}
	}

	.eliqauto-promo {
		position: relative;
		overflow: hidden;
		min-height: 360px;
		border-radius: 8px;
		border: 1px solid rgba(165, 23, 23, 0.16);
		box-shadow: 0 18px 44px rgba(40, 10, 10, 0.18);
		background: #1a0909;
	}

	.eliqauto-promo::before {
		position: absolute;
		inset: 0;
		z-index: 1;
		content: '';
		background:
			linear-gradient(
				90deg,
				rgba(22, 6, 6, 0.98) 0%,
				rgba(22, 6, 6, 0.9) 34%,
				rgba(22, 6, 6, 0.28) 62%,
				rgba(22, 6, 6, 0.06) 100%
			),
			linear-gradient(180deg, rgba(22, 6, 6, 0.08), rgba(22, 6, 6, 0.18));
		pointer-events: none;
	}

	.eliqauto-promo__background {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.eliqauto-promo__copy {
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

	.eliqauto-promo__eyebrow {
		display: inline-flex;
		align-items: center;
		width: fit-content;
		min-height: 31px;
		margin-bottom: 20px;
		padding: 0 15px;
		border: 1px solid rgb(181 18 27 / 0.38);
		border-radius: 999px;
		color: #f3d6d6;
		font-size: var(--bc-text-micro);
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.eliqauto-promo__title {
		margin: 0 0 16px;
		max-width: 540px;
		color: #ffffff;
		font-size: clamp(34px, 4.4vw, 55px);
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: 0;
	}

	.eliqauto-promo__text {
		margin: 0 0 28px;
		max-width: 440px;
		color: rgba(255, 255, 255, 0.82);
		font-size: 17px;
		line-height: 1.48;
	}

	.eliqauto-promo__actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}

	.eliqauto-promo__ghost {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 52px;
		padding: 0 22px;
		border-color: rgba(255, 255, 255, 0.26);
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: var(--bc-radius-md);
		background: rgba(255, 255, 255, 0.03);
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-semibold);
		line-height: var(--bc-leading-control);
		text-decoration: none;
		transition:
			border-color var(--bc-motion-hover),
			background-color var(--bc-motion-hover);
	}

	.eliqauto-promo__ghost:focus-visible {
		border-color: rgba(165, 23, 23, 0.5);
		background: rgba(165, 23, 23, 0.16);
	}

	@media (hover: hover) and (pointer: fine) {
		.eliqauto-promo__ghost:hover {
			border-color: rgba(165, 23, 23, 0.5);
			background: rgba(165, 23, 23, 0.16);
		}
	}

	.eliqauto-promo__ghost:active {
		transform: translateY(1px);
	}

	.eliqauto-promo__proof {
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

	.eliqauto-promo__proof li {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: rgba(255, 255, 255, 0.9);
	}

	.eliqauto-promo__proof li::before {
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: #a51717;
		content: '';
	}

	.eliqauto-promo__proof strong {
		color: #ffffff;
	}

	@media (max-width: 1199px) {
		.eliqauto-promo__copy {
			width: min(52%, 520px);
			padding-left: 32px;
		}
	}

	@media (max-width: 991px) {
		.eliqauto-promo {
			min-height: 330px;
		}

		.eliqauto-promo::before {
			background:
				linear-gradient(
					90deg,
					rgba(22, 6, 6, 0.98) 0%,
					rgba(22, 6, 6, 0.88) 42%,
					rgba(22, 6, 6, 0.26) 72%,
					rgba(22, 6, 6, 0.08) 100%
				),
				linear-gradient(180deg, rgba(22, 6, 6, 0.06), rgba(22, 6, 6, 0.2));
		}

		.eliqauto-promo__background {
			object-position: 61% center;
		}

		.eliqauto-promo__copy {
			min-height: 330px;
			width: min(62%, 500px);
		}

		.eliqauto-promo__text {
			max-width: 390px;
		}
	}
</style>
