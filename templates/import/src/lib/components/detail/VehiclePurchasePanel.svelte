<script lang="ts">
	import { formatMoney } from '$lib/i18n/formatting';
	import { linkHref } from '$lib/utils/links';
	import { Tabs } from 'bits-ui';
	import Phone from '@lucide/svelte/icons/phone';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import type { AuxeroVehicleDetailData } from '$lib/server/vehicle-detail';
	import { site } from '$lib/config/site';
	import { dealerCopy } from '$lib/config/dealer-copy';
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
</script>

<section class="purchase-panel" aria-label={english ? 'Price and viewing' : 'Цена и оглед'}>
	<Tabs.Root value="cash">
		<Tabs.List class="purchase-tabs" aria-label={english ? 'Payment options' : 'Начин на плащане'}>
			<Tabs.Trigger value="cash" class="purchase-tab"
				>{english ? 'Cash price' : 'В брой'}</Tabs.Trigger
			>
			{#if estimate}<Tabs.Trigger value="finance" class="purchase-tab"
					>{english ? 'Financing' : 'Финансиране'}</Tabs.Trigger
				>{/if}
		</Tabs.List>
		<Tabs.Content value="cash" class="purchase-content">
			<div class="purchase-price">
				<span>{english ? 'Vehicle price' : 'Цена на автомобила'}</span><strong
					>{detail.priceLabel}</strong
				>
			</div>
			{#if !english && detail.priceBgn}<p class="purchase-secondary-price">
					{detail.priceBgn}
				</p>{/if}
			{#if estimate}<a class="purchase-finance-link" href="#vehicle-finance"
					>{money(estimate.monthly)}{english
						? '/mo. · Calculate payment'
						: '/мес. · Изчисли вноска'}<ArrowRight size={16} aria-hidden="true" /></a
				>{/if}
		</Tabs.Content>
		{#if estimate}<Tabs.Content value="finance" class="purchase-content">
				<div class="purchase-price">
					<span>{english ? 'Illustrative monthly payment' : 'Ориентировъчна месечна вноска'}</span
					><strong>{money(estimate.monthly)}<small>{english ? '/mo.' : '/мес.'}</small></strong>
				</div>
				<dl class="purchase-terms">
					<div>
						<dt>{english ? 'Term' : 'Срок'}</dt>
						<dd>{site.finance.months} {english ? 'months' : 'месеца'}</dd>
					</div>
					<div>
						<dt>{english ? 'Down payment' : 'Първоначална вноска'}</dt>
						<dd>{site.finance.downPaymentPercent}%</dd>
					</div>
					<div>
						<dt>{english ? 'Annual interest' : 'Годишна лихва'}</dt>
						<dd>{site.finance.annualRate}%</dd>
					</div>
				</dl>
				<a class="purchase-finance-link" href="#vehicle-finance"
					>{english ? 'Adjust the calculation' : 'Промени изчислението'}<ArrowRight
						size={16}
						aria-hidden="true"
					/></a
				>
				<p class="purchase-note">
					{english
						? 'Illustrative calculation, not a credit offer. Fees and insurance are not included.'
						: 'Примерно изчисление, не кредитна оферта. Без такси и застраховки.'}
				</p>
			</Tabs.Content>{/if}
	</Tabs.Root>
	<div class="purchase-actions">
		<Action size="primary" onclick={oninquiry}
			>{english ? 'Enquire about this car' : 'Запитване за автомобила'}<ArrowRight
				size={18}
				aria-hidden="true"
			/></Action
		>
		<Action href={site.contact.phoneHref} variant="strong"
			><Phone size={18} aria-hidden="true" />{site.contact.phone}</Action
		>
	</div>
	<div class="purchase-dealer">
		<strong>{site.identity.name}</strong>
		<p>{dealerCopy[english ? 'en' : 'bg'].appointment}</p>
		<a href={linkHref(site.contact.mapHref)} target="_blank" rel="noreferrer"
			><MapPin size={18} aria-hidden="true" /><span>{site.contact.address}</span></a
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
		font-size: var(--bc-text-label);
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
	.purchase-dealer {
		display: grid;
		gap: var(--bc-space-2);
		border-top: 1px solid var(--bc-border);
		margin-top: var(--bc-space-5);
		padding-top: var(--bc-space-5);
	}
	.purchase-dealer > strong {
		font: var(--bc-weight-heading) var(--bc-text-h6)/1.3 var(--bc-font-heading);
	}
	.purchase-dealer p {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
		margin: 0;
	}
	.purchase-dealer a {
		display: flex;
		align-items: start;
		gap: var(--bc-space-2);
		font-size: var(--bc-text-label);
		color: var(--bc-copy);
		text-decoration: none;
	}
	.purchase-dealer a :global(svg) {
		flex-shrink: 0;
		margin-top: var(--bc-space-1);
	}
	.purchase-dealer a:hover span {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
</style>
