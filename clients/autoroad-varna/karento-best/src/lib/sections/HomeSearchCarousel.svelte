<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { slider } from "#lib/vendor.ts";
  import VehicleSearch from "#lib/components/search/VehicleSearch.svelte";
</script>

<section class="section-box box-banner-home7 background-body">
  <div class="container-banner-home7 position-relative">
    <div class="box-swiper">
      <div class="swiper-container swiper-group-1" {@attach slider}>
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="item-banner-slide banner-1">
              <div class="container">
                <span
                  class="btn background-brand-2 px-3 py-3 rounded-12 text-sm-bold text-dark desktop-type-eyebrow"
                  >{locale.t("referenceOffers.search.count")}</span
                >
                <h1 class="mt-20 mb-20 color-white desktop-type-hero"
                  >{locale.t(
                    "ui.home-search-carousel.find-your-next-vehicle-today",
                  )}</h1
                >
                <h6
                  class="color-white heading-6-medium pb-lg-0 pb-4 desktop-type-lead"
                >
                  {locale.t(
                    "ui.home-search-carousel.browse-our-diverse-inventory-and-enjoy-a-seamless-buying",
                  )} <br />
                  {locale.t("referenceOffers.search.expert")}
                </h6>
                <span class="text-lg-medium color-white d-lg-none"
                  >{locale.t("ui.home-search-carousel.get-5-discount-when")}
                  <a
                    class="text-primary"
                    href="#install-app"
                    aria-label={locale.t(
                      "ui.home-search-carousel.ordering-via-app",
                    )}>{locale.t("ui.home-search-carousel.ordering-via-app")}</a
                  ></span
                >
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item-banner-slide banner-2">
              <div class="container">
                <span
                  class="btn background-brand-2 px-3 py-3 rounded-12 text-sm-bold text-dark desktop-type-eyebrow"
                  >{locale.t(
                    "ui.home-search-carousel.best-car-rental-system",
                  )}</span
                >
                <h1 class="mt-20 mb-20 color-white desktop-type-hero"
                  >{locale.t(
                    "ui.home-search-carousel.discover-your-next-ride-today",
                  )}</h1
                >
                <h6 class="color-white heading-6-medium desktop-type-lead">
                  {locale.t("referenceOffers.search.selection")} <br />
                  {locale.t("referenceOffers.search.assistance")}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container-search-advance">
    <div class="container">
      <VehicleSearch fieldIdPrefix="field-b226deee" class="mb-5" />
      <div
        class="align-items-center justify-content-between pt-40 d-none d-lg-flex"
      >
        <span class="text-lg-medium color-white"
          >{locale.t("ui.home-search-carousel.get-5-discount-when")}
          <a
            class="text-primary"
            href="#install-app"
            aria-label={locale.t("ui.home-search-carousel.ordering-via-app")}
            >{locale.t("ui.home-search-carousel.ordering-via-app")}</a
          ></span
        >
        <div
          class="box-button-slider box-button-slider-team justify-content-end"
        >
          <div
            class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
            tabindex="0"
            role="button"
            aria-label={locale.t("ui.home-search-carousel.previous-slide")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
          <div
            class="swiper-button-next swiper-button-next-style-1 swiper-button-next-2"
            tabindex="0"
            role="button"
            aria-label={locale.t("ui.home-search-carousel.next-slide")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .container-search-advance a.text-primary {
      color: var(--bs-neutral-0) !important;
      text-decoration: underline;
    }
  }

  @media (max-width: 767.98px) {
    .box-banner-home7 .item-banner-slide {
      min-height: 0;
      padding-block: var(--karento-space-8);
    }
    h1 {
      font-size: var(--karento-type-page-size);
      font-weight: var(--karento-type-page-weight);
      line-height: var(--karento-type-page-leading);
    }
    h6 {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .item-banner-slide span.btn {
      font-size: var(--karento-type-eyebrow-size);
      font-weight: var(--karento-type-eyebrow-weight) !important;
      line-height: var(--karento-type-eyebrow-leading);
    }
    .item-banner-slide .text-lg-medium {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .container-search-advance {
      margin-block: var(--karento-space-6);
    }
  }
</style>
