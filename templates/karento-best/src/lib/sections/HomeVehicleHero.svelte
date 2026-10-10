<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section class="box-section block-banner-home1 position-relative">
  <div class="container position-relative z-1">
    <p class="text-primary text-md-bold desktop-type-eyebrow"
      >{locale.t("ui.home-vehicle-hero.find-your-perfect-car")}</p
    >
    <h1 class="color-white mb-35 desktop-type-hero"
      >{locale.t("ui.home-vehicle-hero.looking-for-a-vehicle")}
      <br class="d-none d-lg-block" />{locale.t(
        "ui.home-vehicle-hero.you-re-in-the-perfect-spot",
      )}</h1
    >
    <ul class="list-ticks-green">
      <li class=""
        >{locale.t("ui.home-vehicle-hero.high-quality-at-a-low-cost")}</li
      >
      <li class="">{locale.t("referenceOffers.hero.premium")}</li>
      <li class="">{locale.t("referenceOffers.hero.roadside")}</li>
    </ul>
  </div>
  <div class="bg-shape z-0"></div>
</section>

<style>
  @media (max-width: 767.98px) {
    section.block-banner-home1 {
      min-height: 0;
      padding-block: var(--karento-space-8);
    }
    h1 {
      font-size: var(--karento-type-page-size);
      font-weight: var(--karento-type-page-weight);
      line-height: var(--karento-type-page-leading);
    }
    p.text-primary {
      color: var(--bs-neutral-0) !important;
      font-size: var(--karento-type-eyebrow-size);
      font-weight: var(--karento-type-eyebrow-weight) !important;
      line-height: var(--karento-type-eyebrow-leading);
    }
    ul {
      display: grid;
      gap: var(--karento-space-2);
      margin: 0;
    }
    li {
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
</style>
