<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ProductBreadcrumb from "#lib/sections/ProductBreadcrumb.svelte";
  import ProductPurchaseBanner from "#lib/sections/ProductPurchaseBanner.svelte";
  import ProductDetail from "#lib/sections/ProductDetail.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.shop-details.product-details")} />
<main class="main"
  ><ProductBreadcrumb />
  <ProductPurchaseBanner />
  <ProductDetail />
  <Footer /></main
>
