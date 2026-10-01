<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import { getDayNightVehicleAvailability } from '$lib/data/daynight-vehicles';

	let { vehicle }: { vehicle: InventoryListVehicle } = $props();

	const badge = $derived(
		vehicle.badges.find((value) => normalizeBadgeLabel(value) !== 'vip') ?? vehicle.badges[0] ?? ''
	);

	function normalizeBadgeLabel(value: string) {
		return value.trim().toLocaleLowerCase('bg-BG');
	}
</script>

{#if badge}
	<p class="highlight" class:incoming={getDayNightVehicleAvailability(vehicle) === 'incoming'}>
		{i18n.spec(badge)}
	</p>
{:else}
	<p></p>
{/if}

<style>
	.highlight {
		background: #fff;
		color: #171b1e;
		border-radius: 6px;
		font: var(--sa-weight-semibold) var(--sa-text-caption)/1.4 var(--sa-font);
		padding: 5px 9px;
		margin: 0;
	}
	.highlight.incoming {
		background: #171b1e;
		color: #fff;
	}
</style>
