<script lang="ts">
	import { MapPin, Navigation, X } from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import MobileDrawer from '$lib/components/shared/mobile/MobileDrawer.svelte';
	let { open = $bindable(false) }: { open?: boolean } = $props();
	const mapHref = daynightSite.mapUrl;
	const phoneHref = daynightSite.phoneHref;
</script>

<MobileDrawer bind:open labelledBy="mh-location-title">
	<div class="mh-location-sheet mh-sheet-scope">
		<header>
			<div>
				<span>Локация</span>
				<strong id="mh-location-title">{daynightSite.locationShort}</strong>
			</div>
			<button type="button" aria-label="Затвори" onclick={() => (open = false)}>
				<X size={19} strokeWidth={2.5} />
			</button>
		</header>

		<div class="mh-location-sheet__map" aria-hidden="true">
			<span class="mh-location-sheet__pin">
				<MapPin size={24} strokeWidth={2.5} />
			</span>
			<span>{daynightSite.city}</span>
			<strong>{daynightSite.location}</strong>
		</div>

		<p>{daynightSite.location}</p>

		<div class="mh-location-sheet__actions">
			<a class="is-primary" href={mapHref} target="_blank" rel="external noreferrer">
				<Navigation size={16} strokeWidth={2.4} aria-hidden="true" />
				Отвори карта
			</a>
			<a href={phoneHref}>Обади се</a>
		</div>
	</div>
</MobileDrawer>
