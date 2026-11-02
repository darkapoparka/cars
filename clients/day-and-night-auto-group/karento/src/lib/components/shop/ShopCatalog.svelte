<script lang="ts">
  import { page } from "$app/state";
  import { afterNavigate, goto } from "$app/navigation";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  import {
    desktopShopDestination,
    readDesktopShopFilters,
    matchDesktopShop,
    shopFilterKeys,
    shopFilterLabel,
    shopSortOptions,
    type DesktopShopFilters,
  } from "#lib/data/desktop-shop.ts";
  import {
    withShopReferenceFacets,
    availableShopCategories,
    availableShopBrands,
  } from "#lib/data/shop-reference-facets.ts";
  import {
    referenceProductDestination,
    hasReferenceDiscount,
  } from "#lib/data/shop-mobile.ts";
  import VehicleLandingHero from "#lib/sections/VehicleLandingHero.svelte";
  import CatalogToolbar from "#lib/components/vehicle-listing/CatalogToolbar.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import CatalogSearchBox from "#lib/components/vehicle-listing/CatalogSearchBox.svelte";
  import DesktopShopFilterDialog from "./DesktopShopFilterDialog.svelte";
  import ShopSortDialog from "./ShopSortDialog.svelte";

  let { products }: { products: readonly ListingProduct[] } = $props();
  const locale = useLocale();
  const id = $props.id();
  const catalogue = $derived(withShopReferenceFacets(products));
  const categories = $derived(availableShopCategories(catalogue));
  const filters = $derived(readDesktopShopFilters(page.url.searchParams));
  const results = $derived(matchDesktopShop(catalogue, filters));
  const selected = $derived(shopFilterKeys.filter((key) => filters[key]));
  let draftQuery = $derived(filters.q);
  let draftCategory = $derived(filters.category);
  let panel = $state<"filters" | "sort" | null>(null);

  function destination(next: DesktopShopFilters) {
    return locale.href(
      desktopShopDestination(
        page.url.pathname,
        next,
        page.url.searchParams,
        page.url.hash,
      ),
    );
  }
  function update(next: DesktopShopFilters) {
    panel = null;
    void goto(destination(next), { reset: false });
  }
  function search() {
    const brands = availableShopBrands(catalogue, draftCategory);
    update({
      ...filters,
      q: draftQuery.trim(),
      category: draftCategory,
      brand: brands.includes(filters.brand) ? filters.brand : "",
    });
  }
  function remove(key?: (typeof shopFilterKeys)[number]) {
    document
      .querySelector<HTMLButtonElement>(".shop-filter-trigger")
      ?.focus({ preventScroll: true });
    update(
      key
        ? { ...filters, [key]: "" }
        : {
            ...readDesktopShopFilters(new URLSearchParams()),
            sort: filters.sort,
          },
    );
  }
  function productHref(product: ListingProduct) {
    const target = new URL(
      referenceProductDestination(product),
      "http://local",
    );
    for (const [key, value] of page.url.searchParams)
      if (key !== "product") target.searchParams.set(key, value);
    return locale.href(target.pathname + target.search + target.hash);
  }
  afterNavigate(() => {
    panel = null;
  });
</script>

<VehicleLandingHero
  title={locale.t("ui.parts-hero.parts-accessories")}
  image={{ src: "/assets/imgs/page-header/banner9.png" }}
>
  <CatalogSearchBox
    bind:category={draftCategory}
    bind:query={draftQuery}
    options={[
      { value: "", label: locale.locale === "bg" ? "Всички" : "All" },
      ...categories.map((option) => ({
        value: option.value,
        label: locale.t(option.labelKey),
      })),
    ]}
    label={locale.t("ui.desktop-shop-catalog.search-products")}
    categoryLabel={locale.locale === "bg"
      ? "Категория продукти"
      : "Product category"}
    queryLabel={locale.locale === "bg" ? "Продукт" : "Product"}
    placeholder={locale.locale === "bg" ? "Име или марка" : "Name or brand"}
    onsearch={search}
  />
</VehicleLandingHero>

<section
  class="container shop-catalog"
  aria-label={locale.t("ui.desktop-shop-catalog.browse-reference-products")}
  id="shop-results"
