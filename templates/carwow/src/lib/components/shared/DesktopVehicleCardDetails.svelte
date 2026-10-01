<script lang="ts">
	import { resolve } from '$app/paths';
	import { getI18n } from '$lib/locale/context';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleMetaRow from '$lib/components/inventory/desktop/VehicleMetaRow.svelte';
	import VehiclePriceRow from '$lib/components/inventory/desktop/VehiclePriceRow.svelte';

	let { vehicle, financeLink = false }: { vehicle: InventoryListVehicle; financeLink?: boolean } =
		$props();
	const i18n = getI18n();
</script>

<div class="desktop-vehicle-details">
	<h3 class="card-box__title">
		<a
			href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
			title={vehicle.shortTitle}
		>
			{vehicle.shortTitle}
		</a>
	</h3>
	<p class="desktop-vehicle-details__drivetrain">
		<span>{i18n.spec(vehicle.transmission)}</span><span>{i18n.spec(vehicle.fuel)}</span>
	</p>
	<VehiclePriceRow {vehicle} {financeLink} />
	<div class="desktop-vehicle-details__metadata">
		<VehicleMetaRow {vehicle} styleClass="style2" plain />
	</div>
</div>

<style>
	.desktop-vehicle-details {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
	}
	.card-box__title {
		margin: 0;
		color: var(--sa-ink);
		font: var(--sa-weight-strong) var(--sa-text-lg)/1.3 var(--sa-font);
		letter-spacing: -0.02em;
	}
	.card-box__title a {
		color: inherit;
		font: inherit;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}
	.desktop-vehicle-details__drivetrain {
		display: flex;
		flex-wrap: wrap;
		gap: 0 8px;
		margin: 6px 0 12px;
		color: var(--discovery-muted, #62676e);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.5 var(--sa-font);
	}
	.desktop-vehicle-details__drivetrain span + span::before {
		content: '·';
		margin-right: 8px;
	}
	.desktop-vehicle-details :global(.card-box__price) {
		margin: auto 0 0;
	}
	.desktop-vehicle-details__metadata {
		margin-top: 12px;
	}
	.desktop-vehicle-details a:focus-visible {
		outline: 2px solid var(--desktop-focus, #171b1e);
		outline-offset: 3px;
	}
</style>
