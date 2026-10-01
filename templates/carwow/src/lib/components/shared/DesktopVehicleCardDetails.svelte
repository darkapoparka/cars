<script lang="ts">
	import { resolve } from '$app/paths';
	import { getI18n } from '$lib/locale/context';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehiclePriceRow from '$lib/components/inventory/desktop/VehiclePriceRow.svelte';

	let { vehicle, financeLink = false }: { vehicle: InventoryListVehicle; financeLink?: boolean } =
		$props();
	const i18n = getI18n();
</script>

<div class="desktop-vehicle-details">
	<h3 class="desktop-vehicle-details__title">
		<a
			href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
			title={vehicle.shortTitle}
		>
			{vehicle.shortTitle}
		</a>
	</h3>
	<dl class="desktop-vehicle-details__metadata">
		<dt>{i18n.t('copy.38867d861fa9')}</dt>
		<dd>{vehicle.year}</dd>
		<dt>{i18n.t('copy.69cc064f0636')}</dt>
		<dd>{i18n.distance(vehicle.mileage)}</dd>
		<dt>{i18n.t('inventory.spec.transmission')}</dt>
		<dd>{i18n.spec(vehicle.transmission)}</dd>
		<dt>{i18n.t('copy.b52d6c364219')}</dt>
		<dd>{i18n.spec(vehicle.fuel)}</dd>
	</dl>
	<VehiclePriceRow {vehicle} {financeLink} />
</div>

<style>
	.desktop-vehicle-details {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}
	.desktop-vehicle-details__title {
		min-block-size: 2lh;
		margin: 0;
		color: var(--sa-ink);
		font: var(--sa-weight-strong) var(--sa-text-lg)/1.35 var(--sa-font);
		letter-spacing: -0.02em;
	}
	.desktop-vehicle-details__title a {
		color: inherit;
		font: inherit;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
	.desktop-vehicle-details :global(.card-box__price) {
		margin: auto 0 0;
		padding-top: 16px;
	}
	.desktop-vehicle-details__metadata {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px 12px;
		max-inline-size: 22rem;
		margin: 12px 0 0;
		color: var(--discovery-muted, #62676e);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.5 var(--sa-font);
		letter-spacing: 0;
	}
	.desktop-vehicle-details__metadata dt {
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	.desktop-vehicle-details__metadata dd {
		margin: 0;
		min-width: 0;
		color: inherit;
		font: inherit;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.desktop-vehicle-details a:focus-visible {
		outline: 2px solid var(--desktop-focus, #171b1e);
		outline-offset: 3px;
	}
</style>
