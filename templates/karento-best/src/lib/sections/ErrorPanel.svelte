<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { status = 404 }: { status?: number } = $props();
  const title = $derived(
    locale.t(
      status === 404
        ? "reference.controls.error404Title"
        : "reference.controls.errorTitle",
    ),
  );
</script>

<div class="container pt-140 pb-170">
  <div class="row">
    <div class="col-md-5 mx-auto">
      <div class="d-flex justify-content-center align-items-center flex-column">
        <h1>{status}</h1>
        <h5>{title}</h5>
        <p class="text-md-medium neutral-500 text-center desktop-type-body"
          >{status === 404
            ? locale.t("reference.controls.error404Body")
            : locale.t("reference.controls.errorBody")} <br />
          {locale.t("reference.controls.errorMenu")}</p
        >
        <a
          href={locale.href("/")}
          class="btn btn-primary mt-30 desktop-type-control"
          aria-label={locale.t("ui.error-panel.back-to-home")}
          ><img src="/assets/imgs/template/icons/arrow-left.svg" alt="" />
          {locale.t("ui.error-panel.back-to-home")}</a
        >
        <img
          src="/assets/imgs/template/404.png"
          alt={locale.t("image.illustrative")}
        />
      </div>
    </div>
  </div>
</div>
