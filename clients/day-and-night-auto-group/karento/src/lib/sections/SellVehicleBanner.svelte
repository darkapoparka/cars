<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<section class="background-body">
  <div
    class="box-cta-3 background-100 py-96 mx-auto rounded-3 position-relative overflow-hidden desktop-marketing-section"
  >
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-5 pe-lg-5">
          <span class="btn btn-signin bg-white text-dark mb-4"
            >{locale.t("referenceOffers.sell.expertise")}</span
          >
          <h4 class="mb-4 pe-lg-5 neutral-1000 desktop-type-section"
            >{locale.t("referenceOffers.sell.deal")}</h4
          >
          <p class="text-lg-medium neutral-500 mb-4 desktop-type-lead">
            {locale.t("referenceOffers.sell.first")}
            <br class="d-none d-lg-block" />
            {locale.t("referenceOffers.sell.second")}
          </p>
          <div class="row">
            <div class="col">
              <ul class="list-ticks-green">
                <li class="neutral-1000"
                  >{locale.t("referenceOffers.sell.professionals")}</li
                >
                <li class="neutral-1000"
                  >{locale.t("referenceOffers.sell.pricing")}</li
                >
                <li class="neutral-1000"
                  >{locale.t("referenceOffers.sell.parts")}</li
                >
              </ul>
            </div>
          </div>
          <DemoActionLink
            class="btn btn-primary mt-2 desktop-type-control"
            href="#!"
            aria-label={locale.t("ui.sell-vehicle-banner.get-started-now")}
          >
            {locale.t("ui.sell-vehicle-banner.get-started-now")}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M8 15L15 8L8 1M15 8L1 8"
                stroke=""
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </DemoActionLink>
        </div>
        <div class="col-lg-6 offset-lg-1 position-relative z-1 mt-lg-0 mt-4">
          <div class="box-image-payment-2">
            <div class="row align-items-center">
              <div class="col-sm-4 mb-30">
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-3/img-1.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
              <div class="col-sm-4 mb-30">
                <img
                  class="bdrd8 w-100 mb-15"
                  src="/assets/imgs/cta/cta-3/img-2.png"
                  alt={locale.t("image.illustrative")}
                />
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-3/img-3.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
              <div class="col-sm-4 mb-30">
                <img
                  class="bdrd8 w-100 mb-15"
                  src="/assets/imgs/cta/cta-3/img-4.png"
                  alt={locale.t("image.illustrative")}
                />
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-3/img-5.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill"
    ></div>
  </div>
</section>
