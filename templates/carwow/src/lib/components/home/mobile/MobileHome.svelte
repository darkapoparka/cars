<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { ChevronRight, Search } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { HomeMobileData } from '$lib/types/home';
	import { enhanceDayNightImageFallbacks } from '$lib/utils/daynight-image-fallback';
	import MobileBottomDock from './MobileBottomDock.svelte';
	import MobileHeroBar from '$lib/components/shared/MobileHeroBar.svelte';
	import MobileHomeDiscovery from './MobileHomeDiscovery.svelte';
	import MobileHomeFooter from './MobileHomeFooter.svelte';
	import MobileHomeSearchSheet from './MobileHomeSearchSheet.svelte';
	import MobileHomeImportSheet from './MobileHomeImportSheet.svelte';
	import MobileHomeLocationSheet from './MobileHomeLocationSheet.svelte';
	import './mobile-home-sheets.css';
	import '$lib/styles/mobile-hero-pill.css';
	import '$lib/styles/mobile-quick-pills.css';
	import '$lib/styles/mobile-entry-hero.css';

	let {
		data,
		heroToggle = 'underline',
		heroBox = false
	}: {
		data: HomeMobileData;
		heroToggle?: 'underline' | 'segmented';
		heroBox?: boolean;
	} = $props();
	const inventoryPath = '/inventory' as const;
	const inventoryHref = resolve(inventoryPath);
	type InventoryHref = typeof inventoryPath | `${typeof inventoryPath}?${string}`;
	type QuickFilter = { label: string; ariaLabel: string; href: InventoryHref };
	const total = $derived(data.total);
	let heroMode = $state<'buy' | 'import'>('buy');
	let searchOpen = $state(false);
	let importOpen = $state(false);
	let locationOpen = $state(false);
	function openSearch() {
		if (heroMode === 'buy') searchOpen = true;
		else importOpen = true;
	}
	onMount(() => enhanceDayNightImageFallbacks());
	const priceNumber = $derived(new Intl.NumberFormat(i18n.locale === 'bg' ? 'bg-BG' : 'en-GB'));
	const quickFilters = $derived(
		data.budgetTiles.flatMap((tile): QuickFilter[] => {
			const band = tile.value.match(/^(under|over)-(\d+)$/);
			if (!band) return [];
			return [
				{
					label: `${band[1] === 'under' ? '<' : '>'}${priceNumber.format(Number(band[2]))}`,
					ariaLabel: i18n.text(tile.label),
					href: `${inventoryPath}?price=${encodeURIComponent(tile.value)}`
				}
			];
		})
	);
</script>

