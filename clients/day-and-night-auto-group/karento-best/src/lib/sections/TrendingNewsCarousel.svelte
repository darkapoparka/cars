<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { slider } from "#lib/vendor.ts";
</script>

<section class="section-box background-body pb-85 desktop-collection-section">
  <div class="container">
    <div class="row align-items-end desktop-section-heading">
      <div class="col-md-9 mb-30">
        <h3 class="title-svg neutral-1000 mb-15 desktop-type-collection"
          >{locale.t("ui.trending-news-carousel.inside-trending")}</h3
        >
        <p class="text-lg-medium text-bold neutral-500 desktop-type-lead"
          >{locale.t("ui.trending-news-carousel.the-latest-news-and-events")}</p
        >
      </div>
      <div class="col-md-3 position-relative mb-30">
        <div
          class="box-button-slider box-button-slider-team justify-content-end"
        >
          <div
            class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
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
    <div class="box-list-news mt-5">
      <div class="box-swiper">
        <div class="swiper-container swiper-group-2" {@attach slider}>
          <div class="swiper-wrapper">
            <div class="swiper-slide pb-4 pt-2">
              <div class="card-news background-card d-md-flex mb-4">
                <div class="card-image">
                  <a
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "ui.trending-news-carousel.view-details",
                    )}
                  >
                    <img
                      class="w-100"
                      src="/assets/imgs/blog/blog-2/img-1.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </a>
                </div>
                <div class="card-info mt-0 w-68 px-4">
                  <div class="card-title mb-2">
                    <a
                      class="text-xl-bold neutral-1000 d-block"
                      href={locale.href("/news/article")}
                      aria-label={locale.t(
                        "ui.trending-news-carousel.view-details",
                      )}
                    >
                      <h6 class="desktop-type-card"
                        >{locale.t("editorial.title.stylishTech")}</h6
                      >
                    </a>
                  </div>
                  <div class="card-meta"
                    ><span class="post-date neutral-1000 desktop-type-meta"
                      >{locale.date("2024-09-18")}</span
                    ><span class="post-time neutral-1000 desktop-type-meta"
                      >{locale.t("referenceHome.news.readTime")}</span
                    ><span class="post-comment neutral-1000 desktop-type-meta"
                      >{locale.count(38, "comments")}</span
                    ></div
                  >
                  <p class="text-md-medium neutral-500 desktop-type-body"
                    >{locale.t("editorial.list.shortExcerpt")}</p
                  >
                  <div class="card-program">
                    <div class="endtime mt-4">
                      <div class="card-button"
                        ><a
                          class="btn btn-gray desktop-type-pill"
                          href={locale.href("/news/article")}
                          aria-label={locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}
                          >{locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-news background-card d-md-flex mb-4">
                <div class="card-image">
                  <a
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "ui.trending-news-carousel.view-details",
                    )}
                  >
                    <img
                      class="w-100"
                      src="/assets/imgs/blog/blog-2/img-2.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </a>
                </div>
                <div class="card-info mt-0 w-68 px-4">
                  <div class="card-title mb-2">
                    <a
                      class="text-xl-bold neutral-1000 d-block"
                      href={locale.href("/news/article")}
                      aria-label={locale.t(
                        "ui.trending-news-carousel.view-details",
                      )}
                    >
                      <h6 class="desktop-type-card"
                        >{locale.t("editorial.title.stylishTech")}</h6
                      >
                    </a>
                  </div>
                  <div class="card-meta"
                    ><span class="post-date neutral-1000 desktop-type-meta"
                      >{locale.date("2024-09-18")}</span
                    ><span class="post-time neutral-1000 desktop-type-meta"
                      >{locale.t("referenceHome.news.readTime")}</span
                    ><span class="post-comment neutral-1000 desktop-type-meta"
                      >{locale.count(38, "comments")}</span
                    ></div
                  >
                  <p class="text-md-medium neutral-500 desktop-type-body"
                    >{locale.t("editorial.list.shortExcerpt")}</p
                  >
                  <div class="card-program">
                    <div class="endtime mt-4">
                      <div class="card-button"
                        ><a
                          class="btn btn-gray desktop-type-pill"
                          href={locale.href("/news/article")}
                          aria-label={locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}
                          >{locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide pb-4 pt-2">
              <div class="card-news background-card d-md-flex mb-4">
                <div class="card-image">
                  <a
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "ui.trending-news-carousel.view-details",
                    )}
                  >
                    <img
                      class="w-100"
                      src="/assets/imgs/blog/blog-2/img-3.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </a>
                </div>
                <div class="card-info mt-0 w-68 px-4">
                  <div class="card-title mb-2">
                    <a
                      class="text-xl-bold neutral-1000 d-block"
                      href={locale.href("/news/article")}
                      aria-label={locale.t(
                        "ui.trending-news-carousel.view-details",
                      )}
                    >
                      <h6 class="desktop-type-card"
                        >{locale.t("editorial.title.stylishTech")}</h6
                      >
                    </a>
                  </div>
                  <div class="card-meta"
                    ><span class="post-date neutral-1000 desktop-type-meta"
                      >{locale.date("2024-09-18")}</span
                    ><span class="post-time neutral-1000 desktop-type-meta"
                      >{locale.t("referenceHome.news.readTime")}</span
                    ><span class="post-comment neutral-1000 desktop-type-meta"
                      >{locale.count(38, "comments")}</span
                    ></div
                  >
                  <p class="text-md-medium neutral-500 desktop-type-body"
                    >{locale.t("editorial.list.shortExcerpt")}</p
                  >
                  <div class="card-program">
                    <div class="endtime mt-4">
                      <div class="card-button"
                        ><a
                          class="btn btn-gray desktop-type-pill"
                          href={locale.href("/news/article")}
                          aria-label={locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}
                          >{locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}</a
                        ></div
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-news background-card d-md-flex mb-4">
                <div class="card-image">
                  <a
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "ui.trending-news-carousel.view-details",
                    )}
                  >
                    <img
                      class="w-100"
                      src="/assets/imgs/blog/blog-2/img-4.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </a>
                </div>
                <div class="card-info mt-0 w-68 px-4">
                  <div class="card-title mb-2">
                    <a
                      class="text-xl-bold neutral-1000 d-block"
                      href={locale.href("/news/article")}
                      aria-label={locale.t(
                        "ui.trending-news-carousel.view-details",
                      )}
                    >
                      <h6 class="desktop-type-card"
                        >{locale.t("editorial.title.stylishTech")}</h6
                      >
                    </a>
                  </div>
                  <div class="card-meta"
                    ><span class="post-date neutral-1000 desktop-type-meta"
                      >{locale.date("2024-09-18")}</span
                    ><span class="post-time neutral-1000 desktop-type-meta"
                      >{locale.t("referenceHome.news.readTime")}</span
                    ><span class="post-comment neutral-1000 desktop-type-meta"
                      >{locale.count(38, "comments")}</span
                    ></div
                  >
                  <p class="text-md-medium neutral-500 desktop-type-body"
                    >{locale.t("editorial.list.shortExcerpt")}</p
                  >
                  <div class="card-program">
                    <div class="endtime mt-4">
                      <div class="card-button"
                        ><a
                          class="btn btn-gray desktop-type-pill"
                          href={locale.href("/news/article")}
                          aria-label={locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}
                          >{locale.t(
                            "ui.trending-news-carousel.keep-reading",
                          )}</a
                        ></div
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
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-section-heading > .mb-30 {
      margin-bottom: 0 !important;
    }
  }
</style>
