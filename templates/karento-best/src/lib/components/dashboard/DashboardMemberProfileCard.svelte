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
      >{locale.t("ui.dashboard-member-profile-card.update-your-profile")}</p
    >
  </div>
  <div class="card-body">
    <div class="box-avatar-profile d-flex align-items-center">
      <div class="image-avatar me-3">
        <img src="/assets/imgs/section-1/img-2.png" alt="Travilla" />
      </div>
      <DemoActionButton
        class="btn btn-primary me-3"
        aria-label={locale.t("ui.dashboard-member-profile-card.change-avatar")}
        type="button"
        >{locale.t(
          "ui.dashboard-member-profile-card.change-avatar",
        )}</DemoActionButton
      >
      <i class="fi fi-rr-trash"></i>
    </div>

    <div class="row mt-3">
      <DashboardFormField field={dashboardFields.memberFullName} />
      <DashboardFormField field={dashboardFields.memberEmail} />
      <DashboardFormField field={dashboardFields.memberContactNumber} />
      <DashboardFormField field={dashboardFields.memberWebsite} />
      <DashboardFormField field={dashboardFields.memberBio} />
      <DashboardFormField field={dashboardFields.memberLanguages} />
      <DashboardFormField field={dashboardFields.memberNationality} />
    </div>
    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-member-profile-card.save-changes")}
        type="button"
        >{locale.t(
          "ui.dashboard-member-profile-card.save-changes",
        )}</DemoActionButton
      >
    </div>
  </div>
</div>
