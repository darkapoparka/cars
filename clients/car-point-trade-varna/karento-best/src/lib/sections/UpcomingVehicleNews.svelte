<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { slider } from "#lib/vendor.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileNewsCollection from "#lib/components/editorial/MobileNewsCollection.svelte";
  import {
    newsArticleDestination,
    referenceNewsLinkIds,
  } from "#lib/data/news.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  function articleHref(id: string) {
    return locale.href(
      desktop.current ? newsArticleDestination({ id }) : "/news/article",
    );
  }
</script>

{#if phone.current}
  <MobileNewsCollection />
{:else}
  <section
    class="section-box box-news background-body desktop-collection-section"
  >
    <div class="container">
      <div
        class="row align-items-end home-section-heading desktop-section-heading"
      >
        <div class="col-md-9 mb-30 home-section-title">
          <h3 class="title-svg neutral-1000 mb-15 desktop-type-collection"
            >{locale.t("ui.upcoming-vehicle-news.upcoming-cars-events")}</h3
          >
          <p
            class="text-lg-medium text-bold neutral-500 home-section-description desktop-type-lead"
            >{locale.t("editorial.upcoming.summary")}</p
          >
        </div>
        <div class="col-md-3 position-relative mb-30 home-section-actions">
          <div
            class="box-button-slider box-button-slider-team justify-content-end"
          >
            <div
              class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
              tabindex="0"
              role="button"
              aria-label={locale.t("ui.upcoming-vehicle-news.previous-slide")}
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
              aria-label={locale.t("ui.upcoming-vehicle-news.next-slide")}
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
          <div class="swiper-container swiper-group-3" {@attach slider}>
            <div class="swiper-wrapper">
              <div class="swiper-slide pt-2">
                <div class="card-news background-card">
                  <div class="card-image">
                    <a
                      href={articleHref(referenceNewsLinkIds.escalade)}
                      aria-label={locale.t(
                        "ui.upcoming-vehicle-news.view-details",
                      )}
                    >
                      <img
                        src="/assets/imgs/blog/blog-1/img-1.png"
                        alt={locale.t("image.illustrative")}
                      />
                    </a>
                  </div>
                  <div class="card-info">
                    <a
                      class="karento-news-tag bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold desktop-type-badge"
                      href={locale.href("/news")}
                      aria-label={locale.t("ui.upcoming-vehicle-news.news")}
                      >{locale.t("ui.upcoming-vehicle-news.news")}</a
                    >
                    <div class="card-meta"
                      ><span class="post-date neutral-1000 desktop-type-meta"
                        >{locale.date("2024-09-18")}</span
                      ><span class="post-time neutral-1000 desktop-type-meta"
                        >{locale.t("referenceHome.news.readTime")}</span
                      ><span class="post-comment neutral-1000 desktop-type-meta"
                        >{locale.count(38, "comments")}</span
                      ></div
                    >
                    <div class="card-title"
                      ><a
                        class="text-xl-bold neutral-1000 d-block desktop-type-card"
                        href={articleHref(referenceNewsLinkIds.escalade)}
                        aria-label={locale.t("referenceHome.news.escalade")}
                        >{locale.t("referenceHome.news.escalade")}
                      </a></div
                    >
                    <div class="card-program">
                      <div class="endtime">
                        <div class="card-author">
                          <img
                            src="/assets/imgs/blog/blog-1/avatar-1.png"
                            alt={locale.t("image.illustrative")}
                          />
                          <p class="text-sm-bold neutral-1000 desktop-type-meta"
                            >Jimmy Dave</p
                          >
                        </div>
                        <div class="card-button"
                          ><a
                            class="btn btn-gray desktop-type-pill"
                            href={articleHref(referenceNewsLinkIds.escalade)}
                            aria-label={locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
                            )}
                            >{locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
                            )}</a
                          ></div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="swiper-slide pt-2">
                <div class="card-news background-card">
                  <div class="card-image">
                    <a
                      href={articleHref(referenceNewsLinkIds.bmw)}
                      aria-label={locale.t(
                        "ui.upcoming-vehicle-news.view-details",
                      )}
                    >
                      <img
                        src="/assets/imgs/blog/blog-1/img-2.png"
                        alt={locale.t("image.illustrative")}
                      />
                    </a>
                  </div>
                  <div class="card-info">
                    <a
                      class="karento-news-tag bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold desktop-type-badge"
                      href={locale.href("/news")}
                      aria-label={locale.t("referenceHome.news.trend")}
                      >{locale.t("referenceHome.news.trend")}</a
                    >
                    <div class="card-meta"
                      ><span class="post-date neutral-1000 desktop-type-meta"
                        >{locale.date("2024-09-18")}</span
                      ><span class="post-time neutral-1000 desktop-type-meta"
                        >{locale.t("referenceHome.news.readTime")}</span
                      ><span class="post-comment neutral-1000 desktop-type-meta"
                        >{locale.count(38, "comments")}</span
                      ></div
                    >
                    <div class="card-title"
                      ><a
                        class="text-xl-bold neutral-1000 d-block desktop-type-card"
                        href={articleHref(referenceNewsLinkIds.bmw)}
                        aria-label={locale.t("referenceHome.news.bmw")}
                        >{locale.t("referenceHome.news.bmw")}</a
                      ></div
                    >
                    <div class="card-program">
                      <div class="endtime">
                        <div class="card-author">
                          <img
                            src="/assets/imgs/blog/blog-1/avatar-2.png"
                            alt={locale.t("image.illustrative")}
                          />
                          <p class="text-sm-bold neutral-1000 desktop-type-meta"
                            >Steven Job</p
                          >
                        </div>
                        <div class="card-button"
                          ><a
                            class="btn btn-gray desktop-type-pill"
                            href={articleHref(referenceNewsLinkIds.bmw)}
                            aria-label={locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
                            )}
                            >{locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
                            )}</a
                          ></div
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="swiper-slide pt-2">
                <div class="card-news background-card">
                  <div class="card-image">
                    <a
                      href={articleHref(referenceNewsLinkIds.rodeo)}
                      aria-label={locale.t(
                        "ui.upcoming-vehicle-news.view-details",
                      )}
                    >
                      <img
                        src="/assets/imgs/blog/blog-1/img-3.png"
                        alt={locale.t("image.illustrative")}
                      />
                    </a>
                  </div>
                  <div class="card-info">
                    <a
                      class="karento-news-tag bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold desktop-type-badge"
                      href={locale.href("/news")}
                      aria-label={locale.t("editorial.category.discovery")}
                      >{locale.t("editorial.category.discovery")}</a
                    >
                    <div class="card-meta"
                      ><span class="post-date neutral-1000 desktop-type-meta"
                        >{locale.date("2024-09-18")}</span
                      ><span class="post-time neutral-1000 desktop-type-meta"
                        >{locale.t("referenceHome.news.readTime")}</span
                      ><span class="post-comment neutral-1000 desktop-type-meta"
                        >{locale.count(38, "comments")}</span
                      ></div
                    >
                    <div class="card-title"
                      ><a
                        class="text-xl-bold neutral-1000 d-block desktop-type-card"
                        href={articleHref(referenceNewsLinkIds.rodeo)}
                        aria-label={locale.t("referenceHome.news.rodeo")}
                        >{locale.t("referenceHome.news.rodeo")}</a
                      ></div
                    >
                    <div class="card-program">
                      <div class="endtime">
                        <div class="card-author">
                          <img
                            src="/assets/imgs/blog/blog-1/avatar-3.png"
                            alt={locale.t("image.illustrative")}
                          />
                          <p class="text-sm-bold neutral-1000 desktop-type-meta"
                            >David Jame</p
                          >
                        </div>
                        <div class="card-button"
                          ><a
                            class="btn btn-gray desktop-type-pill"
                            href={articleHref(referenceNewsLinkIds.rodeo)}
                            aria-label={locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
                            )}
                            >{locale.t(
                              "ui.upcoming-vehicle-news.keep-reading",
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
{/if}

<style>
  @media (min-width: 992px) {
    .karento-news-tag {
      left: 24px;
      right: auto !important;
      margin-right: 0 !important;
      padding: var(--karento-desktop-space-1) var(--karento-desktop-space-3) !important;
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-pill-radius) !important;
      background: var(--bs-neutral-0) !important;
      color: var(--bs-neutral-1000);
      box-shadow: 0 2px 7px rgb(0 0 0 / 7%);
    }

    .karento-news-tag:is(:hover, :focus-visible) {
      background: var(--bs-neutral-100) !important;
      color: var(--bs-neutral-1000);
    }

    .karento-news-tag:focus-visible {
      outline: 2px solid var(--bs-neutral-1000) !important;
      outline-offset: 3px;
    }
  }

  @media (min-width: 992px) {
    .desktop-section-heading > .mb-30 {
      margin-bottom: 0 !important;
    }
    .box-list-news.mt-5 {
      margin-top: 0 !important;
    }
  }
</style>
