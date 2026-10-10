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
  const rating = $derived(product.rating.trim().replace(/\s+/g, " / "));
</script>

<MobileMediaRow
  class="mobile-product-card"
  href={locale.href(referenceProductDestination(product))}
  label={locale.t("reference.shop.viewProduct", { product: product.title })}
  image={product.image}
  imageAlt={product.imageAlt}
  fit="contain"
>
  <div class="product-summary">
    <p class="product-rating"
      >{rating}<span
        >{product.reviewsKey
          ? locale.t(product.reviewsKey)
          : product.reviews}</span
      ></p
    >
    <h3>{product.title}</h3>
    <div class="product-prices"
      ><strong>{product.price}</strong>{#if discounted}<s
          >{product.originalPrice}</s
        >{/if}</div
    >
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
  .product-rating {
    display: flex;
    gap: var(--karento-space-1);
    flex-wrap: wrap;
    margin: 0;
  }
  .product-rating span {
    color: var(--bs-neutral-600);
  }

  @media (max-width: 767.98px) {
    h3 {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
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

    .product-rating {
      font-size: var(--karento-type-badge-size);
      font-weight: var(--karento-type-badge-weight);
      line-height: var(--karento-type-badge-leading);
    }

    .product-rating span {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
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

    .product-rating {
      font-size: var(--karento-text-compact);
      line-height: 1.5;
      font-weight: 600;
    }

    .product-rating span {
      font-weight: 400;
    }
  }
</style>
