<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  const mobile = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="section-box box-picked background-body desktop-collection-section"
>
  <div class="container">
    {#if mobile.current}
      <MobileSectionHeading
        title={locale.t("ui.featured-car-review.car-review")}
        description={locale.t("reference.featured.reviews.intro")}
        actionLabel={locale.t("ui.featured-car-review.view-more")}
        actionHref="/vehicles"
      />
    {:else}
      <div class="row align-items-end desktop-section-heading">
        <div class="col-md-9 mb-30">
          <h3 class="neutral-1000 desktop-type-collection"
            >{locale.t("ui.featured-car-review.car-review")}</h3
          >
          <p class="text-lg-medium neutral-500 desktop-type-lead"
            >{locale.t("reference.featured.reviews.intro")}</p
          >
        </div>
        <div class="col-md-3 mb-30">
          <div class="d-flex justify-content-center justify-content-md-end">
            <a
              class="btn btn-primary desktop-type-pill desktop-section-action"
              href={locale.href("/vehicles")}
              aria-label={locale.t("ui.featured-car-review.view-more")}
            >
              {locale.t("ui.featured-car-review.view-more")}
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
            </a>
          </div>
        </div>
      </div>
    {/if}
    <div class="box-videos-small mt-0">
      <div class="bg-video background-2"></div>
      <div class="row">
        <div class="col-lg-7">
          <div class="card-grid-video">
            <div class="card-image"
              ><a
                class="btn btn-play popup-youtube"
                href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                aria-label={locale.t("ui.featured-car-review.view-details")}
              >
              </a><img
                class="mr-10"
                src="/assets/imgs/car-review/car-review-1/img-video-1.png"
                alt={locale.t("image.illustrative")}
              /></div
            >
            <div class="card-info">
              <h4 class="text-white desktop-type-article-subhead"
                >{locale.t("reference.featured.reviews.bmwM2")}</h4
              >
              <p class="text-md-medium text-white desktop-type-meta"
                >{locale.date("2024-08-18")}</p
              >
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="list-videos-small">
            <div class="item-video-small">
              <div class="item-image"
                ><a
                  class="btn-play-sm popup-youtube"
                  href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                  aria-label={locale.t("ui.featured-car-review.view-details")}
                >
                </a><img
                  class="mr-10"
                  src="/assets/imgs/car-review/car-review-1/img-video-2.png"
                  alt={locale.t("image.illustrative")}
                /></div
              >
              <div class="item-info">
                <a
                  class="heading-6 desktop-type-compact-card"
                  href={locale.href("/vehicle")}
                  aria-label={locale.t(
                    "reference.featured.reviews.threeRowSuvs",
                  )}>{locale.t("reference.featured.reviews.threeRowSuvs")}</a
                >
                <p class="text-md-medium neutral-500 desktop-type-meta"
                  >{locale.date("2024-08-18")}</p
                >
              </div>
            </div>
            <div class="item-video-small">
              <div class="item-image"
                ><a
                  class="btn-play-sm popup-youtube"
                  href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                  aria-label={locale.t("ui.featured-car-review.view-details")}
                >
                </a><img
                  class="mr-10"
                  src="/assets/imgs/car-review/car-review-1/img-video-3.png"
                  alt={locale.t("image.illustrative")}
                /></div
              >
              <div class="item-info">
                <a
                  class="heading-6 desktop-type-compact-card"
                  href={locale.href("/vehicle")}
                  aria-label={locale.t(
                    "reference.featured.reviews.sportCoupes",
                  )}>{locale.t("reference.featured.reviews.sportCoupes")}</a
                >
                <p class="text-md-medium neutral-500 desktop-type-meta"
                  >{locale.date("2024-08-18")}</p
                >
              </div>
            </div>
            <div class="item-video-small">
              <div class="item-image"
                ><a
                  class="btn-play-sm popup-youtube"
                  href="https://www.youtube.com/watch?v=AOg61RB75Ho"
                  aria-label={locale.t("ui.featured-car-review.view-details")}
                >
                </a><img
                  class="mr-10"
                  src="/assets/imgs/car-review/car-review-1/img-video-4.png"
                  alt={locale.t("image.illustrative")}
                /></div
              >
              <div class="item-info">
                <a
                  class="heading-6 desktop-type-compact-card"
                  href={locale.href("/vehicle")}
                  aria-label={locale.t(
                    "reference.featured.reviews.smallHatchbacks",
                  )}>{locale.t("reference.featured.reviews.smallHatchbacks")}</a
                >
                <p class="text-md-medium neutral-500 desktop-type-meta"
                  >{locale.date("2024-08-18")}</p
                >
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
