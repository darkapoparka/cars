<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { dealer } from "#lib/content.ts";
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
  import {
    readDesktopCatalogFilters,
    matchDesktopCatalog,
    clearDesktopCatalogDestination,
    desktopCatalogFilterKeys,
  } from "#lib/data/desktop-catalog.ts";
  import ListingToolbar from "./ListingToolbar.svelte";
  import ListingVehicleGrid from "./ListingVehicleGrid.svelte";
  import ListingPagination from "./ListingPagination.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import DesktopCatalogFilters from "./DesktopCatalogFilters.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
  let { cards }: { cards: readonly ListingVehicle[] } = $props();
  const inventory = $derived(
    cards.map((card) => ({ ...card, ...dealer.inventory[card.title] })),
  );
  const filters = $derived(readDesktopCatalogFilters(page.url.searchParams));
  const filtered = $derived(matchDesktopCatalog(inventory, filters));
  const active = $derived(
    desktopCatalogFilterKeys.filter((key) => filters[key]),
  );
  const clearHref = $derived(
    clearDesktopCatalogDestination(page.url.pathname, page.url.searchParams),
  );
</script>

{#if desktop.current}
  <DesktopCatalogFilters
    {cards}
    count={filtered.length}
    total={inventory.length}
    {filters}
  />
  {#if filtered.length}
    <ListingVehicleGrid cards={filtered} columns={4} />
  {:else}
    <div class="catalog-empty">
      <h3 class="desktop-type-panel"
        >{locale.t("ui.desktop-catalog-results.no-matching-vehicles")}</h3
      >
      <p class="desktop-type-body"
        >{locale.t("ui.desktop-catalog-results.try-adjusting-your-filters")}</p
      >
      <a
        class="btn btn-brand-2 desktop-type-control"
        href={locale.href(clearHref)}
        >{locale.t("ui.desktop-catalog-results.browse-all-vehicles")}</a
      >
    </div>
  {/if}
{:else if active.length}
  <div class="catalog-summary">
    <p role="status" aria-live="polite" class="desktop-type-body"
      >{locale.t("reference.controls.found", {
        results: locale.count(filtered.length),
      })}</p
    >
    <a href={locale.href(clearHref)}
      >{locale.t("ui.desktop-catalog-results.clear-filters")}</a
    >
  </div>
  <div
    class="catalog-selection"
    aria-label={locale.t("ui.desktop-catalog-results.selected-filters")}
  >
    {#each active as key (key)}<span
        >{key === "budget"
          ? locale.t("catalog.maximumPrice") + ": "
          : key === "type"
            ? locale.t("catalog.type") + ": "
            : ""}{filters[key]}</span
      >{/each}
  </div>
  {#if filtered.length}<ListingVehicleGrid
      cards={filtered}
      columns={4}
    />{:else}
    <div class="catalog-empty"
      ><h3 class="desktop-type-panel"
        >{locale.t("ui.desktop-catalog-results.no-matching-vehicles")}</h3
      ><p class="desktop-type-body"
        >{locale.t(
          "ui.desktop-catalog-results.try-a-different-type-make-model-or-budget",
        )}</p
      ><a
        class="btn btn-brand-2 desktop-type-control"
        href={locale.href(clearHref)}
        >{locale.t("ui.desktop-catalog-results.browse-all-vehicles")}</a
      ></div
    >
  {/if}
{:else}
  <ListingToolbar flushSortToggle />
  <ListingVehicleGrid {cards} columns={4} />
  <ListingPagination />
{/if}

<style>
  .catalog-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 12px 0;
  }
  .catalog-summary p {
    margin: 0;
    font-weight: 600;
  }
  .catalog-summary a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .catalog-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
  .catalog-selection span {
    padding: 7px 12px;
    border: 1px solid #dedede;
    border-radius: 20px;
    color: #333;
    font-size: 14px;
  }
  .catalog-empty {
    padding: 50px 24px;
    text-align: center;
  }
  .catalog-empty h3 {
    margin-bottom: 14px;
  }
  .catalog-empty p {
    margin-bottom: 22px;
  }

  @media (min-width: 992px) {
    .catalog-summary {
      gap: var(--karento-desktop-panel-gap);
      padding-block: var(--karento-desktop-space-3);
    }
    .catalog-selection {
      gap: var(--karento-desktop-space-2);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .catalog-selection span {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .catalog-empty {
      padding: var(--karento-desktop-space-12)
        var(--karento-desktop-panel-padding);
    }
  }
</style>
