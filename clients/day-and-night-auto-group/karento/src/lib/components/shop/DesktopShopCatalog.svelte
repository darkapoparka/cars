<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { afterNavigate, goto } from "$app/navigation";
  import { MediaQuery } from "svelte/reactivity";
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  import {
    desktopShopDestination,
    matchDesktopShop,
    readDesktopShopFilters,
    shopFilterKeys,
    shopFilterLabel,
    shopSortOptions,
    type DesktopShopFilters,
  } from "#lib/data/desktop-shop.ts";
  import DesktopShopProductCard from "./DesktopShopProductCard.svelte";
  import DesktopShopFilterDialog from "./DesktopShopFilterDialog.svelte";
  import {
    availableShopBrands,
    availableShopCategories,
    withShopReferenceFacets,
  } from "#lib/data/shop-reference-facets.ts";
  import PartsHero from "#lib/sections/PartsHero.svelte";
  let { products }: { products: readonly ListingProduct[] } = $props();
  let priceError = $state("");
  let filtersOpen = $state(false);
  const desktop = new MediaQuery("(min-width: 992px)");
  const id = $props.id();
  const dialogId = id + "-shop-filters";
  const catalogue = $derived(withShopReferenceFacets(products));
  const categories = $derived(availableShopCategories(catalogue));
  const filters = $derived(readDesktopShopFilters(page.url.searchParams));
  const results = $derived(matchDesktopShop(catalogue, filters));
  const selected = $derived(shopFilterKeys.filter((key) => filters[key]));
  const clearHref = $derived(
    destination({
      ...readDesktopShopFilters(new URLSearchParams()),
      sort: filters.sort,
    }),
  );

  function destination(next: DesktopShopFilters) {
    return desktopShopDestination(
      page.url.pathname,
      next,
      page.url.searchParams,
      page.url.hash,
    );
  }

  function update(next: DesktopShopFilters) {
    priceError = "";
    filtersOpen = false;
    void goto(locale.href(destination(next)), { reset: false });
  }

  function selectCategory(category: string) {
    const brands = availableShopBrands(catalogue, category);
    update({
      ...filters,
      category,
      brand: brands.includes(filters.brand) ? filters.brand : "",
    });
  }

  function navigate(event: MouseEvent & { currentTarget: HTMLAnchorElement }) {
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

  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parameters = new URLSearchParams(Object.entries(filters));
    for (const key of ["q", "minPrice", "budget"])
      parameters.set(key, String(data.get(key) ?? ""));
    parameters.set("sort", filters.sort);
    const draft = readDesktopShopFilters(parameters);
    if (
      draft.minPrice &&
      draft.budget &&
      Number(draft.minPrice) > Number(draft.budget)
    ) {
      priceError = locale.t("reference.shop.price.rangeError");
      return;
    }
    update(draft);
  }

  afterNavigate(() => {
    priceError = "";
    filtersOpen = false;
  });
</script>

