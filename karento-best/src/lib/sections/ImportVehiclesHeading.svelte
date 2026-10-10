<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section class="section-box pt-50 background-body">
  <div class="container">
    <div class="row align-items-end">
      <div class="col-md-9 mb-30">
        <h4 class="title-svg neutral-1000 mb-15 desktop-type-collection"
          >{locale.t(
            "ui.import-vehicles-heading.vehicles-from-this-source",
          )}</h4
        >
        <p class="text-lg-medium text-bold neutral-500 desktop-type-lead"
          >{locale.t("reference.import.rentalHeading")}</p
        >
      </div>
    </div>
  </div>
</section>
