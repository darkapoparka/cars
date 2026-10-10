<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import HomeVehicleHero from "#lib/sections/HomeVehicleHero.svelte";
  import HomeCompactVehicleSearch from "#lib/sections/HomeCompactVehicleSearch.svelte";
  import PremiumBrandCarousel from "#lib/sections/PremiumBrandCarousel.svelte";
  import MostSearchedVehicles from "#lib/sections/MostSearchedVehicles.svelte";
  import SellVehicleOffer from "#lib/sections/SellVehicleOffer.svelte";
  import VehicleTypeShowcase from "#lib/sections/VehicleTypeShowcase.svelte";
  import VehicleJourneySteps from "#lib/sections/VehicleJourneySteps.svelte";
  import LoanCalculatorOffer from "#lib/sections/LoanCalculatorOffer.svelte";
  import FeaturedVehicleGrid from "#lib/sections/FeaturedVehicleGrid.svelte";
  import SellVehicleBanner from "#lib/sections/SellVehicleBanner.svelte";
  import ServicesOverview from "#lib/sections/ServicesOverview.svelte";
  import RentalOfferCards from "#lib/sections/RentalOfferCards.svelte";
  import CustomerReviewCarousel from "#lib/sections/CustomerReviewCarousel.svelte";
  import FeaturedCarReview from "#lib/sections/FeaturedCarReview.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import AppAvailabilityBanner from "#lib/sections/AppAvailabilityBanner.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.index.home")} />
<main class="main"
  ><HomeVehicleHero />
  <HomeCompactVehicleSearch />
  <PremiumBrandCarousel />
  <MostSearchedVehicles />
  <SellVehicleOffer />
  <VehicleTypeShowcase />
  <VehicleJourneySteps />
  <LoanCalculatorOffer />
  <FeaturedVehicleGrid />
  <SellVehicleBanner />
  <ServicesOverview />
  <RentalOfferCards />
  <CustomerReviewCarousel />
  <FeaturedCarReview />
  <UpcomingVehicleNews />
  <AppAvailabilityBanner /></main
>

<Footer />