<PartsHero>
  {#snippet searchControls()}
    <form class="shop-search" method="get" onsubmit={submit}>
      <input type="hidden" name="lang" value={locale.locale} />
      <label class="shop-keyword"
        ><span class="desktop-type-label"
          >{locale.t("ui.desktop-shop-catalog.search-products")}</span
        ><input
          type="search"
          name="q"
          value={filters.q}
          placeholder={locale.t(
            "ui.desktop-shop-catalog.product-name-or-keyword",
          )}
          class="desktop-type-body-small"
        /></label
      >
      <fieldset
        ><legend class="desktop-type-label"
          ><span>{locale.t("ui.desktop-shop-catalog.price")}</span
          >{#if priceError}<span
              class="shop-price-error desktop-type-meta"
              id="shop-price-error"
              role="alert">{priceError}</span
            >{/if}</legend
        ><div class="shop-price-fields"
          ><label
            ><span class="visually-hidden"
              >{locale.t("ui.desktop-shop-catalog.minimum-price")}</span
            ><input
              type="number"
              name="minPrice"
              min="0"
              step="0.01"
              value={filters.minPrice}
              placeholder={locale.t("ui.desktop-shop-catalog.min")}
              aria-invalid={priceError ? "true" : undefined}
              aria-describedby={priceError ? "shop-price-error" : undefined}
              oninput={() => {
                priceError = "";
              }}
              class="desktop-type-body-small"
            /></label
          ><span aria-hidden="true">–</span><label
            ><span class="visually-hidden"
              >{locale.t("ui.desktop-shop-catalog.maximum-price")}</span
            ><input
              type="number"
              name="budget"
              min="0"
              step="0.01"
              value={filters.budget}
              placeholder={locale.t("ui.desktop-shop-catalog.max")}
              aria-invalid={priceError ? "true" : undefined}
              aria-describedby={priceError ? "shop-price-error" : undefined}
              oninput={() => {
                priceError = "";
              }}
              class="desktop-type-body-small"
            /></label
          ></div
        ></fieldset
      >
      <button class="shop-search-button desktop-type-control" type="submit"
        ><svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          ><circle
            cx="8.5"
            cy="8.5"
            r="5.5"
            stroke="currentColor"
            stroke-width="1.6"
          /><path
            d="m13 13 4 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          /></svg
        >{locale.t("ui.desktop-shop-catalog.search")}</button
      >
    </form>
    <nav
      class="shop-category-pills"
      aria-label={locale.t("ui.desktop-shop-catalog.product-categories")}
    >
      <button
        type="button"
        class={["desktop-type-pill", { active: !filters.category }]}
        aria-pressed={!filters.category}
        onclick={() => selectCategory("")}
        >{locale.t("ui.desktop-shop-catalog.all-products")}</button
      >
      {#each categories as category (category.value)}
        <button
          type="button"
          class={[
            "desktop-type-pill",
            { active: filters.category === category.value },
          ]}
          aria-pressed={filters.category === category.value}
          onclick={() => selectCategory(category.value)}
          >{locale.t(category.labelKey)}</button
        >
      {/each}
    </nav>
  {/snippet}
</PartsHero>
<section
  class="shop-desktop-catalog container"
  aria-label={locale.t("ui.desktop-shop-catalog.browse-reference-products")}
  id="shop-results"
>
  <div class="shop-results-toolbar">
    <div class="shop-result-summary"
      ><p
        role="status"
        aria-live="polite"
        data-desktop-shop-count
        class="desktop-type-body-small"
        ><strong>{results.length}</strong>{selected.length
          ? locale.t("reference.shop.count.of", {
              count: locale.number(products.length),
            })
          : ""}
        {(selected.length ? products.length : results.length) === 1
          ? locale.t("reference.shop.product.one")
          : locale.t("reference.shop.product.other")}</p
      ><span class="desktop-type-meta"
        >{locale.t("ui.desktop-shop-catalog.reference-collection")}</span
      ></div
    >
    <div
      class="shop-selected-filters"
      aria-label={locale.t("ui.desktop-shop-catalog.selected-product-filters")}
    >
      {#if selected.length}
        {#each selected as key (key)}
          <a
            href={locale.href(destination({ ...filters, [key]: "" }))}
            onclick={navigate}
            aria-label={locale.t("reference.shop.removeFilter", {
              filter: shopFilterLabel(key, filters[key], locale.locale),
            })}
            class="desktop-type-pill"
            ><span class="filter-value"
              >{shopFilterLabel(key, filters[key], locale.locale)}</span
            ><span aria-hidden="true">×</span></a
          >
        {/each}
        <a
          class="shop-clear-filters desktop-type-meta"
          href={locale.href(clearHref)}
          onclick={navigate}>{locale.t("ui.desktop-shop-catalog.clear-all")}</a
        >
      {/if}
    </div>
    <div class="shop-results-controls">
      <button
        type="button"
        class="shop-filter-button desktop-type-control"
        aria-label={locale.t("ui.desktop-shop-catalog.product-filters")}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen}
        aria-controls={!desktop.current || filtersOpen ? dialogId : undefined}
        onclick={() => (filtersOpen = true)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          ><path
            d="M3 5h14M3 10h14M3 15h14"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          /><path
            d="M7 3v4M13 8v4M7 13v4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          /></svg
        >
        {locale.t("ui.desktop-shop-catalog.filters")}{#if selected.length}<span
            class="filter-count desktop-type-badge"
            aria-hidden="true">{selected.length}</span
          >{/if}
      </button>
      <label class="shop-sort desktop-type-label"
        ><span class="desktop-type-label"
          >{locale.t("ui.desktop-shop-catalog.sort-by")}</span
        ><select
          aria-label={locale.t("ui.desktop-shop-catalog.sort-products")}
          value={filters.sort}
          onchange={(event) =>
            update({ ...filters, sort: event.currentTarget.value })}
          class="desktop-type-body-small"
          >{#each shopSortOptions as option (option.value)}<option
              value={option.value}>{locale.t(option.labelKey)}</option
            >{/each}</select
        ></label
      >
    </div>
  </div>
  {#if results.length}<div class="shop-product-grid"
      >{#each results as product (product.id)}<DesktopShopProductCard
          {product}
        />{/each}</div
    >{:else}<div class="shop-empty"
      ><h2 class="desktop-type-panel"
        >{locale.t("ui.desktop-shop-catalog.no-matching-products")}</h2
      ><p class="desktop-type-body-small"
        >{locale.t(
          "ui.desktop-shop-catalog.try-another-category-keyword-or-price",
        )}</p
      ><a
        class="desktop-type-control"
        href={locale.href(clearHref)}
        onclick={navigate}
        >{locale.t("ui.desktop-shop-catalog.browse-all-products")}</a
      ></div
    >{/if}
</section>

{#if filtersOpen}
  <DesktopShopFilterDialog
    id={dialogId}
    products={catalogue}
    {filters}
    onapply={update}
    onclose={() => (filtersOpen = false)}
  />
{/if}

<style>
  .shop-desktop-catalog {
    padding-top: 8px;
    padding-bottom: 72px;
  }
  .shop-search {
    display: flex;
    align-items: start;
    gap: 16px;
    padding: 20px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 12px;
    background: var(--bs-background-card);
  }
  label,
  fieldset {
    margin: 0;
    min-width: 0;
  }
  label > span,
  legend {
    display: flex;
    align-items: baseline;
    gap: 8px;
    white-space: nowrap;
    margin-bottom: 7px;
    color: var(--bs-neutral-700);
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  }
  .shop-keyword {
    flex: 1;
  }
  fieldset {
    width: 260px;
    padding: 0;
    border: 0;
  }
  legend {
    float: none;
    width: auto;
    padding: 0;
  }
  input,
  select {
    height: 44px;
    margin: 0;
    padding: 0 14px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 8px;
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 14px;
  }
  input {
    width: 100%;
  }
  input::placeholder {
    color: var(--bs-neutral-500);
  }
  input:focus-visible,
  select:focus-visible,
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
  .shop-price-fields {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .shop-price-fields label {
    flex: 1;
  }
  .shop-price-fields > span {
    color: var(--bs-neutral-500);
  }
  .shop-search-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 25px;
    height: 44px;
    padding: 0 24px;
    border: 1px solid var(--bs-neutral-1000);
    border-radius: 8px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .shop-category-pills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }
  .shop-category-pills button {
    min-height: 36px;
    padding: 6px 14px;
    border: 1px solid rgb(255 255 255 / 45%);
    border-radius: 999px;
    background: rgb(0 0 0 / 18%);
    color: white;
    font: inherit;
    font-size: 13px;
    line-height: 22px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
  }
  .shop-category-pills button:hover {
    border-color: white;
    background: rgb(255 255 255 / 14%);
  }
  .shop-category-pills button.active {
    border-color: white;
    background: white;
    color: #171717;
  }
  .shop-category-pills button:focus-visible {
    outline-color: white;
  }
  .shop-results-toolbar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 0;
  }
  .shop-result-summary {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  p {
    margin: 0;
    color: var(--bs-neutral-600);
    font-size: 14px;
    line-height: 1.5;
  }
  strong {
    color: var(--bs-neutral-1000);
    font-weight: 700;
  }
  .shop-result-summary > span {
    color: var(--bs-neutral-500);
    font-size: 13px;
  }
  .shop-sort {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .shop-results-controls {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .shop-filter-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 7px 14px;
    border: 1px solid var(--bs-neutral-1000);
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    cursor: pointer;
  }
  .shop-filter-button:hover {
    border-color: #222;
    background: #222;
  }
  .shop-filter-button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000) !important;
    outline-offset: 3px;
  }
  .filter-count {
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font-size: 11px;
    line-height: 20px;
  }
  .shop-sort > span {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }
  select {
    height: 40px;
    width: auto;
    min-width: 185px;
    padding-right: 28px;
    border-radius: 999px;
    cursor: pointer;
  }
  .shop-selected-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .shop-selected-filters a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: min(100%, 280px);
    padding: 6px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 999px;
    background: var(--bs-neutral-100);
    color: var(--bs-neutral-1000);
    font-size: 13px;
    line-height: 20px;
    text-decoration: none;
    white-space: nowrap;
  }
  .filter-value {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .shop-selected-filters a > span:last-child {
    flex-shrink: 0;
  }
  .shop-selected-filters a:hover {
    background: var(--bs-neutral-200);
  }
  .shop-selected-filters .shop-clear-filters {
    background: transparent;
    border-color: transparent;
    color: var(--bs-neutral-600);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .shop-product-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  .shop-empty {
    padding: 48px 24px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 12px;
    background: var(--bs-neutral-100);
    text-align: center;
  }
  .shop-price-error {
    margin: 0;
    color: var(--bs-neutral-1000);
    font-size: 12px;
    line-height: 1.4;
  }
  .shop-empty h2 {
    margin: 0 0 8px;
    font-size: 24px;
  }
  .shop-empty a {
    display: inline-block;
    margin-top: 20px;
    padding: 9px 16px;
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font-size: 14px;
    font-weight: 600;
  }
  @media (min-width: 1200px) {
    .shop-product-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 992px) {
    .shop-desktop-catalog {
      padding-top: var(--karento-desktop-space-2);
      padding-bottom: var(--karento-desktop-space-16);
    }
    .shop-search {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
    input {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .shop-search-button {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .shop-price-fields,
    .shop-category-pills,
    .shop-selected-filters {
      gap: var(--karento-desktop-space-2);
    }
    .shop-category-pills button,
    .shop-filter-button,
    .shop-selected-filters a,
    .shop-empty a {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .shop-filter-button {
      min-height: var(--karento-desktop-pill-height);
    }
    .shop-sort select {
      height: var(--karento-desktop-pill-height);
      border-radius: var(--karento-desktop-pill-radius);
    }
    .shop-results-toolbar {
      gap: var(--karento-desktop-space-5);
      padding-block: var(--karento-desktop-panel-padding);
    }
    .shop-results-controls {
      gap: var(--karento-desktop-card-gap);
    }
    .shop-product-grid {
      gap: var(--karento-desktop-grid-gap);
    }
    .shop-empty {
      padding: var(--karento-desktop-space-12)
        var(--karento-desktop-panel-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
  }
</style>
