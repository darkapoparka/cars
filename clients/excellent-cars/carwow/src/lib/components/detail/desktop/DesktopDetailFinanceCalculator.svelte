<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { calculateFinance, financeDefaults, formatFinanceEur } from '$lib/utils/finance-estimate';
	import { resolve } from '$app/paths';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	let inputs = $derived({
		...financeDefaults,
		price: String(vehicle.price),
		deposit: '0',
		months: '60'
	});
	const estimate = $derived(calculateFinance(inputs));
</script>

<h2 class="h4 mb-16">{i18n.t('copy.bbc120ea0e49')}</h2>
<form action={resolve('/calculator')} method="get" class="financing-calculator mb-40">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<label class="mb-10" for="FinancingCalculatorCarPrice">{i18n.t('copy.a6dcd022e308')}</label>
				<input
					{@attach i18n.validation}
					class="active"
					id="FinancingCalculatorCarPrice"
					name="price"
					type="text"
					inputmode="decimal"
					bind:value={() => inputs.price, (value) => (inputs = { ...inputs, price: value })}
					required
				/>
			</div>

			<div>
				<label class="mb-10" for="FinancingCalculatorInterestRate"
					>{i18n.t('copy.162834b010ed')}</label
				>
				<input
					{@attach i18n.validation}
					id="FinancingCalculatorInterestRate"
					name="annualRate"
					type="text"
					inputmode="decimal"
					bind:value={
						() => inputs.annualRate, (value) => (inputs = { ...inputs, annualRate: value })
					}
					required
				/>
			</div>

			<div>
				<label class="mb-8" for="FinancingCalculatorLoanTerm">{i18n.t('copy.937a2221d4da')}</label>
				<select
					{@attach i18n.validation}
					id="FinancingCalculatorLoanTerm"
					name="months"
					bind:value={() => inputs.months, (value) => (inputs = { ...inputs, months: value })}
				>
					<option value="60">{i18n.t('copy.873793bffc12')}</option>
					<option value="30">{i18n.t('copy.4a7869558c98')}</option>
					<option value="10">{i18n.t('copy.d22c789ac228')}</option>
				</select>
			</div>

			<div>
				<label class="mb-8" for="FinancingCalculatorDownPayment"
					>{i18n.t('copy.194d2d978886')}</label
				>
				<input
					{@attach i18n.validation}
					id="FinancingCalculatorDownPayment"
					name="deposit"
					type="text"
					inputmode="decimal"
					bind:value={() => inputs.deposit, (value) => (inputs = { ...inputs, deposit: value })}
					required
				/>
			</div>
		</div>

		<input type="hidden" name="tradeIn" value={inputs.tradeIn} />
		<input type="hidden" name="feePercent" value={inputs.feePercent} />
		<button type="submit" class="sa-cta-compact mb-2 sa-cta sa-cta-primary"
			>{i18n.t('copy.fa3f81c39b76')}</button
		>
	</div>

	<div class="md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">{i18n.t('copy.9bb5c9b15d01')}</p>
			<p class="font-weight-600">
				{estimate.valid ? formatFinanceEur(estimate.monthly, i18n.locale) : '—'}
			</p>
		</div>

		<div>
			<p class="mb-4">{i18n.t('copy.05356987fb4e')}</p>
			<p class="font-weight-600">
				{estimate.valid ? formatFinanceEur(estimate.interest + estimate.fees, i18n.locale) : '—'}
			</p>
		</div>

		<div>
			<p class="mb-4">{i18n.t('copy.916e0277bed7')}</p>
			<p class="font-weight-600">
				{estimate.valid ? formatFinanceEur(estimate.price, i18n.locale) : '—'}
			</p>
		</div>
	</div>
	<p class="h7 text-secondary">
		{i18n.t('copy.ae64cff97546')}
		{inputs.feePercent}{i18n.t('copy.6d9d560f640e')}
	</p>
	{#if !estimate.valid}<p role="alert">{estimate.error}</p>{/if}
</form>
