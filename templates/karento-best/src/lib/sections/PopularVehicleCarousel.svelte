<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobileVehicleCollection from "#lib/components/mobile/MobileVehicleCollection.svelte";
  import VehicleFeaturedCard from "#lib/cards/VehicleFeaturedCard.svelte";
  import { referenceVehicles } from "#lib/data/vehicles.ts";
  import PopularVehicleFilters from "#lib/components/vehicles/PopularVehicleFilters.svelte";
  import { measuredSlider } from "#lib/measured-slider.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="section-box box-flights background-body desktop-collection-section"
>
  <div class="container">
    <div class="row align-items-end desktop-section-heading">
      <div class="col-lg-6 mb-30 text-center text-lg-start">
        <h2 class="neutral-1000 desktop-type-collection"
          >{locale.t("ui.popular-vehicle-carousel.popular-vehicles")}</h2
        >
        <p class="text-xl-medium neutral-500 desktop-type-lead"
          >{locale.t(
            "ui.popular-vehicle-carousel.favorite-vehicles-based-on-customer-reviews",
          )}</p
        >
      </div>
      <div class="col-lg-6 mb-30">
        <PopularVehicleFilters />
      </div>
    </div>

    {#if phone.current}
      <MobileVehicleCollection
        label={locale.t("ui.popular-vehicle-carousel.popular-vehicle-groups")}
        groups={[
          referenceVehicles.popularVehicleSlides.slice(0, 3),
          referenceVehicles.popularVehicleSlides.slice(3, 6),
        ]}
      />
    {:else}
      <div class="block-flights">
        <div class="box-swiper mt-30">
          <div
            class="swiper-container swiper-group-2 swiper-group-journey"
            {@attach measuredSlider}
          >
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[0]}
                /><VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[1]}
                /><VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[2]}
                /></div
              >
              <div class="swiper-slide">
                <VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[3]}
                /><VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[4]}
                /><VehicleFeaturedCard
                  card={referenceVehicles.popularVehicleSlides[5]}
                /></div
              >
            </div>
          </div>
        </div>
      </div>
    {/if}
    <div class="d-flex justify-content-center">
      {#if phone.current}
        <MobilePill
          label={locale.t("ui.popular-vehicle-carousel.load-more-cars")}
          href={locale.href("/vehicles")}
          variant="secondary"
        />
      {:else}
        <a
          class="btn btn-brand-2 text-nowrap desktop-type-control"
          href={locale.href("/vehicles")}
          aria-label={locale.t("ui.popular-vehicle-carousel.load-more-cars")}
        >
          <svg
            class="me-2"
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <g clip-path="url(#clip0_117_4717)">
              <path
                d="M4.4024 14.0977C1.60418 11.2899 1.60418 6.71576 4.4024 3.90794L5.89511 5.40064V0.90332H1.39779L3.13528 2.64081C-0.378102 6.1494 -0.378102 11.8562 3.13528 15.3696C5.35275 17.5823 8.43896 18.403 11.2996 17.8175V15.9648C8.91413 16.584 6.26949 15.9648 4.4024 14.0977Z"
                fill="#101010"
              ></path>
              <path
                d="M15.864 2.64036C13.6465 0.418093 10.5603 -0.402657 7.69971 0.182907V2.03559C10.0852 1.41643 12.7346 2.04519 14.5969 3.90748C17.4047 6.71531 17.4047 11.2894 14.5969 14.0973L13.1042 12.6045V17.1067H17.6063L15.8688 15.3692C19.3774 11.8558 19.3774 6.14894 15.864 2.64036Z"
                fill="#101010"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_117_4717">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0.5)"
                ></rect>
              </clipPath>
            </defs>
          </svg>
          {locale.t("ui.popular-vehicle-carousel.load-more-cars")}
        </a>
      {/if}
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-section-heading > .mb-30 {
      margin-bottom: 0 !important;
    }
    .block-flights .box-swiper.mt-30 {
      margin-top: 0 !important;
    }
  }
</style>
