<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  const commentTime = $derived(
    new Intl.DateTimeFormat(locales[locale.locale].format, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date("2024-12-04T15:12:00Z")),
  );
  import { locales } from "#lib/i18n/locales.ts";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<div class="box-list-comment background-card mb-0">
  <div class="list-reviews">
    <div class="item-review">
      <div class="head-review">
        <div class="author-review">
          <img
            src="/assets/imgs/blog/blog-details/avatar-1.png"
            alt={locale.t("image.illustrative")}
          />
          <div class="author-info">
            <p class="text-lg-bold neutral-1000 desktop-type-compact-card"
              >Sarah Johnson</p
            >
            <p class="text-sm-medium neutral-500 desktop-type-meta"
              >{locale.t("editorial.comment.timestamp", {
                date: locale.date("2024-12-04"),
                time: commentTime,
              })}</p
            >
          </div>
        </div>
        <div class="rate-review">
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
      <div class="content-review">
        <p class="text-sm-medium neutral-800 desktop-type-body"
          >{locale.t(
            desktop.current
              ? "editorial.comment.sampleFirstBody"
              : "editorial.comment.firstBody",
          )}</p
        >
      </div>
    </div>
    <div class="item-review">
      <div class="head-review">
        <div class="author-review">
          <img
            src="/assets/imgs/blog/blog-details/avatar-2.png"
            alt={locale.t("image.illustrative")}
          />
          <div class="author-info">
            <p class="text-lg-bold neutral-1000 desktop-type-compact-card"
              >Michael Smith</p
            >
            <p class="text-sm-medium neutral-500 desktop-type-meta"
              >{locale.t("editorial.comment.timestamp", {
                date: locale.date("2024-12-04"),
                time: commentTime,
              })}</p
            >
          </div>
        </div>
        <div class="rate-review">
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
      <div class="content-review">
        <p class="text-sm-medium neutral-800 desktop-type-body"
          >{locale.t(
            desktop.current
              ? "editorial.comment.sampleSecondBody"
              : "editorial.comment.secondBody",
          )}</p
        >
      </div>
    </div>
    <div class="item-review">
      <div class="head-review">
        <div class="author-review">
          <img
            src="/assets/imgs/blog/blog-details/avatar-3.png"
            alt={locale.t("image.illustrative")}
          />
          <div class="author-info">
            <p class="text-lg-bold neutral-1000 desktop-type-compact-card"
              >Emily Williams</p
            >
            <p class="text-sm-medium neutral-500 desktop-type-meta"
              >{locale.t("editorial.comment.timestamp", {
                date: locale.date("2024-12-04"),
                time: commentTime,
              })}</p
            >
          </div>
        </div>
        <div class="rate-review">
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
          <img
            class="background-brand-2 p-1"
            src="/assets/imgs/template/icons/star-white.svg"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
      <div class="content-review">
        <p class="text-sm-medium neutral-800 desktop-type-body"
          >{locale.t(
            desktop.current
              ? "editorial.comment.sampleThirdBody"
              : "editorial.comment.thirdBody",
          )}</p
        >
      </div>
    </div>
  </div>
  <nav aria-label={locale.t("ui.article-comments.page-navigation-example")}>
    <ul class="pagination">
      <li class="page-item">
        <DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label={locale.t("ui.article-comments.previous")}
        >
          <span aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
        </DemoActionLink>
      </li>
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label="1">1</DemoActionLink
        ></li
      >
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link active"
          href="#!"
          aria-label="2">2</DemoActionLink
        ></li
      >
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label="3">3</DemoActionLink
        ></li
      >
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label="4">4</DemoActionLink
        ></li
      >
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label="5">5</DemoActionLink
        ></li
      >
      <li class="page-item"
        ><DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label="...">...</DemoActionLink
        ></li
      >
      <li class="page-item">
        <DemoActionLink
          class="desktop-type-pill page-link"
          href="#!"
          aria-label={locale.t("ui.article-comments.next")}
        >
          <span aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992"
                stroke=""
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </span>
        </DemoActionLink>
      </li>
    </ul>
  </nav>
</div>

<style>
  @media (min-width: 992px) {
    .list-reviews .item-review {
      padding: var(--karento-desktop-card-padding);
      margin-bottom: var(--karento-desktop-card-gap);
      border-radius: var(--karento-desktop-card-radius);
    }
    .item-review .head-review {
      align-items: center;
      flex-wrap: wrap;
      gap: var(--karento-desktop-space-3);
      padding-bottom: var(--karento-desktop-space-4);
      margin-bottom: var(--karento-desktop-space-4);
    }
    .item-review .author-review {
      min-width: 0;
    }
    .item-review .author-review img {
      width: var(--karento-desktop-control-height);
      height: var(--karento-desktop-control-height);
      margin-right: var(--karento-desktop-space-3);
    }
  }
</style>
