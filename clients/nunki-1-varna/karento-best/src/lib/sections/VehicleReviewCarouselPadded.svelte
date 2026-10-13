<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { slider } from "#lib/vendor.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileCarReviewRail from "#lib/components/editorial/MobileCarReviewRail.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

{#if phone.current}
  <MobileCarReviewRail />
{:else}
  <section class="background-body pt-80 pb-50">
    <div class="container">
      <div class="box-swiper">
        <div
          class="swiper-container swiper-group-1 position-relative"
          {@attach slider}
        >
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div
                class="item-banner-slide-review d-flex align-items-center rounded-12"
              >
                <div class="ps-md-5 ps-2 position-relative z-1">
                  <span class="text-primary text-md-bold desktop-type-eyebrow"
                    >{locale.t(
                      "ui.vehicle-review-carousel-padded.car-review",
                    )}</span
                  >
                  <h3 class="mt-20 mb-20 color-white desktop-type-banner">
                    Hyundai Tucson Plug-In <br class="d-none d-md-block" />
                    {locale.t("referenceOffers.reviews.hybrid")}
                  </h3>
                  <p class="text-lg-medium color-white desktop-type-lead"
                    >{locale.t("referenceHome.reviews.description")}</p
                  >
                  <DemoActionLink
                    href="#!"
                    class="btn btn-primary mt-30 desktop-type-control"
                    aria-label={locale.t(
                      "ui.vehicle-review-carousel-padded.view-details",
                    )}
                  >
                    {locale.t("ui.vehicle-review-carousel-padded.view-details")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M12 19.5L19 12.5L12 5.5M19 12.5L5 12.5"
                        stroke="#101010"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </DemoActionLink>
                </div>
              </div>
            </div>

            <div class="swiper-slide">
              <div
                class="item-banner-slide-review banner-3 d-flex align-items-center rounded-12"
              >
                <div class="ps-md-5 ps-2 position-relative z-1">
                  <span class="text-primary text-md-bold desktop-type-eyebrow"
                    >{locale.t(
                      "ui.vehicle-review-carousel-padded.car-review",
                    )}</span
                  >
                  <h3 class="mt-20 mb-20 color-white desktop-type-banner">
                    2025 Mazda CX-50 <br class="d-none d-md-block" />
                    {locale.t(
                      "ui.vehicle-review-carousel-padded.review-and-news",
                    )}
                  </h3>
                  <p class="text-lg-medium color-white desktop-type-lead"
                    >{locale.t("referenceHome.reviews.description")}</p
                  >
                  <DemoActionLink
                    href="#!"
                    class="btn btn-primary mt-30 desktop-type-control"
                    aria-label={locale.t(
                      "ui.vehicle-review-carousel-padded.view-details",
                    )}
                  >
                    {locale.t("ui.vehicle-review-carousel-padded.view-details")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M12 19.5L19 12.5L12 5.5M19 12.5L5 12.5"
                        stroke="#101010"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </DemoActionLink>
                </div>
              </div>
            </div>
          </div>
          <div class="position-absolute end-0 bottom-0 p-40">
            <div
              class="box-button-slider box-button-slider-team justify-content-end"
            >
              <div
                class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
                tabindex="0"
                role="button"
                aria-label={locale.t(
                  "ui.vehicle-review-carousel-padded.previous-slide",
                )}
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
                aria-label={locale.t(
                  "ui.vehicle-review-carousel-padded.next-slide",
                )}
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
    </div>
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .item-banner-slide-review span.text-primary {
      color: var(--bs-neutral-0) !important;
    }
  }
</style>
