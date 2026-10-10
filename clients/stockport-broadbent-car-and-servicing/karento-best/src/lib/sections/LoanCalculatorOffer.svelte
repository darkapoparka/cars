<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import LoanCard from "#lib/components/finance/LoanCard.svelte";
</script>

<section class="box-cta-2 background-body overflow-hidden">
  <div class="bg-shape top-50 start-50 translate-middle"></div>
  <div class="container position-relative z-1">
    <div class="row">
      <div class="col-lg-5 pe-lg-5">
        <h3 class="text-white desktop-type-section"
          >{locale.t(
            "ui.loan-calculator-offer.want-to-calculate-your-car-payment",
          )}</h3
        >
        <p class="text-lg-medium text-white desktop-type-lead"
          >{locale.t("referenceOffers.loan.body")}</p
        >
      </div>
      <div class="col-lg-6 offset-lg-1">
        <LoanCard fieldIdPrefix="field-88468ec8" />
      </div>
    </div>
    <div class="row align-items-center">
      <div class="border-top py-3 mt-3"></div>
      <div class="col-lg-7 mb-20">
        <div class="row">
          <div
            class="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start"
          >
            <div class="d-flex justify-content-center justify-content-md-start">
              <h3 class="count text-white desktop-type-stat"
                ><span class="karento-static-count" data-count="45">45</span
                ></h3
              >
              <h3 class="text-white desktop-type-stat">+</h3>
            </div>
            <div class="position-relative">
              <p class="text-lg-bold text-white"
                >{locale.t("referenceHome.stats.global")}</p
              >
              <p class="text-lg-bold text-white"
                >{locale.t("referenceHome.stats.branches")}</p
              >
            </div>
          </div>
          <div
            class="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start"
          >
            <div class="d-flex justify-content-center justify-content-md-start">
              <h3 class="count text-white desktop-type-stat"
                ><span class="karento-static-count" data-count="29">29</span
                ></h3
              >
              <h3 class="text-white desktop-type-stat"
                >{locale.t("referenceHome.stats.thousand")}</h3
              >
            </div>
            <div class="position-relative">
              <p class="text-lg-bold text-white"
                >{locale.t("referenceHome.stats.destinations")}</p
              >
              <p class="text-lg-bold text-white"
                >{locale.t("ui.loan-calculator-offer.collaboration")}</p
              >
            </div>
          </div>
          <div
            class="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start"
          >
            <div class="d-flex justify-content-center justify-content-md-start">
              <h3 class="count text-white desktop-type-stat"
                ><span class="karento-static-count" data-count="20">20</span
                ></h3
              >
              <h3 class="text-white desktop-type-stat">+</h3>
            </div>
            <div class="position-relative">
              <p class="text-lg-bold text-white"
                >{locale.t("ui.loan-calculator-offer.years")}</p
              >
              <p class="text-lg-bold text-white"
                >{locale.t("referenceHome.stats.experience")}</p
              >
            </div>
          </div>
          <div
            class="col-md-3 col-6 mb-md-0 mb-4 d-flex flex-column align-items-center align-items-md-start"
          >
            <div class="d-flex justify-content-center justify-content-md-start">
              <h3 class="count text-white desktop-type-stat"
                ><span class="karento-static-count" data-count="168">168</span
                ></h3
              >
              <h3 class="text-white desktop-type-stat"
                >{locale.t("referenceHome.stats.thousand")}</h3
              >
            </div>
            <div class="position-relative">
              <p class="text-lg-bold text-white"
                >{locale.t("referenceHome.stats.happy")}</p
              >
              <p class="text-lg-bold text-white"
                >{locale.t("ui.loan-calculator-offer.customers")}</p
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 offset-lg-1">
        <div class="box-authors-partner background-body p-4">
          <div class="authors-partner-left">
            <img
              src="/assets/imgs/page/homepage5/author.png"
              alt={locale.t("image.illustrative")}
            /><img
              src="/assets/imgs/page/homepage5/author2.png"
              alt={locale.t("image.illustrative")}
            /><img
              src="/assets/imgs/page/homepage5/author3.png"
              alt={locale.t("image.illustrative")}
            />
            <span class="item-author">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="0.5" y="7.448" width="17" height="2.31818" fill="black"
                ></rect>
                <rect
                  x="7.84082"
                  y="17.1072"
                  width="17"
                  height="2.31818"
                  transform="rotate(-90 7.84082 17.1072)"
                  fill="black"
                ></rect>
              </svg>
            </span>
          </div>
          <div class="authors-partner-right">
            <p class="text-sm neutral-1000"
              >{locale.t("referenceOffers.loan.used", {
                count: locale.number(1684),
              })}
              <strong
                >{locale.t("ui.loan-calculator-offer.carento")}
              </strong>{locale.t("referenceOffers.loan.last")}
              <strong>{locale.t("referenceOffers.loan.hours")}</strong></p
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
