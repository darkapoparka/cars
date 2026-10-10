<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<section class="box-app-2 position-relative pb-80 desktop-marketing-section">
  <div class="container bg-4 rounded-12 overflow-hidden">
    <div class="row align-items-center">
      <div class="col-lg-6 p-5">
        <span class="btn btn-primary background-brand-2 mobile-section-label"
          >{locale.t("ui.app-download-promotion.download-apps")}</span
        >
        <h4 class="mt-4 mb-3 neutral-1000 desktop-section-title">
          {locale.t("ui.app-download-promotion.get-15-off-when")} <br />
          {locale.t("ui.app-download-promotion.ordering-on-the-app")}
        </h4>
        <p class="text-md-medium pb-3 neutral-500 desktop-type-body">
          {locale.t(
            "ui.app-download-promotion.manage-all-your-car-rentals-on-the-go",
          )} <br />
          {locale.t("ui.app-download-promotion.with-the-carento-app")}
        </p>
        <div class="download-apps mt-0">
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.app-download-promotion.view-details")}
          >
            <img
              src="/assets/imgs/template/googleplay.png"
              alt={locale.t("image.illustrative")}
            />
          </DemoActionLink>
          <DemoActionLink
            href="#!"
            aria-label={locale.t("ui.app-download-promotion.view-details")}
          >
            <img
              src="/assets/imgs/template/appstore.png"
              alt={locale.t("image.illustrative")}
            />
          </DemoActionLink>
        </div>
      </div>
      <div class="col-lg-6 px-0 align-self-stretch">
        <img
          class="w-100 h-100 img-fluid d-none d-lg-block"
          src="/assets/imgs/app/app-1/background-1.png"
          alt={locale.t("image.illustrative")}
        />
      </div>
    </div>
  </div>
</section>
