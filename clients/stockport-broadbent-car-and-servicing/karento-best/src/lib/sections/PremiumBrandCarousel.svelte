<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<div class="background-100 pb-70 desktop-collection-section">
  <div class="container">
    <div class="box-search-category">
      {#if phone.current}
        <MobileSectionHeading
          title={locale.t("ui.premium-brand-carousel.premium-brands")}
          description={locale.t("reference.featured.brands.intro")}
          actionLabel={locale.t("ui.premium-brand-carousel.show-all-brands")}
          actionHref="/vehicles"
        />
      {:else}
        <h3 class="heading-3 mb-0 neutral-1000 desktop-type-collection"
          >{locale.t("ui.premium-brand-carousel.premium-brands")}</h3
        >
        <div class="d-flex align-items-center justify-content-between">
          <p class="text-lg-medium neutral-500 desktop-type-lead"
            >{locale.t("reference.featured.brands.intro")}</p
          >
          <a
            href={locale.href("/vehicles")}
            class="text-sm-bold neutral-1000"
            aria-label={locale.t("ui.premium-brand-carousel.show-all-brands")}
          >
            {locale.t("ui.premium-brand-carousel.show-all-brands")}
            <svg
              class="ms-1"
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="10"
              viewBox="0 0 15 10"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.718262 4.99965C0.718262 4.86705 0.77094 4.73987 0.864708 4.6461C0.958476 4.55233 1.08565 4.49965 1.21826 4.49965H13.0113L9.86426 1.35366C9.77038 1.25977 9.71763 1.13243 9.71763 0.999655C9.71763 0.866879 9.77038 0.739542 9.86426 0.645655C9.95815 0.551768 10.0855 0.499023 10.2183 0.499023C10.351 0.499023 10.4784 0.551768 10.5723 0.645655L14.5723 4.64565C14.6188 4.6921 14.6558 4.74728 14.681 4.80802C14.7062 4.86877 14.7192 4.93389 14.7192 4.99965C14.7192 5.06542 14.7062 5.13054 14.681 5.19129C14.6558 5.25203 14.6188 5.30721 14.5723 5.35365L10.5723 9.35365C10.4784 9.44754 10.351 9.50029 10.2183 9.50029C10.0855 9.50029 9.95815 9.44754 9.86426 9.35365C9.77038 9.25977 9.71763 9.13243 9.71763 8.99965C9.71763 8.86688 9.77038 8.73954 9.86426 8.64565L13.0113 5.49965H1.21826C1.08565 5.49965 0.958476 5.44698 0.864708 5.35321C0.77094 5.25944 0.718262 5.13226 0.718262 4.99965Z"
                fill="#101010"
              ></path>
            </svg>
          </a>
        </div>
      {/if}
      <div
        class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
      >
        <ul class="carouselTicker__list">
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/jaguar.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/jaguar-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/honda.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/honda-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/chevrolet.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/chevrolet-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/acura.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/acura-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bmw.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bmw-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/toyota.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/toyota-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/lexus.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/lexus-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/mer.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/mer-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
          <li class="carouselTicker__item">
            <a
              href={locale.href("/vehicles")}
              class="item-brand"
              aria-label={locale.t("ui.premium-brand-carousel.view-details")}
            >
              <img
                class="light-mode"
                src="/assets/imgs/page/homepage2/bugatti.png"
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src="/assets/imgs/page/homepage2/bugatti-w.png"
                alt={locale.t("image.illustrative")}
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .box-search-category {
      margin-top: var(--karento-space-6);
    }
    .box-list-brand-car {
      margin-top: 0;
    }
  }

  @media (min-width: 992px) {
    .box-search-category {
      margin-top: 0;
    }
  }
</style>
