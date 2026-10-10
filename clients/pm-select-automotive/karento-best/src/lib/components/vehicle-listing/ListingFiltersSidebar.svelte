<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingMapFilter from "./ListingMapFilter.svelte";
  import ListingPriceFilter from "./ListingPriceFilter.svelte";
  import ListingChoiceFilter from "./ListingChoiceFilter.svelte";
  import ListingRatingFilter from "./ListingRatingFilter.svelte";
  import { listingFilterChoices } from "#lib/data/vehicle-listing.ts";
  let {
    kind = "vehicle",
    hidden = false,
  }: { kind?: "vehicle" | "product"; hidden?: boolean } = $props();
</script>

<div class={["content-left order-lg-first", { "d-none": hidden }]}>
  {#if kind === "vehicle"}<ListingMapFilter />{/if}
  <ListingPriceFilter />
  {#if kind === "vehicle"}
    <ListingChoiceFilter
      title={locale.t("ui.listing-filters-sidebar.car-type")}
      choices={listingFilterChoices["Car type"]}
      seeMoreClass="box-see-more mt-20 mb-25"
    />
    <ListingChoiceFilter
      title={locale.t("reference.controls.amenities")}
      choices={listingFilterChoices["Car Amenities"]}
      seeMoreClass="box-see-more mt-20 mb-25"
    />
  {:else}
    <ListingChoiceFilter
      title={locale.t("ui.listing-filters-sidebar.categories")}
      choices={listingFilterChoices.Categories}
      seeMoreClass="box-see-more mt-20 mb-25"
    />
    <ListingChoiceFilter
      title={locale.t("ui.listing-filters-sidebar.brands")}
      choices={listingFilterChoices.Brands}
      seeMoreClass="box-see-more mt-20 mb-25"
    />
  {/if}
  <ListingChoiceFilter
    title={locale.t("ui.listing-filters-sidebar.fuel-type")}
    choices={listingFilterChoices["Fuel Type"]}
  />
  <ListingRatingFilter />
  {#if kind === "vehicle"}
    <ListingChoiceFilter
      title={locale.t("ui.listing-filters-sidebar.booking-location")}
      choices={listingFilterChoices["Booking Location"]}
      seeMoreClass="box-see-more"
    />
  {/if}
</div>
