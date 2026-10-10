<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import AboutHeading from "#lib/sections/AboutHeading.svelte";
  import AboutVehicleBusiness from "#lib/sections/AboutVehicleBusiness.svelte";
  import AgentTeamBordered from "#lib/sections/AgentTeamBordered.svelte";
  import FairPriceVehicleOffer from "#lib/sections/FairPriceVehicleOffer.svelte";
  import BusinessStats from "#lib/sections/BusinessStats.svelte";
  import ServiceSupportOffer from "#lib/sections/ServiceSupportOffer.svelte";
  import CustomerReviewCarouselPlain from "#lib/sections/CustomerReviewCarouselPlain.svelte";
  import HomeFaq from "#lib/sections/HomeFaq.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
  import { MediaQuery } from "svelte/reactivity";
  import AboutOverview from "#lib/sections/AboutOverview.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<PageMetadata title={locale.t("ui.about-us.about-us")} />
<main class="main"
  ><AboutHeading />
  {#if desktop.current && (!dealer.businessPreview || dealer.about)}
    <AboutOverview />
  {:else}
    <AboutVehicleBusiness />
    {#if !dealer.businessPreview}
      <AgentTeamBordered />
      <FairPriceVehicleOffer />
      <BusinessStats />
      <ServiceSupportOffer />
      <CustomerReviewCarouselPlain />
    {/if}
    <HomeFaq />
    {#if !dealer.businessPreview}
      <UpcomingVehicleNews />
    {/if}
  {/if}
  <Footer /></main
>
