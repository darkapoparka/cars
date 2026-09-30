<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	import DayNightSpecIcon from '$lib/components/shared/icons/DayNightSpecIcon.svelte';
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
		<DayNightSpecIcon name="mileage" size={14} />
		<span>{compactMobileDistance(i18n.distance(vehicle.mileage))}</span>
	</span>
	<span class="vehicle-stats__badge" role="listitem"
		><DayNightSpecIcon name="year" size={14} /><span>{vehicle.year}</span></span
	>
	<span class="vehicle-stats__badge" role="listitem">
		<DayNightSpecIcon name="fuel" size={14} /><span>{shortFuel(vehicle.fuel, i18n.locale)}</span>
	</span>
	<span
		class="vehicle-stats__badge"
		role="listitem"
		aria-label={i18n.spec(vehicle.transmission)}
		title={i18n.spec(vehicle.transmission)}
	>
		<DayNightSpecIcon name="transmission" size={14} />
		<span>{compactMobileTransmission(i18n.spec(vehicle.transmission))}</span>
	</span>
</span>

<style>
	.vehicle-stats {
		display: grid;
		container-type: inline-size;
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
		gap: 4px;
		border-radius: 7px;
		background: #fff;
		padding: 3px;
		color: #4e5965;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-medium);
		line-height: 1.2;
	}
	.vehicle-stats__badge span {
		min-width: 0;
		overflow-wrap: anywhere;
	}
	.vehicle-stats__badge :global(.daynight-spec-icon) {
		flex: 0 0 auto;
		color: #202a35;
	}
	@container (max-width: 180px) {
		.vehicle-stats__badge :global(.daynight-spec-icon) {
			display: none;
		}
	}
	@media (max-width: 359px) {
		.vehicle-stats__badge :global(.daynight-spec-icon) {
			display: none;
		}
	}
</style>
