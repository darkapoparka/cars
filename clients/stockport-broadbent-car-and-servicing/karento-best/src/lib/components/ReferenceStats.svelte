<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { referenceStats } from "#lib/data/promotions.ts";
  import ResponsiveDisclosure from "./ResponsiveDisclosure.svelte";
  import { dealer } from "#lib/content.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<ResponsiveDisclosure title={locale.t("ui.reference-stats.sample-statistics")}>
  {#if desktop.current && dealer.contentStatus === "reference-demo"}
    <p class="reference-stats-notice text-center neutral-500 desktop-type-meta"
      >{locale.t("ui.reference-stats.sample-statistics")}</p
    >
  {/if}
  <div
    class="reference-stats d-flex align-items-center justify-content-around flex-wrap"
  >
    {#each referenceStats as item (item.id)}
      <div class="reference-stat mb-4 mb-lg-0 d-block px-lg-5 px-3">
        <div class="d-flex justify-content-center justify-content-md-start">
          <h3 class="count neutral-1000 desktop-type-stat"
            ><span class="karento-static-count" data-count={item.value}
              >{item.value}</span
            ></h3
          >
          <h3 class="neutral-1000 desktop-type-stat"
            >{locale.text(item.suffix)}</h3
          >
        </div>
        <div class="text-md-start text-center">
          <p class="text-lg-bold neutral-1000 desktop-type-body-small"
            >{locale.text(item.label[0])}</p
          >
          <p class="text-lg-bold neutral-1000 desktop-type-body-small"
            >{locale.text(item.label[1])}</p
          >
        </div>
      </div>
    {/each}
  </div>
</ResponsiveDisclosure>

<style>
  @media (min-width: 992px) {
    .reference-stats-notice {
      margin-bottom: var(--karento-desktop-card-gap);
    }
  }
  @media (max-width: 767.98px) {
    .reference-stats {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--karento-space-4);
      align-items: start !important;
    }

    .reference-stat {
      padding: 0 !important;
      margin: 0 !important;
    }

    .reference-stat p.text-lg-bold {
      font-size: var(--karento-type-label-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-label-leading);
    }

    .reference-stat h3.neutral-1000 {
      font-size: var(--karento-type-page-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-page-leading);
    }
  }
</style>
