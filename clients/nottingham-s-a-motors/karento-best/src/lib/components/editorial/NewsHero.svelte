<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { slider } from "#lib/vendor.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<div class="box-swiper">
  <div
    class="swiper-container swiper-group-1 position-relative"
    {@attach slider}
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <a
          class="d-block"
          href={locale.href("/news/article")}
          aria-label={locale.t("ui.news-hero.view-details")}
          ><div
            class="item-banner-slide-review karento-news-hero d-flex align-items-center rounded-12"
          >
            <div class="position-relative z-1 karento-news-hero-copy">
              <span class="text-primary text-md-bold desktop-type-eyebrow"
                >{locale.t("ui.news-hero.road-trips")}</span
              >
              <h2
                class="mt-20 mb-20 color-white desktop-type-hero karento-news-hero-title"
              >
                {locale.t("editorial.hero.titleLead")}
                <br class="d-none d-md-block" />
                {locale.t("editorial.hero.titleTail")}
              </h2>
              <div class="card-meta-user">
                <div class="box-author-small">
                  <img
                    src="/assets/imgs/blog/blog-grid/avatar.png"
                    alt={locale.t("image.illustrative")}
                  />
                  <p class="text-sm-bold desktop-type-meta"
                    >{locale.t("editorial.authorBy", {
                      author: "Jimmy Dave",
                    })}</p
                  >
                </div>
                <div class="date-post">
                  <p class="text-sm-medium desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
              <p class="text-lg-medium color-white mt-3 desktop-type-lead">
                {#if desktop.current}{locale.t(
                    "editorial.hero.desktopSummary",
                  )}{:else}
                  {locale.t("editorial.hero.summaryLead")} <br />
                  {locale.t("editorial.hero.summaryTail")}
                {/if}
              </p>
            </div>
          </div></a
        >
      </div>
      <div class="swiper-slide">
        <a
          class="d-block"
          href={locale.href("/news/article")}
          aria-label={locale.t("ui.news-hero.view-details")}
          ><div
            class="item-banner-slide-review karento-news-hero banner2 d-flex align-items-center rounded-12"
          >
            <div class="position-relative z-1 karento-news-hero-copy">
              <span class="text-primary text-md-bold desktop-type-eyebrow"
                >{locale.t("ui.news-hero.road-trips")}</span
              >
              <h2
                class="mt-20 mb-20 color-white desktop-type-hero karento-news-hero-title"
              >
                {locale.t("editorial.hero.titleLead")}
                <br class="d-none d-md-block" />
                {locale.t("editorial.hero.titleTail")}
              </h2>
              <div class="card-meta-user">
                <div class="box-author-small">
                  <img
                    src="/assets/imgs/blog/blog-grid/avatar.png"
                    alt={locale.t("image.illustrative")}
                  />
                  <p class="text-sm-bold desktop-type-meta"
                    >{locale.t("editorial.authorBy", {
                      author: "Jimmy Dave",
                    })}</p
                  >
                </div>
                <div class="date-post">
                  <p class="text-sm-medium desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
              <p class="text-lg-medium color-white mt-3 desktop-type-lead">
                {#if desktop.current}{locale.t(
                    "editorial.hero.desktopSummary",
                  )}{:else}
                  {locale.t("editorial.hero.summaryLead")} <br />
                  {locale.t("editorial.hero.summaryTail")}
                {/if}
              </p>
            </div>
          </div></a
        >
      </div>
    </div>
    <div class="position-absolute end-0 bottom-0 p-40">
      <div class="box-button-slider box-button-slider-team justify-content-end">
        <div
          class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
          tabindex="0"
          role="button"
          aria-label={locale.t("ui.news-hero.previous-slide")}
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
          aria-label={locale.t("ui.news-hero.next-slide")}
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

<style>
  .karento-news-hero-title {
    text-wrap: balance;
  }
  @media (max-width: 991.98px) {
    .karento-news-hero-title {
      font-size: 30px;
      line-height: 1.25;
    }
  }
</style>
