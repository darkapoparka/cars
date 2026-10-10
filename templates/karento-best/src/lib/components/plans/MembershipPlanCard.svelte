<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import ResponsiveDisclosure from "#lib/components/ResponsiveDisclosure.svelte";
  import { MediaQuery } from "svelte/reactivity";

  import type { MembershipPlan } from "#lib/data/plans.ts";
  let { item, annualPrice }: { item: MembershipPlan; annualPrice: boolean } =
    $props();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<div class="col-lg-3 col-sm-6 mb-lg-0 mb-4 membership-plan-column">
  <div
    class="h-100 p-4 border rounded-12 membership-plan desktop-panel desktop-panel--compact"
  >
    <h6 class="text-lg-bold neutral-1000 desktop-type-panel"
      >{locale.text(item.name)}</h6
    >
    <div class="d-flex">
      <span class="heading-3 neutral-1000 desktop-type-plan-price">$</span>
      <h3 class={[item.priceClass, "desktop-type-plan-price"]}
        >{annualPrice ? item.annual : item.monthly}</h3
      >
      <span class={[item.intervalClass, "desktop-type-meta"]}
        >{locale.t(
          annualPrice
            ? "reference.ancillary.plans.perYear"
            : "reference.ancillary.plans.perMonth",
        )}</span
      >
    </div>
    <p class="text-sm-medium neutral-1000 desktop-type-body-small"
      >{desktop.current
        ? locale.text(item.desktopDescription)
        : locale.t(
            "ui.membership-plan-card.for-most-businesses-that-want-to-optimize-web-queries",
          )}</p
    >
    <ResponsiveDisclosure
      title={locale.t("ui.membership-plan-card.what-s-included")}
    >
      <ul class="list-unstyled mb-0 py-4 border-top mt-4 plan-features">
        {#each item.features as feature (feature.id)}<li
            class={["d-flex align-items-center", { "mb-3": !feature.last }]}
          >
            <svg
              class="karento-plan-check"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              aria-hidden="true"
              focusable="false"
              ><circle cx="13" cy="13" r="13" fill="currentColor" /><path
                d="m8 13 3.25 3.25L18 9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >
            <p
              class={[
                "text-sm-medium neutral-1000 m-0 ms-2 desktop-type-body-small",
                { "text-400": feature.muted },
              ]}>{locale.text(feature.text)}</p
            >
          </li>
        {/each}
      </ul>
    </ResponsiveDisclosure>
    <DemoActionButton
      class="btn btn-primary2 w-100 d-flex justify-content-between desktop-type-control desktop-panel-action desktop-panel-action--spread desktop-action-primary"
      aria-label={locale.t("ui.membership-plan-card.get-started-now")}
      type="button"
    >
      {locale.t("ui.membership-plan-card.get-started-now")}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          class="fill-dark"
          d="M17.4177 5.41797L16.3487 6.48705L21.1059 11.2443H0V12.7562H21.1059L16.3487 17.5134L17.4177 18.5825L24 12.0002L17.4177 5.41797Z"
          fill={item.actionFill}
        ></path>
      </svg>
    </DemoActionButton>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .membership-plan-column {
      margin-bottom: var(--karento-space-3) !important;
    }
    .membership-plan {
      padding: var(--karento-space-4) !important;
    }
    .plan-features {
      margin-top: 0 !important;
      padding-block: var(--karento-space-3) !important;
    }
  }

  @media (min-width: 992px) {
    .membership-plan > h6 {
      margin: 0;
    }
    .membership-plan > p {
      margin: 0;
    }
    .membership-plan .plan-features {
      margin-top: 0 !important;
      padding-block: var(--karento-desktop-space-4) !important;
    }
    .plan-features li {
      gap: var(--karento-desktop-space-2);
    }
    .plan-features li.mb-3 {
      margin-bottom: var(--karento-desktop-space-4) !important;
    }
  }
</style>
