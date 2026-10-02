<script lang="ts">
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { site } from '$lib/config/site';
	import { daynightAssets } from '$lib/config/dealer';
	import { dealerCopy } from '$lib/config/dealer-copy';
	import { assetHref } from '$lib/utils/assets';
	import { linkHref } from '$lib/utils/links';
	let { english = false }: { english?: boolean } = $props();
	const copy = $derived(dealerCopy[english ? 'en' : 'bg']);
</script>

<a class="dealer-banner" href={linkHref(site.contact.mapHref)} target="_blank" rel="noreferrer">
	<img
		class="dealer-banner__image"
		src={assetHref(daynightAssets.vehicleDealerBanner)}
		alt=""
		width="720"
		height="405"
		loading="lazy"
		decoding="async"
	/>
	<div class="dealer-banner__identity">
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
	</div>
	<span class="dealer-banner__address">
		<span>{copy.address}</span>
		<ArrowUpRight size={18} aria-hidden="true" />
	</span>
</a>

<style>
	.dealer-banner {
		position: relative;
		isolation: isolate;
		display: grid;
		align-content: space-between;
		gap: var(--bc-space-6);
		min-width: 0;
		min-height: 200px;
		padding: var(--bc-space-5);
		overflow: hidden;
		border-radius: var(--bc-radius-panel);
		background: var(--bc-ink);
		color: var(--bc-white);
		text-decoration: none;
	}
	.dealer-banner::before,
	.dealer-banner__image {
		position: absolute;
		inset: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
	}
	.dealer-banner__image {
		z-index: -2;
		object-fit: cover;
		object-position: right center;
	}
	.dealer-banner::before {
		content: '';
		background: linear-gradient(180deg, rgb(0 0 0 / 0.4), rgb(0 0 0 / 0.15) 40%, rgb(0 0 0 / 0.95));
	}
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
	.dealer-banner__address {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--bc-space-3);
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-h7);
		font-weight: var(--bc-weight-body);
	}
	.dealer-banner:hover,
	.dealer-banner:focus-visible {
		color: var(--bc-white);
	}
	.dealer-banner:hover .dealer-banner__address > span,
	.dealer-banner:focus-visible .dealer-banner__address > span {
		text-decoration: underline;
		text-underline-offset: var(--bc-space-1);
	}
</style>
