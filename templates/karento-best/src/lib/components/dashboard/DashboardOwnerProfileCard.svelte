<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import { dashboardFields } from "#lib/data/dashboard.ts";
  import DashboardFormField from "#lib/components/dashboard/DashboardFormField.svelte";
</script>

<div class="card shadow-none flex-fill mb-3">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t("ui.dashboard-owner-profile-card.update-your-profile")}</p
    >
  </div>
  <div class="card-body">
    <div class="row pt-4">
      <div class="col-lg-6 mb-3 mb-lg-0">
        <div class="box-avatar-profile d-flex align-items-center">
          <div class="image-avatar me-3">
            <img src="/assets/imgs/page/homepage2/honda.png" alt="Travilla" />
          </div>
          <DemoActionButton
            class="btn btn-primary me-3"
            aria-label={locale.t(
              "ui.dashboard-owner-profile-card.change-avatar",
            )}
            type="button"
            >{locale.t(
              "ui.dashboard-owner-profile-card.change-avatar",
            )}</DemoActionButton
          >
          <i class="fi fi-rr-trash"></i>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="box-avatar-profile d-flex align-items-center">
          <div class="image-avatar-2 w-50 me-3 rounded-2 overflow-hidden">
            <img src="/assets/imgs/page-header/banner8.png" alt="Travilla" />
          </div>
          <DemoActionButton
            class="btn btn-primary me-3"
            aria-label={locale.t("ui.dashboard-owner-profile-card.update")}
            type="button"
            >{locale.t(
              "ui.dashboard-owner-profile-card.update",
            )}</DemoActionButton
          >
          <i class="fi fi-rr-trash"></i>
        </div>
        <p class="text-sm-medium neutral-500 mt-2 desktop-type-body-small"
          >{locale.t(
            "ui.dashboard-owner-profile-card.recommended-dimensions-are-typically-400-x-400-pixels",
          )}</p
        >
      </div>
    </div>
    <div class="py-5">
      <div class="hr"></div>
    </div>

    <div class="row">
      <DashboardFormField field={dashboardFields.ownerFullName} />
      <DashboardFormField field={dashboardFields.ownerEmail} />
      <DashboardFormField field={dashboardFields.ownerContactNumber} />
      <DashboardFormField field={dashboardFields.ownerWebsite} />
      <DashboardFormField field={dashboardFields.ownerBio} />
      <DashboardFormField field={dashboardFields.ownerLanguages} />
      <DashboardFormField field={dashboardFields.ownerNationality} />
    </div>
    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-owner-profile-card.save-changes")}
        type="button"
        >{locale.t(
          "ui.dashboard-owner-profile-card.save-changes",
        )}</DemoActionButton
      >
    </div>
  </div>
</div>
