<script lang="ts">
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	const mapUrl =
		'https://www.google.com/maps/search/?api=1&query=%D0%A1%D0%BF%D0%B0%D1%80%D1%82%D0%B0%D0%BA%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%2086%2C%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F';
	const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
		`${daynightSite.mapLabel}, ${daynightSite.location}`
	)}&output=embed`;
</script>

<div class="md-flex-col md-items-start mb-16 flex items-center justify-between gap-16">
	<div>
		<p class="h4 mb-12">Локация</p>
		<p class="flex items-center gap-8">
			<img
				class="h-16 w-16"
				src="/assets/icons/MapPin.svg"
				alt=""
				aria-hidden="true"
				decoding="async"
				loading="lazy"
			/>
			{daynightSite.location}
		</p>
	</div>

	<a href={mapUrl} class="text-underline text-highlight text-sm" target="_blank" rel="noopener">
		Виж локация
	</a>
</div>

<LazyMapEmbed
	class="widget-gg-map radius-16 mb-40 flex overflow-hidden"
	title="Карта до VOIVODOV AUTO & ANTONIO Пловдив"
	src={mapEmbedSrc}
	height="520px"
	iframeStyle="border:0;width: 100%;"
/>
