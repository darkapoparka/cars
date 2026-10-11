<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import VehicleDetailPanels from "#lib/components/vehicle-detail/VehicleDetailPanels.svelte";
  import DetailSellerCard from "#lib/components/vehicle-detail/DetailSellerCard.svelte";
  import DetailBrandStrip from "#lib/components/vehicle-detail/DetailBrandStrip.svelte";
  import RelatedProductSidebar from "#lib/components/vehicle-detail/RelatedProductSidebar.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { page } from "$app/state";
  import { selectedReferenceProduct } from "#lib/data/shop-mobile.ts";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
  import DesktopShopProductCard from "#lib/components/shop/DesktopShopProductCard.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const selected = $derived(selectedReferenceProduct(page.url.searchParams));
  const otherProducts = $derived(
    listingProducts.filter((product) => product.id !== selected.id).slice(0, 3),
  );
</script>

{#if desktop.current}
  <section
    class="shop-desktop-information container"
    aria-labelledby="shop-more-heading"
  >
    <div class="shop-more-heading"
      ><h2 id="shop-more-heading" class="desktop-type-panel"
        >{locale.t("ui.product-detail.more-parts-accessories")}</h2
      ><a href={locale.href("/shop")} class="desktop-type-control"
        >{locale.t("ui.product-detail.view-all")}</a
      ></div
    >
    <div class="shop-more-products"
      >{#each otherProducts as product (product.id)}<DesktopShopProductCard
          {product}
        />{/each}</div
    >
  </section>
{:else}
  <section class="box-section box-content-tour-detail background-body pt-0">
    <div class="container">
      <div class="row pt-30">
        <div class="col-lg-8">
          {#if phone.current}<div class="product-reference-information"
              ><h2>{locale.t("ui.product-detail.reference-information")}</h2><p
                >{locale.t(
                  "ui.product-detail.the-content-below-illustrates-the-product-detail-layout",
                )}</p
              ><ul
                >{#each selected.features as feature (feature)}<li>{feature}</li
                  >{/each}</ul
              ></div
            >{/if}
          <VehicleDetailPanels product />
        </div>
        <div class="col-lg-4">
          <DetailSellerCard />
          <RelatedProductSidebar />
        </div>
      </div>
    </div>
    <DetailBrandStrip />
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .shop-desktop-information {
      padding-top: var(--karento-desktop-space-8);
      padding-bottom: var(--karento-desktop-section-padding);
    }
    .shop-more-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--karento-desktop-grid-gap);
      margin-bottom: var(--karento-desktop-heading-gap-compact);
    }
    .shop-more-heading h2 {
      margin: 0;
      font-size: var(--karento-type-panel-size);
      line-height: var(--karento-type-panel-leading);
    }
    .shop-more-heading a {
      display: inline-flex;
      align-items: center;
      min-height: var(--karento-desktop-pill-height);
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-3);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-control-size);
      line-height: var(--karento-type-control-leading);
      font-weight: var(--karento-type-control-weight);
      white-space: nowrap;
    }
    .shop-more-heading a:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 3px;
    }
    .shop-more-products {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--karento-desktop-grid-gap);
    }
  }
  @media (max-width: 767.98px) {
    .product-reference-information {
      margin-bottom: var(--karento-space-4);
    }
    .product-reference-information h2 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
      margin-bottom: 6px;
    }
    .product-reference-information p {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
      color: var(--bs-neutral-600);
    }
    .product-reference-information ul {
      margin-top: var(--karento-space-3);
      padding-left: 18px;
      display: grid;
      gap: 6px;
    }
    .product-reference-information li {
      list-style: disc;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
</style>
