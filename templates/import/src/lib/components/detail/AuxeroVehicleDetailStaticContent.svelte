<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	const contactHref = resolve('/contact');
	const reviewsHref = resolve('/reviews');
	const mapsHref = $derived(
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(detail.contact.address)}`
	);
</script>

{#snippet starRow()}
	<div class="flex items-center">
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
		<img src="/assets/icons/star-2.svg" alt="star" />
	</div>
{/snippet}

{#snippet ratingBar(label: string, width: string, percent: string)}
	<div class="rating-box__bar-item">
		<p class="rating-box__bar-label">
			<span class="text">{label}</span> <img src="/assets/icons/star-2.svg" alt="star" />
		</p>
		<div class="rating-box__bar-wrapper">
			<div class="rating-box__bar" style={`width: ${width};`}></div>
		</div>
		<span class="rating-box__bar-percent">{percent}</span>
	</div>
{/snippet}

<section class="daynight-pdp-finance" aria-labelledby="daynight-pdp-financing-title">
	<h2 class="sr-only" id="daynight-pdp-financing-title">Финансиране и ориентировъчна вноска</h2>
	<img
		src="/assets/daynight/pdp/financing-banner.webp"
		alt="Финансиране и ориентировъчна вноска"
		width="1400"
		height="420"
		class="daynight-pdp-finance__banner"
	/>
	<div class="daynight-pdp-finance__body">
		<form action="/calculator" class="financing-calculator">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<p class="mb-10">Цена на автомобила</p>
				<input
					aria-label="Цена на автомобила"
					id="ServicesCalculatorCarPrice"
					name="ServicesCalculatorCarPrice"
					type="text"
					value={detail.priceLabel}
					required
				/>
			</div>

			<div>
				<p class="mb-10">Лихвен процент</p>
				<input
					aria-label="Лихвен процент"
					id="ServicesCalculatorInterestRate"
					name="ServicesCalculatorInterestRate"
					type="text"
					value="1.2%"
					required
				/>
			</div>

			<div>
				<p class="mb-8">Срок (месеци)</p>
				<select
					aria-label="Срок (месеци)"
					id="ServicesCalculatorLoanTerm"
					name="ServicesCalculatorLoanTerm"
				>
					<option>60 месеца</option>
					<option>30 месеца</option>
					<option>10 месеца</option>
				</select>
			</div>

			<div>
				<p class="mb-8">Първоначална вноска</p>
				<input
					aria-label="Първоначална вноска"
					id="ServicesCalculatorDownPayment"
					name="ServicesCalculatorDownPayment"
					type="text"
					value="1 000 EUR"
					required
				/>
			</div>
		</div>

		<button class="btn btn-medium btn-primary mb-2">Изчисли</button>
	</div>

	<div class="md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">Месечна вноска:</p>
			<p class="font-weight-600">{detail.monthlyLabel}</p>
		</div>

		<div>
			<p class="mb-4">Лихва:</p>
			<p class="font-weight-600">По оферта от партньор</p>
		</div>

		<div>
			<p class="mb-4">Ориентировъчна обща сума:</p>
			<p class="font-weight-600">{detail.priceLabel}</p>
		</div>
	</div>
		</form>
	</div>
</section>

<section class="daynight-pdp-section-card" aria-labelledby="daynight-pdp-location-title">
	<div class="md-flex-col md-items-start mb-16 flex items-center justify-between gap-16">
	<div>
		<p class="h4 mb-12" id="daynight-pdp-location-title">Локация</p>
		<p class="flex items-center gap-8">
			<img class="h-16 w-16" src="/assets/icons/MapPin.svg" alt="Локация" />
			{detail.contact.address}
		</p>
	</div>

	<a href={contactHref} class="text-underline text-highlight text-sm">Виж упътване</a>
</div>

<a
	class="daynight-pdp-map"
	href={mapsHref}
	target="_blank"
	rel="noopener noreferrer"
	aria-label={`Отвори ${detail.contact.address} в Google Maps`}
>
	<span class="daynight-pdp-map__grid" aria-hidden="true"></span>
	<span class="daynight-pdp-map__pin" aria-hidden="true">
		<img src="/assets/icons/MapPin.svg" alt="" />
	</span>
	<span class="daynight-pdp-map__card">
		<strong>Day Night Auto</strong>
		<span>{detail.contact.address}</span>
		<small>Отвори в Google Maps ↗</small>
	</span>
</a>
</section>

<section class="daynight-pdp-reviews-shell" aria-labelledby="daynight-pdp-reviews-title">
	<div class="daynight-pdp-reviews-shell__header">
		<p class="h4" id="daynight-pdp-reviews-title">Клиентски отзиви</p>
		<a href={reviewsHref} class="daynight-pdp-reviews-shell__all">Виж всички отзиви →</a>
	</div>

<div class="rating-box">
	<div class="rating-box__content">
		<div class="rating-box__overview">
			<div class="rating-box__average">
				<span class="rating-box__score">4.8</span>
				<div class="rating-box__stars">
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
					<img src="/assets/icons/star-2.svg" alt="star" />
				</div>
				<p class="rating-box__count">(157 отзива във Facebook)</p>
			</div>
		</div>
		<div class="rating-box__distribution">
			{@render ratingBar('5', '60%', '60%')}
			{@render ratingBar('4', '20%', '20%')}
			{@render ratingBar('3', '10%', '10%')}
			{@render ratingBar('2', '7%', '7%')}
			{@render ratingBar('1', '3%', '3%')}
		</div>
		<div class="rating-box__button">
			<a href={reviewsHref} class="btn btn-primary btn-large font-weight-600">
				Виж всички отзиви
			</a>
		</div>
	</div>
</div>

<div class="comments daynight-pdp-reviews mb-40">
	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar">
				<img src="/assets/images/avatar/coment-avatar-1.webp" alt="avatar" />
			</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Александър Вътев</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">13 август 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary">
			Екипът ми обясни историята на автомобила, транспорта и стъпките по регистрация преди да поема
			ангажимент. Огледът беше спокоен, с ясни документи и конкретни следващи действия.
		</p>
	</div>

	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar">
				<img src="/assets/images/avatar/avatar-2.webp" alt="avatar" />
			</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Красимир Георгиев</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">22 август 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary">
			Day Night Auto запазиха разговора практичен: снимки, документи, пробег и реалните разходи,
			които имат значение преди доставка. Хареса ми, че нямаше излишни обещания.
		</p>
	</div>

	<div class="comment-box">
		<div class="comment-box__header mb-20">
			<div class="comment-box__avatar">
				<img src="/assets/images/avatar/coment-avatar-2.webp" alt="avatar" />
			</div>
			<div>
				<div class="text-secondary mb-8 flex items-center gap-4">
					<p class="h5">Илиян Петров</p>
					<span class="text-secondary text-sm">-</span>
					<span class="text-secondary text-sm">18 август 2025</span>
				</div>
				{@render starRow()}
			</div>
		</div>
		<p class="text-secondary" id="reviewForm">
			Изпратих данните за клиентски автомобил и получих ясна обратна връзка за цена, документи и
			най-добрия начин да бъде представен автомобилът.
		</p>
	</div>

	<p>
		<a href={reviewsHref} class="text-underline font-weight-600">Виж още отзиви</a>
	</p>
</div>
</section>

<style>
	.daynight-pdp-section-card {
		margin-bottom: 40px;
		padding: 24px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
	}

	.daynight-pdp-finance {
		margin-bottom: 40px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: #ffffff;
	}

	.daynight-pdp-finance__banner {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 10 / 3;
		object-fit: cover;
	}

	.daynight-pdp-finance__body {
		padding: 24px;
	}

	.daynight-pdp-finance :global(.financing-calculator) {
		margin: 0 !important;
		padding: 0 !important;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
	}

	.daynight-pdp-finance :global(.financing-calculator-form) {
		padding-bottom: 20px;
		border-bottom: 1px solid var(--bc-border);
	}

	.daynight-pdp-finance :global(input),
	.daynight-pdp-finance :global(select) {
		border-color: var(--bc-border) !important;
		background: #ffffff !important;
		color: var(--bc-ink) !important;
	}

	.daynight-pdp-reviews-shell {
		margin-bottom: 40px;
		padding: 24px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
	}

	.daynight-pdp-reviews-shell__header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 18px;
	}

	.daynight-pdp-reviews-shell__header :global(.h4) {
		margin: 0;
	}

	.daynight-pdp-reviews-shell__all {
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}

	.daynight-pdp-reviews-shell :global(.rating-box) {
		margin-bottom: 18px !important;
		border: 0 !important;
		background: var(--bc-surface) !important;
	}

	.daynight-pdp-reviews-shell :global(.rating-box__button) {
		display: none;
	}

	.daynight-pdp-reviews-shell .daynight-pdp-reviews {
		margin-bottom: 0 !important;
	}

	.daynight-pdp-reviews-shell .daynight-pdp-reviews > p {
		display: none;
	}

	.daynight-pdp-map {
		position: relative;
		display: block;
		height: 236px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: #f1f3f5;
		color: var(--bc-ink);
		text-decoration: none;
	}

	.daynight-pdp-map__grid {
		position: absolute;
		inset: -20%;
		background-image:
			linear-gradient(28deg, transparent 46%, rgb(255 255 255 / 0.95) 47%, rgb(255 255 255 / 0.95) 50%, transparent 51%),
			linear-gradient(112deg, transparent 47%, rgb(255 255 255 / 0.9) 48%, rgb(255 255 255 / 0.9) 51%, transparent 52%),
			linear-gradient(var(--bc-border) 1px, transparent 1px),
			linear-gradient(90deg, var(--bc-border) 1px, transparent 1px);
		background-size: 180px 130px, 220px 160px, 42px 42px, 42px 42px;
		background-position: 12% 18%, 68% 40%, 0 0, 0 0;
		opacity: 0.64;
		transform: rotate(-3deg) scale(1.08);
	}

	.daynight-pdp-map__pin {
		position: absolute;
		top: 50%;
		left: 58%;
		display: grid;
		width: 52px;
		height: 52px;
		place-items: center;
		border: 1px solid rgb(185 22 28 / 0.22);
		border-radius: 50%;
		background: #ffffff;
		box-shadow: 0 12px 28px rgb(23 25 28 / 0.12);
		transform: translate(-50%, -50%);
	}

	.daynight-pdp-map__pin img {
		width: 23px;
		height: 23px;
	}

	.daynight-pdp-map__card {
		position: absolute;
		bottom: 16px;
		left: 16px;
		display: grid;
		max-width: min(330px, calc(100% - 32px));
		gap: 2px;
		padding: 13px 15px;
		border: 1px solid var(--bc-border);
		border-radius: 10px;
		background: rgb(255 255 255 / 0.96);
		box-shadow: var(--bc-shadow-card);
	}

	.daynight-pdp-map__card strong {
		font-size: 15px;
		line-height: 1.35;
	}

	.daynight-pdp-map__card span {
		color: var(--bc-muted);
		font-size: 13px;
		line-height: 1.4;
	}

	.daynight-pdp-map__card small {
		margin-top: 5px;
		color: var(--bc-accent);
		font-size: 12px;
		font-weight: 700;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-pdp-map:hover {
			border-color: var(--bc-border-strong);
		}
	}

	@media (min-width: 768px) {
		.daynight-pdp-reviews {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 16px;
		}

		.daynight-pdp-reviews :global(.comment-box) {
			height: 100%;
			margin: 0 !important;
		}

		.daynight-pdp-reviews :global(.comment-box:nth-of-type(3)) {
			display: none;
		}

		.daynight-pdp-reviews > p {
			grid-column: 1 / -1;
			margin: 4px 0 0;
		}
	}

	@media (max-width: 767px) {
		.daynight-pdp-map {
			height: 240px;
		}
	}
</style>
