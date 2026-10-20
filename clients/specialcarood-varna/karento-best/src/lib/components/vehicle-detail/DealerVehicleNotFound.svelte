<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section class="box-section background-body py-96">
  <div class="container">
    <h1 class="neutral-1000 desktop-type-page"
      >{locale.t("dealer.vehicle.missing")}</h1
    >
    <p class="neutral-500 mt-20 desktop-type-body"
      >{locale.t("dealer.vehicle.missingBody")}</p
    >
    <a
      class="btn btn-brand-2 mt-20 desktop-type-control"
      href={locale.href("/vehicles")}>{locale.t("action.backVehicles")}</a
    >
  </div>
</section>
