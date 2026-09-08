<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		auxeroCalculatorInitial,
		calculateAuxeroCalculatorTotals,
		formatEur,
		type AuxeroCalculatorData,
		type AuxeroCalculatorInputKey,
		type AuxeroCalculatorSummaryRow
	} from '$lib/auxero/calculator';

	let { calculator }: { calculator: AuxeroCalculatorData } = $props();

	const inputClass = (active: boolean) => `${active ? 'active ' : ''}input-large`;
	const fieldValue = (key: AuxeroCalculatorInputKey) =>
		calculator.fields.find((field) => field.key === key)?.value ?? auxeroCalculatorInitial[key];
	const summaryLabel = (key: AuxeroCalculatorSummaryRow['key'], fallback: string) =>
		calculator.summaryRows.find((row) => row.key === key)?.label ?? fallback;

	let values = $state<Record<AuxeroCalculatorInputKey, number>>({
		dutyRate: fieldValue('dutyRate'),
		prep: fieldValue('prep'),
		price: fieldValue('price'),
		transport: fieldValue('transport'),
		vatRate: fieldValue('vatRate')
	});

	const totals = $derived.by(() =>
		calculateAuxeroCalculatorTotals({
			dutyRate: values.dutyRate,
			prep: values.prep,
			price: values.price,
			transport: values.transport,
			vatRate: values.vatRate
		})
	);
	const totalLabel = $derived(formatEur(totals.total));
	const summaryRows = $derived<AuxeroCalculatorSummaryRow[]>([
		{ key: 'price', label: summaryLabel('price', 'Цена на автомобила'), value: values.price },
		{ key: 'transport', label: summaryLabel('transport', 'Транспорт'), value: values.transport },
		{ key: 'duty', label: summaryLabel('duty', 'Мито'), value: totals.duty },
		{ key: 'vat', label: summaryLabel('vat', 'ДДС'), value: totals.vat },
		{ key: 'prep', label: summaryLabel('prep', 'Подготовка и регистрация'), value: values.prep }
	]);

	const setNumberValue = (key: AuxeroCalculatorInputKey, event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		const next = input.valueAsNumber;

		values[key] = Number.isFinite(next) ? next : 0;
	};
</script>

<div class="lg-grid-cols-1 grid grid-cols-2 gap-40" data-eliqauto-calculator>
	<div class="border-box">
		<p class="h3 mb-28">Изчисли ориентировъчната крайна цена</p>
		<form action="#" class="calculate-form" novalidate>
			<div class="grid grid-cols-1 gap-15">
				{#each calculator.fields as field (field.key)}
					<div>
						<p class="mb-8">
							{field.label}
							{#if field.mutedLabel}
								<span class="text-muted">{field.mutedLabel}</span>
							{/if}
						</p>
						<input
							aria-label={field.label}
							class={inputClass(field.active)}
							data-eliqauto-calc-input={field.key}
							min={field.min}
							name={field.name}
							step={field.step}
							type="number"
							value={values[field.key]}
							oninput={(event) => setNumberValue(field.key, event)}
						/>
					</div>
				{/each}
			</div>
		</form>
	</div>
	<div class="border-box">
		<p class="h3 mb-8">{calculator.title}</p>
		<p class="mb-10">
			<span class="text-56 font-weight-600" data-eliqauto-calc-output="total">
				{totalLabel}
			</span>
		</p>
		<p class="h5 mb-28 capitalize">{calculator.totalNote}</p>
		<div class="divider mb-28 w-full"></div>
		<p class="h4 mb-20">{calculator.subtitle}</p>
		<div class="mb-28 flex flex-col gap-18">
			{#each summaryRows as row (row.key)}
				<p class="flex justify-between gap-8">
					<span class="h7 text-secondary">{row.label}</span>
					<span class="h7" data-eliqauto-calc-output={row.key}>{formatEur(row.value)}</span>
				</p>
			{/each}
		</div>
		<div class="divider mb-28 w-full"></div>
		<div class="mb-16 flex justify-between gap-8">
			<p class="h4">{calculator.totalRowLabel}</p>
			<p class="h4" data-eliqauto-calc-output="totalSmall">{totalLabel}</p>
		</div>
		<a
			href={resolve(calculator.ctaHref as '/')}
			class="btn btn-primary btn-large font-weight-600 w-full"
		>
			{calculator.ctaLabel}
		</a>
	</div>
</div>

<style>
	@media (max-width: 767.98px) {
		[data-eliqauto-calculator] {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			gap: 10px;
			min-width: 0;
		}

		[data-eliqauto-calculator] :global(.border-box) {
			width: 100%;
			min-width: 0;
			border-color: transparent;
			border-radius: 8px;
			background: var(--bc-surface-soft);
			padding: 17px;
		}

		[data-eliqauto-calculator] :global(.border-box:last-child) {
			border-color: #111111;
			background: #111111;
			color: #ffffff;
		}

		[data-eliqauto-calculator] :global(.border-box:last-child p),
		[data-eliqauto-calculator] :global(.border-box:last-child span),
		[data-eliqauto-calculator] :global(.border-box:last-child .h3),
		[data-eliqauto-calculator] :global(.border-box:last-child .h4),
		[data-eliqauto-calculator] :global(.border-box:last-child .h5),
		[data-eliqauto-calculator] :global(.border-box:last-child .h7) {
			color: inherit;
		}

		[data-eliqauto-calculator] :global(.border-box:last-child .text-secondary) {
			color: rgb(255 255 255 / 0.68);
		}

		[data-eliqauto-calculator] :global(.border-box:last-child .text-56),
		[data-eliqauto-calculator] :global(.border-box:last-child [data-eliqauto-calc-output='total']) {
			color: var(--bc-accent-on-dark);
		}

		[data-eliqauto-calculator] :global(.border-box:last-child .divider) {
			background: rgb(255 255 255 / 0.18);
		}

		[data-eliqauto-calculator] :global(.border-box > .h3) {
			margin-bottom: 14px;
			font-size: 22px;
			font-weight: 700;
			line-height: 28px;
		}

		[data-eliqauto-calculator] :global(.calculate-form) {
			width: 100%;
			min-width: 0;
		}

		[data-eliqauto-calculator] :global(.calculate-form > .grid) {
			gap: 11px;
		}

		[data-eliqauto-calculator] :global(.calculate-form p),
		[data-eliqauto-calculator] :global(.h7) {
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
		}

		[data-eliqauto-calculator] :global(input) {
			width: 100%;
			height: 48px;
			border-radius: 8px;
			font-size: 16px;
			line-height: 22px;
			padding: 0 13px;
		}

		[data-eliqauto-calculator] :global(.text-56) {
			font-size: 36px;
			line-height: 42px;
		}

		[data-eliqauto-calculator] :global(.h5) {
			margin-bottom: 18px;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
		}

		[data-eliqauto-calculator] :global(.divider) {
			margin-bottom: 18px;
		}

		[data-eliqauto-calculator] :global(.mb-28.flex.flex-col) {
			gap: 11px;
			margin-bottom: 18px;
		}

		[data-eliqauto-calculator] :global(.btn) {
			min-height: 50px;
			border-radius: 8px;
		}

		[data-eliqauto-calculator] :global(.border-box:last-child .btn) {
			border-color: var(--bc-accent);
			background: var(--bc-accent);
			color: var(--bc-accent-contrast);
		}
	}
</style>
