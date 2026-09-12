<script lang="ts">
	import type {
		HomeFiveBrandCard,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveModalsData,
		HomeFiveTypeCard,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { HomeTwoBudgetTile } from '$lib/auxero/home-two';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroHead from '$lib/components/layout/AuxeroHead.svelte';
	import HomeFiveFooter from '../home/HomeFiveFooter.svelte';
	import HomeFiveModals from '../home/HomeFiveModals.svelte';
	import HomeTwoBrowsePaths from './HomeTwoBrowsePaths.svelte';
	import HomeTwoDeals from './HomeTwoDeals.svelte';
	import HomeTwoExploreMore from './HomeTwoExploreMore.svelte';
	import HomeTwoHeader from './HomeTwoHeader.svelte';
	import HomeTwoHero from './HomeTwoHero.svelte';
	import HomeTwoTrustSection from './HomeTwoTrustSection.svelte';

	let {
		brandCards,
		budgetTiles,
		copy,
		footer,
		header,
		hero,
		modals,
		pageDocument,
		runtimeHtml,
		typeCards,
		vehiclePills
	}: {
		brandCards: HomeFiveBrandCard[];
		budgetTiles: HomeTwoBudgetTile[];
		copy: HomePageCopy;
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		pageDocument: AuxeroPageDocument;
		runtimeHtml?: string;
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();

	const bodyClassScript = $derived(
		`document.body.className = ${JSON.stringify(pageDocument.bodyClass)};`
	);

	// Title is handled declaratively by <AuxeroHead> (<svelte:head><title>), so the effect
	// only syncs the body class to the document (body is outside the component tree).
	$effect(() => {
		document.body.className = pageDocument.bodyClass;
	});
</script>

<AuxeroHead assets={pageDocument.headAssets} title="OUTLETCARS.BG — Варна Marketplace | Home2" />
<svelte:element this={'script'}>
	{bodyClassScript}
</svelte:element>
<svelte:head>
	<meta
		name="description"
		content="Купи, продай или внеси автомобил с OUTLETCARS.BG — Варна през Carwow-вдъхновена marketplace начална страница."
	/>
</svelte:head>

<div id="wrapper" class="daynight-home-two-shell">
	<div class="home2-stage">
		<HomeTwoHeader {header} />
		<HomeTwoHero {hero} />
	</div>
	<main>
		<HomeTwoBrowsePaths {budgetTiles} {copy} pills={vehiclePills} />
		<HomeTwoDeals />
		<HomeTwoTrustSection />
		<HomeTwoExploreMore {brandCards} {typeCards} {copy} />
	</main>
	<HomeFiveFooter {footer} />
</div>

<HomeFiveModals {modals} {copy} {header} />

{#if runtimeHtml}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html runtimeHtml}
{/if}

<style>
	:global(body:has(.daynight-home-two-shell)) {
		background: #f3f4f6;
		color: #121214;
	}

	.daynight-home-two-shell {
		background: #f3f4f6;
		color: #121214;
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		letter-spacing: 0;
		min-height: 100vh;
		overflow: clip;
	}

	.daynight-home-two-shell :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.daynight-home-two-shell :global(button),
	.daynight-home-two-shell :global(input) {
		font: inherit;
		letter-spacing: 0;
	}

	.daynight-home-two-shell :global(img) {
		display: block;
		max-width: 100%;
	}

	.home2-stage {
		background: #080a09;
		isolation: isolate;
		position: relative;
	}

	:global(.switcher-container) {
		display: none !important;
	}
</style>
