<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import VehicleFilterMenu from "./VehicleFilterMenu.svelte";
  import { popularVehicleFilters } from "#lib/data/vehicle-filters.ts";
  import { MediaQuery } from "svelte/reactivity";
  import { goto } from "$app/navigation";
  import { dealer } from "#lib/content.ts";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import {
    catalogDestination,
    emptyCatalogFilters,
    type CatalogFilters,
    type CatalogPanel,
  } from "#lib/data/mobile-catalog.ts";
  import CatalogFilterSheet from "#lib/components/vehicle-listing/CatalogFilterSheet.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let open = $state(false);
  let draft = $state<CatalogFilters>({ ...emptyCatalogFilters });
  let panel = $state<CatalogPanel>("make");
  let compact = $state(false);
  const items = $derived(
    vehicleListings.gridFourColumns.map((card) => ({
      ...card,
      ...dealer.inventory[card.title],
    })),
  );
  function openPanel(nextPanel: CatalogPanel) {
    draft = { ...emptyCatalogFilters };
    panel = nextPanel;
    compact = nextPanel === "budget";
    open = true;
  }
</script>

{#if phone.current}
  <MobilePillRail
    class="popular-categories mobile-quick-filters"
    label={locale.t("ui.popular-vehicle-filters.browse-vehicles")}
  >
    <MobilePill
      label={locale.t("ui.popular-vehicle-filters.all-cars")}
      href={locale.href("/vehicles")}
      trailingIcon="arrow-up-right"
    />
    <MobilePill
      label={locale.t("ui.popular-vehicle-filters.make")}
      trailingIcon="chevron-down"
      onclick={() => openPanel("make")}
      popup="dialog"
      expanded={open && panel === "make"}
    />
    <MobilePill
      label={locale.t("ui.popular-vehicle-filters.budget")}
      trailingIcon="chevron-down"
      onclick={() => openPanel("budget")}
      popup="dialog"
      expanded={open && panel === "budget"}
    />
  </MobilePillRail>
  <CatalogFilterSheet
    bind:open
    bind:draft
    bind:panel
    {items}
    {compact}
    onapply={(filters) => void goto(catalogDestination("/vehicles", filters))}
  />
{:else}
  <div
    class="d-flex align-items-center justify-content-center justify-content-lg-end popular-categories"
  >
    {#each popularVehicleFilters as filter (filter.id)}<VehicleFilterMenu
        {filter}
      />
    {/each}
  </div>
{/if}
