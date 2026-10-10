<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import HomeSearchCarousel from "#lib/sections/HomeSearchCarousel.svelte";
  import VehicleTypeLinks from "#lib/sections/VehicleTypeLinks.svelte";
  import PopularVehicleCarousel from "#lib/sections/PopularVehicleCarousel.svelte";
  import SellAndRentalOffersCompact from "#lib/sections/SellAndRentalOffersCompact.svelte";
  import VehicleReviewCarouselPadded from "#lib/sections/VehicleReviewCarouselPadded.svelte";
  import BusinessStatsPlain from "#lib/sections/BusinessStatsPlain.svelte";
  import FeaturedVehicleCarousel from "#lib/sections/FeaturedVehicleCarousel.svelte";
  import PremiumBrandGrid from "#lib/sections/PremiumBrandGrid.svelte";
  import AgentTeam from "#lib/sections/AgentTeam.svelte";
  import LoanCalculatorSplit from "#lib/sections/LoanCalculatorSplit.svelte";
  import CustomerReviewCarouselPlain from "#lib/sections/CustomerReviewCarouselPlain.svelte";
  import VehicleJourneySteps from "#lib/sections/VehicleJourneySteps.svelte";
  import TrendingNewsCarousel from "#lib/sections/TrendingNewsCarousel.svelte";
  import AppDownloadPromotionCompact from "#lib/sections/AppDownloadPromotionCompact.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.index-2.home")} />
<main class="main"
  ><HomeSearchCarousel />
  <VehicleTypeLinks />
  <PopularVehicleCarousel />
  <SellAndRentalOffersCompact />
  <VehicleReviewCarouselPadded />
  <BusinessStatsPlain />
  <FeaturedVehicleCarousel />
  <PremiumBrandGrid />
  <AgentTeam />
  <LoanCalculatorSplit />
  <CustomerReviewCarouselPlain />
  <VehicleJourneySteps />
  <TrendingNewsCarousel />
  <AppDownloadPromotionCompact />
  <Footer /></main
>
