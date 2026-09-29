<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import MapPin from '@lucide/svelte/icons/map-pin';
	import PhoneCall from '@lucide/svelte/icons/phone-call';
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';

	let { onLocation, showLocation = true }: { onLocation?: () => void; showLocation?: boolean } =
		$props();

	const phoneHref = daynightSite.phoneHref;
	const mapHref = daynightSite.mapUrl;
</script>

<div class="mobile-hero-bar">
	<a
		class="mobile-hero-bar__brand"
		href={i18n.href(resolve('/'))}
		aria-label={i18n.t('pattern.be6474ae3e2b', { v0: daynightSite.shortName })}
	>
		<img
			src={i18n.asset(resolve(daynightSite.logoLight))}
			alt={daynightSite.shortName}
			width="170"
			height="44"
		/>
	</a>
	<div class="mobile-hero-bar__actions">
		{#if showLocation}
			{#if onLocation}
				<button
					class="mobile-hero-bar__action"
					type="button"
					aria-label={i18n.t('pattern.c8ce698e8cf0', { v0: i18n.dealer('locationShort') })}
					title={i18n.t('copy.cb9410729d40')}
					onclick={onLocation}
				>
					<MapPin size={20} strokeWidth={2} aria-hidden="true" />
				</button>
			{:else}
				<a
					class="mobile-hero-bar__action"
					href={i18n.href(mapHref)}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={i18n.t('pattern.e0245f747462', { v0: i18n.dealer('locationShort') })}
					title={i18n.t('copy.cb9410729d40')}
				>
					<MapPin size={20} strokeWidth={2} aria-hidden="true" />
				</a>
			{/if}
		{/if}
		<a
			class="mobile-hero-bar__action"
			href={i18n.href(phoneHref)}
			aria-label={i18n.t('pattern.ab13c281dac3', { v0: daynightSite.phoneLabel })}
			title={i18n.t('copy.d40e5119596a')}
		>
			<PhoneCall size={20} strokeWidth={2} aria-hidden="true" />
		</a>
	</div>
</div>

<style>
	.mobile-hero-bar__brand img {
		max-width: min(170px, calc(100vw - 184px));
	}
	.mobile-hero-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		height: 48px;
		min-width: 0;
	}
	.mobile-hero-bar__brand {
		display: flex;
		align-items: center;
		width: 170px;
		height: 44px;
		min-width: 0;
	}
	.mobile-hero-bar__brand img {
		display: block;
		width: 170px;
		height: 44px;
		object-fit: contain;
		object-position: left center;
	}
	.mobile-hero-bar__actions {
		color: #fff;
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 6px;
	}
	.mobile-hero-bar__action {
		display: grid;
		place-items: center;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		flex: 0 0 var(--sa-mobile-action-h);
		padding: 0;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: var(--sa-r-pill);
		background: rgba(255, 255, 255, 0.08);
		color: #fff !important;
		box-shadow: none;
		text-decoration: none;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background-color 120ms ease-out;
	}
	.mobile-hero-bar__action :global(svg),
	.mobile-hero-bar__action :global(svg *) {
		color: inherit !important;
		stroke: currentColor !important;
	}
	@media (hover: hover) and (pointer: fine) {
		.mobile-hero-bar__action:hover {
			background: rgba(255, 255, 255, 0.1);
		}
	}
	.mobile-hero-bar__action:active {
		background: rgba(255, 255, 255, 0.16);
	}
	.mobile-hero-bar a:focus-visible,
	.mobile-hero-bar button:focus-visible {
		outline: 2px solid var(--sa-yellow) !important;
		outline-offset: 3px !important;
		box-shadow: none !important;
	}
</style>
