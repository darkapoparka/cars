<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import VehicleSearch from "#lib/components/search/VehicleSearch.svelte";
  import DealershipVehicleSearch from "#lib/components/search/DealershipVehicleSearch.svelte";
  let { dealership = false }: { dealership?: boolean } = $props();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if dealership && desktop.current}
  <section class="box-section karento-catalog-search">
    <DealershipVehicleSearch syncWithCatalog />
  </section>
{:else}
  <section class="box-section box-search-advance-home10 background-body">
    <div class="container">
      <VehicleSearch fieldIdPrefix="field-d473775e" />
    </div>
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .karento-catalog-search {
      position: relative;
      z-index: 30;
      width: min(960px, 100%);
      margin-inline: auto;
    }
  }
</style>
