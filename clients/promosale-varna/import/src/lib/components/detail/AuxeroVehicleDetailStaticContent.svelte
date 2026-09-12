<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
	const contactHref = resolve('/contact');
	const reviewsHref = resolve('/reviews');
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

<div class="divider mb-40 w-full"></div>

<p class="h4 mb-16">Финансиране и ориентировъчна вноска</p>
<form action="/calculator" class="financing-calculator mb-40">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<p class="mb-10">Цена на автомобила</p>
				<input
					aria-label="Цена на автомобила"
					class="active"
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

<div class="divider mb-40 w-full"></div>

<div class="md-flex-col md-items-start mb-16 flex items-center justify-between gap-16">
	<div>
		<p class="h4 mb-12">Локация</p>
		<p class="flex items-center gap-8">
			<img class="h-16 w-16" src="/assets/icons/MapPin.svg" alt="Локация" />
			{detail.contact.address}
		</p>
	</div>

	<a href={contactHref} class="text-underline text-highlight text-sm">Виж упътване</a>
</div>

<div class="widget-gg-map radius-16 mb-40 flex overflow-hidden">
	<iframe
		title="Promosale Varna appointment area"
		src="https://maps.google.com/maps?q=Plovdiv%20South%20Industrial%20Zone&t=&z=13&ie=UTF8&iwloc=&output=embed"
		height="523"
		style="border:0;width: 100%;"
		allowfullscreen
		loading="lazy"
		referrerpolicy="no-referrer-when-downgrade"
	></iframe>
</div>

<div class="divider mb-40 w-full"></div>

<div class="mb-16 flex items-center justify-between gap-16">
	<p class="h4">Клиентски отзиви</p>
</div>

<div class="rating-box mb-40">
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

<div class="comments mb-40">
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
			Promosale Varna запазиха разговора практичен: снимки, документи, пробег и реалните разходи, които
			имат значение преди доставка. Хареса ми, че нямаше излишни обещания.
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
