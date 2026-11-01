<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<section
  class="box-app-2 position-relative background-100 pt-50 desktop-marketing-section"
  id="install-app"
>
  <div class="container position-relative z-1">
    <div class="row align-items-center">
      <div class="col-lg-5 col-md-12">
        <span class="btn btn-primary background-brand-2 mobile-section-label"
          >{locale.t("ui.app-download-promotion-compact.download-apps")}</span
        >
        <h4 class="mt-4 mb-3 neutral-1000 desktop-type-section">
          {locale.t("ui.app-download-promotion-compact.get-15-off-when")} <br />
          {locale.t("ui.app-download-promotion-compact.ordering-on-the-app")}
        </h4>
        <p class="text-md-medium pb-3 neutral-500 desktop-type-body">
          {locale.t(
            "ui.app-download-promotion-compact.manage-all-your-car-rentals-on-the-go",
          )} <br />
          {locale.t("ui.app-download-promotion-compact.with-the-carento-app")}
        </p>
        <div class="download-apps mt-0 mb-40">
          <DemoActionLink
            href="#!"
            aria-label={locale.t(
              "ui.app-download-promotion-compact.view-details",
            )}
          >
            <img
              src="/assets/imgs/template/googleplay.png"
              alt={locale.t("image.illustrative")}
            />
          </DemoActionLink>
          <DemoActionLink
            href="#!"
            aria-label={locale.t(
              "ui.app-download-promotion-compact.view-details",
            )}
          >
            <img
              src="/assets/imgs/template/appstore.png"
              alt={locale.t("image.illustrative")}
            />
          </DemoActionLink>
        </div>
      </div>
      <div class="col-lg-7 col-md-12">
        <div class="box-app-img d-lg-flex align-items-end d-none">
          <img
            src="/assets/imgs/app/app-1/phone.png"
            alt={locale.t("image.illustrative")}
          />
        </div>
      </div>
    </div>
  </div>
</section>
