<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import {
    referenceRelatedProducts,
    type DetailRelatedProduct,
  } from "#lib/data/vehicle-detail.ts";
  let {
    products = referenceRelatedProducts,
  }: { products?: readonly DetailRelatedProduct[] } = $props();
</script>

<div class="sidebar-banner"
  ><div class="p-4 background-body border rounded-3 desktop-panel"
    ><p class="text-xl-bold neutral-1000 mb-4 desktop-type-panel"
      >{locale.t("ui.related-product-sidebar.related-products")}</p
    >{#each products as product (product.id)}<div
        class="d-flex align-items-center mb-3"
        ><div class="me-3 border rounded-3 overflow-hidden"
          ><DemoActionLink
            href="#!"
            aria-label={locale.t("ui.related-product-sidebar.view-details")}
            ><img
              src={product.image}
              alt={locale.t("ui.related-product-sidebar.carento")}
            /></DemoActionLink
          ></div
        ><div class="position-relative"
          ><DemoActionLink
            href="#!"
            class="text-md-bold neutral-1000 desktop-type-body-small"
            aria-label={product.title}>{product.title}</DemoActionLink
          >{" "}<p class="text-md-bold text-success desktop-type-price"
            >{product.price}</p
          ></div
        ></div
      >{/each}</div
  ></div
>

<style>
  @media (min-width: 992px) {
    .sidebar-banner > .desktop-panel > p {
      margin-bottom: var(--karento-desktop-space-4) !important;
    }
    .sidebar-banner .d-flex {
      gap: var(--karento-desktop-space-3);
    }
    .sidebar-banner .d-flex > .me-3 {
      margin-right: 0 !important;
      border-radius: var(--karento-desktop-control-radius) !important;
    }
  }
</style>
