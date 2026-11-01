<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  import MobileMediaRow from "#lib/components/mobile/MobileMediaRow.svelte";
  import {
    referenceProductDestination,
    hasReferenceDiscount,
  } from "#lib/data/shop-mobile.ts";
  let { product }: { product: ListingProduct } = $props();
  const discounted = $derived(hasReferenceDiscount(product));
</script>

<MobileMediaRow
  class="mobile-product-card"
  layout="tile"
  href={locale.href(referenceProductDestination(product))}
  label={locale.t("reference.shop.viewProduct", { product: product.title })}
  image={product.image}
  imageAlt={product.imageAlt}
  fit="contain"
  loading="lazy"
>
  <div class="product-summary">
    <h3 title={product.title}>{product.title}</h3>
    <div class="product-prices">
      <strong>{product.price}</strong>{#if discounted}<s
          >{product.originalPrice}</s
        >{/if}
    </div>
  </div>
</MobileMediaRow>

<style>
  .product-summary {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--karento-space-2);
    min-width: 0;
  }
  h3 {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .product-prices {
    display: flex;
    flex-wrap: wrap;
    gap: var(--karento-space-1) var(--karento-space-2);
    align-items: baseline;
  }
  .product-prices s {
    color: var(--bs-neutral-600);
  }

  @media (max-width: 767.98px) {
    h3 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      min-height: 2.6em;
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
    }

    .product-prices strong {
      font-size: var(--karento-type-price-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }

    .product-prices s {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }

  @media (min-width: 768px) {
    h3 {
      font-size: var(--karento-text-card-title);
      line-height: 1.35;
      font-weight: 700;
    }

    .product-prices {
      font-size: var(--karento-text-subheading);
      line-height: 1.4;
    }

    .product-prices s {
      font-size: var(--karento-text-caption);
    }
  }
</style>
