<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	import { compactMobileDistance, compactMobileTransmission, shortFuel } from '$lib/utils/format';
	import type { HomeMobileVehicle } from '$lib/types/home';
	const i18n = getI18n();
	let { vehicle }: { vehicle: HomeMobileVehicle } = $props();
</script>

<span class="vehicle-stats" role="list" aria-label={i18n.t('copy.e802379d67a7')}>
	<span
		class="vehicle-stats__badge"
		role="listitem"
		aria-label={i18n.distance(vehicle.mileage)}
		title={i18n.distance(vehicle.mileage)}
	>
		<span>{compactMobileDistance(i18n.distance(vehicle.mileage))}</span>
	</span>
	<span class="vehicle-stats__badge" role="listitem"><span>{vehicle.year}</span></span>
	<span class="vehicle-stats__badge" role="listitem" aria-label={i18n.spec(vehicle.fuel)}>
		<span>{shortFuel(vehicle.fuel, i18n.locale)}</span>
	</span>
	<span
		class="vehicle-stats__badge"
		role="listitem"
		aria-label={i18n.spec(vehicle.transmission)}
		title={i18n.spec(vehicle.transmission)}
	>
		<span>{compactMobileTransmission(i18n.spec(vehicle.transmission))}</span>
	</span>
</span>

<style>
	.vehicle-stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
	}
	.vehicle-stats__badge {
		display: flex;
		min-width: 0;
		min-height: 25px;
		align-items: center;
		justify-content: center;
		border-radius: 7px;
		background: #fff;
		padding: 4px 3px;
		color: #4e5965;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-medium);
		line-height: 1.2;
	}
	.vehicle-stats__badge span {
		min-width: 0;
		color: inherit;
		font: inherit;
		line-height: inherit;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
