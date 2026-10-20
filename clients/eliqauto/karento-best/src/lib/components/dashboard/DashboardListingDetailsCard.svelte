<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardListingFeatures } from "#lib/data/dashboard.ts";
  import DashboardImagePreview from "./DashboardImagePreview.svelte";
  import { dashboardListingImages } from "#lib/data/dashboard.ts";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import DashboardFormField from "#lib/components/dashboard/DashboardFormField.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-listing-details-card.car-details")}</span
      >
    </div>
  </div>
  <div class="card-body">
    <div class="row">
      <div class="col-lg-12 mb-3">
        <div class="list-image-upload">
          <div class="box-upload-image">
            <div class="item-upload-image">
              <input
                type="file"
                name="file"
                aria-label={locale.t("reference.controls.uploadFile")}
              />
              <div class="upload-info">
                <div class="icon-upload">
                  <svg
                    width="22"
                    height="23"
                    viewBox="0 0 22 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M8 10.25C6.48 10.25 5.25 9.02 5.25 7.5C5.25 5.98 6.48 4.75 8 4.75C9.52 4.75 10.75 5.98 10.75 7.5C10.75 9.02 9.52 10.25 8 10.25ZM8 6.25C7.31 6.25 6.75 6.81 6.75 7.5C6.75 8.19 7.31 8.75 8 8.75C8.69 8.75 9.25 8.19 9.25 7.5C9.25 6.81 8.69 6.25 8 6.25Z"
                      fill=""
                    ></path>
                    <path
                      d="M14 22.25H8C2.57 22.25 0.25 19.93 0.25 14.5V8.5C0.25 3.07 2.57 0.75 8 0.75H12C12.41 0.75 12.75 1.09 12.75 1.5C12.75 1.91 12.41 2.25 12 2.25H8C3.39 2.25 1.75 3.89 1.75 8.5V14.5C1.75 19.11 3.39 20.75 8 20.75H14C18.61 20.75 20.25 19.11 20.25 14.5V9.5C20.25 9.09 20.59 8.75 21 8.75C21.41 8.75 21.75 9.09 21.75 9.5V14.5C21.75 19.93 19.43 22.25 14 22.25Z"
                      fill=""
                    ></path>
                    <path
                      d="M17 8.24994C16.59 8.24994 16.25 7.90994 16.25 7.49994V1.49994C16.25 1.19994 16.43 0.919939 16.71 0.809939C16.99 0.699939 17.31 0.759939 17.53 0.969939L19.53 2.96994C19.82 3.25994 19.82 3.73994 19.53 4.02994C19.24 4.31994 18.76 4.31994 18.47 4.02994L17.75 3.30994V7.49994C17.75 7.90994 17.41 8.24994 17 8.24994Z"
                      fill=""
                    ></path>
                    <path
                      d="M14.9999 4.24994C14.8099 4.24994 14.6199 4.17994 14.4699 4.02994C14.1799 3.73994 14.1799 3.25994 14.4699 2.96994L16.4699 0.969941C16.7599 0.679941 17.2399 0.679941 17.5299 0.969941C17.8199 1.25994 17.8199 1.73994 17.5299 2.02994L15.5299 4.02994C15.3799 4.17994 15.1899 4.24994 14.9999 4.24994Z"
                      fill=""
                    ></path>
                    <path
                      d="M1.6698 19.2001C1.4298 19.2001 1.1898 19.0801 1.0498 18.8701C0.819805 18.5301 0.909805 18.0601 1.2498 17.8301L6.1798 14.5201C7.2598 13.8001 8.7498 13.8801 9.7298 14.7101L10.0598 15.0001C10.5598 15.4301 11.4098 15.4301 11.8998 15.0001L16.0598 11.4301C17.1198 10.5201 18.7898 10.5201 19.8598 11.4301L21.4898 12.8301C21.7998 13.1001 21.8398 13.5701 21.5698 13.8901C21.2998 14.2001 20.8198 14.2401 20.5098 13.9701L18.8798 12.5701C18.3798 12.1401 17.5398 12.1401 17.0398 12.5701L12.8798 16.1401C11.8198 17.0501 10.1498 17.0501 9.0798 16.1401L8.7498 15.8501C8.2898 15.4601 7.52981 15.4201 7.01981 15.7701L2.0998 19.0801C1.9598 19.1601 1.8098 19.2001 1.6698 19.2001Z"
                      fill=""
                    ></path>
                  </svg>
                </div>
                <div class="text-upload">
                  <p class="text-sm-medium neutral-500 desktop-type-body-small"
                    >{locale.t(
                      "ui.dashboard-listing-details-card.upload-image",
                    )}</p
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="preview-images">
            <div class="list-preview">
              {#each dashboardListingImages as image (image.id)}<DashboardImagePreview
                  {image}
                />{/each}
            </div>
          </div>
        </div>
      </div>
      <DashboardFormField field={dashboardFields.listingTitle} />
      <DashboardFormField field={dashboardFields.listingModel} />
      <DashboardFormField field={dashboardFields.listingType} />
      <DashboardFormField field={dashboardFields.listingCondition} />
      <DashboardFormField field={dashboardFields.listingStockNumber} />
      <DashboardFormField field={dashboardFields.listingMileage} />
      <DashboardFormField field={dashboardFields.listingTransmission} />
      <DashboardFormField field={dashboardFields.listingDescription} />
    </div>
    <div class="row">
      <div class="col-lg-12 mb-3">
        <h6 class="desktop-type-compact-card"
          >{locale.t("ui.dashboard-listing-details-card.features")}</h6
        >
      </div>
      {#each dashboardListingFeatures as feature (feature)}{@const featureLabel =
          desktop.current &&
          feature.message === "reference.dynamic.dashboard-listing-features.8"
            ? locale.t("reference.listing.filter.heatedSeats")
            : locale.text(feature)}<div class="col-lg-6"
          ><label class="lbl-checkbox text-md-medium neutral-500"
            ><input
              type="checkbox"
              aria-label={phone.current || desktop.current
                ? featureLabel
                : locale.t("ui.dashboard-listing-details-card.preview-field")}
            />{featureLabel}</label
          ></div
        >{/each}
    </div>
    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-listing-details-card.save-changes")}
        type="button"
        >{locale.t(
          "ui.dashboard-listing-details-card.save-changes",
        )}</DemoActionButton
      >
    </div>
  </div>
</div>
