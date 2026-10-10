<script lang="ts">
	import { financeEstimatorCopy } from '$lib/content/finance-estimator';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { formatMoney } from '$lib/i18n/formatting';
	import { assetHref } from '$lib/utils/assets';
	import { estimateFinance } from '$lib/domain/finance';
	import { site } from '$lib/config/site';
	import Action from '$lib/components/common/Action.svelte';
	let {
		initialPrice = 30000,
		english = false,
		layout = 'full',
		banner,
		inquiryHref = '/contact?service=financing'
	}: {
		initialPrice?: number;
		english?: boolean;
		layout?: 'full' | 'sidebar';
		banner?: string;
		inquiryHref?: string;
	} = $props();
	const copy = $derived(financeEstimatorCopy[english ? 'en' : 'bg']);
	const termLabelId = $props.id();
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
		{copy.noScript}
		<Action href="/contact">{copy.requestEstimate}</Action>
	</p></noscript
>

<section
	class="site-panel finance-estimator"
	class:finance-estimator--sidebar={layout === 'sidebar'}
	aria-label={copy.label}
>
	{#if banner}<img
			class="finance-estimator__banner"
			src={assetHref(banner)}
			alt=""
			width="1536"
			height="512"
			loading="lazy"
		/>{/if}
	<h2>{copy.title}</h2>
	<div class="site-fields">
		<label class="site-field" class:site-field--wide={layout === 'sidebar'}
			><span>{copy.price} ({site.locale.currency})</span><input
				type="number"
				inputmode="decimal"
				min="0"
				max="10000000"
				step="100"
				bind:value={price}
			/></label
		>
		<label class="site-field" class:site-field--wide={layout === 'sidebar'}
			><span>{copy.deposit} ({site.locale.currency})</span><input
				type="number"
				inputmode="decimal"
				min="0"
				max={price}
				step="100"
				bind:value={downPayment}
			/></label
		>
		<label class="site-field finance-estimator__term"
			><span id={layout === 'sidebar' ? termLabelId : undefined}>{copy.term}</span><select
				bind:value={months}
				aria-labelledby={layout === 'sidebar' ? termLabelId : undefined}
				>{#each [12, 24, 36, 48, 60, 72, 84, 96] as term (term)}<option value={term}>{term}</option
					>{/each}</select
			>
			{#if layout === 'sidebar'}
				<ChevronDown size={18} aria-hidden="true" class="finance-estimator__chevron" />
			{/if}</label
		>
		<label class="site-field"
			><span>{copy.interest}</span><input
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
					<dt>{copy.financed}</dt>
					<dd>{money(estimate.financed)}</dd>
				</div>
				<div>
					<dt>{copy.total}</dt>
					<dd>{money(estimate.total)}</dd>
				</div>
				<div class="finance-estimator__total">
					<dt>{copy.monthly}</dt>
					<dd>{money(estimate.monthly)}</dd>
				</div>
			</dl>
		{:else}<p class="site-form-error">
				{copy.invalid}
			</p>{/if}
	</div>
	<p class="site-form-note">
		{copy.disclosure}
	</p>
	<Action href={inquiryHref}>{copy.enquiry}</Action>
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
	.finance-estimator--sidebar {
		gap: var(--bc-space-4);
	}
	.finance-estimator--sidebar .site-field:not(.site-field--wide) {
		grid-row: span 2;
		grid-template-rows: subgrid;
	}
	.finance-estimator--sidebar dl > div {
		gap: var(--bc-space-3);
	}
	.finance-estimator--sidebar dt,
	.finance-estimator--sidebar dd {
		font-size: var(--bc-text-label);
	}
	.finance-estimator--sidebar .finance-estimator__total {
		display: grid;
		gap: var(--bc-space-2);
	}
	.finance-estimator--sidebar .finance-estimator__total dd {
		font-size: var(--bc-text-h3);
	}
	.finance-estimator :global(.finance-estimator__chevron) {
		display: none;
	}
	@media (min-width: 768px) {
		.finance-estimator__banner {
			border-radius: var(--bc-desktop-media-radius);
		}
		.site-field {
			grid-row: span 2;
			grid-template-rows: subgrid;
		}
		.finance-estimator--sidebar .finance-estimator__term select {
			grid-column: 1;
			grid-row: 2;
			appearance: none;
			padding-inline-end: calc(var(--bc-space-4) + var(--bc-space-6));
		}
		.finance-estimator--sidebar :global(.finance-estimator__chevron) {
			display: block;
			grid-column: 1;
			grid-row: 2;
			align-self: center;
			justify-self: end;
			margin-inline-end: var(--bc-space-4);
			color: var(--bc-copy);
			pointer-events: none;
		}
		.finance-estimator--sidebar input[type='number'] {
			appearance: textfield;
		}
		.finance-estimator--sidebar input[type='number']::-webkit-inner-spin-button,
		.finance-estimator--sidebar input[type='number']::-webkit-outer-spin-button {
			margin: 0;
			appearance: none;
		}
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

	@media (max-width: 767.98px) {
		.finance-estimator {
			gap: var(--bc-space-4);
		}
		.site-field input,
		.site-field select {
			height: var(--bc-control-height-chip);
			min-height: var(--bc-control-height-chip);
			padding-block: 0;
			font-size: var(--bc-text-control);
			line-height: var(--bc-leading-control);
		}
		.finance-estimator > h2 {
			order: -2;
			font-size: var(--bc-text-h4);
		}
		.finance-estimator > [aria-live] {
			order: -1;
		}
		.finance-estimator__total {
			order: -1;
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: center;
			gap: var(--bc-space-3);
			padding: var(--bc-space-3);
			border: 0;
			border-radius: var(--bc-radius-control);
			background: var(--bc-bg-strong);
		}
		.finance-estimator__total dt {
			color: var(--bc-ink);
			font-size: var(--bc-text-body);
		}
		.finance-estimator__total dd {
			font-size: var(--bc-mobile-page-title);
		}
		.site-fields {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--bc-space-3);
		}
		.site-field {
			grid-row: span 2;
			grid-template-rows: subgrid;
		}
		.site-fields > label:nth-child(-n + 2) {
			grid-column: 1 / -1;
		}
	}
</style>
