<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import VehicleOfferCard from "#lib/components/VehicleOfferCard.svelte";
  import { vehicleOffers } from "#lib/data/promotions.ts";
  import ReferenceStats from "#lib/components/ReferenceStats.svelte";

  let {
    showStats = true,
    homeSource = "index-2",
  }: { showStats?: boolean; homeSource?: string | null } = $props();
</script>

<section
  class="section-cta-4 position-relative overflow-hidden desktop-marketing-section"
  data-home-section-source={homeSource}
>
  <div class="bg-shape"></div>
  <div class="container position-relative z-1">
    <div class="text-center desktop-section-heading">
      <span
        class="text-sm-bold bg-white p-3 rounded-12 mobile-section-label desktop-type-eyebrow"
        >{locale.t("ui.sell-and-rental-offers.best-car-rental-system")}</span
      >
      <h4 class="mt-4 desktop-section-title">
        {locale.t("referenceOffers.sell.offer")} <br />
        {locale.t("referenceOffers.sell.today")}
      </h4>
    </div>
    <div class="row mt-60 vehicle-offer-layout">
      <div class="col-lg-4">
        <VehicleOfferCard offer={vehicleOffers[0]} />
      </div>
      <div class="col-lg-4 text-center vehicle-offer-artwork">
        <img
          src="/assets/imgs/cta/cta-4/car-center.png"
          alt={locale.t("image.illustrative")}
        />
      </div>
      <div class="col-lg-4">
        <VehicleOfferCard offer={vehicleOffers[1]} />
      </div>
    </div>
    {#if showStats}<div
        class="rounded-12 pt-30 pb-30 karento-system-stats background-card border mt-60"
      >
        <div class="">
          <ReferenceStats />
        </div>
      </div>{/if}</div
  >
</section>

<style>
  @media (max-width: 767.98px) {
    .karento-system-stats {
      display: none;
    }

    .section-cta-4.position-relative {
      padding-block: var(--karento-space-6);
    }
    .vehicle-offer-layout {
      row-gap: var(--karento-space-3);
    }
    .vehicle-offer-artwork {
      display: none;
    }
  }

  @media (min-width: 992px) {
    .vehicle-offer-layout {
      margin-top: 0 !important;
    }
  }
</style>
