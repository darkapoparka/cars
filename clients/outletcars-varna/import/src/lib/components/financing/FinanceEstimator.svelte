<script lang="ts">
	import { formatMoney } from '$lib/i18n/formatting';
	import { assetHref } from '$lib/utils/assets';
	import { estimateFinance } from '$lib/domain/finance';
	import { site } from '$lib/config/site';
	import Action from '$lib/components/common/Action.svelte';
	let {
		initialPrice = 30000,
		english = false,
		banner,
		inquiryHref = '/contact?service=financing'
	}: { initialPrice?: number; english?: boolean; banner?: string; inquiryHref?: string } = $props();
	// svelte-ignore state_referenced_locally
	let price = $state(initialPrice);
	// svelte-ignore state_referenced_locally
	let downPayment = $state((initialPrice * site.finance.downPaymentPercent) / 100);
	let months = $state(site.finance.months);
	let annualRate = $state(site.finance.annualRate);
	const estimate = $derived(estimateFinance({ price, downPayment, months, annualRate }));
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

<section
	class="site-panel finance-estimator"
	aria-label={english ? 'Monthly payment calculator' : 'Калкулатор за месечна вноска'}
>
	{#if banner}<img
			class="finance-estimator__banner"
			src={assetHref(banner)}
			alt=""
			width="1536"
			height="512"
			loading="lazy"
		/>{/if}
	<h2>{english ? 'Calculate your payment' : 'Изчисли месечна вноска'}</h2>
	<div class="site-fields">
		<label class="site-field"
			><span>{english ? 'Vehicle price' : 'Цена на автомобила'} ({site.locale.currency})</span
			><input
				type="number"
				inputmode="decimal"
				min="0"
				max="10000000"
				step="100"
				bind:value={price}
			/></label
		>
		<label class="site-field"
			><span>{english ? 'Down payment' : 'Първоначална вноска'} ({site.locale.currency})</span
			><input
				type="number"
				inputmode="decimal"
				min="0"
				max={price}
				step="100"
				bind:value={downPayment}
			/></label
		>
		<label class="site-field"
			><span>{english ? 'Term (months)' : 'Срок (месеци)'}</span><select bind:value={months}
				>{#each [12, 24, 36, 48, 60, 72, 84, 96] as term (term)}<option value={term}>{term}</option
					>{/each}</select
			></label
		>
		<label class="site-field"
			><span>{english ? 'Annual interest (%)' : 'Годишна лихва (%)'}</span><input
				type="number"
				inputmode="decimal"
				min="0"
				max="100"
				step="0.1"
				bind:value={annualRate}
			/></label
		>
	</div>
	<div aria-live="polite" aria-atomic="true">
		{#if estimate}<dl>
				<div>
					<dt>{english ? 'Financed amount' : 'Финансирана сума'}</dt>
					<dd>{money(estimate.financed)}</dd>
				</div>
				<div>
					<dt>{english ? 'Total including down payment' : 'Общо с първоначалната вноска'}</dt>
					<dd>{money(estimate.total)}</dd>
				</div>
				<div class="finance-estimator__total">
					<dt>{english ? 'Estimated monthly payment' : 'Ориентировъчна месечна вноска'}</dt>
					<dd>{money(estimate.monthly)}</dd>
				</div>
			</dl>
		{:else}<p class="site-form-error">
				{english
					? 'Check the price, down payment, term and interest rate.'
					: 'Провери цената, първоначалната вноска, срока и лихвата.'}
			</p>{/if}
	</div>
	<p class="site-form-note">
		{english
			? 'Illustrative calculation, not a credit offer. Fees and insurance are not included; the lender confirms the final terms.'
			: 'Примерно изчисление, не кредитна оферта. Такси и застраховки не са включени; кредиторът потвърждава крайните условия.'}
	</p>
	<Action href={inquiryHref}>{english ? 'Ask about financing' : 'Запитване за финансиране'}</Action>
</section>

<style>
	.finance-estimator__banner {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--bc-radius-card);
	}
	.finance-estimator {
		display: grid;
		gap: var(--bc-space-5);
		align-content: start;
	}
	.finance-estimator > h2 {
		margin-bottom: 0;
	}
	dl {
		display: grid;
		gap: var(--bc-space-3);
		margin: 0;
	}
	dl > div {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--bc-space-4);
	}
	dt {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	dd {
		margin: 0;
		font-weight: var(--bc-weight-heading);
		white-space: nowrap;
	}
	.finance-estimator__total {
		border-top: 1px solid var(--bc-border);
		padding-top: var(--bc-space-4);
	}
	.finance-estimator__total dd {
		color: var(--bc-accent);
		font: var(--bc-weight-heading) 2rem/1.2 var(--bc-font-heading);
	}
	@media (min-width: 768px) {
		dt,
		dd {
			font-size: var(--bc-text-body-lg);
		}
		dd {
			font-variant-numeric: tabular-nums;
		}
		.finance-estimator__total {
			border: 0;
			border-radius: var(--bc-radius-control);
			padding: var(--bc-space-4);
			background: var(--bc-bg-strong);
		}
		.finance-estimator__total dt {
			color: var(--bc-ink);
			font-weight: var(--bc-weight-heading);
		}
	}
</style>
