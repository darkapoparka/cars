<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import FaqColumns from "#lib/components/faq/FaqColumns.svelte";
  import {
    desktopGeneralFaqItems,
    referenceCardFaqItems,
  } from "#lib/data/faq.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
  const idBase = $props.id();
</script>

<section
  class="section-faqs-2 pt-80 pb-80 border-bottom background-body desktop-collection-section"
>
  <div class="container">
    <div class="text-start mb-40 desktop-section-heading">
      <h2 class="my-3 neutral-1000 desktop-type-faq-group"
        >{locale.t("ui.general-faq.general")}</h2
      >
    </div>
    <FaqColumns
      items={desktop.current ? desktopGeneralFaqItems : referenceCardFaqItems}
      {idBase}
      splitAt={desktop.current ? 4 : 7}
      defaultOpen={"#" +
        idBase +
        "-" +
        (desktop.current ? desktopGeneralFaqItems[0].suffix : "collapse01")}
      appearance="rounded"
    />
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-section-heading h2 {
      margin-block: 0 !important;
    }
  }
</style>
