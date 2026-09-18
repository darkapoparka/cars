<script lang="ts">
	import { resolve } from '$app/paths';
	import type { InventoryListVehicle } from '$lib/types/inventory';

	let { vehicle }: { vehicle: InventoryListVehicle } = $props();

	const displayPrice = $derived(vehicle.priceEur.replace(/\s*EUR\b/, ' €'));
</script>

<div class="h6 card-box__price mb-15">
	<span class="daynight-card-price__stack">
		<span class="daynight-card-price__value">{displayPrice}</span>
		<span class="daynight-card-price__monthly">{vehicle.monthly}</span>
	</span>
	<a
		href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
		class="daynight-card-price__link"
		aria-label={`Виж ${vehicle.shortTitle}`}
		title="Виж автомобила"
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
		align-items: flex-end !important;
		column-gap: 12px !important;
		display: flex !important;
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
		font-size: var(--sa-text-panel-title);
		font-weight: var(--sa-weight-strong);
		letter-spacing: -0.025em;
		line-height: 0.98;
		white-space: nowrap;
	}

	.daynight-card-price__monthly {
		color: #667085;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-semibold);
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
		transition:
			background-color 140ms ease,
			transform 140ms ease;
		width: 32px;
	}

	.daynight-card-price__link:hover {
		background: #b00000;
		transform: translateX(1px);
	}

	.daynight-card-price__link:focus-visible {
		outline: 2px solid #b00000;
		outline-offset: 3px;
	}

	.daynight-card-price__link svg {
		height: 17px;
		width: 17px;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
	) {
		align-items: flex-end !important;
		column-gap: 12px !important;
		display: flex !important;
		justify-content: space-between !important;
		min-height: 52px !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__value
	) {
		color: #101828 !important;
		font-size: var(--sa-text-panel-title) !important;
		font-weight: var(--sa-weight-strong) !important;
		letter-spacing: -0.025em !important;
		line-height: 0.98 !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__monthly
	) {
		color: #667085 !important;
		font-size: var(--sa-text-caption) !important;
		font-weight: var(--sa-weight-semibold) !important;
		line-height: 1.2 !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__link
	) {
		background: #050505 !important;
		color: #fff !important;
		flex: 0 0 32px !important;
		height: 32px !important;
		width: 32px !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__link:hover
	) {
		background: #b00000 !important;
	}
</style>
