<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section class="section-box background-body desktop-marketing-section">
  <div class="container">
    <div class="row">
      <div class="col-lg-6">
        <div
          class="box-banner-1 background-6 px-5 pt-40 position-relative rounded-12 overflow-hidden"
        >
          <div class="banner-images">
            <img
              class="position-absolute bottom-0 end-0"
              src="/assets/imgs/banners/banners-1/img-1.png"
              alt={locale.t("image.illustrative")}
            />
          </div>
          <div class="banner-info">
            <div class="banner-title">
              <h5 class="desktop-type-panel"
                >{locale.t("ui.rental-offer-cards.loking-for-a-rental-car")}</h5
              >
            </div>
            <p class="banner-text text-md-regular py-3 desktop-type-body">
              {locale.t("referenceHome.promotions.rentalFirst")} <br />
              {locale.t("referenceHome.promotions.rentalSecond")}
            </p>
            <div class="banner-button pb-70 pt-3">
              <a
                class="btn btn-primary background-brand-2 desktop-type-control"
                href={locale.href("/vehicles")}
                aria-label={locale.t("ui.rental-offer-cards.get-started-now")}
              >
                {locale.t("ui.rental-offer-cards.get-started-now")}
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
      </div>
      <div class="col-lg-6">
        <div
          class="box-banner-1 background-5 px-5 pt-40 position-relative rounded-12 mt-lg-0 mt-4 overflow-hidden"
        >
          <div class="banner-images">
            <img
              class="position-absolute bottom-0 end-0"
              src="/assets/imgs/banners/banners-1/img-2.png"
              alt={locale.t("image.illustrative")}
            />
          </div>
          <div class="banner-info">
            <div class="banner-title">
              <h5 class="desktop-type-panel"
                >{locale.t("ui.rental-offer-cards.loking-for-a-rental-car")}</h5
              >
            </div>
            <p class="banner-text text-md-regular py-3 desktop-type-body">
              {locale.t("referenceHome.promotions.sellFirst")} <br />
              {locale.t("referenceHome.promotions.sellSecond")}
            </p>
            <div class="banner-button pb-70 pt-3">
              <a
                class="btn btn-primary bg-white desktop-type-control"
                href={locale.href("/vehicles")}
                aria-label={locale.t("ui.rental-offer-cards.get-started-now")}
              >
                {locale.t("ui.rental-offer-cards.get-started-now")}
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
      </div>
    </div>
  </div>
</section>
