<script lang="ts">
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';

	let {
		map
	}: {
		map: NonNullable<AuxeroInventoryDesktopData['map']>;
	} = $props();

	const externalHref = (href: string) => ({ href });
</script>

<div
	id="map"
	class="eliqauto-map-fallback"
	data-map-zoom="16"
	data-map-scroll="true"
	data-eliqauto-map-selected={map.locations.length}
>
	<div class="eliqauto-map-fallback__inner">
		<p class="h4 mb-12">{map.title}</p>
		<p class="text-secondary mb-8">{map.address}</p>
		<p class="text-secondary mb-12" data-eliqauto-map-summary={map.summary}>{map.summary}</p>
		{#if map.locations.length}
			<ul class="eliqauto-map-fallback__locations">
				{#each map.locations as location (location.location)}
					<li data-eliqauto-map-location={location.location}>
						<span class="h7 font-weight-600">{location.location}</span>
						<span class="text-secondary">{location.countLabel}</span>
						<span class="text-secondary">{location.samples}</span>
					</li>
				{/each}
			</ul>
		{/if}
		<p class="text-secondary mb-16">{map.appointmentNote}</p>
		<a class="btn btn-medium btn-primary-3 font-weight-600" {...externalHref(map.ctaHref)}
			>{map.ctaLabel}</a
		>
	</div>
</div>
