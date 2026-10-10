<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ProductBreadcrumb from "#lib/sections/ProductBreadcrumb.svelte";
  import ProductPurchaseBanner from "#lib/sections/ProductPurchaseBanner.svelte";
  import ProductDetail from "#lib/sections/ProductDetail.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { page } from "$app/state";
  import { MediaQuery } from "svelte/reactivity";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
  import { isUnavailableDesktopProduct } from "#lib/data/desktop-shop.ts";

  const desktop = new MediaQuery("(min-width: 992px)");
  const missing = $derived(
    desktop.current &&
      isUnavailableDesktopProduct(page.url.searchParams, listingProducts),
  );
</script>

<PageMetadata
  title={locale.t(
    missing
      ? "reference.shop.product.missingTitle"
      : "ui.shop-details.product-details",
  )}
/>
<main class="main"
  >{#if missing}
    <section class="box-section background-body shop-product-unavailable">
      <div class="container">
        <h1 class="neutral-1000 desktop-type-page"
          >{locale.t("reference.shop.product.missingTitle")}</h1
        >
        <p class="neutral-500 mt-20 desktop-type-body"
          >{locale.t("reference.shop.product.missingBody")}</p
        >
        <a
          class="btn btn-gray mt-20 desktop-type-pill desktop-card-action"
          href={locale.href("/shop")}
          >{locale.t("ui.product-purchase-banner.back-to-shop")}</a
        >
      </div>
    </section>
  {:else}
    <ProductBreadcrumb />
    <ProductPurchaseBanner />
    <ProductDetail />
  {/if}
  <Footer /></main
>

<style>
  @media (min-width: 992px) {
    .shop-product-unavailable {
      padding-block: var(--karento-desktop-section-padding);
    }
  }
</style>
