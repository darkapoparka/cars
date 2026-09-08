<script lang="ts">
  import './listing.css';
  import VehicleSearchDialog from '$components/listing/VehicleSearchDialog.svelte';
  import ListingHero from '$components/listing/ListingHero.svelte';
  import ListingFilters from '$components/listing/ListingFilters.svelte';
  import ListingResults from '$components/listing/ListingResults.svelte';
  import { brand, dealerSource } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let draftFilters = $derived(data.filters);
</script>

<svelte:head>
  <title>Автомобили от обявите — {brand.name}</title>
  <meta name="description" content={`${brand.name}, ${brand.city}. ${dealerSource.inventoryNotice}`} />
</svelte:head>

<VehicleSearchDialog filters={draftFilters}>
  {#snippet children(openFilters, filtersOpen)}
    <div class="dn-listing-stage">
      <ListingHero count={data.vehicles.length} />
      <ListingFilters filters={data.filters} {openFilters} {filtersOpen} onDraftChange={filters => draftFilters = filters} />
    </div>
    <ListingResults filters={data.filters} vehicles={data.vehicles} {draftFilters} {openFilters} {filtersOpen} />
  {/snippet}
</VehicleSearchDialog>
