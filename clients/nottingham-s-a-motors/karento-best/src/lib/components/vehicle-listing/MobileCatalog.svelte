<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { afterNavigate, goto } from "$app/navigation";
  import { onDestroy, tick } from "svelte";
  import { dealer } from "#lib/content.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import type {
    ListingVehicle,
    ListingProduct,
  } from "#lib/data/vehicle-listing.ts";
  import {
    emptyCatalogFilters,
    catalogFilterKeys,
    catalogSortOptions,
    readCatalogFilters,
    matchCatalog,
    catalogDestination,
    type CatalogFilters,
    type CatalogPanel,
  } from "#lib/data/mobile-catalog.ts";
  import ListingVehicleGrid from "./ListingVehicleGrid.svelte";
  import ListingProductGrid from "./ListingProductGrid.svelte";
  import CatalogFilterSheet from "./CatalogFilterSheet.svelte";

  let {
    cards = [],
    products,
    columns = 4,
  }: {
    cards?: readonly ListingVehicle[];
    products?: readonly ListingProduct[];
    columns?: 3 | 4;
  } = $props();

  const productMode = $derived(products !== undefined);
  const noun = $derived(
    productMode
      ? locale.t("catalog.products")
      : locale.t("ui.mobile-catalog.vehicles"),
  );
  const inventory = $derived(
    cards.map((card) => ({ ...card, ...dealer.inventory[card.title] })),
  );
  const items = $derived(products ?? inventory);
  const applied = $derived(readCatalogFilters(page.url.searchParams));
  let draft = $state<CatalogFilters>({ ...emptyCatalogFilters });
  let panel = $state<CatalogPanel>("filters");
  let open = $state(false);
  let compact = $state(false);
  let active = true;
  const activeCount = $derived(
    catalogFilterKeys.filter((key) => applied[key]).length,
  );
  const visible = $derived(matchCatalog(inventory, applied));
  const visibleProducts = $derived(matchCatalog(products ?? [], applied));
  const visibleCount = $derived(
    productMode ? visibleProducts.length : visible.length,
  );
  const sortLabel = $derived(
    locale.t(
      catalogSortOptions.find((option) => option.value === applied.sort)
        ?.labelKey ?? "catalog.order.default",
    ),
  );
  const countLabel = $derived(
    locale.count(visibleCount, productMode ? "products" : "vehicles"),
  );
  const resultLabel = $derived(
    [
      countLabel,
      ...catalogFilterKeys
        .filter((key) => applied[key])
        .map((key) =>
          key === "q"
            ? locale.t("catalog.searchQuery", { query: applied.q })
            : `${key === "make" ? locale.t("ui.mobile-catalog.make") : key === "model" ? locale.t("ui.mobile-catalog.model") : locale.t("ui.mobile-catalog.budget")}: ${filterLabel(key)}`,
        ),
      ...(applied.sort ? [sortLabel] : []),
    ].join(" · "),
  );

  function filterLabel(key: (typeof catalogFilterKeys)[number]) {
    return key === "budget"
      ? "≤ " +
          locale.money(
            Number(applied.budget),
            dealer.businessPreview?.currency || "USD",
          ) +
          (productMode || dealer.businessPreview
            ? ""
            : "/" + locale.t("unit.day"))
      : applied[key];
  }

  function openFilters(nextPanel: CatalogPanel = "filters") {
    draft = { ...applied };
    panel = nextPanel;
    compact = nextPanel === "budget" || nextPanel === "sort";
    open = true;
  }

  async function update(
    filters: CatalogFilters,
    focusTarget?: HTMLButtonElement | null,
  ) {
    open = false;
    await goto(
      locale.href(
        catalogDestination(
          page.url.pathname,
          filters,
          page.url.searchParams,
          page.url.hash,
        ),
      ),
      { reset: false },
    );
    if (focusTarget) {
      await tick();
      if (active && focusTarget.isConnected)
        focusTarget.focus({ preventScroll: true });
    }
  }

  function selectorFor(
    control: HTMLButtonElement,
    key?: (typeof catalogFilterKeys)[number],
  ) {
    const className =
      key && key !== "q" ? `.mobile-${key}-trigger` : ".mobile-filter-trigger";
    return control
      .closest("section")
      ?.querySelector<HTMLButtonElement>(className);
  }

  function removeFilter(
    key: (typeof catalogFilterKeys)[number],
    control: HTMLButtonElement,
  ) {
    return update(
      {
        ...applied,
        [key]: "",
        ...(key === "make" ? { model: "" } : {}),
      },
      selectorFor(control, key),
    );
  }

  function clearFilters(control: HTMLButtonElement) {
    return update(
      { ...emptyCatalogFilters, sort: applied.sort },
      selectorFor(control),
    );
  }

  afterNavigate(async () => {
    if (page.url.searchParams.get("filters") !== "open") return;
    await tick();
    if (active && page.url.searchParams.get("filters") === "open")
      openFilters();
  });
  onDestroy(() => {
    active = false;
  });
