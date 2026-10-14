<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<section class="box-app position-relative">
  <div class="container position-relative z-1">
    <div class="row align-items-center py-5 desktop-marketing-section">
      <div class="col-lg-5">
        <h4 class="desktop-type-section"
          >{locale.t("ui.app-availability-banner.carento-app-is-available")}</h4
        >
        <p class="text-md-medium pb-3 desktop-type-body"
          >{locale.t("referenceOffers.app.body")}</p
        >
        <div class="download-apps mt-0">
          <DemoActionLink
            class=""
            href="#!"
            aria-label={locale.t("ui.app-availability-banner.view-details")}
            ><img
              src="/assets/imgs/template/googleplay.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
          <DemoActionLink
            class=""
            href="#!"
            aria-label={locale.t("ui.app-availability-banner.view-details")}
            ><img
              src="/assets/imgs/template/appstore.png"
              alt={locale.t("image.illustrative")}
            /></DemoActionLink
          >
        </div>
      </div>
      <div class="col-lg-7">
        <div class="box-app-img"
          ><img
            src="/assets/imgs/app/app-1/truck.png"
            alt={locale.t("image.illustrative")}
          /></div
        >
      </div>
    </div>
  </div>
</section>
