<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section class="box-cta-1 background-100 py-96 desktop-marketing-section">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 pe-lg-5">
        <div class="card-video">
          <div class="card-image"
            ><a
              class="btn btn-play popup-youtube desktop-type-control"
              href="https://www.youtube.com/watch?v=AOg61RB75Ho"
              aria-label={locale.t("ui.sell-vehicle-offer.view-details")}
            ></a><img
              src="/assets/imgs/cta/cta-1/video.png"
              alt={locale.t("image.illustrative")}
            /></div
          >
        </div>
      </div>
      <div class="col-lg-6 mt-lg-0 mt-4">
        <span
          class="btn btn-signin bg-white text-dark mb-4 mobile-section-label"
          >{locale.t("ui.sell-vehicle-offer.best-car-rental-system")}</span
        >
        <h4 class="mb-4 neutral-1000 desktop-type-section"
          >{locale.t("referenceOffers.sell.combined")}</h4
        >
        <p class="text-lg-medium neutral-500 mb-4 desktop-type-lead"
          >{locale.t("referenceOffers.sell.body")}</p
        >
        <div class="row">
          <div class="col-md-6">
            <ul class="list-ticks-green">
              <li class="neutral-1000"
                >{locale.t("referenceOffers.sell.mechanics")}</li
              >
              <li class="neutral-1000"
                >{locale.t("referenceOffers.sell.price")}</li
              >
              <li class="neutral-1000"
                >{locale.t("referenceOffers.sell.parts")}</li
              >
            </ul>
          </div>
          <div class="col-md-6">
            <ul class="list-ticks-green">
              <li class="neutral-1000"
                >{locale.t("referenceOffers.sell.services")}</li
              >
              <li class="neutral-1000"
                >{locale.t("referenceOffers.sell.roadside")}</li
              >
              <li class="neutral-1000"
                >{locale.t("ui.sell-vehicle-offer.free-pick-up-drop-offs")}</li
              >
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