</script>

<MobilePillRail
  class="mobile-catalog-tools"
  label={productMode
    ? locale.t("ui.mobile-catalog.product-filters")
    : locale.t("catalog.tools")}
>
  <MobilePill
    class="mobile-filter-trigger"
    label={locale.t("ui.mobile-catalog.filters")}
    leadingIcon="filters"
    count={activeCount}
    selected={activeCount > 0}
    onclick={() => openFilters()}
    ariaLabel={locale.t(
      productMode ? "catalog.productFilterTitle" : "catalog.vehicleFilters",
    )}
    popup="dialog"
    expanded={open && panel === "filters"}
  />
  <MobilePill
    class="mobile-sort-trigger"
    label={locale.t("ui.mobile-catalog.sort-by")}
    leadingIcon="sort"
    selected={!!applied.sort}
    ariaLabel={locale.t("catalog.sortLabel", {
      entity: noun,
      order: sortLabel,
    })}
    popup="dialog"
    expanded={open && panel === "sort"}
    onclick={() => openFilters("sort")}
  />
  {#if !productMode}<MobilePill
      class="mobile-make-trigger"
      label={applied.make || locale.t("ui.mobile-catalog.make")}
      trailingIcon="chevron-down"
      selected={!!applied.make}
      onclick={() => openFilters("make")}
      popup="dialog"
      expanded={open && panel === "make"}
    />
    <MobilePill
      class="mobile-model-trigger"
      label={applied.model || locale.t("ui.mobile-catalog.model")}
      trailingIcon="chevron-down"
      selected={!!applied.model}
      onclick={() => openFilters("model")}
      popup="dialog"
      expanded={open && panel === "model"}
    />{/if}
  <MobilePill
    class="mobile-budget-trigger"
    label={applied.budget
      ? filterLabel("budget")
      : locale.t("ui.mobile-catalog.budget")}
    trailingIcon="chevron-down"
    selected={!!applied.budget}
    onclick={() => openFilters("budget")}
    popup="dialog"
    expanded={open && panel === "budget"}
  />
</MobilePillRail>

<div class="mobile-catalog-results">
  <p
    class={activeCount ? "visually-hidden" : "mobile-result-count"}
    data-catalog-count
    role="status"
    aria-label={resultLabel}
    aria-live="polite"
    aria-atomic="true"
    title={resultLabel}
  >
    {activeCount ? resultLabel : countLabel}
  </p>
  {#if activeCount}
    <MobilePillRail
      class="mobile-active-filters"
      variant="secondary"
      label={locale.t("catalog.selectedFilters", { entity: noun })}
    >
      {#each catalogFilterKeys as key (key)}
        {#if applied[key]}<MobilePill
            label={filterLabel(key)}
            trailingIcon="close"
            variant="secondary"
            onclick={(event) => removeFilter(key, event.currentTarget)}
            ariaLabel={locale.t("catalog.removeFilter", {
              field:
                key === "budget" ? locale.t("catalog.budget") : applied[key],
            })}
          />{/if}
      {/each}
      <MobilePill
        label={locale.t("ui.mobile-catalog.clear-all")}
        variant="secondary"
        onclick={(event) => clearFilters(event.currentTarget)}
      />
    </MobilePillRail>
  {/if}
</div>

{#if visibleCount}
  {#if productMode}<ListingProductGrid
      products={visibleProducts}
    />{:else}<ListingVehicleGrid cards={visible} {columns} />{/if}
{:else}
  <div class="mobile-empty-results"
    ><h3>{locale.t("ui.mobile-catalog.no-matching")} {noun}</h3><p
      >{locale.t("ui.mobile-catalog.try-another-search-or-a-wider-budget")}</p
    ><MobilePill
      label={locale.t("ui.mobile-catalog.clear-filters")}
      variant="secondary"
      onclick={(event) => clearFilters(event.currentTarget)}
    /></div
  >
{/if}

<CatalogFilterSheet
  bind:open
  bind:draft
  bind:panel
  {items}
  {productMode}
  {compact}
  onapply={update}
/>

<style>
  .mobile-catalog-results {
    display: flex;
    align-items: center;
    min-block-size: var(--karento-touch-target);
  }

  .mobile-catalog-results .mobile-result-count {
    margin: 0;
    white-space: nowrap;
  }
</style>
