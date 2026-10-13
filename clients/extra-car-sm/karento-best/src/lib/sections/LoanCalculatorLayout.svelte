<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import { referenceLoanCard } from "#lib/data/finance.ts";
  import { message } from "#lib/i18n/text.ts";
  import LoanCard from "#lib/components/finance/LoanCard.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section
  class="section-cta-12 background-100 py-96 desktop-hero-content karento-calculator-layout"
>
  <div class="box-cta-6">
    <div class="container">
      <div class="row align-items-center flex-column-reverse flex-lg-row">
        <div
          class={desktop.current
            ? "col-lg-5 calculator-page-artwork"
            : "col-lg-6"}
        >
          <div
            class={desktop.current
              ? "calculator-page-image position-relative"
              : "card-image d-inline-block position-relative mb-100"}
          >
            <img
              class="rounded-12"
              src="/assets/imgs/cta/cta-11/img-3.png"
              alt={locale.t("image.illustrative")}
            />
            <img
              class={desktop.current
                ? "calculator-page-car"
                : "position-absolute top-100 start-100 translate-middle d-none d-md-block"}
              src="/assets/imgs/cta/cta-11/img-car.png"
              alt={desktop.current ? "" : locale.t("image.illustrative")}
            />
          </div>
        </div>
        <div
          class={desktop.current
            ? "col-lg-7 calculator-page-form"
            : "col-lg-6 ps-lg-5"}
        >
          <LoanCard
            fieldIdPrefix="field-633889a9"
            headingId="car-loan-calculator"
            headingClass="neutral-1000 mb-2 karento-hero-target"
            class={desktop.current
              ? "background-card rounded-3 calculator-page-card"
              : undefined}
            content={desktop.current
              ? {
                  ...referenceLoanCard,
                  title: message("referenceFinance.formTitle"),
                }
              : referenceLoanCard}
          />
        </div>
      </div>
    </div>
    <div
      class="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill"
    ></div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    :global(.main) .karento-calculator-layout.section-cta-12 {
      background-color: var(--bs-background-body) !important;
      padding-bottom: var(--karento-desktop-section-padding) !important;
    }
    .karento-calculator-layout .box-cta-6 > .bg-overlay {
      display: none;
    }
    .karento-calculator-layout .row {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
    .karento-calculator-layout :global(.calculator-page-card) {
      padding: var(--karento-desktop-panel-padding);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-card-radius) !important;
    }
    .calculator-page-form {
      order: 1;
    }
    .calculator-page-artwork {
      display: flex;
      align-self: stretch;
      order: 2;
      padding-left: var(--karento-desktop-space-8);
    }
    .calculator-page-image {
      width: 100%;
      container-type: size;
    }
    .calculator-page-image > img:first-child {
      position: absolute;
      inset: 0;
      /* Use the source portrait's 344-by-424 proportions inside the form-height wrapper. */
      width: min(100cqw, calc(100cqh * 344 / 424));
      height: auto;
      margin: auto;
      object-fit: contain;
      border-radius: var(--karento-desktop-card-radius) !important;
    }
    .calculator-page-car {
      position: absolute;
      width: 55%;
      right: var(--karento-desktop-space-4);
      bottom: calc(-1 * var(--karento-desktop-space-4));
    }
  }
</style>
