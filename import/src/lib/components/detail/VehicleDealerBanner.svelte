<script lang="ts">
	import ImageLinkBanner from '$lib/components/common/ImageLinkBanner.svelte';
	import { site } from '$lib/config/site';
	import { daynightAssets } from '$lib/config/dealer';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { assetHref } from '$lib/utils/assets';
	let { english = false }: { english?: boolean } = $props();
	const copy = $derived(dealerCopy[english ? 'en' : 'bg']);
</script>

<ImageLinkBanner
	class="dealer-banner"
	image={daynightAssets.vehicleDealerBanner}
	href={site.contact.mapHref}
	external
>
	{#snippet heading()}<div class="dealer-banner__identity">
			<img
				class="dealer-banner__logo"
				src={assetHref(site.identity.logoOnDark)}
				alt={site.identity.name}
				width="600"
				height="171"
				loading="lazy"
				decoding="async"
			/>
			<p>{copy.appointment}</p>
		</div>{/snippet}
	{copy.address}
</ImageLinkBanner>

<style>
	.dealer-banner__identity {
		display: grid;
		justify-items: start;
		gap: var(--bc-space-2);
	}
	.dealer-banner__logo {
		width: 180px;
		max-width: 70%;
		height: auto;
	}
	.dealer-banner__identity p {
		margin: 0;
		font-size: var(--bc-text-body-lg);
		line-height: var(--bc-leading-body-lg);
		color: var(--bc-white);
	}
</style>
