<script lang="ts">
	// Native self-contained rebuild of the localized /calculator main content
	// (breadcrumb + payment calculator + budget tiers + FAQ). The look that used to
	// come from app.css + StorefrontTemplateContent's :global stylesheet is reproduced
	// as a SELF-CONTAINED scoped style block below (design-system rules inlined,
	// de-scoped to this component's markup). The calculator form is static (no recompute
	// JS exists today), so this only reproduces the initial render. The FAQ is a NATIVE
	// Svelte accordion (data-daynight-native-accordion so RouteAccordionBehavior skips
	// it); the first item starts open, matching the baseline. The breadcrumb chevron
	// imgs are replaced with lucide's ChevronRight.

	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import { daynightVehicles } from '$lib/data/daynight-vehicles';

	// "Browse by Price" budget tiers with live counts — mirrors the exact server
	// logic in daynight-template-content.ts so the rendered counts stay 1:1.
	const budgetTiers = [
		{ label: 'До 10 000 EUR', value: 'under-10000', limit: 10000 },
		{ label: 'До 20 000 EUR', value: 'under-20000', limit: 20000 },
		{ label: 'До 30 000 EUR', value: 'under-30000', limit: 30000 },
		{ label: 'До 50 000 EUR', value: 'under-50000', limit: 50000 },
		{ label: 'Над 50 000 EUR', value: 'over-50000', min: 50000 }
	] as const;

	const budgetBoxes = budgetTiers.map((tier) => {
		const count = daynightVehicles.filter((vehicle) =>
			'limit' in tier ? vehicle.price > 0 && vehicle.price <= tier.limit : vehicle.price > tier.min
		).length;

		return {
			countLabel: `${count} ${count === 1 ? 'автомобил' : 'автомобила'}`,
			label: tier.label,
			value: tier.value
		};
	});

	type FaqItem = {
		question: string;
		paragraphs: readonly string[];
		open?: boolean;
	};

	const faqItems: readonly FaqItem[] = [
		{
			question: 'Какво представлява финансирането?',
			open: true,
			paragraphs: [
				'Финансирането позволява да платите автомобила на месечни вноски за избран срок. Вноската зависи от цената, първоначалната вноска, срока и лихвения процент — калкулаторът дава ориентировъчна сметка преди разговор с екипа.',
				'Голяма част от покупките на автомобили у нас се финансират — разсроченото плащане прави месечната вноска постижима, вместо да се плаща цялата цена наведнъж.',
				'Екипът на Excellent Cars съдейства с варианти за финансиране, лизинг и собствено разсрочено плащане според автомобила и бюджета. Получавате ориентировъчни условия предварително и избирате най-подходящия вариант.'
			]
		},
		{
			question: 'Как се изчислява месечната вноска?',
			paragraphs: [
				'Месечната вноска се изчислява от цената на автомобила минус първоначалната вноска и бартера, разпределена за избрания срок, плюс лихва и такси. Променете стойностите в калкулатора и сметката се обновява веднага.'
			]
		},
		{
			question: 'Бюджет и цена на автомобила?',
			paragraphs: [
				'Изберете бюджет, който оставя резерв за регистрация, застраховка и поддръжка. Ориентировъчно е добре месечната вноска да не надвишава 15–20% от месечния доход — калкулаторът помага да я видите предварително.'
			]
		},
		{
			question: 'Първоначална вноска?',
			paragraphs: [
				'Първоначалната вноска намалява финансираната сума и месечната вноска. По-висока първоначална вноска обикновено означава по-добри условия — екипът на Excellent Cars предлага варианти според бюджета.'
			]
		},
		{
			question: 'Бартер / замяна?',
			paragraphs: [
				'Можете да дадете настоящия си автомобил като бартер — оценката му се приспада от цената и намалява финансираната сума. Excellent Cars прави оглед и ясна оценка преди сделката.'
			]
		},
		{
			question: 'Данъци и такси?',
			paragraphs: [
				'Към цената се добавят такси за прехвърляне, регистрация и застраховка. Калкулаторът показва ориентировъчна стойност — точните суми се уточняват при огледа според конкретния автомобил.'
			]
		},
		{
			question: 'Лихвен процент?',
			paragraphs: [
				'Лихвеният процент зависи от финансиращата институция, срока и профила на клиента. Стойността в калкулатора е ориентировъчна — екипът съдейства с конкретни оферти от партньорски банки и лизинг.'
			]
		}
	];

	// First item starts open, matching the baseline `open` flag.
	let openQuestion = $state<string | null>(faqItems.find((item) => item.open)?.question ?? null);

	function toggleFaq(question: string) {
		openQuestion = openQuestion === question ? null : question;
	}
