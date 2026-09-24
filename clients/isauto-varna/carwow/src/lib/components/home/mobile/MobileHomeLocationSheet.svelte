<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
				<span>{i18n.t('copy.cb9410729d40')}</span>
				<strong id="mh-location-title">{i18n.dealer('locationShort')}</strong>
			</div>
			<button type="button" aria-label={i18n.t('copy.1ef1a425356f')} onclick={() => (open = false)}>
				<X size={19} strokeWidth={2.5} />
			</button>
		</header>

		<div class="mh-location-sheet__map" aria-hidden="true">
			<span class="mh-location-sheet__pin">
				<MapPin size={24} strokeWidth={2.5} />
			</span>
			<span>{i18n.dealer('city')}</span>
			<strong>{i18n.dealer('address')}</strong>
		</div>

		<p>{i18n.dealer('address')}</p>

		<div class="mh-location-sheet__actions">
			<a class="is-primary" href={i18n.href(mapHref)} target="_blank" rel="external noreferrer">
				<Navigation size={16} strokeWidth={2.4} aria-hidden="true" />
				{i18n.t('copy.d0f804364b2c')}
			</a>
			<a href={i18n.href(phoneHref)}>{i18n.t('copy.d40e5119596a')}</a>
		</div>
	</div>
</MobileDrawer>
