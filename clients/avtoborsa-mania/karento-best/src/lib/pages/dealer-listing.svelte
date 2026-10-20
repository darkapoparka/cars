<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ImportSourcesHeading from "#lib/sections/ImportSourcesHeading.svelte";
  import ImportSourceDirectory from "#lib/sections/ImportSourceDirectory.svelte";
  import FairPriceVehicleOffer from "#lib/sections/FairPriceVehicleOffer.svelte";
  import BusinessStats from "#lib/sections/BusinessStats.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { snapshot } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import { suppliedImportSources } from "#lib/data/import-sources.ts";
  import { dealer } from "#lib/content.ts";
  const sources = suppliedImportSources();
  const desktop = new MediaQuery("(min-width: 992px)");
  let query = $state("");
  let country = $state("all");
  function resetFilters() {
    query = "";
    country = "all";
  }
  function clearFilters() {
    resetFilters();
    document
      .querySelector<HTMLInputElement>(
        '.desktop-import-search input[type="search"]',
      )
      ?.focus();
  }
  snapshot<{ query: string; country: string }>({
    id: "karento-import-filters",
    capture: () => ({ query, country }),
    restore: (value) => {
      query = value.query;
      country = value.country;
    },
    reset: resetFilters,
  });
</script>

<PageMetadata title={locale.t("ui.dealer-listing.import-sources")} />
<main class="main"
  ><ImportSourcesHeading
    {sources}
    countryChoices={dealer.importCountryChoices}
    bind:query
    bind:country
  />
  <ImportSourceDirectory {sources} {query} {country} onclear={clearFilters} />
  {#if !desktop.current}
    <FairPriceVehicleOffer />
    <BusinessStats />
  {/if}
  <Footer /></main
>
