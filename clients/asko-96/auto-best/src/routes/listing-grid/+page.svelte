<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import './listing.css';
  import VehicleSearchDialog from '$components/listing/VehicleSearchDialog.svelte';
  import ListingHero from '$components/listing/ListingHero.svelte';
  import ListingFilters from '$components/listing/ListingFilters.svelte';
  import ListingResults from '$components/listing/ListingResults.svelte';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let draftFilters = $derived(data.filters);
</script>

<svelte:head>
  <title>{i18n.t("m_270ca25eca2a", { p0: brand.name })}</title>
  <meta name="description" content={i18n.t("m_ab0bddd89743", { p0: i18n.dealer('city') })} />
</svelte:head>

<VehicleSearchDialog filters={draftFilters}>
{#snippet children(openFilters, filtersOpen)}
<div class="dn-listing-stage" data-layout="hero-discovery">
  <ListingHero count={data.vehicles.length} />
  <ListingFilters filters={data.filters} {openFilters} {filtersOpen} onDraftChange={(filters) => draftFilters = filters} />
</div>
<ListingResults filters={data.filters} vehicles={data.vehicles} {draftFilters} {openFilters} {filtersOpen} />
{/snippet}
</VehicleSearchDialog>
