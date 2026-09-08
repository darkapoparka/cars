<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const monthlyPayment = $derived(vehicle.monthly.replace(/^от\s+/i, ''));
</script>

<p class="h4 mb-16">Калкулатор за финансиране</p>
<form action={resolve('/calculator')} method="get" class="financing-calculator mb-40">
	<div class="financing-calculator-form mb-24">
		<div class="xl2-grid-cols-2 md-grid-cols-1 grid grid-cols-4 gap-12">
			<div>
				<label class="mb-10" for="FinancingCalculatorCarPrice">Цена на автомобила</label>
				<input
					class="active"
					id="FinancingCalculatorCarPrice"
					name="FinancingCalculatorCarPrice"
					type="text"
					value={vehicle.priceEur}
					required
				/>
			</div>

			<div>
				<label class="mb-10" for="FinancingCalculatorInterestRate">Лихвен процент</label>
				<input
					id="FinancingCalculatorInterestRate"
					name="FinancingCalculatorInterestRate"
					type="text"
					value="1.2%"
					required
				/>
			</div>

			<div>
				<label class="mb-8" for="FinancingCalculatorLoanTerm">Срок (месеци)</label>
				<select id="FinancingCalculatorLoanTerm" name="FinancingCalculatorLoanTerm">
					<option>60 месеца</option>
					<option>30 месеца</option>
					<option>10 месеца</option>
				</select>
			</div>

			<div>
				<label class="mb-8" for="FinancingCalculatorDownPayment">Първоначална вноска</label>
				<input
					id="FinancingCalculatorDownPayment"
					name="FinancingCalculatorDownPayment"
					type="text"
					value="по оферта"
					required
				/>
			</div>
		</div>

		<button type="submit" class="sa-cta sa-cta-primary sa-cta-compact mb-2">Изчисли</button>
	</div>

	<div class="md-grid-cols-1 grid grid-cols-3 gap-8">
		<div>
			<p class="mb-4">Месечна вноска:</p>
			<p class="font-weight-600">{monthlyPayment}</p>
		</div>

		<div>
			<p class="mb-4">Лихва и такси:</p>
			<p class="font-weight-600">уточняват се</p>
		</div>

		<div>
			<p class="mb-4">Ориентировъчна цена:</p>
			<p class="font-weight-600">{vehicle.priceBgn}</p>
		</div>
	</div>
</form>