<div class="mobile-home">
	<header class="mh-hero mobile-entry-hero">
		<MobileHeroBar onLocation={() => (locationOpen = true)} />

		<h1 class="mh-hero__title">{daynightSite.shortName}</h1>

		<div class={`mh-hero__box${heroBox ? ' mh-hero__box--card' : ''}`}>
			<div
				class={`mh-hero__modes mobile-entry-hero__tabs${heroToggle === 'segmented' ? ' mh-hero__modes--segmented' : ''}`}
				role="group"
				aria-label={i18n.t('copy.69b5266fcf70')}
			>
				<button
					type="button"
					class={heroMode === 'buy' ? 'is-active' : ''}
					aria-pressed={heroMode === 'buy'}
					onclick={() => (heroMode = 'buy')}
				>
					{i18n.t('copy.f6c6952d4d23')}
				</button>
				<button
					type="button"
					class={heroMode === 'import' ? 'is-active' : ''}
					aria-pressed={heroMode === 'import'}
					onclick={() => (heroMode = 'import')}
				>
					{i18n.t('copy.995bfafd0b63')}
				</button>
			</div>
			<button class="mh-hero__search mobile-entry-hero__search" type="button" onclick={openSearch}>
				<span class="mh-hero__search-label">
					{heroMode === 'buy' ? i18n.t('copy.5e985723597f') : i18n.t('copy.d028fe65890c')}
				</span>
				<span class="mh-hero__search-go mobile-entry-hero__go" aria-hidden="true">
					{#if heroMode === 'buy'}
						<Search size={20} strokeWidth={2.5} />
					{:else}
						<ChevronRight size={22} strokeWidth={2.7} />
					{/if}
				</span>
			</button>
			{#if heroMode === 'buy'}
				<a
					class="mobile-hero-pill mh-hero__all mh-hero__all--browse"
					href={i18n.href(inventoryHref)}
				>
					<span>{i18n.t('copy.9b2d5cddac16')}{total})</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</a>
			{:else}
				<button
					class="mobile-hero-pill mh-hero__all mh-hero__all--import"
					type="button"
					onclick={openSearch}
				>
					<span>{i18n.t('copy.ee4d0f651884')}</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</button>
			{/if}
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<nav class="mh-quick mobile-quick-pills" aria-label={i18n.t('copy.6a46dc837411')}>
			{#each quickFilters as item (item.label)}
				<a
					class="mh-quick__pill"
					aria-label={item.ariaLabel}
					href={i18n.href(resolve(item.href))}
					onfocus={(event) =>
						event.currentTarget.scrollIntoView({
							block: 'nearest',
							inline: 'nearest',
							behavior: 'instant'
						})}
				>
					<span>{item.label}</span>
				</a>
			{/each}
		</nav>

		<MobileHomeDiscovery {data} />
	</main>

	<MobileHomeFooter />

	<MobileBottomDock />

	<MobileHomeSearchSheet {data} bind:open={searchOpen} />
	<MobileHomeImportSheet bind:open={importOpen} />
	<MobileHomeLocationSheet bind:open={locationOpen} />
</div>

<style>
	.mobile-home {
		--mh-gutter: var(--sa-mobile-gutter-wide);

		display: none;
		min-height: 100svh;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-home a {
		color: inherit;
		text-decoration: none;
	}

	.mobile-home main {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 18px;
		margin-top: calc(-1 * var(--sa-mobile-panel-overlap));
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: #fff;
		padding-top: 16px;
		padding-bottom: 12px;
	}
	.mh-hero {
		--mobile-entry-gutter: var(--mh-gutter);
	}

	.mh-hero__title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.mh-hero__box {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-width: 0;
		gap: var(--mobile-entry-hero-gap);
		margin: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		padding: 0;
		box-shadow: none;
	}
	.mh-hero__box--card {
		gap: 10px;
		border-radius: 18px;
		background: #fff;
		padding: 10px;
		box-shadow: 0 16px 36px rgba(0, 38, 92, 0.22);
	}

	.mh-hero__box--card .mh-hero__modes--segmented {
		background: var(--sa-fill);
	}

	.mh-hero__box--card .mh-hero__modes--segmented button {
		color: var(--sa-muted);
	}

	.mh-hero__box--card .mh-hero__modes--segmented button.is-active {
		background: var(--sa-blue);
		color: #fff;
		box-shadow: none;
	}

	.mh-hero__box--card .mh-hero__search {
		border: 1px solid var(--sa-line);
		background: var(--sa-fill);
		box-shadow: none;
	}

	.mh-hero__box--card .mh-hero__all {
		background: var(--sa-fill);
		color: var(--sa-blue-strong) !important;
	}
	.mh-hero__modes {
		justify-self: center;
		align-items: end;
		padding: 0;
	}
	.mh-hero__modes--segmented {
		display: grid;
		width: 100%;
		grid-auto-columns: minmax(0, 1fr);
		grid-auto-flow: column;
		align-items: stretch;
		gap: 4px;
		border-bottom: 0;
		border-radius: var(--sa-r-pill);
		background: rgba(255, 255, 255, 0.16);
		padding: 3px;
	}
	.mh-hero__box:not(.mh-hero__box--card) .mh-hero__modes--segmented {
		justify-self: center;
		width: 86%;
	}

	.mh-hero__modes--segmented button {
		width: 100%;
		min-height: 38px;
		align-items: center;
		border-radius: var(--sa-r-pill);
		padding: 2px 8px;
		font-size: var(--sa-button-font-size);
		font-weight: var(--sa-button-font-weight);
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.mh-hero__modes--segmented button.is-active {
		background: #fff;
		color: var(--sa-blue-strong);
		box-shadow: 0 2px 8px rgba(0, 30, 80, 0.16);
	}

	.mh-hero__modes--segmented button.is-active::after {
		display: none;
	}

	.mh-hero__search {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 4px 4px 4px 17px;
		color: var(--sa-muted);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		text-align: left;
		cursor: pointer;
	}

	.mh-hero__search-label {
		flex: 1 1 auto;
		min-width: 0;
		color: var(--mobile-entry-placeholder);
		font: inherit;
		line-height: inherit;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mh-hero__search-go {
		display: grid;
		width: var(--sa-mobile-pill-h);
		height: var(--sa-mobile-pill-h);
		flex: 0 0 auto;
		place-items: center;
		border-radius: 50%;
		color: #fff !important;
	}

	.mh-hero__search-go :global(svg),
	.mh-hero__search-go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mh-hero__all {
		max-width: 100%;
	}
	.mh-hero__all > span {
		min-width: 0;
		text-align: center;
	}

	.mh-quick {
		--mobile-quick-pills-padding: 6px 0;
		--mobile-quick-pills-scroll-padding: 0px;

		min-width: 0;
		margin: 0 var(--mh-gutter);
	}

	.mobile-home :global(svg),
	.mobile-home :global(svg *) {
		stroke: currentColor !important;
	}

	@media (max-width: 991px) {
		.mobile-home {
			display: block;
		}
	}

	@media (max-width: 360px) {
		.mobile-home {
			--mh-gutter: 16px;
		}

		.mh-hero__box {
			gap: var(--mobile-entry-hero-gap);
		}

		.mh-hero__search-go {
			width: var(--sa-mobile-pill-h);
			height: var(--sa-mobile-pill-h);
		}
	}
</style>
