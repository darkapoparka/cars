<script lang="ts">
	import type { AuxeroVehicleDetailOverviewItem } from '$lib/auxero/detail';

	let { items }: { items: AuxeroVehicleDetailOverviewItem[] } = $props();
</script>

<ul class="car-overview-list-style2">
	{#each items as item (item.label)}
		<li class="grid grid-cols-2">
			<p class="flex items-center gap-8">
				<img class="h-28 w-28" src={`/assets/icons/${item.icon}`} alt={item.label} />
				<span class="h7 text-secondary">{item.label}:</span>
			</p>
			<span class="h7 font-weight-500 pl-28">{item.value}</span>
		</li>
	{/each}
</ul>
