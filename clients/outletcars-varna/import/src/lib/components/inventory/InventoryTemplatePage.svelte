<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy, InventoryCopy } from '$lib/i18n/messages';
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AuxeroHead from '$lib/components/layout/AuxeroHead.svelte';
	import HomeFiveFooter from '$lib/components/home/HomeFiveFooter.svelte';
	import HomeFiveHeader from '$lib/components/home/HomeFiveHeader.svelte';
	import HomeFiveModals from '$lib/components/home/HomeFiveModals.svelte';
	import { onMount } from 'svelte';
	import AuxeroInventoryDesktopSurface from './AuxeroInventoryDesktopSurface.svelte';
	import InventoryMobilePage from './InventoryMobilePage.svelte';

	type InventoryProgressState = {
		cardSetKey: string;
		count: number;
	};

	let {
		cards,
		copy,
		desktop,
		mobile,
		pageDocument,
		seoTitle,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		desktop: AuxeroInventoryDesktopData;
		mobile: InventoryMobileData;
		pageDocument: AuxeroPageDocument;
		seoTitle?: string;
		shellCopy: HomePageCopy;
		shellFooter?: HomeFiveFooterData;
		shellHeader?: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
	} = $props();

	let mobileRouteVisible = $state(false);
	let visibleCardCounts = $state<Record<string, number>>({});
	const initialCardCount = 12;
	const cardBatchSize = 12;
	const cardSetKey = $derived(cards.map((card) => card.slug).join('|'));
	const visibleCardCount = $derived(
		Math.min(cards.length, visibleCardCounts[cardSetKey] ?? initialCardCount)
	);
	const visibleCards = $derived(cards.slice(0, visibleCardCount));
	const hasMoreCards = $derived(visibleCardCount < cards.length);
	const loadMoreLabel = $derived(
		desktop.showingText.startsWith('Showing') ? 'Show more cars' : 'Покажи още автомобили'
	);
	const resolvedTitle = $derived(
		seoTitle ?? pageDocument.headHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
	);
	const bodyClassScript = $derived(
		`document.body.className = ${JSON.stringify(pageDocument.bodyClass)};`
	);
	const revealMoreCards = () => {
		const nextCount = Math.min(cards.length, visibleCardCount + cardBatchSize);

		visibleCardCounts[cardSetKey] = nextCount;
		replaceState(resolve(`/inventory${page.url.search}` as `/inventory${string}`), {
			...page.state,
			daynightInventoryProgress: { cardSetKey, count: nextCount }
		} as App.PageState);
	};

	$effect(() => {
		document.body.className = pageDocument.bodyClass;
		if (resolvedTitle) {
			document.title = resolvedTitle;
		}
	});

	onMount(() => {
		const progress = (
			page.state as App.PageState & { daynightInventoryProgress?: InventoryProgressState }
		).daynightInventoryProgress;

		if (progress?.cardSetKey === cardSetKey) {
			visibleCardCounts[cardSetKey] = Math.min(
				cards.length,
				Math.max(initialCardCount, progress.count)
			);
		}

		const media = window.matchMedia('(max-width: 767.98px)');
		const syncMobileRoute = () => {
			mobileRouteVisible = media.matches;
		};

		syncMobileRoute();
		media.addEventListener('change', syncMobileRoute);

		return () => {
			media.removeEventListener('change', syncMobileRoute);
		};
	});
</script>

<AuxeroHead assets={pageDocument.headAssets} title={resolvedTitle} />
<svelte:element this={'script'}>
	{bodyClassScript}
</svelte:element>

{#if mobileRouteVisible}
	<div class="daynight-inventory-mobile-route">
		<InventoryMobilePage cards={visibleCards} {copy} {mobile} />
		{@render cardLoadMore()}
	</div>
{:else}
	<div class="daynight-inventory-desktop-route">
		<div id="wrapper" class="daynight-public-shell">
			<HomeFiveHeader header={shellHeader} />
			<main>
				<AuxeroInventoryDesktopSurface cards={visibleCards} {copy} {desktop} />
				{@render cardLoadMore()}
			</main>
			<HomeFiveFooter footer={shellFooter} />
		</div>

		<HomeFiveModals modals={shellModals} copy={shellCopy} header={shellHeader} />
	</div>
{/if}

{#snippet cardLoadMore()}
	{#if hasMoreCards}
		<div class="daynight-inventory-card-load-more">
			<button type="button" onclick={revealMoreCards}>
				{loadMoreLabel}
				<span aria-hidden="true">{visibleCardCount} / {cards.length}</span>
			</button>
		</div>
	{/if}
{/snippet}

<style>
	.daynight-inventory-mobile-route {
		display: none;
	}

	.daynight-inventory-card-load-more {
		display: flex;
		justify-content: center;
		padding: 28px 16px 12px;
	}

	.daynight-inventory-card-load-more button {
		display: inline-flex;
		min-height: 48px;
		align-items: center;
		gap: 10px;
		border: 1px solid #191919;
		border-radius: 10px;
		background: #ffffff;
		padding: 0 22px;
		color: #191919;
		font: inherit;
		font-size: 14px;
		font-weight: 700;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.daynight-inventory-card-load-more button:hover {
		background: #191919;
		color: #ffffff;
	}

	.daynight-inventory-card-load-more button:focus-visible {
		outline: 3px solid rgba(185, 22, 28, 0.22);
		outline-offset: 3px;
	}

	.daynight-inventory-card-load-more span {
		color: #707070;
		font-size: 12px;
		font-weight: 600;
	}

	.daynight-inventory-card-load-more button:hover span {
		color: #ffffff;
	}

	@media (max-width: 767.98px) {
		.daynight-inventory-desktop-route {
			display: none;
		}

		.daynight-inventory-mobile-route {
			display: block;
		}
	}
</style>
