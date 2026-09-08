<script lang="ts">
	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	const mapUrl = daynightSite.mapUrl;
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
	title="Карта до Иво Ауто Варна"
	src={mapEmbedSrc}
	height="520px"
	iframeStyle="border:0;width: 100%;"
/>
