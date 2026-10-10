<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { snapshot } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import type { ServiceFilterId } from "#lib/data/services.ts";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ServicesHeading from "#lib/sections/ServicesHeading.svelte";
  import ServiceBenefits from "#lib/sections/ServiceBenefits.svelte";
  import RentalSavingsBanner from "#lib/sections/RentalSavingsBanner.svelte";
  import CustomerReviewCarouselPlain from "#lib/sections/CustomerReviewCarouselPlain.svelte";
  import TripPlanningCarousel from "#lib/sections/TripPlanningCarousel.svelte";
  import BusinessStatsBordered from "#lib/sections/BusinessStatsBordered.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import DesktopServiceSupport from "#lib/components/services/DesktopServiceSupport.svelte";

  interface ServicesFilterSnapshot {
    query: string;
    category: ServiceFilterId;
  }

  let query = $state("");
  let category = $state<ServiceFilterId>("all");
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  snapshot<ServicesFilterSnapshot>({
    id: "karento-services-filters",
    capture: () => ({ query, category }),
    restore: (value) => {
      query = value.query;
      category = value.category;
    },
    reset: resetFilters,
  });

  function resetFilters() {
    query = "";
    category = "all";
  }

  function clearFilters() {
    resetFilters();
    document
      .querySelector<HTMLInputElement>(
        desktop.current
          ? '.desktop-service-search input[type="search"]'
          : ".mobile-service-tools input",
      )
      ?.focus({ preventScroll: !desktop.current });
  }
</script>

<PageMetadata title={locale.t("ui.services.services")} />
<main class="main"
  ><ServicesHeading bind:query bind:category />
  <ServiceBenefits bind:query bind:category onclear={clearFilters} />
  {#if desktop.current}
    <DesktopServiceSupport />
  {:else}
    <RentalSavingsBanner servicesMobile />
    <CustomerReviewCarouselPlain />
    <TripPlanningCarousel />
    {#if !phone.current}<BusinessStatsBordered />{/if}
    <UpcomingVehicleNews />
  {/if}
  <Footer /></main
>
