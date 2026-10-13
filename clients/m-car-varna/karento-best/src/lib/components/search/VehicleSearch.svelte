<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import DealershipVehicleSearch from "./DealershipVehicleSearch.svelte";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import CategoryTabs from "./CategoryTabs.svelte";
  import LocationField from "./LocationField.svelte";
  import DateField from "./DateField.svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { dealer } from "#lib/content.ts";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import CatalogFilterSheet from "#lib/components/vehicle-listing/CatalogFilterSheet.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import {
    emptyCatalogFilters,
    readCatalogFilters,
    catalogDestination,
    type CatalogFilters,
    type CatalogPanel,
  } from "#lib/data/mobile-catalog.ts";
  import {
    referenceVehicleSearch,
    type VehicleSearchContent,
  } from "#lib/data/search.ts";
  let {
    fieldIdPrefix,
    class: className = "",
    content = referenceVehicleSearch,
    kind = "vehicle",
  }: {
    fieldIdPrefix: string;
    class?: string;
    content?: VehicleSearchContent;
    kind?: "vehicle" | "product";
  } = $props();
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const optionsId = $props.id();
  const applied = $derived(readCatalogFilters(page.url.searchParams));
  const inventory = $derived(
    vehicleListings.gridFourColumns.map((card) => ({
      ...card,
      ...dealer.inventory[card.title],
    })),
  );
  const searchLabel = $derived(
    applied.q ||
      [applied.make, applied.model].filter(Boolean).join(" ") ||
      locale.t("ui.vehicle-search.make-or-model"),
  );
  let open = $state(false);
  let draft = $state<CatalogFilters>({ ...emptyCatalogFilters });
  let panel = $state<CatalogPanel>("search");

  function openSearch(nextPanel: CatalogPanel = "search") {
    draft = { ...applied };
    panel = nextPanel;
    open = true;
  }

  function applySearch(filters: CatalogFilters) {
    open = false;
    void goto(
      locale.href(
        catalogDestination(
          "/vehicles",
          filters,
          page.params.path === "vehicles"
            ? page.url.searchParams
            : new URLSearchParams(),
          "#vehicle-results",
        ),
      ),
    );
  }
</script>

{#snippet searchIcon()}
  <svg
    class="me-2"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M19 19L14.6569 14.6569M14.6569 14.6569C16.1046 13.2091 17 11.2091 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17C11.2091 17 13.2091 16.1046 14.6569 14.6569Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
{/snippet}

{#if mobile.current && kind === "vehicle"}
  <div
    class="mobile-catalog-search mobile-vehicle-search"
    role="search"
    aria-label={locale.t("ui.vehicle-search.find-a-vehicle")}
  >
    <button
      type="button"
      class="mobile-search-opener"
      aria-label={locale.t("ui.vehicle-search.make-or-model")}
      aria-haspopup="dialog"
      aria-expanded={open}
      onclick={() => openSearch()}
    >
      <MobileIcon name="search" size="action" />
      <span>{searchLabel}</span>
    </button>
    <MobilePill
      label={locale.t("ui.vehicle-search.open-vehicle-filters")}
      leadingIcon="filters"
      iconOnly
      popup="dialog"
      expanded={open && panel === "filters"}
      onclick={() => openSearch("filters")}
      class="mobile-search-filter"
    />
  </div>
  <CatalogFilterSheet
    bind:open
    bind:draft
    bind:panel
    items={inventory}
    onapply={applySearch}
  />
{:else if mobile.current}
  <form
    class="mobile-catalog-search"
    action={locale.href(kind === "product" ? "/shop" : "/vehicles")}
    method="GET"
    role="search"
    aria-label={kind === "product"
      ? locale.t("catalog.findProduct")
      : locale.t("ui.vehicle-search.find-a-vehicle")}
  >
    <input type="hidden" name="lang" value={locale.locale} />
    {#each ["make", "model", "budget", "sort"] as key (key)}
      {#if page.url.searchParams.get(key)}
        <input
          type="hidden"
          name={key}
          value={page.url.searchParams.get(key) ?? ""}
        />
      {/if}
    {/each}
    <label class="visually-hidden" for={optionsId}
      >{kind === "product"
        ? locale.t("catalog.searchParts")
        : locale.t("ui.vehicle-search.make-or-model")}</label
    >
    <div class="mobile-search-input">
      <MobileIcon name="search" size="action" />
      <input
        id={optionsId}
        name="q"
        type="search"
        placeholder={kind === "product"
          ? locale.t("catalog.searchParts")
          : locale.t("ui.vehicle-search.make-or-model")}
        value={page.url.searchParams.get("q") ?? ""}
        class="desktop-type-body-small"
      />
    </div>
    <button
      type="submit"
      aria-label={kind === "product"
        ? locale.t("ui.vehicle-search.search-products")
        : locale.t("catalog.searchVehicles")}
      class="mobile-search-submit"
      ><MobileIcon name="arrow-right" size="action" /></button
    >
  </form>
{:else if dealer.businessPreview && kind === "vehicle"}
  <DealershipVehicleSearch syncWithCatalog={page.params.path === "vehicles"} />
{:else}
  <div class={["box-search-advance background-card", className]}>
    <div class="box-top-search">
      <CategoryTabs options={content.categories} />
      <div class="right-top-search d-none d-md-flex">
        <a
          class="text-sm-medium need-some-help desktop-type-meta"
          href={locale.href(content.help.href)}
          aria-label={locale.text(content.help.label)}
          >{locale.text(content.help.label)}</a
        >
      </div>
    </div>
    <div class="box-bottom-search background-card" id={optionsId}>
      <LocationField
        id={fieldIdPrefix + "-0"}
        label={locale.text(content.pickupLocation.label)}
        value={content.pickupLocation.value}
        options={content.locations}
      />
      <LocationField
        id={fieldIdPrefix + "-3"}
        label={locale.text(content.dropoffLocation.label)}
        value={content.dropoffLocation.value}
        options={content.locations}
        class="item-search item-search-2"
      />
      <DateField
        id={fieldIdPrefix + "-6"}
        label={locale.text(content.pickupDate.label)}
        value={content.pickupDate.value}
        class="item-search item-search-3"
      />
      <DateField
        id={fieldIdPrefix + "-7"}
        label={locale.text(content.returnDate.label)}
        value={content.returnDate.value}
        class="item-search bd-none"
      />
      <div class="item-search bd-none d-flex justify-content-end">
        <DemoActionButton
          class="btn btn-brand-2 text-nowrap desktop-type-control"
          aria-label={locale.text(content.actionLabel)}
          type="button"
        >
          {@render searchIcon()}
          {locale.text(content.actionLabel)}
        </DemoActionButton>
      </div>
    </div>
  </div>
{/if}
