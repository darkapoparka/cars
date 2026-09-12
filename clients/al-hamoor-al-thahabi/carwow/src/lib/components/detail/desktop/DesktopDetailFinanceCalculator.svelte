<script lang="ts">
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

<h2 class="h4 mb-16">Finance calculator</h2>
<form action={resolve('/calculator')} method="get" class="financing-calculator mb-40">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<label class="mb-10" for="FinancingCalculatorCarPrice">Цена на автомобила (€)</label>
				<input
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
				<label class="mb-10" for="FinancingCalculatorInterestRate">Годишна лихва (%)</label>
				<input
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
				<label class="mb-8" for="FinancingCalculatorLoanTerm">Срок (месеци)</label>
				<select
					id="FinancingCalculatorLoanTerm"
					name="months"
					bind:value={() => inputs.months, (value) => (inputs = { ...inputs, months: value })}
				>
					<option value="60">60 месеца</option>
					<option value="30">30 месеца</option>
					<option value="10">10 месеца</option>
				</select>
			</div>

			<div>
				<label class="mb-8" for="FinancingCalculatorDownPayment">Първоначална вноска (€)</label>
				<input
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
		<button type="submit" class="sa-cta-compact mb-2 sa-cta sa-cta-primary">Изчисли</button>
	</div>

	<div class="md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">Месечна вноска:</p>
			<p class="font-weight-600">{estimate.valid ? formatFinanceEur(estimate.monthly) : '—'}</p>
		</div>

		<div>
			<p class="mb-4">Лихва и такси:</p>
			<p class="font-weight-600">
				{estimate.valid ? formatFinanceEur(estimate.interest + estimate.fees) : '—'}
			</p>
		</div>

		<div>
			<p class="mb-4">Ориентировъчна цена:</p>
			<p class="font-weight-600">{estimate.valid ? formatFinanceEur(estimate.price) : '—'}</p>
		</div>
	</div>
	<p class="h7 text-secondary">
		Примерна сметка в евро, не оферта: равни вноски, фиксирана годишна лихва, {inputs.feePercent}%
		финансирани такси от цената; без други разходи и застраховки. Всички стойности могат да се
		променят в калкулатора.
	</p>
	{#if !estimate.valid}<p role="alert">{estimate.error}</p>{/if}
</form>
