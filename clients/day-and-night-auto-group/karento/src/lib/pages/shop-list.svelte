<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import ShopCatalog from "#lib/components/shop/ShopCatalog.svelte";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
</script>

<PageMetadata title={locale.t("ui.shop-list.shop")} />
<main class="main">
  <ShopCatalog products={listingProducts} />
  <Footer />
</main>
