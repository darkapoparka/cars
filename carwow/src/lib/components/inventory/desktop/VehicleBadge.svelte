<script lang="ts">
	import type { InventoryListVehicle } from '$lib/types/inventory';

	let { vehicle, index }: { vehicle: InventoryListVehicle; index: number } = $props();

	const fallbackBadge = $derived(index % 5 === 1 ? 'Добра цена' : '');
	const badge = $derived(
		vehicle.badges.find((value) => normalizeBadgeLabel(value) !== 'vip') ??
			vehicle.badges[0] ??
			fallbackBadge
	);
	const badgeClass = $derived(
		normalizeBadgeLabel(badge) === normalizeBadgeLabel(fallbackBadge) ? 'bg-green' : 'bg-primary-2'
	);

	function normalizeBadgeLabel(value: string) {
		return value.trim().toLocaleLowerCase('bg-BG');
	}
</script>

{#if badge}
	<p class="{badgeClass} highlight text-white">{badge}</p>
{:else}
	<p></p>
{/if}
