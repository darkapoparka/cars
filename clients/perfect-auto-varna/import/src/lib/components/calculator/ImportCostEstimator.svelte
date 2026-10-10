<script lang="ts">
	import { formatMoney } from '$lib/i18n/formatting';
	import { site } from '$lib/config/site';
	import { estimateImportCost } from '$lib/domain/import-cost';
	import Action from '$lib/components/common/Action.svelte';
	let { english = false }: { english?: boolean } = $props();
	let price = $state<number | undefined>(25000);
	let transport = $state<number | undefined>(0);
	let dutyRate = $state<number | undefined>(0);
	let vatRate = $state<number | undefined>(0);
	let prep = $state<number | undefined>(0);
	const totals = $derived(
		estimateImportCost({
			price: price ?? NaN,
			transport: transport ?? NaN,
			dutyRate: dutyRate ?? NaN,
			vatRate: vatRate ?? NaN,
			prep: prep ?? NaN
		})
	);
	const money = (value: number) => formatMoney(value, english ? 'en' : 'bg');
</script>

<noscript
	><p class="site-container site-form-note">
		{english
			? 'Interactive calculations require JavaScript. You can request an estimate using the contact form.'
			: 'Интерактивните изчисления изискват JavaScript. Можеш да заявиш изчисление чрез контактната форма.'}
		<Action href="/contact">{english ? 'Request an estimate' : 'Заяви изчисление'}</Action>
	</p></noscript
>

<div class="import-estimator">
	<div class="import-estimator__mobile-summary">
		<span>{english ? 'Illustrative total' : 'Ориентировъчна крайна цена'}</span><output
			aria-live="polite">{totals ? money(totals.total) : '—'}</output
		>
	</div>
	<section class="site-panel site-stack">
		<h2>{english ? 'Cost assumptions' : 'Данни за изчислението'}</h2>
		<div class="site-fields">
			<label class="site-field"
				><span>{english ? 'Vehicle price' : 'Цена на автомобила'} ({site.locale.currency})</span
				><input type="number" inputmode="decimal" min="0" step="100" bind:value={price} /></label
			>
			<label class="site-field"
				><span>{english ? 'Transport' : 'Транспорт'} ({site.locale.currency})</span><input
					type="number"
					min="0"
					step="50"
					bind:value={transport}
					inputmode="decimal"
				/></label
			>
			<label class="site-field"
				><span>{english ? 'Duty assumption (%)' : 'Въведено мито (%)'}</span><input
					type="number"
					min="0"
					max="100"
					step="0.1"
					bind:value={dutyRate}
					inputmode="decimal"
				/></label
			>
			<label class="site-field"
				><span>{english ? 'VAT assumption (%)' : 'Въведен ДДС (%)'}</span><input
					type="number"
					min="0"
					max="100"
					step="0.1"
					bind:value={vatRate}
					inputmode="decimal"
				/></label
			>
			<label class="site-field site-field--wide"
				><span>{english ? 'Preparation' : 'Подготовка и регистрация'} ({site.locale.currency})</span
				><input type="number" inputmode="decimal" min="0" step="50" bind:value={prep} /></label
			>
		</div>
		<p class="site-form-note">
			{english
				? 'Enter the costs and rates confirmed for the specific vehicle and transaction. Zero is an editable starting value, not a tax exemption.'
				: 'Въведи разходите и ставките, потвърдени за конкретния автомобил и сделка. Нулата е начална стойност за редакция, не освобождаване от данък.'}
		</p>
	</section>
	<section class="site-panel site-stack">
		<h2>{english ? 'Illustrative total' : 'Ориентировъчна крайна цена'}</h2>
		{#if totals}
			<output class="import-estimator__total" aria-live="polite">{money(totals.total)}</output>
			<dl>
				<div>
					<dt>{english ? 'Vehicle' : 'Автомобил'}</dt>
					<dd>{money(price ?? 0)}</dd>
				</div>
				<div>
					<dt>{english ? 'Transport' : 'Транспорт'}</dt>
					<dd>{money(transport ?? 0)}</dd>
				</div>
				<div>
					<dt>{english ? 'Duty' : 'Мито'}</dt>
					<dd>{money(totals.duty)}</dd>
				</div>
				<div>
					<dt>{english ? 'VAT' : 'ДДС'}</dt>
					<dd>{money(totals.vat)}</dd>
				</div>
				<div>
					<dt>{english ? 'Preparation' : 'Подготовка'}</dt>
					<dd>{money(prep ?? 0)}</dd>
				</div>
			</dl>
		{:else}<p role="status">
				{english
					? 'Enter valid non-negative amounts and rates from 0 to 100.'
					: 'Въведи валидни положителни суми и ставки от 0 до 100.'}
			</p>{/if}
		<p class="site-form-note">
			{english
				? 'Illustration only: duty is calculated on the entered price; VAT on price, transport and duty. The actual tax base and applicable charges require confirmation. This is not an offer.'
				: 'Илюстрация: митото се изчислява върху въведената цена, а ДДС върху цената, транспорта и митото. Реалната данъчна основа и приложимите разходи изискват потвърждение. Това не е оферта.'}
		</p>
		<Action href="/contact?service=import-cost"
			>{english ? 'Request a calculation' : 'Заяви изчисление'}</Action
		>
	</section>
</div>

<style>
	.import-estimator {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-6);
		align-items: start;
	}
	.import-estimator__total {
		font: var(--bc-weight-heading) var(--bc-text-h2)/1.2 var(--bc-font-heading);
	}
	dl {
		margin: 0;
		display: grid;
		gap: var(--bc-space-3);
	}
	dl div {
		display: flex;
		justify-content: space-between;
		gap: var(--bc-space-4);
	}
	dt {
		color: var(--bc-muted);
	}
	dd {
		margin: 0;
	}
	@media (max-width: 767.98px) {
		.import-estimator {
			grid-template-columns: 1fr;
		}
	}

	.import-estimator__mobile-summary {
		display: none;
	}
	@media (max-width: 767.98px) {
		.import-estimator {
			gap: var(--bc-space-3);
		}
		.import-estimator__mobile-summary {
			display: grid;
			gap: var(--bc-space-1);
			padding: var(--bc-space-4);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-radius-panel);
			background: var(--bc-white);
		}
		.import-estimator__mobile-summary span {
			color: var(--bc-copy);
			font-size: var(--bc-text-body);
		}
		.import-estimator__mobile-summary output {
			font: var(--bc-weight-heading) var(--bc-mobile-page-title)/var(--bc-mobile-page-title-leading)
				var(--bc-font-heading);
		}
		.import-estimator > section .import-estimator__total {
			display: none;
		}
	}
</style>
