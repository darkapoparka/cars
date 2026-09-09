<script lang="ts">
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import HeroClean from './HeroClean.svelte';
	import ActionBandClean from './ActionBandClean.svelte';
	import FeaturedVehiclesClean from './FeaturedVehiclesClean.svelte';
	import BrowseSectionClean from './BrowseSectionClean.svelte';
	import CompareSectionClean from './CompareSectionClean.svelte';
	import ReviewsSectionClean from './ReviewsSectionClean.svelte';
	import NewsSectionClean from './NewsSectionClean.svelte';
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveNewsPost,
		HomeFiveReview,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';

	// Clean Svelte 5 + Tailwind v4 homepage — the migration target that retires the
	// Auxero shell for `/`. Global clean chrome (CleanSiteHeader `home` variant sits
	// transparent over the dark hero; CleanSiteFooter) wraps the rebuilt sections.
	// No pageDocument, no app.css, no swiper, no !important.
	let {
		copy,
		header,
		footer,
		hero,
		featuredVehicles,
		vehiclePills,
		brandCards,
		typeCards,
		comparePairs,
		reviews,
		newsPosts
	}: {
		copy: HomePageCopy;
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
		hero: HomeFiveHeroData;
		featuredVehicles: HomeFiveVehicleCardData[];
		vehiclePills: HomeFiveVehiclePill[];
		brandCards: HomeFiveBrandCard[];
		typeCards: HomeFiveTypeCard[];
		comparePairs: HomeFiveComparePair[];
		reviews: HomeFiveReview[];
		newsPosts: HomeFiveNewsPost[];
	} = $props();
</script>

<CleanSiteHeader {header} variant="home" pathname="/" />

<main id="main-content" class="bg-bc-bg font-bc-body">
	<HeroClean {hero} />
	<ActionBandClean {copy} />
	<FeaturedVehiclesClean vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<BrowseSectionClean {brandCards} {typeCards} {copy} />
	<CompareSectionClean pairs={comparePairs} {copy} />
	<ReviewsSectionClean {reviews} {copy} />
	<NewsSectionClean posts={newsPosts} {copy} />
</main>

<CleanSiteFooter {footer} />
