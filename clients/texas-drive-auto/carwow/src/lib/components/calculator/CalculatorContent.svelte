<script lang="ts">
	import { page } from '$app/state';
	import {
		calculateFinance,
		readFinanceInputs,
		formatFinanceEur
	} from '$lib/utils/finance-estimate';
	import { resolve } from '$app/paths';
	import { ChevronRight } from '@lucide/svelte';
	import { daynightVehicles } from '$lib/data/daynight-vehicles';

	let inputs = $derived(readFinanceInputs(page.url.searchParams));
	const estimate = $derived(calculateFinance(inputs));
	const amount = (value: number | undefined) =>
		value === undefined ? '—' : formatFinanceEur(value);

	// "Browse by Price" budget tiers with live counts — mirrors the exact server
	// logic in daynight-template-content.ts so the rendered counts stay 1:1.
	const budgetTiers = [
		{ label: 'Up to 10 000 USD', value: 'under-10000', limit: 10000 },
		{ label: 'Up to 20 000 USD', value: 'under-20000', limit: 20000 },
		{ label: 'Up to 30 000 USD', value: 'under-30000', limit: 30000 },
		{ label: 'Up to 50 000 USD', value: 'under-50000', limit: 50000 },
		{ label: 'Over 50 000 USD', value: 'over-50000', min: 50000 }
	] as const;

	const budgetBoxes = budgetTiers.map((tier) => {
		const count = daynightVehicles.filter((vehicle) =>
			'limit' in tier ? vehicle.price > 0 && vehicle.price <= tier.limit : vehicle.price > tier.min
		).length;

		return {
			countLabel: `${count} ${count === 1 ? 'vehicle' : 'vehicles'}`,
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
			question: 'What is buyer-arranged funding?',
			open: true,
			paragraphs: [
				'A loan arranged independently with a lender may let you pay for a vehicle in monthly installments. Payments depend on the price, down payment, term, interest rate, and fees. This calculator provides an illustrative estimate only. Texas Drive Auto offers no dealer financing or payment plans.',
				'If you plan to borrow, compare payment estimates and total borrowing costs with an independent lender. Buyer-arranged funding is separate from the dealership.',
				'Financing services are unavailable in this Texas Drive Auto preview. Texas Drive Auto offers no dealer financing, leasing, or payment plans. Buyers must arrange any funding independently.'
			]
		},
		{
			question: 'How is the monthly payment estimated?',
			paragraphs: [
				'The calculator estimates payments using the vehicle price minus the down payment and any hypothetical trade-in credit, plus interest and financed fees over the selected term. Adjust the values to update the estimate. Trade-in acceptance is not confirmed, and this is not a dealer financing offer.'
			]
		},
		{
			question: 'Vehicle budget and price?',
			paragraphs: [
				'Choose a budget that leaves room for registration, insurance, and maintenance. Use the calculator to compare illustrative terms and down payments before discussing buyer-arranged funding with an independent lender.'
			]
		},
		{
			question: 'Down payment?',
			paragraphs: [
				'A down payment reduces the amount borrowed and the estimated monthly payment. Ask your independent lender how different down payments affect its terms. No financing options are available through this Texas Drive Auto preview.'
			]
		},
		{
			question: 'Trade-in?',
			paragraphs: [
				'Trade-in acceptance and valuations are not confirmed in this Texas Drive Auto preview. Ask whether a trade-in is possible before including its value in your purchase budget.'
			]
		},
		{
			question: 'Taxes and fees?',
			paragraphs: [
				'Taxes, title and registration fees, and insurance may add to your budget. The calculator uses illustrative fees only and does not confirm actual costs. Request an itemized purchase total for the specific vehicle.'
			]
		},
		{
			question: 'Interest rate?',
			paragraphs: [
				'Your independent lender determines the interest rate and loan terms. The calculator’s rate is illustrative only. Texas Drive Auto offers no dealer financing, payment plans, or financing approval.'
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
					<a href={resolve('/')}>Home</a>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>More</span>
				</li>
				<li class="breadcrumb__icon" aria-hidden="true">
					<ChevronRight size={14} />
				</li>
				<li>
					<span>Calculator</span>
				</li>
			</ul>
		</div>
	</section>
	<!-- breadcrumb -->

	<!-- New Cars -->
	<section class="pb-100">
		<div class="tf-spacing-style3"></div>

		<div class="container">
			<h1 class="mb-12 text-center">Monthly payment estimator</h1>
			<p class="text-secondary h7 line-height-28 mb-40 text-center">
				Illustrative estimates for buyer-arranged funding. No dealer financing or payment plans.
			</p>

			<div class="lg-grid-cols-1 grid grid-cols-2 gap-40">
				<div class="border-box">
					<h2 class="h3 mb-28">Estimate a monthly payment</h2>
					<form class="calculate-form" onsubmit={(event) => event.preventDefault()}>
						<div class="grid grid-cols-1 gap-15">
							<div>
								<label class="mb-8" for="calculatePrice">Vehicle price (USD)</label>
								<input
									class="active input-large"
									id="calculatePrice"
									name="calculatePrice"
									type="text"
									inputmode="decimal"
									aria-describedby="finance-assumptions"
									bind:value={() => inputs.price, (value) => (inputs = { ...inputs, price: value })}
									required
								/>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторPayment">Down payment (USD)</label>
								<input
									class="input-large"
									id="КалкулаторPayment"
									name="КалкулаторPayment"
									type="text"
									inputmode="decimal"
									aria-describedby="finance-assumptions"
									bind:value={
										() => inputs.deposit, (value) => (inputs = { ...inputs, deposit: value })
									}
									required
								/>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторInterestRate"
									>Term <span class="text-muted">(months)</span></label
								>
								<input
									id="КалкулаторInterestRate"
									name="КалкулаторInterestRate"
									class="input-large"
									type="number"
									min="1"
									max="120"
									step="1"
									bind:value={
										() => Number(inputs.months),
										(value) => (inputs = { ...inputs, months: value == null ? '' : String(value) })
									}
									required
								/>
							</div>

							<div>
								<label class="mb-8" for="КалкулаторTrade">Hypothetical trade-in credit (USD; 0 without trade-in)</label>
								<input
									class="input-large"
									id="КалкулаторTrade"
									placeholder="0 $"
									name="КалкулаторTrade"
									type="text"
									inputmode="decimal"
									aria-describedby="finance-assumptions"
									bind:value={
										() => inputs.tradeIn, (value) => (inputs = { ...inputs, tradeIn: value })
									}
									required
								/>
							</div>
							<div>
								<label class="mb-8" for="КалкулаторInterestRate2">Annual interest rate (%)</label>
								<input
									class="input-large"
									id="КалкулаторInterestRate2"
									name="КалкулаторInterestRate2"
									type="text"
									inputmode="decimal"
									aria-describedby="finance-assumptions"
									bind:value={
										() => inputs.annualRate, (value) => (inputs = { ...inputs, annualRate: value })
									}
									required
								/>
							</div>
							<div>
								<label class="mb-8" for="КалкулаторTax">Financed fees (% of price)</label>
								<input
									class="input-large"
									id="КалкулаторTax"
									name="КалкулаторTax"
									type="text"
									inputmode="decimal"
									aria-describedby="finance-assumptions"
									bind:value={
										() => inputs.feePercent, (value) => (inputs = { ...inputs, feePercent: value })
									}
									required
								/>
							</div>
						</div>
					</form>
					<p id="finance-assumptions" class="h7 text-secondary finance-assumptions">
						* Example inputs, not an offer. Estimates use USD, equal monthly payments, and
						a fixed annual interest rate. Fees are a percentage of the price and included in the amount borrowed. Other costs and
						insurance are excluded; confirm terms with your independent lender. No dealer financing or payment plans.
					</p>
				</div>

				<div class="border-box">
					<h2 class="h3 mb-8">Estimated monthly payment*</h2>
					{#if !estimate.valid}<p role="alert">{estimate.error}</p>{/if}
					<p class="mb-10">
						<span class="text-56 font-weight-600"
							>{amount(estimate.valid ? estimate.monthly : undefined)}</span
						><span class="h3 font-weight-600">/month</span>
					</p>
					<p class="h5 mb-28 capitalize">
						{estimate.valid
							? `for a term of ${estimate.months} months`
							: 'Check your entries'}
					</p>
					<div class="divider mb-28 w-full"></div>

					<p class="h4 mb-20">Estimate summary</p>

					<div class="mb-28 flex flex-col gap-18">
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Vehicle price</span>
							<span class="h7">{amount(estimate.valid ? estimate.price : undefined)}</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Down payment</span>
							<span class="h7">{amount(estimate.valid ? -estimate.deposit : undefined)}</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Hypothetical trade-in credit</span>
							<span class="h7">{amount(estimate.valid ? -estimate.tradeIn : undefined)}</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Total interest over the term</span>
							<span class="h7">{amount(estimate.valid ? estimate.interest : undefined)}</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Financed fees</span>
							<span class="h7">{amount(estimate.valid ? estimate.fees : undefined)}</span>
						</p>
						<p class="flex justify-between gap-8">
							<span class="h7 text-secondary">Other fees</span>
							<span class="h7">not included</span>
						</p>
					</div>

					<div class="divider mb-28 w-full"></div>

					<div class="mb-16 flex justify-between gap-8">
						<p class="h4">Total before taxes and fees</p>
						<p class="h4">{amount(estimate.valid ? estimate.total : undefined)}</p>
					</div>

					<div class="flex justify-between gap-8">
						<p class="h4">No dealer payment plans</p>
						<p class="h4">{amount(estimate.valid ? estimate.monthly : undefined)}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="tf-spacing"></div>

		<h2 class="mb-40 text-center capitalize">Browse by budget</h2>

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
				<a href={resolve('/inventory')} class="sa-cta sa-cta-ghost"> View all </a>
			</div>
		</div>
	</section>
	<!-- New Cars -->

	<section class="background-light py-100">
		<div class="container">
			<h2 class="mb-40 text-center">Frequently asked questions</h2>
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

	.finance-assumptions {
		margin-top: 16px;
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

	.input-large {
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

	.input-large:focus {
		border-color: var(--sa-blue, #b00000);
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