</script>

<div class="calculator-page">
	<!-- breadcrumb -->
	<section class="background-light">
		<div class="container">
			<ul class="breadcrumb">
				<li>
					<a href={resolve('/')}>Начало</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Още</span>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Калкулатор</span>
				</li>
			</ul>
		</div>
	</section>
	<!-- breadcrumb -->

	<!-- New Cars -->
	<section class="pb-100">
		<div class="tf-spacing-style3"></div>

		<div class="container">
			<h1 class="mb-12 text-center">Калкулатор за месечна вноска</h1>
			<p class="text-secondary h7 line-height-28 mb-40 text-center">
				Ориентировъчна сметка за бюджет, първоначална вноска и месечна вноска.
			</p>

			<div class="lg-grid-cols-1 grid grid-cols-2 gap-40">
				<div class="border-box">
					<p class="h3 mb-28">Изчислете ориентировъчна месечна вноска</p>
					<form action="#" class="calculate-form">
						<div class="grid grid-cols-1 gap-15">
							<div>
								<label class="mb-8" for="calculatePrice">Цена на автомобила</label>
								<input
									class="active input-large"
									id="calculatePrice"
									name="calculatePrice"
									type="text"
									value="46 300 €"
									required
								/>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторPayment">Първоначална вноска</label>
								<input
									class="input-large"
									id="КалкулаторPayment"
									name="КалкулаторPayment"
									type="text"
									value="400 €"
									required
								/>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторInterestRate"
									>Срок <span class="text-muted">(месеци)</span></label
								>
								<select id="КалкулаторInterestRate" name="КалкулаторInterestRate">
									<option>36 месеца</option>
									<option>24 месеца</option>
									<option>12 месеца</option>
								</select>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторTrade">Бартер / замяна (по избор)</label>
								<input
									class="input-large"
									id="КалкулаторTrade"
									placeholder="0 €"
									name="КалкулаторTrade"
									type="text"
									value=""
									required
								/>
							</div>
							<div>
								<label class="mb-8" for="КалкулаторInterestRate2">Лихвен процент</label>
								<input
									class="input-large"
									id="КалкулаторInterestRate2"
									name="КалкулаторInterestRate2"
									type="text"
									value="1.20%"
									required
								/>
							</div>
							<div>
								<label class="mb-8" for="КалкулаторTax">Данъци и такси</label>
								<input
									class="input-large"
									id="КалкулаторTax"
									name="КалкулаторTax"
									type="text"
									value="3.00%"
									required
								/>
							</div>
						</div>
					</form>
				</div>

				<div class="border-box">
					<p class="h3 mb-8">Ориентировъчна месечна вноска*</p>
					<p class="mb-10">
						<span class="text-56 font-weight-600">1 338 €</span><span class="h3 font-weight-600"
							>/месец</span
						>
					</p>
					<p class="h5 mb-28 capitalize">за срок от 3 години</p>
					<div class="divider mb-28 w-full"></div>

					<p class="h4 mb-20">Обобщение на сметката</p>

					<div class="mb-28 flex flex-col gap-18">
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Цена на автомобила</span>
							<span class="h7">46 300 €</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Първоначална вноска</span>
							<span class="h7">−400 €</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Бартер / замяна</span>
							<span class="h7">−0 €</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Лихва (ориент.) (1.20%)</span>
							<span class="h7">+880 €</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Такси (ориент.) (3.00%)</span>
							<span class="h7">+1 389 €</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Други такси</span>
							<span class="h7">не са включени</span>
						</p>
					</div>

					<div class="divider mb-28 w-full"></div>

					<div class="mb-16 flex justify-between gap-8">
						<p class="h4">Обща сума за плащане</p>
						<p class="h4">48 169 €</p>
					</div>

					<div class="flex justify-between gap-8">
						<p class="h4">Месечна вноска</p>
						<p class="h4">1 338 €</p>
					</div>
				</div>
			</div>
		</div>

		<div class="tf-spacing"></div>

		<h2 class="mb-40 text-center capitalize">Разгледай по бюджет</h2>

		<div class="container">
			<div
				class="lg-grid-cols-3 md-grid-cols-2 smb-grid-cols-1 padding-box-20 mb-40 grid grid-cols-5 gap-20"
			>
				{#each budgetBoxes as box (box.value)}
					<div class="price-box">
						<a
							href={resolve(`/inventory?price=${box.value}`)}
							class="h7 font-weight-500 text-underline mb-8"
						>
							{box.countLabel}
						</a>
						<p class="h4">{box.label}</p>
					</div>
				{/each}
			</div>

			<div class="flex justify-center">
							<a href={resolve('/inventory')} class="sa-cta sa-cta-ghost">
					Виж всички
				</a>
			</div>
		</div>
	</section>
	<!-- New Cars -->

	<section class="background-light py-100">
		<div class="container">
			<h2 class="mb-40 text-center">Често задавани въпроси</h2>
			<div class="max-width-930 mx-auto w-full">
				<div
					class="flat-accordion max-width-930 flex flex-col gap-18"
					data-daynight-native-accordion
				>
					{#each faqItems as item, itemIndex (item.question)}
						{@const open = openQuestion === item.question}
						<div class={['flat-toggle', 'bg-white', { active: open }]}>
							<button
								type="button"
								class={['toggle-title', { active: open }]}
								aria-expanded={open}
								aria-controls={`calculator-faq-${itemIndex}`}
								onclick={() => toggleFaq(item.question)}
							>
								<p class="h5 title">{item.question}</p>
								<span class="icon">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M20 15L12 7L4 15"
											stroke="#1C1C1C"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</span>
							</button>
							<div id={`calculator-faq-${itemIndex}`} class="toggle-content">
								{#each item.paragraphs as paragraph, index (paragraph)}
									<p
										class={index < item.paragraphs.length - 1
											? 'h7 text-secondary line-height-28 mb-8'
											: 'h7 text-secondary line-height-28'}
									>
										{paragraph}
									</p>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* Self-contained scoped styles for /calculator. Reproduce the legacy app.css +
	   StorefrontTemplateContent :global rules for the verbatim class strings used
	   above. Brand colours route through tokens (--sa-*); template neutrals stay
	   literal for an exact match. */

	.calculator-page {
		box-sizing: border-box;
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		letter-spacing: 0;
	}

	/* Universal reset at low specificity so the .mb-* utilities (declared later, equal
	   specificity) still win for elements that carry them. */
	.calculator-page :global(*) {
		box-sizing: border-box;
		margin: 0;
	}

	.calculator-page :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.calculator-page :global(img),
	.calculator-page :global(svg) {
		display: block;
		max-width: 100%;
	}

	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.background-light {
		background: #f5f7fb;
	}

	.bg-white {
		background: #fff;
	}

	/* Section spacing */
	.pb-100 {
		padding-bottom: 100px;
	}

	.py-100 {
		padding-top: 100px;
		padding-bottom: 100px;
	}

	.tf-spacing {
		height: 48px;
	}

	.tf-spacing-style3 {
		height: 34px;
	}

	/* Margin utilities */
	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-10 {
		margin-bottom: 10px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-16 {
		margin-bottom: 16px;
	}

	.mb-20 {
		margin-bottom: 20px;
	}

	.mb-28 {
		margin-bottom: 28px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.mx-auto {
		margin-right: auto;
		margin-left: auto;
	}

	.w-full {
		width: 100%;
	}

	.max-width-930 {
		max-width: 930px;
	}

	/* Grid / flex utilities */
	.grid {
		display: grid;
	}

	.grid-cols-1 {
		grid-template-columns: 1fr;
	}

	.grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.grid-cols-5 {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}

	.gap-8 {
		gap: 8px;
	}

	.gap-15 {
		gap: 15px;
	}

	.gap-18 {
		gap: 18px;
	}

	.gap-20 {
		gap: 20px;
	}

	.gap-40 {
		gap: 40px;
	}

	.flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}

	.justify-between {
		justify-content: space-between;
	}

	.justify-center {
		justify-content: center;
	}

	/* Text utilities */
	.text-center {
		text-align: center;
	}

	.capitalize {
		text-transform: none;
	}

	.text-secondary {
		color: #667085;
	}

	.text-muted {
		color: #5b6472;
	}

	.text-underline {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.line-height-28 {
		line-height: 28px;
	}

	.text-56 {
		font-size: clamp(38px, 5vw, 56px);
		line-height: 1;
	}

	.font-weight-500 {
		font-weight: 500;
	}

	.font-weight-600 {
		font-weight: 600;
	}

	/* Headings. app.css forced font-weight 600 on the .h4…h7,h1…h6 group;
	   StorefrontTemplateContent re-set h3/h4/h5 weights (winning at source order) while
	   .h7 kept the 600. Reproduce the computed result. */
	.calculator-page h1,
	.calculator-page h2 {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		line-height: 1.08;
	}

	.h3 {
		font-size: clamp(24px, 2.4vw, 32px);
		font-weight: 700;
		line-height: 1.16;
	}

	.h4 {
		font-size: 22px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.25;
	}

	.h5 {
		font-size: 18px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	.h7 {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.6;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
		list-style: none;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.72;
	}

	/* Card surfaces */
	.border-box {
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
		padding: clamp(24px, 3vw, 38px);
	}

	.price-box {
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
		padding: 22px 20px;
	}

	.divider {
		height: 1px;
		background: #e4e8ef;
	}

	/* Calculator form fields */
	.calculate-form label {
		display: block;
		font-weight: 500;
	}

	.input-large,
	.calculate-form select {
		width: 100%;
		height: 56px;
		border: 1px solid #d9e0ea;
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font: inherit;
		font-weight: 600;
		outline: 0;
		padding: 0 16px;
	}

	.input-large:focus,
	.calculate-form select:focus {
		border-color: var(--sa-blue, #B00000);
		box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.14);
	}

	/* FAQ accordion. The legacy look was a BLEND: app.css supplied the outer padding
	   (20px 28px) + the absolute-positioned icon, while StorefrontTemplateContent won
	   the border/radius/background/shadow + the flat-toggle flex title. */
	.flat-accordion {
		width: 100%;
	}

	.flat-toggle {
		overflow: hidden;
		padding: 20px 28px;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
	}

	.toggle-title {
		position: relative;
		display: flex;
		min-height: 72px;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px;
		cursor: pointer;
		width: 100%;
		border: 0;
		background: transparent;
		color: inherit;
		font: inherit;
		text-align: left;
	}

	.toggle-title:focus-visible {
		border-radius: 8px;
		outline: 3px solid color-mix(in srgb, var(--sa-red) 28%, transparent);
		outline-offset: 2px;
	}

	.toggle-title .title {
		margin: 0;
	}

	.toggle-title .icon {
		position: absolute;
		top: 2px;
		right: 0;
		display: grid;
		width: 34px;
		height: 34px;
		flex: 0 0 auto;
		place-items: center;
		border-radius: 999px;
		background: #f4f6fa;
		transform: rotate(180deg);
		transition: all 0.3s ease;
	}

	.toggle-title.active .icon {
		transform: rotate(180deg);
	}

	.toggle-content {
		display: none;
		margin-top: 6px;
		padding: 0 24px 24px;
	}

	.flat-accordion .flat-toggle.active .toggle-content {
		display: block;
	}

	@media (max-width: 1100px) {
		.lg-grid-cols-1 {
			grid-template-columns: 1fr;
		}

		.lg-grid-cols-3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-100,
		.py-100 {
			padding-top: 56px;
			padding-bottom: 56px;
		}

		.pb-100 {
			padding-top: 0;
		}

		.grid-cols-2,
		.grid-cols-5,
		.md-grid-cols-2,
		.smb-grid-cols-1 {
			grid-template-columns: 1fr;
		}

		.toggle-title {
			min-height: 64px;
			padding: 18px;
		}

		.toggle-content {
			padding: 0 18px 18px;
		}
	}
</style>
