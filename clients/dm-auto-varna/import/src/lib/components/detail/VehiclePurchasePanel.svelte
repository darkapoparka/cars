<script lang="ts">
	import { formatMoney } from '$lib/i18n/formatting';
	import { Tabs } from 'bits-ui';
	import Phone from '@lucide/svelte/icons/phone';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import type { AuxeroVehicleDetailData } from '$lib/server/vehicle-detail';
	import { site } from '$lib/config/site';
	import { vehicleInformationCopy, vehiclePurchaseCopy } from '$lib/content/vehicle-information';
	import { estimateFinance } from '$lib/domain/finance';
	import Action from '$lib/components/common/Action.svelte';
	let {
		detail,
		price,
		english = false,
		oninquiry
	}: {
		detail: AuxeroVehicleDetailData;
		price: number;
		english?: boolean;
		oninquiry: () => void;
	} = $props();
	const estimate = $derived(
		site.finance.showEstimates && price > 0
			? estimateFinance({
					price,
					downPayment: (price * site.finance.downPaymentPercent) / 100,
					months: site.finance.months,
					annualRate: site.finance.annualRate
				})
			: null
	);
	const money = (value: number) => formatMoney(value, english ? 'en' : 'bg');
	const copy = $derived(vehiclePurchaseCopy[english ? 'en' : 'bg']);
	const informationCopy = $derived(vehicleInformationCopy[english ? 'en' : 'bg']);
</script>

<section class="purchase-panel" aria-label={copy.label}>
	<Tabs.Root value="cash">
		<Tabs.List class="purchase-tabs" aria-label={copy.paymentOptions}>
			<Tabs.Trigger value="cash" class="purchase-tab">{copy.cash}</Tabs.Trigger>
			{#if estimate}<Tabs.Trigger value="finance" class="purchase-tab"
					>{copy.financing}</Tabs.Trigger
				>{/if}
		</Tabs.List>
		<Tabs.Content value="cash" class="purchase-content">
			<div class="purchase-price">
				<span>{copy.price}</span><strong>{detail.priceLabel}</strong>
			</div>
			{#if !english && detail.priceBgn}<p class="purchase-secondary-price">
					{detail.priceBgn}
				</p>{/if}
			{#if estimate}<a class="purchase-finance-link" href="#vehicle-finance"
					>{money(estimate.monthly)}{copy.monthlyUnit} · {copy.calculatePayment}<ArrowRight
						size={16}
						aria-hidden="true"
					/></a
				>{/if}
		</Tabs.Content>
		{#if estimate}<Tabs.Content value="finance" class="purchase-content">
				<div class="purchase-price">
					<span>{copy.monthly}</span><strong
						>{money(estimate.monthly)}<small>{copy.monthlyUnit}</small></strong
					>
				</div>
				<dl class="purchase-terms">
					<div>
						<dt>{copy.term}</dt>
						<dd>{site.finance.months} {copy.months}</dd>
					</div>
					<div>
						<dt>{copy.deposit}</dt>
						<dd>{site.finance.downPaymentPercent}%</dd>
					</div>
					<div>
						<dt>{copy.interest}</dt>
						<dd>{site.finance.annualRate}%</dd>
					</div>
				</dl>
				<a class="purchase-finance-link" href="#vehicle-finance"
					>{copy.adjust}<ArrowRight size={16} aria-hidden="true" /></a
				>
				<p class="purchase-note">
					{copy.disclosure}
				</p>
			</Tabs.Content>{/if}
	</Tabs.Root>
	<div class="purchase-actions">
		<Action size="primary" onclick={oninquiry}
			>{informationCopy.inquiry}<ArrowRight size={18} aria-hidden="true" /></Action
		>
		<Action href={site.contact.phoneHref} variant="secondary"
			><Phone size={18} aria-hidden="true" />{site.contact.phone}</Action
		>
	</div>
</section>

<style>
	.purchase-panel {
		border: 1px solid var(--bc-border-strong);
		box-shadow: var(--bc-shadow-card);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-6);
		min-width: 0;
	}
	@media (min-width: 768px) {
		.purchase-panel {
			border-color: var(--bc-border);
			border-radius: var(--bc-desktop-card-radius);
			box-shadow: var(--bc-editorial-shadow);
		}
	}
	:global(.purchase-tabs) {
		display: flex;
		gap: var(--bc-space-1);
		border-radius: var(--bc-radius-pill);
		padding: var(--bc-space-1);
		background: var(--bc-control);
	}
	:global(.purchase-tab) {
		flex: 1;
		min-width: 0;
		min-height: var(--bc-control-height-secondary);
		padding: var(--bc-space-2);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: transparent;
		color: var(--bc-copy);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-control);
	}
	:global(.purchase-tab[data-state='active']) {
		background: var(--bc-ink);
		color: var(--bc-white);
	}
	:global(.purchase-content) {
		padding-block: var(--bc-space-6);
	}
	.purchase-price {
		display: grid;
		gap: var(--bc-space-2);
	}
	.purchase-price > span {
		color: var(--bc-copy);
		font-size: var(--bc-text-label);
	}
	.purchase-price > strong {
		color: var(--bc-ink);
		font: var(--bc-weight-heading) var(--bc-text-h3)/1.1 var(--bc-font-heading);
		font-variant-numeric: tabular-nums;
	}
	.purchase-price small {
		margin-left: var(--bc-space-1);
		color: var(--bc-muted);
		font: var(--bc-weight-body) var(--bc-text-control)/var(--bc-leading-control) var(--bc-font-body);
	}

	.purchase-secondary-price {
		margin: var(--bc-space-2) 0 0;
		font-size: var(--bc-text-label);
		color: var(--bc-muted);
	}
	.purchase-finance-link {
		display: inline-flex;
		align-items: center;
		gap: var(--bc-space-2);
		min-height: var(--bc-control-height-compact);
		margin-top: var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-control);
		text-decoration: none;
	}
	.purchase-finance-link:hover {
		color: var(--bc-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.purchase-terms {
		display: grid;
		gap: var(--bc-space-2);
		margin: var(--bc-space-4) 0 0;
		font-size: var(--bc-text-label);
	}
	.purchase-terms > div {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--bc-space-2);
	}
	dt {
		color: var(--bc-muted);
	}
	dd {
		margin: 0;
		font-weight: var(--bc-weight-heading);
	}
	.purchase-note {
		margin: var(--bc-space-2) 0 0;
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
		line-height: 1.4;
	}
	.purchase-actions {
		display: grid;
		gap: var(--bc-space-2);
	}
</style>
