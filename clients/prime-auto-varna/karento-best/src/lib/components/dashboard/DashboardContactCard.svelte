<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardField } from "#lib/data/dashboard.ts";
  import DashboardFormField from "./DashboardFormField.svelte";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  let { fields }: { fields: readonly DashboardField[] } = $props();
</script>

<div class="card shadow-none flex-fill mb-3">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t(
        "reference.ancillary.DashboardContactCard.contact-information",
      )}</p
    >
  </div>
  <div class="card-body">
    <div class="row">
      {#each fields as field (field.id ?? field.placeholder)}<DashboardFormField
          {field}
        />{/each}
      <div class="col-lg-12">
        <div class="form-group">
          <span class="d-inline-block text-sm-medium neutral-500 mb-10"
            >{locale.t("ui.dashboard-contact-card.google-map")}</span
          >
          <div class="map-tour">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120835.65146929219!2d2.5873635107259836!3d47.992147406516835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5878d50e09eab%3A0x40b82c3688c4a20!2s77460%20Souppes-sur-Loing%2C%20Ph%C3%A1p!5e0!3m2!1svi!2s!4v1715095452879!5m2!1svi!2s"
              width="100%"
              height="363"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title={locale.t("ui.dashboard-contact-card.location-map")}
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-contact-card.save-changes")}
        type="button"
        >{locale.t("ui.dashboard-contact-card.save-changes")}</DemoActionButton
      >
    </div>
  </div>
</div>
