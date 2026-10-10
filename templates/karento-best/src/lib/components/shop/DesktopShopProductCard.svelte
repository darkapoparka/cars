<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  import {
    referenceProductDestination,
    hasReferenceDiscount,
  } from "#lib/data/shop-mobile.ts";
  let { product }: { product: ListingProduct } = $props();
  const discounted = $derived(hasReferenceDiscount(product));
</script>

<a
  class="shop-product-card"
  href={locale.href(referenceProductDestination(product))}
  aria-label={locale.t("reference.shop.viewProduct", {
    product: product.title,
  })}
>
  <div class="shop-product-image"
    ><img src={product.image} alt="" loading="lazy" /></div
  >
  <div class="shop-product-content">
    <h2 class="desktop-type-compact-card">{product.title}</h2>
    <div class="shop-product-price"
      ><strong class="desktop-type-price">{product.price}</strong
      >{#if discounted}<s class="desktop-type-meta">{product.originalPrice}</s
        >{/if}<span class="shop-product-action desktop-type-pill"
        >{locale.t("ui.desktop-shop-product-card.view-details")}
        <span aria-hidden="true">↗</span></span
      ></div
    >
  </div>
</a>

<style>
  .shop-product-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 12px;
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  .shop-product-card:hover {
    border-color: var(--bs-neutral-500);
  }
  .shop-product-card:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
  .shop-product-image {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
    place-items: center;
    height: 220px;
    padding: 20px;
    background: var(--bs-background-card);
  }
  img {
    display: block;
    min-height: 0;
    min-width: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .shop-product-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  h2 {
    margin: 0;
    font-size: 18px;
    line-height: 1.4;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .shop-product-price {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: auto;
    line-height: 1.4;
  }
  strong {
    font-size: 20px;
    font-weight: 700;
  }
  s {
    font-size: 13px;
    color: var(--bs-neutral-500);
  }
  .shop-product-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    padding: 6px 10px;
    border-radius: 999px;
    background: var(--bs-neutral-100);
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
  @media (min-width: 1200px) {
    .shop-product-image {
      height: 192px;
      padding: 18px;
    }
    .shop-product-content {
      gap: var(--karento-desktop-space-4);
      padding: 18px;
    }
  }

  @media (min-width: 992px) {
    .shop-product-card {
      border-radius: var(--karento-desktop-card-radius);
    }
    .shop-product-image {
      padding: var(--karento-desktop-card-padding);
    }
    .shop-product-content {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-padding);
    }
    .shop-product-price {
      gap: var(--karento-desktop-space-2);
    }
    .shop-product-action {
      border-radius: var(--karento-desktop-pill-radius);
    }
  }
</style>
