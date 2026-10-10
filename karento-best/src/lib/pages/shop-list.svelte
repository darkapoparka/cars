<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import PartsHero from "#lib/sections/PartsHero.svelte";
  import ProductsHeading from "#lib/sections/ProductsHeading.svelte";
  import PartsListing from "#lib/sections/PartsListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import DesktopShopCatalog from "#lib/components/shop/DesktopShopCatalog.svelte";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<PageMetadata title={locale.t("ui.shop-list.shop")} />
<main class="main"
  >{#if desktop.current}<DesktopShopCatalog
      products={listingProducts}
    />{:else}<PartsHero />
    <ProductsHeading />
    <PartsListing />{/if}
  <Footer /></main
>
