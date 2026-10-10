<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { slider } from "#lib/vendor.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileTestimonialRail from "#lib/components/editorial/MobileTestimonialRail.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if phone.current}
  <MobileTestimonialRail />
{:else}
  <section
    class="section-box py-96 background-body desktop-marketing-section"
    data-home-section-source="index-2"
  >
    <div class="container">
      <div class="row desktop-section-heading">
        <div
          class="col-auto mx-auto text-center d-flex flex-column align-items-center justify-content-center"
        >
          <div
            class="box-author-testimonials background-100 desktop-type-eyebrow"
          >
            <img
              src="/assets/imgs/page/homepage1/testimonial.png"
              alt={locale.t("image.illustrative")}
            />
            <img
              src="/assets/imgs/page/homepage1/testimonial2.png"
              alt={locale.t("image.illustrative")}
            />
            <img
              src="/assets/imgs/page/homepage1/testimonial3.png"
              alt={locale.t("image.illustrative")}
            />
            {locale.t(
              desktop.current
                ? "referenceHome.testimonials.previewLabel"
                : "referenceHome.testimonials.label",
            )}
          </div>
          <h3 class="mt-8 mb-15 neutral-1000 desktop-section-title"
            >{locale.t("ui.customer-review-grid.what-they-say-about-us")}</h3
          >
        </div>
      </div>
    </div>
    <div class="block-testimonials ps-0 mask-image">
      <div class="container-testimonials">
        <div class="container-slider ps-0">
          <div class="box-swiper mt-30">
            <div
              class="swiper-container swiper-group-animate swiper-group-journey"
              {@attach slider}
            >
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="card-testimonial background-card">
                    <div class="card-info">
                      <p
                        class="text-xl-bold card-title neutral-1000 desktop-type-card"
                        >{locale.t("ui.customer-review-grid.no-hidden-fees")}</p
                      >
                      <p class="text-md-regular neutral-500 desktop-type-body"
                        >{locale.t("referenceHome.testimonials.detailQuote")}</p
                      >
                    </div>
                    <div class="card-top pt-40 border-0 mb-0">
                      <div class="card-author">
                        <div class="card-image"
                          ><img
                            src="/assets/imgs/testimonials/testimonials-1/author-1.png"
                            alt={locale.t("image.illustrative")}
                          /></div
                        >
                        <div class="card-info">
                          <p
                            class="text-lg-bold neutral-1000 desktop-type-compact-card"
                            >Sophia Moore</p
                          >
                          <p
                            class="text-md-regular neutral-1000 desktop-type-body"
                            >New York</p
                          >
                        </div>
                      </div>
                      <div class="card-rate"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /></div
                      >
                    </div>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="card-testimonial background-card">
                    <div class="card-info">
                      <p
                        class="text-xl-bold card-title neutral-1000 desktop-type-card"
                        >{locale.t(
                          "ui.customer-review-grid.mobile-friendly-and-fast",
                        )}</p
                      >
                      <p class="text-md-regular neutral-500 desktop-type-body"
                        >{locale.t(
                          desktop.current
                            ? "referenceHome.testimonials.vehicleQuote"
                            : "referenceHome.testimonials.vacationQuote",
                        )}</p
                      >
                    </div>
                    <div class="card-top pt-40 border-0 mb-0">
                      <div class="card-author">
                        <div class="card-image"
                          ><img
                            src="/assets/imgs/testimonials/testimonials-1/author-2.png"
                            alt={locale.t("image.illustrative")}
                          /></div
                        >
                        <div class="card-info">
                          <p
                            class="text-lg-bold neutral-1000 desktop-type-compact-card"
                            >Atend John</p
                          >
                          <p
                            class="text-md-regular neutral-1000 desktop-type-body"
                            >Paris</p
                          >
                        </div>
                      </div>
                      <div class="card-rate"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /></div
                      >
                    </div>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="card-testimonial background-card">
                    <div class="card-info">
                      <p
                        class="text-xl-bold card-title neutral-1000 desktop-type-card"
                        >{locale.t(
                          "referenceHome.testimonials.customerService",
                        )}</p
                      >
                      <p class="text-md-regular neutral-500 desktop-type-body"
                        >{locale.t("referenceHome.testimonials.designQuote")}</p
                      >
                    </div>
                    <div class="card-top pt-40 border-0 mb-0">
                      <div class="card-author">
                        <div class="card-image"
                          ><img
                            src="/assets/imgs/testimonials/testimonials-1/author-3.png"
                            alt={locale.t("image.illustrative")}
                          /></div
                        >
                        <div class="card-info">
                          <p
                            class="text-lg-bold neutral-1000 desktop-type-compact-card"
                            >Sara Mohamed</p
                          >
                          <p
                            class="text-md-regular neutral-1000 desktop-type-body"
                            >Jakatar</p
                          >
                        </div>
                      </div>
                      <div class="card-rate"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /></div
                      >
                    </div>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="card-testimonial background-card">
                    <div class="card-info">
                      <p
                        class="text-xl-bold card-title neutral-1000 desktop-type-card"
                        >{locale.t(
                          "ui.customer-review-grid.highly-flexible-and-customizable",
                        )}</p
                      >
                      <p class="text-md-regular neutral-500 desktop-type-body"
                        >{locale.t("referenceHome.testimonials.detailQuote")}</p
                      >
                    </div>
                    <div class="card-top pt-40 border-0 mb-0">
                      <div class="card-author">
                        <div class="card-image"
                          ><img
                            src="/assets/imgs/testimonials/testimonials-1/author-1.png"
                            alt={locale.t("image.illustrative")}
                          /></div
                        >
                        <div class="card-info">
                          <p
                            class="text-lg-bold neutral-1000 desktop-type-compact-card"
                            >Sara Mohamed</p
                          >
                          <p
                            class="text-md-regular neutral-1000 desktop-type-body"
                            >Jakatar</p
                          >
                        </div>
                      </div>
                      <div class="card-rate"
                        ><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /><img
                          class="background-brand-2 p-1"
                          src="/assets/imgs/template/icons/star-black.svg"
                          alt={locale.t("image.illustrative")}
                        /></div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .block-testimonials .box-swiper.mt-30 {
      margin-top: 0 !important;
    }
  }
</style>
