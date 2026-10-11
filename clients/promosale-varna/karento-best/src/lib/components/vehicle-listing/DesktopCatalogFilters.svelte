<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/state";
  import { dealer } from "#lib/content.ts";
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
  import {
    desktopCatalogDestination,
    desktopCatalogFilterKeys,
    desktopCatalogFilterMessageKeys,
    desktopCatalogFilterValue,
    clearDesktopCatalogDestination,
    removeDesktopCatalogFilterDestination,
    type DesktopCatalogFilters as CatalogFilters,
  } from "#lib/data/desktop-catalog.ts";
  import DesktopCatalogToolbar from "./DesktopCatalogToolbar.svelte";
  import DesktopCatalogFilterDialog from "./DesktopCatalogFilterDialog.svelte";
  import DesktopCatalogFilterModal from "./DesktopCatalogFilterModal.svelte";
  import type { DesktopFilterLayout } from "#lib/data/desktop-catalog-modal.ts";

  let {
    cards,
    count,
    total,
    filters,
  }: {
    cards: readonly ListingVehicle[];
    count: number;
    total: number;
    filters: CatalogFilters;
  } = $props();
  let filterLayout = $state<DesktopFilterLayout | null>(null);
  const defaultLayout = $derived(dealer.vehicleFilters?.layout ?? "drawer");
  const showLayoutOptions = $derived(
    dealer.vehicleFilters?.showLayoutOptions ??
      dealer.contentStatus === "reference-demo",
  );
  const id = $props.id();
  const filterDialogId = id + "-filters";
  const inventory = $derived(
    cards.map((card) => ({ ...card, ...dealer.inventory[card.title] })),
  );
  const active = $derived(
    desktopCatalogFilterKeys.filter((key) => filters[key]),
  );
  const currency = $derived(inventory[0]?.price.match(/^[^\d\s]+/)?.[0] ?? "$");
  const clearHref = $derived(
    clearDesktopCatalogDestination(page.url.pathname, page.url.searchParams),
  );

  afterNavigate(() => (filterLayout = null));

  function apply(next: CatalogFilters) {
    filterLayout = null;
    void goto(
      locale.href(
        desktopCatalogDestination(
          page.url.pathname,
          next,
          page.url.searchParams,
        ),
      ),
      { reset: false },
    );
  }

  function navigate(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    void goto(locale.href(event.currentTarget.href), { reset: false });
  }
</script>

<div
  class="desktop-catalog-filters"
  role="group"
  aria-label={locale.t("ui.desktop-catalog-filters.vehicle-filters")}
>
  <DesktopCatalogToolbar
    {count}
    {total}
    {filters}
    filtersOpen={filterLayout === defaultLayout}
    alternativeOpen={filterLayout !== null && filterLayout !== defaultLayout}
    {defaultLayout}
    {showLayoutOptions}
    {filterDialogId}
    onfilters={() => (filterLayout = defaultLayout)}
    onalternative={() =>
      (filterLayout = defaultLayout === "drawer" ? "modal" : "drawer")}
  >
    {#snippet selectedFilters()}
      {#if active.length}
        <div
          class="catalog-applied"
          role="group"
          aria-label={locale.t(
            "ui.desktop-catalog-filters.selected-vehicle-filters",
          )}
        >
          {#each active as key (key)}
            <a
              class="catalog-filter-pill desktop-type-pill"
              aria-label={locale.t("catalog.removeFilter", {
                field: locale.t(desktopCatalogFilterMessageKeys[key]),
              })}
              href={locale.href(
                removeDesktopCatalogFilterDestination(
                  page.url.pathname,
                  page.url.searchParams,
                  key,
                ),
              )}
              onclick={navigate}
            >
              <span
                >{desktopCatalogFilterValue(
                  key,
                  filters[key],
                  currency,
                  locale.locale,
                )}</span
              >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                ><path
                  d="m4 4 8 8M12 4l-8 8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                /></svg
              >
            </a>
          {/each}
          <a
            class="catalog-clear desktop-type-meta"
            href={locale.href(clearHref)}
            onclick={navigate}
            >{locale.t("ui.desktop-catalog-filters.clear-filters")}</a
          >
        </div>
      {/if}
    {/snippet}
  </DesktopCatalogToolbar>
</div>

{#if filterLayout === "drawer"}
  <DesktopCatalogFilterDialog
    id={filterDialogId}
    items={inventory}
    {filters}
    onapply={apply}
    onclose={() => (filterLayout = null)}
  />
{:else if filterLayout === "modal"}
  <DesktopCatalogFilterModal
    id={filterDialogId}
    items={inventory}
    {filters}
    onapply={apply}
    onclose={() => (filterLayout = null)}
  />
{/if}

<style>
  .desktop-catalog-filters {
    padding-top: 8px;
    margin-bottom: 24px;
  }
  .catalog-applied {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }
  .catalog-filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 34px;
    max-width: 320px;
    padding: 6px 12px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-neutral-100, #f5f5f5);
    color: var(--bs-neutral-1000, #171717);
    font-size: 13px;
    line-height: 20px;
    text-decoration: none;
  }
  .catalog-filter-pill span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .catalog-filter-pill svg {
    flex-shrink: 0;
  }
  .catalog-filter-pill:hover {
    border-color: var(--bs-neutral-500, #737373);
    color: var(--bs-neutral-1000, #171717) !important;
  }
  .catalog-clear {
    padding: 6px 8px;
    color: var(--bs-neutral-500, #737373);
    font-size: 13px;
    line-height: 20px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .catalog-clear:hover {
    color: var(--bs-neutral-1000, #171717) !important;
  }
  a:focus-visible {
    outline: 2px solid var(--bs-neutral-1000, #171717) !important;
    outline-offset: 3px;
  }

  @media (min-width: 992px) {
    .desktop-catalog-filters {
      padding-top: var(--karento-desktop-space-2);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .catalog-applied {
      gap: var(--karento-desktop-space-2);
    }
    .catalog-filter-pill {
      border-radius: var(--karento-desktop-pill-radius);
    }
  }
</style>
