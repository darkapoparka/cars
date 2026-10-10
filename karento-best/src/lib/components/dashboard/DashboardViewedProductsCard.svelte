<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingProductCard from "#lib/components/vehicle-listing/ListingProductCard.svelte";
  import { dashboardViewedProducts } from "#lib/data/dashboard.ts";
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t("ui.dashboard-viewed-products-card.viewed-products")}</p
    >
  </div>
  <div class="card-body">
    <div class="row"
      >{#each dashboardViewedProducts as product (product.id)}<div
          class="col-lg-4 col-md-6"
          ><ListingProductCard
            {product}
            actionClass="btn btn-primary"
            linkedImage={false}
          /></div
        >{/each}</div
    >
  </div>
</div>
