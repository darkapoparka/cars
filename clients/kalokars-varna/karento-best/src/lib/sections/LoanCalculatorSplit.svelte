<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import LoanCard from "#lib/components/finance/LoanCard.svelte";
</script>

<section class="box-cta-5 background-body">
  <div class="bg-shape"></div>
  <div class="container position-relative z-1 pt-100 pb-100">
    <div class="row">
      <div class="col-lg-6 order-last order-lg-first">
        <LoanCard fieldIdPrefix="field-c4f130a1" />
      </div>
      <div class="col-lg-6 order-first order-lg-last pt-lg-60">
        <div class="ps-lg-5">
          <h3 class="text-white mb-3 desktop-type-section">
            {locale.t("ui.loan-calculator-split.want-to-calculate")}
            <br class="d-none d-md-block" />
            {locale.t("ui.loan-calculator-split.your-car-payment")}
          </h3>
          <p class="text-lg-medium text-white desktop-type-lead">
            {locale.t("referenceOffers.loan.first")}
            <br class="d-none d-md-block" />
            {locale.t("referenceOffers.loan.second")}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
