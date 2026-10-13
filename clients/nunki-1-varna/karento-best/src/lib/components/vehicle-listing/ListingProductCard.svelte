<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  let {
    product,
    actionClass = "btn btn-gray",
    linkedImage = true,
  }: {
    product: ListingProduct;
    actionClass?: string;
    linkedImage?: boolean;
  } = $props();
</script>

<div class="card-journey-small background-card">
  <div class="card-image">
    <DemoActionLink
      class="wish"
      href="#!"
      aria-label={locale.t("ui.listing-product-card.view-details")}
    >
      <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z"
          stroke=""
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </DemoActionLink>
    {#if linkedImage}<a
        class="d-block"
        href={locale.href(product.href)}
        aria-label={locale.t("ui.listing-product-card.view-product")}
        ><img src={product.image} alt={product.imageAlt} /></a
      >{:else}<img src={product.image} alt={product.imageAlt} />{/if}
  </div>
  <div class="card-info p-3 pt-30 border-top">
    <div class="card-rating">
      <div class="card-left"></div>
      <div class="card-right">
        <span class="rating text-xs-medium rounded-pill desktop-type-badge"
          >{product.rating}<span class="text-xs-medium neutral-500"
            >{product.reviewsKey
              ? locale.t(product.reviewsKey)
              : product.reviews}</span
          ></span
        >
      </div>
    </div>
    <div class="card-title"
      ><a
        class="text-lg-bold neutral-1000 d-block desktop-type-compact-card"
        href={locale.href(product.href)}
        aria-label={product.titleLabel}>{product.title}</a
      ></div
    >
    <div class="card-program">
      <ul class="list-style-disc ps-3 pe-4">
        <li class="text-xs-medium neutral-1000 desktop-type-meta"
          >{product.featureKeys?.[0]
            ? locale.t(product.featureKeys[0])
            : product.features[0]}</li
        >
        <li class="text-xs-medium neutral-1000 desktop-type-meta"
          >{product.featureKeys?.[1]
            ? locale.t(product.featureKeys[1])
            : product.features[1]}</li
        >
        <li class="text-xs-medium neutral-1000 desktop-type-meta"
          >{product.featureKeys?.[2]
            ? locale.t(product.featureKeys[2])
            : product.features[2]}</li
        >
      </ul>
      <div class="endtime pt-3 mt-3 border-top">
        <div class="card-price">
          <h6
            class="text-md-medium neutral-500 text-decoration-line-through desktop-type-meta"
            >{product.originalPrice}</h6
          >
        </div>
        <DemoActionLink
          href="#!"
          class="card-button pe-3"
          aria-label={locale.t("ui.listing-product-card.view-details")}
          ><img
            src="/assets/imgs/shop/shop-list/stock.png"
            alt={locale.t("image.illustrative")}
          /></DemoActionLink
        >
      </div>
      <div class="endtime desktop-card-footer">
        <div class="card-price">
          <h6 class="text-lg-bold neutral-1000 desktop-type-price"
            >{product.price}</h6
          >
        </div>
        <div class="card-button"
          ><a
            class={[actionClass, "desktop-type-control desktop-card-action"]}
            href={locale.href(product.href)}
            aria-label={product.actionKey
              ? locale.t(product.actionKey)
              : product.action}
            >{product.actionKey
              ? locale.t(product.actionKey)
              : product.action}</a
          ></div
        >
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .card-journey-small {
      border-radius: var(--karento-desktop-card-radius);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .card-journey-small .card-info {
      padding: var(--karento-desktop-card-padding) !important;
      border-radius: var(--karento-desktop-card-radius);
    }
    .card-journey-small .card-info .card-rating {
      left: var(--karento-desktop-card-padding);
      right: var(--karento-desktop-card-padding);
    }
    .card-journey-small .card-info .card-title {
      margin-bottom: var(--karento-desktop-card-gap);
    }
  }
</style>
