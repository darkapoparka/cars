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
	import AuxeroHead from '$lib/components/layout/AuxeroHead.svelte';
	import HomeFiveFooter from '$lib/components/home/HomeFiveFooter.svelte';
	import HomeFiveHeader from '$lib/components/home/HomeFiveHeader.svelte';
	import HomeFiveModals from '$lib/components/home/HomeFiveModals.svelte';
	import { onMount } from 'svelte';
	import AuxeroInventoryDesktopSurface from './AuxeroInventoryDesktopSurface.svelte';
	import InventoryMobilePage from './InventoryMobilePage.svelte';

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

	let mobileRouteVisible = $state(true);
	const resolvedTitle = $derived(
		seoTitle ?? pageDocument.headHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
	);
	const bodyClassScript = $derived(
		`document.body.className = ${JSON.stringify(pageDocument.bodyClass)};`
	);

	$effect(() => {
		document.body.className = pageDocument.bodyClass;
		if (resolvedTitle) {
			document.title = resolvedTitle;
		}
	});

	onMount(() => {
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

<div class="eliqauto-inventory-desktop-route">
	<div id="wrapper" class="eliqauto-public-shell">
		<HomeFiveHeader header={shellHeader} />
		<AuxeroInventoryDesktopSurface
			{cards}
			{copy}
			{desktop}
			modelOptionsByBrand={mobile.modelOptionsByBrand}
		/>
		<HomeFiveFooter footer={shellFooter} />
	</div>

	<HomeFiveModals modals={shellModals} copy={shellCopy} header={shellHeader} />
</div>

<div
	class="eliqauto-inventory-mobile-route"
	hidden={!mobileRouteVisible}
	aria-hidden={!mobileRouteVisible}
>
	<InventoryMobilePage {cards} {copy} {mobile} />
</div>

<style>
	.eliqauto-inventory-mobile-route {
		display: none;
	}

	@media (min-width: 768px) {
		.eliqauto-inventory-mobile-route :global(*) {
			display: none;
		}
	}

	@media (max-width: 767.98px) {
		.eliqauto-inventory-desktop-route {
			display: none;
		}

		.eliqauto-inventory-mobile-route {
			display: block;
		}
	}
</style>
