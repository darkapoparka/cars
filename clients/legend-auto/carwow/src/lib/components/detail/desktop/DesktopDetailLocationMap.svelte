<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import LazyMapEmbed from '$lib/components/shared/map/LazyMapEmbed.svelte';
	import { daynightSite } from '$lib/data/daynight-site';

	const mapUrl = daynightSite.mapUrl;
	const mapEmbedSrc = daynightSite.mapEmbedSrc;
</script>

<div class="md-flex-col md-items-start mb-16 flex items-center justify-between gap-16">
	<div>
		<p class="h4 mb-12">{i18n.t('copy.cb9410729d40')}</p>
		<p class="flex items-center gap-8">
			<img
				class="h-16 w-16"
				src={i18n.asset('/assets/icons/MapPin.svg')}
				alt=""
				aria-hidden="true"
				decoding="async"
				loading="lazy"
			/>
			{i18n.dealer('address')}
		</p>
	</div>

	<a
		href={i18n.href(mapUrl)}
		class="text-underline text-highlight text-sm"
		target="_blank"
		rel="noopener"
	>
		{i18n.t('copy.d78ccda3011d')}
	</a>
</div>

<LazyMapEmbed
	class="widget-gg-map radius-16 mb-40 flex overflow-hidden"
	title={i18n.t('pattern.69c703e84da6', { v0: daynightSite.shortName, v1: i18n.dealer('city') })}
	src={i18n.asset(mapEmbedSrc)}
	height="520px"
	iframeStyle="border:0;width: 100%;"
/>
