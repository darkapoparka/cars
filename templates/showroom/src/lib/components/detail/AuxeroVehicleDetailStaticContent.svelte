<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import { eliqautoContact } from '$lib/data/eliqauto';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	const reviewsHref = resolve('/reviews');
	const mapHref = eliqautoContact.mapHref;
	const mapEmbedUrl = eliqautoContact.mapEmbedUrl;
	const directHref = (href: string) => ({ href });
</script>

{#snippet starRow()}
	<div class="comment-box__stars flex items-center" role="img" aria-label="Оценка 5 от 5">
		<img src="/assets/icons/star-2.svg" alt="" />
		<img src="/assets/icons/star-2.svg" alt="" />
		<img src="/assets/icons/star-2.svg" alt="" />
		<img src="/assets/icons/star-2.svg" alt="" />
		<img src="/assets/icons/star-2.svg" alt="" />
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

<form
	action="/calculator"
	class="financing-calculator eliqauto-pdp-financing mb-40"
	aria-labelledby="eliqauto-pdp-financing-title"
>
	<p class="eliqauto-pdp-financing__title h4" id="eliqauto-pdp-financing-title">
		Финансиране и ориентировъчна вноска
	</p>
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

		<button class="eliqauto-pdp-financing__calculate btn btn-medium btn-primary mb-2"
			>Изчисли</button
		>
	</div>

	<div class="eliqauto-pdp-financing__summary md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">Месечна вноска:</p>
			<p class="eliqauto-pdp-financing__amount font-weight-600">{detail.monthlyLabel}</p>
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

<section class="eliqauto-pdp-location-card mb-40" aria-labelledby="eliqauto-pdp-location-title">
	<div class="eliqauto-pdp-location-card__map">
		<iframe
			src={mapEmbedUrl}
			title="Карта на локацията на Eliq Auto"
			loading="eager"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>

		<a
			{...directHref(mapHref)}
			target="_blank"
			rel="noreferrer"
			class="eliqauto-pdp-location-card__map-link"
			title="Отвори в Google Maps"
		>
			<img class="h-16 w-16" src="/assets/icons/MapPin.svg" alt="" />
			<span id="eliqauto-pdp-location-title">{detail.contact.address}</span>
		</a>
	</div>
</section>

<section class="eliqauto-pdp-reviews mb-40" aria-labelledby="eliqauto-pdp-reviews-title">
	<div class="eliqauto-pdp-reviews-card">
		<div class="eliqauto-pdp-reviews-card__header">
			<p class="h4" id="eliqauto-pdp-reviews-title">Клиентски отзиви</p>
		</div>

		<div class="eliqauto-pdp-reviews-card__summary">
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

		<div class="eliqauto-pdp-reviews-card__list">
			<div class="eliqauto-pdp-reviews-card__comments" aria-label="Последни клиентски отзиви">
				<article class="comment-box">
					<div class="comment-box__header">
						<div class="comment-box__avatar">
							<img src="/assets/images/avatar/coment-avatar-1.webp" alt="Александър Вътев" />
						</div>
						<div class="comment-box__identity">
							<div class="comment-box__meta">
								<p>Александър Вътев</p>
								<span class="comment-box__date">13 август 2025</span>
							</div>
							{@render starRow()}
						</div>
					</div>
					<p class="comment-box__body text-secondary">
						Екипът ми обясни историята на автомобила, транспорта и стъпките по регистрация преди да
						поема ангажимент. Огледът беше спокоен, с ясни документи и конкретни следващи действия.
					</p>
				</article>

				<article class="comment-box">
					<div class="comment-box__header">
						<div class="comment-box__avatar">
							<img src="/assets/images/avatar/avatar-2.webp" alt="Красимир Георгиев" />
						</div>
						<div class="comment-box__identity">
							<div class="comment-box__meta">
								<p>Красимир Георгиев</p>
								<span class="comment-box__date">22 август 2025</span>
							</div>
							{@render starRow()}
						</div>
					</div>
					<p class="comment-box__body text-secondary">
						Eliq Auto запазиха разговора практичен: снимки, документи, пробег и реалните разходи,
						които имат значение преди доставка. Хареса ми, че нямаше излишни обещания.
					</p>
				</article>

				<article class="comment-box">
					<div class="comment-box__header">
						<div class="comment-box__avatar">
							<img src="/assets/images/avatar/coment-avatar-2.webp" alt="Илиян Петров" />
						</div>
						<div class="comment-box__identity">
							<div class="comment-box__meta">
								<p>Илиян Петров</p>
								<span class="comment-box__date">18 август 2025</span>
							</div>
							{@render starRow()}
						</div>
					</div>
					<p class="comment-box__body text-secondary" id="reviewForm">
						Изпратих данните за клиентски автомобил и получих ясна обратна връзка за цена, документи
						и най-добрия начин да бъде представен автомобилът.
					</p>
				</article>
			</div>
		</div>
	</div>
</section>

<style>
	.eliqauto-pdp-financing__title {
		margin: 0 0 24px;
		color: var(--bc-ink);
	}

	.eliqauto-pdp-financing__amount {
		color: var(--bc-accent);
	}

	.eliqauto-pdp-financing__summary {
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr) minmax(0, 1.2fr);
		gap: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface);
		padding: 16px 18px;
	}

	.eliqauto-pdp-financing__summary > div {
		min-width: 0;
		padding-right: 18px;
	}

	.eliqauto-pdp-financing__summary > div + div {
		border-left: 1px solid var(--bc-border);
		padding-right: 18px;
		padding-left: 18px;
	}

	.eliqauto-pdp-financing__summary > div:last-child {
		padding-right: 0;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-financing .eliqauto-pdp-financing__calculate) {
		background: var(--bc-accent);
		border-color: var(--bc-accent);
		color: var(--bc-accent-contrast);
		transition:
			background-color 160ms ease,
			border-color 160ms ease,
			color 160ms ease;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(
			.eliqauto-pdp-desktop .eliqauto-pdp-financing .eliqauto-pdp-financing__calculate:hover
		) {
			background: var(--bc-ink);
			border-color: var(--bc-ink);
			color: var(--bc-accent-contrast);
		}
	}

	.eliqauto-pdp-location-card {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		overflow: hidden;
	}

	.eliqauto-pdp-location-card__map-link {
		position: absolute;
		right: 16px;
		top: 16px;
		z-index: 2;
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
		padding: 0 16px;
		box-shadow: 0 6px 18px rgb(24 24 27 / 16%);
		text-decoration: none;
		transition:
			background-color 160ms ease,
			color 160ms ease;
		white-space: nowrap;
	}

	.eliqauto-pdp-location-card__map-link > img {
		flex: 0 0 auto;
	}

	.eliqauto-pdp-location-card__map-link:focus-visible {
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	.eliqauto-pdp-location-card__map-link:hover {
		background: var(--bc-ink);
		color: var(--bc-accent-contrast);
	}

	.eliqauto-pdp-location-card__map {
		position: relative;
		height: 260px;
		background: var(--bc-surface);
	}

	.eliqauto-pdp-location-card__map iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.eliqauto-pdp-reviews-card {
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-lg);
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		overflow: hidden;
	}

	.eliqauto-pdp-reviews-card__header {
		padding: 24px 26px 0;
	}

	.eliqauto-pdp-reviews-card__header > .h4 {
		margin: 0;
		color: var(--bc-ink);
	}

	.eliqauto-pdp-reviews-card__summary {
		padding: 18px 26px 26px;
	}

	.eliqauto-pdp-reviews-card__list {
		padding: 0 26px 26px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments) {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box) {
		display: flex;
		min-width: 0;
		width: auto;
		height: 100%;
		flex-direction: column;
		margin: 0;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-raised);
		padding: 20px;
		box-shadow: none;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__header) {
		display: flex;
		align-items: flex-start;
		gap: 14px;
		margin-bottom: 16px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__avatar),
	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__avatar img) {
		width: 48px;
		height: 48px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__identity) {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 10px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__meta) {
		display: flex;
		min-width: 0;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 8px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__meta p) {
		margin: 0;
		color: var(--bc-ink);
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__date) {
		color: var(--bc-muted);
		font-size: 13px;
		line-height: 18px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__stars) {
		gap: 2px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__stars img) {
		width: 16px;
		height: 16px;
	}

	:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box__body) {
		margin: 0;
		color: var(--bc-copy);
		font-size: 15px;
		line-height: 24px;
	}

	.rating-box__content {
		display: grid;
		grid-template-columns: 204px minmax(0, 1fr) 211px;
		align-items: center;
		gap: 48px;
	}

	.rating-box__overview {
		width: 204px;
		min-width: 0;
	}

	.rating-box__distribution {
		min-width: 0;
	}

	.rating-box__button {
		width: 100%;
		justify-content: flex-end;
	}

	.rating-box__button .btn {
		width: 100%;
	}

	@media (max-width: 1199.98px) {
		.rating-box__content {
			grid-template-columns: minmax(0, 172px) minmax(0, 1fr);
			gap: 24px;
		}

		.rating-box__overview {
			width: auto;
		}

		.rating-box__button {
			grid-column: 1 / -1;
			justify-content: flex-end;
		}

		.rating-box__button .btn {
			width: 211px;
			max-width: 100%;
		}
	}

	@media (max-width: 767.98px) {
		.eliqauto-pdp-location-card__map-link {
			right: 12px;
			top: 12px;
		}

		.eliqauto-pdp-financing__summary {
			grid-template-columns: minmax(0, 1fr);
			gap: 16px;
		}

		.eliqauto-pdp-financing__summary > div,
		.eliqauto-pdp-financing__summary > div + div {
			border-left: 0;
			padding-right: 0;
			padding-left: 0;
		}

		.eliqauto-pdp-reviews-card__summary {
			padding: 18px;
		}

		.eliqauto-pdp-reviews-card__header {
			padding: 18px 18px 0;
		}

		.eliqauto-pdp-reviews-card__list {
			padding: 0 18px 20px;
		}

		:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments) {
			gap: 12px;
		}

		:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments .comment-box) {
			padding: 18px;
		}

		.eliqauto-pdp-location-card__map {
			height: 210px;
		}

		.rating-box__content {
			grid-template-columns: minmax(0, 1fr);
			gap: 24px;
		}

		.rating-box__overview,
		.rating-box__button {
			width: 100%;
		}

		.rating-box__button {
			grid-column: auto;
			justify-content: stretch;
		}

		.rating-box__button .btn {
			width: 100%;
		}
	}

	@media (min-width: 1200px) {
		:global(.eliqauto-pdp-desktop .eliqauto-pdp-reviews-card__comments) {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
