<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import DemoForm from "#lib/components/DemoForm.svelte";
</script>

<div class="col-lg-4">
  <div class="box-search-style-2">
    <DemoForm action="#">
      <input
        class="desktop-type-body-small"
        type="text"
        placeholder={locale.t("ui.news-sidebar.search")}
        aria-label={locale.t("ui.news-sidebar.search")}
      />
      <input
        class="btn-search-submit"
        type="submit"
        value=""
        aria-label={locale.t("ui.news-sidebar.preview-field")}
      />
    </DemoForm>
  </div>
  <div class="box-sidebar-border desktop-panel">
    <div class="box-head-sidebar">
      <p class="text-xl-bold neutral-1000 desktop-type-panel"
        >{locale.t("ui.news-sidebar.trending-now")}</p
      >
    </div>
    <div class="box-content-sidebar">
      <ul class="list-posts">
        <li>
          <div class="card-post">
            <div class="card-image">
              <a
                href={locale.href("/news/article")}
                aria-label={locale.t("ui.news-sidebar.view-details")}
                ><img
                  src="/assets/imgs/blog/blog-list/trending.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a
                class="text-md-bold neutral-1000 desktop-type-compact-card"
                href={locale.href("/news/article")}
                aria-label={locale.t("editorial.title.rentalInsurance")}
                >{locale.t("editorial.title.rentalInsurance")}</a
              >
              <p class="text-sm-medium date-post neutral-500 desktop-type-meta"
                >{locale.date("2024-09-18")}</p
              >
            </div>
          </div>
        </li>
        <li>
          <div class="card-post">
            <div class="card-image">
              <a
                href={locale.href("/news/article")}
                aria-label={locale.t("ui.news-sidebar.view-details")}
                ><img
                  src="/assets/imgs/blog/blog-list/trending1.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a
                class="text-md-bold neutral-1000 desktop-type-compact-card"
                href={locale.href("/news/article")}
                aria-label={locale.t("editorial.title.businessTravel")}
                >{locale.t("editorial.title.businessTravel")}</a
              >
              <p class="text-sm-medium date-post neutral-500 desktop-type-meta"
                >{locale.date("2024-09-18")}</p
              >
            </div>
          </div>
        </li>
        <li>
          <div class="card-post">
            <div class="card-image">
              <a
                href={locale.href("/news/article")}
                aria-label={locale.t("ui.news-sidebar.view-details")}
                ><img
                  src="/assets/imgs/blog/blog-list/trending2.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a
                class="text-md-bold neutral-1000 desktop-type-compact-card"
                href={locale.href("/news/article")}
                aria-label={locale.t("editorial.title.nationalParks")}
                >{locale.t("editorial.title.nationalParks")}</a
              >
              <p class="text-sm-medium date-post neutral-500 desktop-type-meta"
                >{locale.date("2024-09-18")}</p
              >
            </div>
          </div>
        </li>
        <li>
          <div class="card-post">
            <div class="card-image">
              <a
                href={locale.href("/news/article")}
                aria-label={locale.t("ui.news-sidebar.view-details")}
                ><img
                  src="/assets/imgs/blog/blog-list/trending3.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a
                class="text-md-bold neutral-1000 desktop-type-compact-card"
                href={locale.href("/news/article")}
                aria-label={locale.t("editorial.title.extendRental")}
                >{locale.t("editorial.title.extendRental")}</a
              >
              <p class="text-sm-medium date-post neutral-500 desktop-type-meta"
                >{locale.date("2024-09-18")}</p
              >
            </div>
          </div>
        </li>
        <li>
          <div class="card-post">
            <div class="card-image">
              <a
                href={locale.href("/news/article")}
                aria-label={locale.t("ui.news-sidebar.view-details")}
                ><img
                  src="/assets/imgs/blog/blog-list/trending4.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a
                class="text-md-bold neutral-1000 desktop-type-compact-card"
                href={locale.href("/news/article")}
                aria-label={locale.t("editorial.title.returnChecklist")}
                >{locale.t("editorial.title.returnChecklist")}</a
              >
              <p class="text-sm-medium date-post neutral-500 desktop-type-meta"
                >{locale.date("2024-09-18")}</p
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="box-sidebar-border desktop-panel">
    <div class="box-head-sidebar">
      <p class="text-xl-bold neutral-1000 desktop-type-panel"
        >{locale.t("ui.news-sidebar.gallery")}</p
      >
    </div>
    <div class="box-content-sidebar">
      <ul class="list-photo-col-3">
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat2.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat3.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat4.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat5.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat6.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat7.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat8.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
        <li>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.news-sidebar.view-details")}
            ><img
              src="/assets/imgs/blog/blog-list/cat.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </li>
      </ul>
    </div>
  </div>
  <div class="sidebar-banner">
    <DemoActionLink
      href="#!"
      aria-label={locale.t("ui.news-sidebar.view-details")}
      ><img
        class="rounded-3 w-100"
        src="/assets/imgs/blog/blog-list/banner-ads.png"
        alt={locale.t("image.illustrative")}
      /></DemoActionLink
    >
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .box-sidebar-border {
      margin-bottom: var(--karento-desktop-panel-gap);
    }
    .box-head-sidebar {
      padding-bottom: var(--karento-desktop-space-4);
      margin-bottom: var(--karento-desktop-space-4);
    }
    .list-posts {
      margin: 0;
      padding: 0;
    }
    .list-posts .card-post {
      gap: var(--karento-desktop-space-3);
      margin-bottom: var(--karento-desktop-space-4);
    }
    .card-post .card-image {
      margin-right: 0;
    }
    .card-post .card-info {
      min-width: 0;
    }
    .card-post .card-info a {
      margin-bottom: var(--karento-desktop-space-2);
    }
    .box-search-style-2 {
      margin-bottom: var(--karento-desktop-panel-gap);
    }
    .box-search-style-2 :global(input:not(.btn-search-submit)) {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
      padding-inline: var(--karento-desktop-space-4)
        var(--karento-desktop-space-12);
    }
  }
</style>
