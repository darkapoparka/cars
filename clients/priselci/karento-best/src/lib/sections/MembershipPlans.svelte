<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import MembershipPlanCard from "#lib/components/plans/MembershipPlanCard.svelte";
  import { membershipPlans } from "#lib/data/plans.ts";

  let annualPrice = $state(false);
</script>

<section
  class="section-pricing-1 pt-80 pb-100 background-body border-bottom desktop-hero-content"
>
  <div class="container">
    <div
      class="row pb-40 z-1 justify-content-center membership-heading desktop-content-toolbar"
    >
      <div class="col-lg-auto align-self-end">
        <h3 class="text-center neutral-1000 desktop-type-section"
          >{locale.t("ui.membership-plans.membership-plans")}</h3
        >
        <div
          class="d-flex justify-content-center align-items-center mt-3 desktop-hero-content"
        >
          <fieldset class="karento-billing-control" data-billing-control>
            <legend class="visually-hidden"
              >{locale.t("ui.membership-plans.billing-period")}</legend
            >
            <label class="karento-billing-option"
              ><input
                class="visually-hidden"
                type="radio"
                name="billing-period"
                value={locale.t("ui.membership-plans.monthly")}
                checked={!annualPrice}
                onchange={() => (annualPrice = false)}
              /><span>{locale.t("ui.membership-plans.monthly-9b11f6")}</span
              ></label
            >
            <label class="karento-billing-option"
              ><input
                class="visually-hidden"
                type="radio"
                name="billing-period"
                value={locale.t("ui.membership-plans.annual")}
                checked={annualPrice}
                onchange={() => (annualPrice = true)}
              /><span>{locale.t("ui.membership-plans.annual-2c5e81")}</span
              ></label
            >
          </fieldset>
        </div>
      </div>
    </div>
    <div class="row">
      {#each membershipPlans as item (item.id)}<MembershipPlanCard
          {item}
          {annualPrice}
        />
      {/each}
    </div>
  </div>
  <div class="rotate-center ellipse-rotate-success position-absolute z-0"></div>
  <div class="rotate-center-rev ellipse-rotate-primary position-absolute z-0"
  ></div>
</section>

<style>
  @media (max-width: 767.98px) {
    .membership-heading {
      padding-bottom: var(--karento-space-4) !important;
    }
    .karento-billing-control {
      width: max-content;
      padding: var(--karento-space-1);
    }
    .karento-billing-option {
      position: relative;
      display: flex;
      align-items: center;
      min-height: var(--karento-control-selector);
    }
    .karento-billing-option::before {
      content: "";
      position: absolute;
      inset-inline: 0;
      top: 50%;
      height: var(--karento-touch-target);
      transform: translateY(-50%);
    }
    .karento-billing-option span {
      min-height: var(--karento-control-selector);
      padding: var(--karento-space-1) var(--karento-control-inset);
      font-size: var(--karento-type-pill-size);
      font-weight: var(--karento-type-pill-weight);
      line-height: var(--karento-type-pill-leading);
    }
  }
</style>
