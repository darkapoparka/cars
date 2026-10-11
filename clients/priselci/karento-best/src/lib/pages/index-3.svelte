<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import HomeVehicleCarousel from "#lib/sections/HomeVehicleCarousel.svelte";
  import HomeVehicleSearch from "#lib/sections/HomeVehicleSearch.svelte";
  import DesktopDealershipHero from "#lib/sections/DesktopDealershipHero.svelte";
  import PopularVehicleGrid from "#lib/sections/PopularVehicleGrid.svelte";
  import MobileHomeMakes from "#lib/components/mobile/MobileHomeMakes.svelte";
  import HomeBrandLinks from "#lib/sections/HomeBrandLinks.svelte";
  import VehiclePurchaseSteps from "#lib/sections/VehiclePurchaseSteps.svelte";
  import RentalOfferCardsCompact from "#lib/sections/RentalOfferCardsCompact.svelte";
  import SellAndRentalOffers from "#lib/sections/SellAndRentalOffers.svelte";
  import VehicleTypeShowcase from "#lib/sections/VehicleTypeShowcase.svelte";
  import LoanCalculatorPanel from "#lib/sections/LoanCalculatorPanel.svelte";
  import FeaturedVehicleGrid from "#lib/sections/FeaturedVehicleGrid.svelte";
  import CustomerReviewGrid from "#lib/sections/CustomerReviewGrid.svelte";
  import ServicesOverview from "#lib/sections/ServicesOverview.svelte";
  import VehicleReviewCarousel from "#lib/sections/VehicleReviewCarousel.svelte";
  import AgentTeamCompact from "#lib/sections/AgentTeamCompact.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import AppDownloadPromotion from "#lib/sections/AppDownloadPromotion.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<PageMetadata title={locale.t("ui.index-3.home")} />
<main class="main background-body karento-dealership-home"
  ><DesktopDealershipHero />
  <div class="original-home-hero">
    <HomeVehicleCarousel />
    <HomeVehicleSearch />
  </div>
  {#if phone.current}
    <MobileHomeMakes />
    <PopularVehicleGrid />
    <ServicesOverview compactMobile />
    <VehiclePurchaseSteps />
    <FeaturedVehicleGrid compactMobile />
    <VehicleTypeShowcase mobileLayout="rail" />
    {#if !dealer.businessPreview || dealer.finance}
      <LoanCalculatorPanel mobileFeatured />
    {/if}
    <UpcomingVehicleNews />
    {#if !dealer.businessPreview}
      <CustomerReviewGrid />
      <VehicleReviewCarousel />
      <AgentTeamCompact />
    {/if}
  {:else}
    <PopularVehicleGrid />
    <HomeBrandLinks />
    <VehiclePurchaseSteps />
    {#if !dealer.businessPreview}
      <RentalOfferCardsCompact />
      <SellAndRentalOffers />
    {/if}
    <VehicleTypeShowcase />
    {#if !dealer.businessPreview || dealer.finance}
      <LoanCalculatorPanel />
    {/if}
    <FeaturedVehicleGrid />
    <ServicesOverview />
    <UpcomingVehicleNews />
    {#if !dealer.businessPreview}
      <CustomerReviewGrid />
      <VehicleReviewCarousel />
      <AgentTeamCompact />
      <AppDownloadPromotion />
    {/if}
  {/if}
  <Footer /></main
>

<style>
  @media (max-width: 767.98px) {
    .original-home-hero {
      --karento-mobile-hero-height: 240px;
      --karento-mobile-hero-copy-top: 88px;
      --karento-mobile-hero-copy-bottom: 48px;
      --karento-mobile-hero-shade: linear-gradient(
        180deg,
        rgb(0 0 0 / 52%),
        rgb(0 0 0 / 24%) 40%,
        rgb(0 0 0 / 68%)
      );
    }
    .original-home-hero :global(.item-banner-slide) {
      min-height: var(--karento-mobile-hero-height) !important;
      background-position: 80% center;
    }
    .original-home-hero :global(.item-banner-slide .container) {
      text-align: center !important;
    }
    .original-home-hero :global(h1) {
      max-width: none;
      margin-inline: auto !important;
    }
    .original-home-hero :global(h6) {
      margin-inline: auto;
    }
  }
  @media (min-width: 992px) {
    .original-home-hero {
      display: none;
    }
    :global(.karento-dealership-home > .section-box.py-96) {
      padding-top: 64px !important;
    }
  }
</style>
