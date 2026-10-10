<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { stockSummary } from "#lib/i18n/dealer.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { slider } from "#lib/vendor.ts";
  import { dealer } from "#lib/content.ts";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section class="box-section block-banner-home3 position-relative">
  <div class="container-banner-home3 position-relative">
    <div class="box-swiper">
      <div class="swiper-container swiper-group-1" {@attach slider}>
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="item-banner-slide banner-1">
              <div class="container text-center position-relative z-1">
                <span
                  class="btn background-brand-2 px-3 py-3 rounded-12 text-sm-bold text-dark desktop-type-eyebrow"
                  >{dealer.businessPreview
                    ? stockSummary(dealer.businessPreview, locale)
                    : locale.t("demo.stockCount")}</span
                >
                <h1 class="mt-20 mb-20 color-white desktop-type-hero"
                  >{dealer.businessPreview
                    ? locale.t("dealer.home.heading")
                    : ((phone.current
                        ? dealer.contentStatus === "reference-demo"
                          ? locale.t(
                              "ui.home-vehicle-carousel.find-your-next-car",
                            )
                          : (dealer.copy["home.hero.mobile"] ??
                            locale.t(
                              "ui.home-vehicle-carousel.find-your-next-car",
                            ))
                        : dealer.contentStatus === "reference-demo"
                          ? locale.t(
                              "ui.home-vehicle-carousel.discover-your-next-car-today",
                            )
                          : dealer.copy["home.hero"]) ??
                      locale.t(
                        "ui.home-vehicle-carousel.discover-your-next-car-today",
                      ))}</h1
                >
                <h6 class="color-white heading-6-medium desktop-type-lead">
                  {#if dealer.businessPreview}{locale.t(
                      dealer.businessPreview.mode ===
                        "illustrative-not-dealer-stock"
                        ? "dealer.home.illustrativeIntro"
                        : "dealer.home.intro",
                    )}{:else if phone.current}{locale.t(
                      "ui.home-vehicle-carousel.explore-cars-find-your-fit",
                    )}{:else}
                    {locale.t(
                      "ui.home-vehicle-carousel.explore-our-wide-selection-and-experience-a-smooth-buying",
                    )} <br class="d-none d-md-block" />
                    {locale.t(
                      "ui.home-vehicle-carousel.with-personalized-support-at-every-stage",
                    )}
                  {/if}
                </h6>
                <div
                  class="d-flex align-items-center justify-content-center pt-60 flex-wrap"
                >
                  <span class="text-sm-bold text-white desktop-type-eyebrow">
                    {locale.t("ui.home-vehicle-carousel.popular-searches")}
                  </span>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.economy")}
                  >
                    {locale.t("ui.home-vehicle-carousel.economy")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.standard")}
                  >
                    {locale.t("ui.home-vehicle-carousel.standard")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.luxury")}
                  >
                    {locale.t("ui.home-vehicle-carousel.luxury")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.suv")}
                  >
                    {locale.t("ui.home-vehicle-carousel.suv")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t(
                      "ui.home-vehicle-carousel.convertible",
                    )}
                  >
                    {locale.t("ui.home-vehicle-carousel.convertible")}
                  </DemoActionLink>
                </div>
              </div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="item-banner-slide banner-2">
              <div class="container text-center position-relative z-1">
                <span
                  class="btn background-brand-2 px-3 py-3 rounded-12 text-sm-bold text-dark desktop-type-eyebrow"
                  >{dealer.businessPreview
                    ? stockSummary(dealer.businessPreview, locale)
                    : locale.t("demo.stockCount")}</span
                >
                <h1 class="mt-20 mb-20 color-white desktop-type-hero"
                  >{dealer.businessPreview
                    ? locale.t("dealer.home.heading")
                    : ((phone.current
                        ? dealer.contentStatus === "reference-demo"
                          ? locale.t(
                              "ui.home-vehicle-carousel.find-your-next-car",
                            )
                          : (dealer.copy["home.hero.mobile"] ??
                            locale.t(
                              "ui.home-vehicle-carousel.find-your-next-car",
                            ))
                        : dealer.contentStatus === "reference-demo"
                          ? locale.t(
                              "ui.home-vehicle-carousel.discover-your-next-car-today",
                            )
                          : dealer.copy["home.hero"]) ??
                      locale.t(
                        "ui.home-vehicle-carousel.discover-your-next-car-today",
                      ))}</h1
                >
                <h6 class="color-white heading-6-medium desktop-type-lead">
                  {#if dealer.businessPreview}{locale.t(
                      "dealer.home.intro",
                    )}{:else if phone.current}{locale.t(
                      "ui.home-vehicle-carousel.explore-cars-find-your-fit",
                    )}{:else}
                    {locale.t(
                      "ui.home-vehicle-carousel.explore-our-wide-selection-and-experience-a-smooth-buying",
                    )} <br class="d-none d-md-block" />
                    {locale.t(
                      "ui.home-vehicle-carousel.with-personalized-support-at-every-stage",
                    )}
                  {/if}
                </h6>
                <div
                  class="d-flex align-items-center justify-content-center pt-60 flex-wrap"
                >
                  <span class="text-sm-bold text-white desktop-type-eyebrow">
                    {locale.t("ui.home-vehicle-carousel.popular-searches")}
                  </span>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.economy")}
                  >
                    {locale.t("ui.home-vehicle-carousel.economy")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.standard")}
                  >
                    {locale.t("ui.home-vehicle-carousel.standard")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.luxury")}
                  >
                    {locale.t("ui.home-vehicle-carousel.luxury")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t("ui.home-vehicle-carousel.suv")}
                  >
                    {locale.t("ui.home-vehicle-carousel.suv")}
                  </DemoActionLink>{"\n                                             \n                                            "}<DemoActionLink
                    href="#!"
                    class="text-white text-decoration-underline"
                    aria-label={locale.t(
                      "ui.home-vehicle-carousel.convertible",
                    )}
                  >
                    {locale.t("ui.home-vehicle-carousel.convertible")}
                  </DemoActionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-none d-md-block">
          <div
            class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
            tabindex="0"
            role="button"
            aria-label={locale.t("ui.home-vehicle-carousel.previous-slide")}
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
            aria-label={locale.t("ui.home-vehicle-carousel.next-slide")}
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