>
  <CatalogToolbar
    prefix="shop"
    countLabel={locale.count(results.length, "products")}
    filterCount={selected.length}
    sort={filters.sort}
    entity={locale.t("catalog.products")}
    filterLabel={locale.t("ui.desktop-shop-catalog.product-filters")}
    orderOptions={shopSortOptions}
    filterOpen={panel === "filters"}
    sortOpen={panel === "sort"}
    onfilter={() => {
      panel = "filters";
    }}
    onsort={() => {
      panel = "sort";
    }}
  />
  {#if selected.length}
    <MobilePillRail
      class="shop-applied-filters"
      variant="secondary"
      label={locale.t("ui.desktop-shop-catalog.selected-product-filters")}
    >
      {#each selected as key (key)}<MobilePill
          variant="secondary"
          label={shopFilterLabel(key, filters[key], locale.locale)}
          ariaLabel={locale.t("reference.shop.removeFilter", {
            filter: shopFilterLabel(key, filters[key], locale.locale),
          })}
          trailingIcon="close"
          onclick={() => remove(key)}
        />{/each}
      <MobilePill
        variant="secondary"
        label={locale.t("ui.desktop-shop-catalog.clear-all")}
        onclick={() => remove()}
      />
    </MobilePillRail>
  {/if}
  {#if results.length}
    <div class="shop-grid">
      {#each results as product (product.id)}
        <a
          class="shop-product"
          href={productHref(product)}
          aria-label={locale.t("reference.shop.viewProduct", {
            product: product.title,
          })}
        >
          <div class="shop-product-image">
            <img src={product.image} alt="" loading="lazy" decoding="async" />
          </div>
          <h2 title={product.title}>{product.shortTitle ?? product.title}</h2>
          <p>
            <strong>{product.price}</strong
            >{#if hasReferenceDiscount(product)}<s>{product.originalPrice}</s
              >{/if}
          </p>
        </a>
      {/each}
    </div>
  {:else}
    <div class="shop-empty">
      <h2>{locale.t("ui.desktop-shop-catalog.no-matching-products")}</h2>
      <p>
        {locale.t(
          "ui.desktop-shop-catalog.try-another-category-keyword-or-price",
        )}
      </p>
      <button type="button" onclick={() => remove()}
        >{locale.t("ui.desktop-shop-catalog.browse-all-products")}</button
      >
    </div>
  {/if}
</section>

{#if panel === "filters"}<DesktopShopFilterDialog
    id={id + "-filters"}
    products={catalogue}
    {filters}
    onapply={update}
    onclose={() => {
      panel = null;
    }}
  />{/if}
{#if panel === "sort"}<ShopSortDialog
    value={filters.sort}
    onapply={(sort) => update({ ...filters, sort })}
    onclose={() => {
      panel = null;
    }}
  />{/if}

<style>
  .shop-catalog {
    padding-top: 16px;
    padding-bottom: 40px;
  }
  .shop-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 24px;
    margin-top: 16px;
  }
  .shop-product {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  .shop-product-image {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 1;
    padding: 18px;
    overflow: hidden;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 12px;
    background: var(--bs-neutral-0);
  }
  .shop-product img {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    object-fit: contain;
  }
  .shop-product h2 {
    margin: 2px 0 0;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .shop-product p {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0;
  }
  .shop-product strong {
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
  }
  .shop-product s {
    font-size: 13px;
    color: var(--bs-neutral-500);
  }
  .shop-product:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
    border-radius: 12px;
  }
  .shop-empty {
    padding: 32px 0;
  }
  .shop-empty h2 {
    margin: 0 0 8px;
    font-size: 20px;
    line-height: 26px;
  }
  .shop-empty p {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 14px;
  }
  .shop-empty button {
    min-height: 44px;
    margin-top: 16px;
    padding: 10px 18px;
    border: 0;
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  .shop-catalog :global(.shop-applied-filters) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  @media (min-width: 768px) {
    .shop-catalog :global(.shop-applied-filters .mobile-pill) {
      display: inline-flex;
      position: relative;
      flex-shrink: 0;
      align-items: center;
      gap: 4px;
      min-height: 28px;
      padding: 4px 10px;
      border: 1px solid var(--bs-neutral-200);
      border-radius: 999px;
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: 12px;
      line-height: 18px;
      cursor: pointer;
      white-space: nowrap;
    }
    .shop-catalog :global(.shop-applied-filters .mobile-pill::before) {
      content: "";
      position: absolute;
      inset-inline: 0;
      top: 50%;
      height: 44px;
      transform: translateY(-50%);
    }
    .shop-catalog :global(.shop-applied-filters .mobile-pill svg) {
      width: 14px;
      height: 14px;
    }
  }
  @media (min-width: 768px) and (max-width: 991.98px) {
    .shop-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px 16px;
    }
  }
  @media (max-width: 767.98px) {
    .shop-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px 12px;
      margin-top: 10px;
    }
    .shop-product-image {
      padding: 12px;
    }
    .shop-product h2 {
      font-size: 14px;
      line-height: 19px;
    }
  }
</style>
