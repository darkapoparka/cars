<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import ArticleShareLinks from "./ArticleShareLinks.svelte";
  import ArticleCommentForm from "./ArticleCommentForm.svelte";
  import ArticleComments from "./ArticleComments.svelte";
</script>

<div class="box-content-detail-blog">
  <div class="box-content-info-detail mt-0 pt-0">
    <p class="text-xl-medium mb-20 neutral-1000 desktop-type-lead"
      >{locale.t("editorial.article.introduction")}</p
    >
    <div class="content-detail-post">
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.purposeHeading")}</h6
      >
      <p class="neutral-1000 desktop-type-prose"
        >{locale.t("editorial.article.purposeBody")}</p
      >
    </div>
    <div
      class="d-flex flex-md-row flex-column align-items-center justify-content-center gap-3 mb-30"
    >
      <div>
        <img
          src="/assets/imgs/blog/blog-details/img-1.png"
          alt={locale.t("image.illustrative")}
        />
      </div>
      <div>
        <img
          src="/assets/imgs/blog/blog-details/img-2.png"
          alt={locale.t("image.illustrative")}
        />
      </div>
    </div>
    <div class="content-detail-post">
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.passengersHeading")}</h6
      >
      <p class="desktop-type-prose"
        >{locale.t("editorial.article.passengersBody")}</p
      >
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.terrainHeading")}</h6
      >
      <p class="desktop-type-prose"
        >{locale.t("editorial.article.terrainBody")}</p
      >
    </div>
    <div class="row mb-30 d-none d-md-block">
      <div class="col-8 mx-auto">
        <div class="p-4 position-relative">
          <img
            class="position-absolute top-0 start-0 bottom-0 end-0 z-0 h-100"
            src="/assets/imgs/blog/blog-details/banner-img.png"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="position-absolute top-0 end-0 z-1"
            src="/assets/imgs/blog/blog-details/banner-car.png"
            alt={locale.t("image.illustrative")}
          />
          <div class="position-relative z-1">
            <h6 class="text-white desktop-type-card"
              >{locale.t("ui.rental-advice-article.need-a-car-rent-now")}</h6
            >
            <p class="text-xs-medium text-white desktop-type-meta"
              >{locale.t(
                "ui.rental-advice-article.find-the-perfect-vehicle-for-your-journey-today",
              )}</p
            >
            <DemoActionLink
              href="#!"
              class="btn btn-primary px-2 py-1 rounded-2 mt-1 desktop-type-pill"
              aria-label={locale.t("ui.rental-advice-article.get-started")}
              >{locale.t(
                "ui.rental-advice-article.get-started",
              )}</DemoActionLink
            >
          </div>
        </div>
      </div>
    </div>
    <div class="content-detail-post">
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.fuelHeading")}</h6
      >
      <p class="desktop-type-prose">{locale.t("editorial.article.fuelBody")}</p>
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.budgetHeading")}</h6
      >
      <p class="desktop-type-prose"
        >{locale.t("editorial.article.budgetBody")}</p
      >
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.requirementsHeading")}</h6
      >
      <div class="d-lg-flex gap-4">
        <p class="desktop-type-prose"
          >{locale.t("editorial.article.passengersBody")}</p
        >
        <p class="desktop-type-prose"
          >{locale.t("editorial.article.passengersBody")}</p
        >
      </div>
      <div
        class="d-flex flex-md-row flex-column align-items-center justify-content-center gap-3 mb-30"
      >
        <div>
          <img
            src="/assets/imgs/blog/blog-details/img-3.png"
            alt={locale.t("image.illustrative")}
          />
        </div>
        <div>
          <img
            src="/assets/imgs/blog/blog-details/img-4.png"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
      <h6 class="desktop-type-article-subhead"
        >{locale.t("editorial.article.conclusionHeading")}</h6
      >
      <p class="desktop-type-prose"
        >{locale.t("editorial.article.conclusionBody")}</p
      >
    </div>
    <ArticleShareLinks />
    <ArticleCommentForm />
    <ArticleComments />
  </div>
</div>
