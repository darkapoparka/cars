<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import DashboardFormField from "#lib/components/dashboard/DashboardFormField.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { message } from "#lib/i18n/text.ts";
  const desktop = new MediaQuery("(min-width: 992px)");
  const listingPrice = $derived(
    desktop.current
      ? {
          ...dashboardFields.listingPrice,
          placeholder: message("ui.dashboard-listing-pricing-card.price"),
          ariaLabel: message("ui.dashboard-listing-pricing-card.price"),
        }
      : dashboardFields.listingPrice,
  );
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-listing-pricing-card.pricing")}</span
      >
    </div>
  </div>
  <div class="card-body">
    <div class="row">
      <DashboardFormField field={listingPrice} />
    </div>
    <div class="row mb-2">
      <p class="text-md-bold neutral-1000 mb-12"
        >{locale.t("ui.dashboard-listing-pricing-card.extra-services")}</p
      >
    </div>

    <div class="box-extra-services">
      <div class="item-extra-service">
        <div class="item-extra-1">
          <input
            class="form-control"
            type="text"
            placeholder={locale.t(
              "reference.ancillary.DashboardListingPricingCard.service-title-1",
            )}
            aria-label={locale.t(
              "reference.ancillary.DashboardListingPricingCard.service-title-1",
            )}
          />
        </div>
        <div class="item-extra-2">
          <input
            class="form-control"
            type="text"
            placeholder={locale.t("ui.dashboard-listing-pricing-card.price")}
            aria-label={locale.t("ui.dashboard-listing-pricing-card.price")}
          />
        </div>
        <div class="item-extra-3"
          ><DemoActionLink
            class="btn-remove"
            href="#!"
            aria-label={locale.t(
              "ui.dashboard-listing-pricing-card.view-details",
            )}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12.7778 10.1111V15.4444"
                stroke=""
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M9.22217 10.1111V15.4444"
                stroke=""
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M5.66699 6.55556V17.2222C5.66699 18.2041 6.46293 19 7.44477 19H14.5559C15.5377 19 16.3337 18.2041 16.3337 17.2222V6.55556"
                stroke=""
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M3.88916 6.55556H18.1114"
                stroke=""
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M6.55566 6.55556L8.33344 3H13.6668L15.4446 6.55556"
                stroke=""
                stroke-width="1.33333"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg></DemoActionLink
          ></div
        >
      </div>
    </div>
    <div class="text-end pe-5">
      <DemoActionLink
        class="btn btn-addmore"
        href="#!"
        aria-label={locale.t("ui.dashboard-listing-pricing-card.add-more")}
        >{locale.t(
          "ui.dashboard-listing-pricing-card.add-more",
        )}</DemoActionLink
      >
    </div>

    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn btn-primary"
        aria-label={locale.t("ui.dashboard-listing-pricing-card.save-changes")}
        type="button"
        >{locale.t(
          "ui.dashboard-listing-pricing-card.save-changes",
        )}</DemoActionButton
      >
    </div>
  </div>
</div>
