<script lang="ts">
	import { ChevronRight, Search, Settings2 } from '@lucide/svelte';
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
	type QuickFilter = { label: string; icon: 'car-line' | typeof Settings2; href: InventoryHref };
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
	const quickFilters: QuickFilter[] = [
		{
			label: 'Дизел',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Дизел')}`
		},
		{
			label: 'Бензин',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Бензин')}`
		},
		{
			label: 'Автоматик',
			icon: Settings2,
			href: `${inventoryPath}?transmission=${encodeURIComponent('Автоматик')}`
		},
		{
			label: 'Електрически',
			icon: 'car-line',
			href: `${inventoryPath}?fuel=${encodeURIComponent('Електрически')}`
		}
	];
</script>

{#snippet quickCarIcon()}
	<svg
		class="mh-quick__car-icon"
		aria-hidden="true"
		width="32"
		height="16"
		viewBox="0 0 76 36"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M13 23H8.5C6.6 23 5 21.4 5 19.5V17.6C5 15.9 6.2 14.4 7.9 14.1L17.7 12.3L24.2 6.7C25.5 5.6 27.1 5 28.8 5H45.5C47.7 5 49.8 6 51.1 7.8L55.3 13.4L66.3 15.8C69 16.4 71 18.8 71 21.6V23H64"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path d="M25 23H52" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
		<path
			d="M22.5 28.5C25.54 28.5 28 26.04 28 23C28 19.96 25.54 17.5 22.5 17.5C19.46 17.5 17 19.96 17 23C17 26.04 19.46 28.5 22.5 28.5Z"
			stroke="currentColor"
			stroke-width="3"
		/>
		<path
			d="M58.5 28.5C61.54 28.5 64 26.04 64 23C64 19.96 61.54 17.5 58.5 17.5C55.46 17.5 53 19.96 53 23C53 26.04 55.46 28.5 58.5 28.5Z"
			stroke="currentColor"
			stroke-width="3"
		/>
		<path d="M25 13H48" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
	</svg>
{/snippet}

<div class="mobile-home">
	<header class="mh-hero">
		<MobileHeroBar onLocation={() => (locationOpen = true)} />

		<h1 class="mh-hero__title">{daynightSite.shortName}</h1>

		<div class={`mh-hero__box${heroBox ? ' mh-hero__box--card' : ''}`}>
			<div
				class={`mh-hero__modes${heroToggle === 'segmented' ? ' mh-hero__modes--segmented' : ''}`}
				role="group"
				aria-label="Избери действие"
			>
				<button
					type="button"
					class={heroMode === 'buy' ? 'is-active' : ''}
					aria-pressed={heroMode === 'buy'}
					onclick={() => (heroMode = 'buy')}
				>
					Купи
				</button>
				<button
					type="button"
					class={heroMode === 'import' ? 'is-active' : ''}
					aria-pressed={heroMode === 'import'}
					onclick={() => (heroMode = 'import')}
				>
					Внос
				</button>
			</div>
			<button class="mh-hero__search" type="button" onclick={openSearch}>
				<span class="mh-hero__search-label">
					{heroMode === 'buy' ? 'Търси марка, модел, цена…' : 'Какъв автомобил търсиш?'}
				</span>
				<span class="mh-hero__search-go" aria-hidden="true">
					{#if heroMode === 'buy'}
						<Search size={20} strokeWidth={2.5} />
					{:else}
						<ChevronRight size={22} strokeWidth={2.7} />
					{/if}
				</span>
			</button>
			{#if heroMode === 'buy'}
				<a class="mobile-hero-pill mh-hero__all mh-hero__all--browse" href={inventoryHref}>
					<span>Виж всички ({total})</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</a>
			{:else}
				<button
					class="mobile-hero-pill mh-hero__all mh-hero__all--import"
					type="button"
					onclick={openSearch}
				>
					<span>Заяви внос</span>
					<ChevronRight size={12} strokeWidth={2.8} aria-hidden="true" />
				</button>
			{/if}
		</div>
	</header>

	<main id="main-content" tabindex="-1">
		<nav class="mh-quick" aria-label="Бързи филтри">
			{#each quickFilters as item (item.label)}
				<a class="mh-quick__pill" href={resolve(item.href)}>
					{#if item.icon === 'car-line'}
						{@render quickCarIcon()}
					{:else}
						{@const Icon = item.icon}
						<Icon size={16} strokeWidth={2.2} aria-hidden="true" />
					{/if}
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
		gap: 18px;
		margin-top: calc(-1 * var(--sa-mobile-panel-overlap));
		border-radius: var(--sa-r-xl) var(--sa-r-xl) 0 0;
		background: #fff;
		padding-top: 16px;
		padding-bottom: 12px;
	}
	.mh-hero {
		display: grid;
		gap: var(--sa-mobile-hero-gap);
		padding: calc(env(safe-area-inset-top) + 12px) var(--mh-gutter) var(--sa-mobile-hero-bottom);
		background: var(--sa-blue);
		color: #fff;
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
		gap: var(--sa-mobile-hero-gap);
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
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-self: center;
		align-items: end;
		width: 100%;
		border-bottom: 1px solid rgba(255, 255, 255, 0.24);
		padding: 0;
	}

	.mh-hero__modes button {
		position: relative;
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		min-height: 52px;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		color: var(--mh-hero-tab-color, rgba(255, 255, 255, 0.76));
		font: var(--sa-weight-medium) var(--sa-mobile-type-primary-tab) / var(--sa-leading-snug)
			var(--sa-font);
		padding: 8px 8px 10px;
		cursor: pointer;
		transition: color 0.18s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.mh-hero__modes button:hover {
		color: #fff;
	}

	.mh-hero__modes button:focus-visible {
		border-radius: 6px 6px 0 0;
		outline: 2px solid rgba(255, 255, 255, 0.76);
		outline-offset: -3px;
	}

	.mh-hero__modes button.is-active {
		color: var(--mh-hero-tab-active, #fff);
		font-weight: var(--sa-button-font-weight);
	}

	.mh-hero__modes button.is-active::after {
		position: absolute;
		right: 0;
		bottom: -1px;
		left: 0;
		width: auto;
		height: 4px;
		border-radius: 4px 4px 0 0;
		background: var(--sa-red, #d50032);
		content: '';
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
		width: 100%;
		min-height: var(--sa-mobile-search-h);
		align-items: center;
		box-sizing: border-box;
		gap: 12px;
		border: 0;
		border-radius: var(--sa-r-pill);
		background: #fff;
		padding: 4px 4px 4px 17px;
		color: var(--sa-muted);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-medium);
		text-align: left;
		cursor: pointer;
		box-shadow: 0 12px 32px rgba(0, 45, 110, 0.18);
	}

	.mh-hero__search-label {
		flex: 1 1 auto;
		min-width: 0;
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
		background: var(--sa-blue);
		color: #fff !important;
	}

	.mh-hero__search-go :global(svg),
	.mh-hero__search-go :global(svg *) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.mh-quick {
		display: flex;
		margin-top: 0;
		margin-inline: var(--mh-gutter);
		gap: var(--sa-mobile-gap-sm);
		overflow-x: auto;
		padding: 0 0 2px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.mh-quick::-webkit-scrollbar {
		display: none;
	}

	.mh-quick__pill {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: var(--sa-pill-gap);
		min-height: var(--sa-mobile-pill-h);
		border: 0;
		border-radius: var(--sa-pill-radius);
		background: var(--sa-fill);
		padding: 0 var(--sa-pill-pad-x);
		color: var(--sa-ink);
		font: var(--sa-weight-regular) var(--sa-mobile-type-filter) / 1.5 var(--sa-font);
		white-space: nowrap;
	}

	.mh-quick__pill span {
		font: inherit;
	}

	.mh-quick__pill :global(svg) {
		flex: 0 0 auto;
		color: var(--sa-blue) !important;
	}

	.mh-quick__car-icon {
		display: block;
		width: 30px;
		height: 15px;
		flex: 0 0 auto;
		color: var(--sa-blue);
	}

	@media (max-width: 390px) {
		.mh-quick {
			gap: 7px;
		}

		.mh-quick__pill {
			gap: 5px;
			padding-inline: 8px;
		}
	}

	@media (max-width: 370px) {
		.mh-quick {
			gap: 6px;
		}

		.mh-quick__pill {
			gap: 4px;
			padding-inline: 7px;
		}

		.mh-quick__car-icon {
			width: 28px;
		}
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
			gap: var(--sa-mobile-hero-gap);
		}

		.mh-hero__search {
			min-height: var(--sa-mobile-search-h);
		}

		.mh-hero__search-go {
			width: var(--sa-mobile-pill-h);
			height: var(--sa-mobile-pill-h);
		}
	}
</style>
