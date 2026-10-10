<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import {
    newsArticleDestination,
    referenceNewsLinkIds,
  } from "#lib/data/news.ts";
  const desktop = new MediaQuery("(min-width: 992px)");
  function articleHref(id: string) {
    return locale.href(
      desktop.current ? newsArticleDestination({ id }) : "/news/article",
    );
  }
</script>

<div class="section-box box-posts-grid-2 background-100">
  <div class="container">
    <div class="text-center mb-40">
      <div
        class="background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex"
      >
        <a
          href={locale.href("/")}
          class="neutral-700 text-md-medium desktop-type-meta"
          aria-label={locale.t("ui.trending-news-grid.home")}
          >{locale.t("ui.trending-news-grid.home")}</a
        >
        <span>
          <img
            src="/assets/imgs/template/icons/arrow-right.svg"
            alt={locale.t("image.illustrative")}
          />
        </span>
        <DemoActionLink
          href="#!"
          class="neutral-1000 text-md-bold desktop-type-label"
          aria-label={locale.t("editorial.navigation.blog")}
          >{locale.t("editorial.navigation.blog")}</DemoActionLink
        >
      </div>
      {#if desktop.current}
        <h1 class="my-3 neutral-1000 desktop-type-page"
          >{locale.t("ui.trending-news-grid.inside-trending")}</h1
        >
      {:else}
        <h3 class="my-3 neutral-1000 desktop-type-page"
          >{locale.t("ui.trending-news-grid.inside-trending")}</h3
        >
      {/if}
    </div>
    <div class="row">
      <div class="col-lg-7">
        <div class="card-blog">
          <div class="card-image"
            ><img
              src="/assets/imgs/blog/blog-list/img-1.png"
              alt={locale.t("ui.trending-news-grid.carento-d3b7e0")}
            /></div
          >
          <div class="card-info">
            <div class="card-info-blog">
              <DemoActionLink
                class="btn btn-label-tag desktop-type-badge"
                href="#!"
                aria-label={locale.t("ui.trending-news-grid.car-rental-tips")}
                >{locale.t(
                  "ui.trending-news-grid.car-rental-tips",
                )}</DemoActionLink
              >
              <a
                class="card-title heading-5 desktop-type-article-subhead"
                href={articleHref(referenceNewsLinkIds.rentalExperience)}
                aria-label={locale.t("editorial.title.rentalExperience")}
                >{locale.t("editorial.title.rentalExperience")}</a
              >
              <div class="card-meta-user">
                <div class="box-author-small">
                  <img
                    src="/assets/imgs/page/homepage1/avatar.png"
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
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <ul class="list-posts list-posts-md">
          <li>
            <div class="card-post">
              <div class="card-image">
                <a
                  href={articleHref(referenceNewsLinkIds.rentalNeeds)}
                  aria-label={locale.t("ui.trending-news-grid.view-details")}
                  ><img
                    src="/assets/imgs/blog/blog-list/img-2.png"
                    alt={locale.t("ui.trending-news-grid.carento-d3b7e0")}
                  /></a
                >
              </div>
              <div class="card-info">
                <a
                  class="text-xl-bold neutral-1000 desktop-type-card"
                  href={articleHref(referenceNewsLinkIds.rentalNeeds)}
                  aria-label={locale.t("editorial.title.rentalNeeds")}
                  >{locale.t("editorial.title.rentalNeeds")}</a
                >
                <div class="d-flex align-items-center">
                  <p
                    class="text-md-bold date-post neutral-500 mr-20 desktop-type-meta"
                    >{locale.date("2024-09-18")}</p
                  >
                  <p class="text-md-bold neutral-500 desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card-post">
              <div class="card-image">
                <a
                  href={articleHref(referenceNewsLinkIds.luxuryOccasions)}
                  aria-label={locale.t("ui.trending-news-grid.view-details")}
                  ><img
                    src="/assets/imgs/blog/blog-list/img-3.png"
                    alt={locale.t("ui.trending-news-grid.carento-d3b7e0")}
                  /></a
                >
              </div>
              <div class="card-info">
                <a
                  class="text-xl-bold neutral-1000 desktop-type-card"
                  href={articleHref(referenceNewsLinkIds.luxuryOccasions)}
                  aria-label={locale.t("editorial.title.luxuryOccasions")}
                  >{locale.t("editorial.title.luxuryOccasions")}</a
                >
                <div class="d-flex align-items-center">
                  <p
                    class="text-md-bold date-post neutral-500 mr-20 desktop-type-meta"
                    >{locale.date("2024-09-18")}</p
                  >
                  <p class="text-md-bold neutral-500 desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card-post">
              <div class="card-image">
                <a
                  href={articleHref(referenceNewsLinkIds.scenicDrives)}
                  aria-label={locale.t("ui.trending-news-grid.view-details")}
                  ><img
                    src="/assets/imgs/blog/blog-list/img-4.png"
                    alt={locale.t("ui.trending-news-grid.carento-d3b7e0")}
                  /></a
                >
              </div>
              <div class="card-info">
                <a
                  class="text-xl-bold neutral-1000 desktop-type-card"
                  href={articleHref(referenceNewsLinkIds.scenicDrives)}
                  aria-label={locale.t("editorial.title.scenicDrives")}
                  >{locale.t("editorial.title.scenicDrives")}</a
                >
                <div class="d-flex align-items-center">
                  <p
                    class="text-md-bold date-post neutral-500 mr-20 desktop-type-meta"
                    >{locale.date("2024-09-18")}</p
                  >
                  <p class="text-md-bold neutral-500 desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="card-post">
              <div class="card-image">
                <a
                  href={articleHref(referenceNewsLinkIds.rentingAbroad)}
                  aria-label={locale.t("ui.trending-news-grid.view-details")}
                  ><img
                    src="/assets/imgs/blog/blog-list/img-5.png"
                    alt={locale.t("ui.trending-news-grid.carento-d3b7e0")}
                  /></a
                >
              </div>
              <div class="card-info">
                <a
                  class="text-xl-bold neutral-1000 desktop-type-card"
                  href={articleHref(referenceNewsLinkIds.rentingAbroad)}
                  aria-label={locale.t("editorial.title.rentingAbroad")}
                  >{locale.t("editorial.title.rentingAbroad")}</a
                >
                <div class="d-flex align-items-center">
                  <p
                    class="text-md-bold date-post neutral-500 mr-20 desktop-type-meta"
                    >{locale.date("2024-09-18")}</p
                  >
                  <p class="text-md-bold neutral-500 desktop-type-meta"
                    >{locale.date("2024-01-12")}</p
                  >
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="d-flex flex-wrap align-items-center justify-content-center gap-3 pt-55"
    >
      <span class="text-md-bold neutral-1000 desktop-type-label">
        {locale.t("ui.trending-news-grid.category")}
      </span>
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.industry-news")}
        >{locale.t("ui.trending-news-grid.industry-news")}</DemoActionLink
      >
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.rental-advice")}
        >{locale.t("ui.trending-news-grid.rental-advice")}</DemoActionLink
      >
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.road-trips")}
        >{locale.t("ui.trending-news-grid.road-trips")}</DemoActionLink
      >
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.car-review")}
        >{locale.t("ui.trending-news-grid.car-review")}</DemoActionLink
      >
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.travel-tips")}
        >{locale.t("ui.trending-news-grid.travel-tips")}</DemoActionLink
      >
      <DemoActionLink
        href="#!"
        class="btn btn-white px-3 py-2 desktop-type-pill"
        aria-label={locale.t("ui.trending-news-grid.customer-stories")}
        >{locale.t("ui.trending-news-grid.customer-stories")}</DemoActionLink
      >
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .card-blog {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
    }

    .card-blog .card-image,
    .card-blog .card-info {
      grid-area: 1 / 1;
      min-width: 0;
    }

    .card-blog .card-image {
      display: grid;
    }

    .card-blog .card-image img {
      height: 100%;
      object-fit: cover;
    }

    .card-blog .card-info {
      position: relative;
      inset: auto;
      display: flex;
      align-items: flex-end;
    }

    .card-blog .card-info .card-info-blog {
      position: static;
      padding: var(--karento-space-4);
    }

    .card-blog .card-info .card-info-blog :global(.btn),
    .card-blog .card-info .card-info-blog .card-title {
      margin-bottom: var(--karento-space-3);
    }

    .card-blog .card-info .card-info-blog .card-title {
      font-size: var(--karento-type-compact-card-size);
      font-weight: var(--karento-type-compact-card-weight);
      line-height: var(--karento-type-compact-card-leading);
    }
  }
</style>
