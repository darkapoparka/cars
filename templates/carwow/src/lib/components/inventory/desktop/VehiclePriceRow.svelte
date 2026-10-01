<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import type { InventoryListVehicle } from '$lib/types/inventory';

	let { vehicle }: { vehicle: InventoryListVehicle } = $props();

	const displayPrice = $derived(vehicle.priceEur.replace(/\s*EUR\b/, ' €'));
</script>

<div class="h6 card-box__price mb-15">
	<span class="daynight-card-price__stack">
		<span class="daynight-card-price__value">{displayPrice}</span>
		<span class="daynight-card-price__monthly">{i18n.spec(vehicle.monthly)}</span>
	</span>
	<a
		href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
		class="daynight-card-price__link"
		aria-label={i18n.t('pattern.db06e7c6718a', { v0: vehicle.shortTitle })}
		title={i18n.t('copy.0e6bbe909038')}
	>
		<svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
			<path d="M4.25 10H15.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<path
				d="M10.75 5.5L15.25 10L10.75 14.5"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</a>
</div>

<style>
	.card-box__price {
		align-items: flex-end;
		column-gap: 12px;
		display: flex;
		justify-content: space-between;
		min-height: 52px;
	}

	.daynight-card-price__stack {
		align-items: flex-start;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.daynight-card-price__value {
		color: #101828;
		font-size: var(--sa-text-2xl);
		font-weight: var(--sa-weight-strong);
		letter-spacing: -0.025em;
		line-height: 1.15;
		white-space: nowrap;
	}

	.daynight-card-price__monthly {
		color: #47515b;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-regular);
		letter-spacing: 0;
		line-height: 1.2;
		white-space: nowrap;
	}

	.daynight-card-price__link {
		align-items: center;
		background: #050505;
		border-radius: 999px;
		color: #fff;
		display: inline-flex;
		flex: 0 0 32px;
		height: 32px;
		justify-content: center;
		text-decoration: none;
		transition: background-color 140ms ease;
		width: 32px;
	}

	.daynight-card-price__link:hover {
		background: var(--desktop-action-hover);
	}

	.daynight-card-price__link:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}

	.daynight-card-price__link svg {
		height: 17px;
		width: 17px;
	}
</style>
