<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { CardFaqContent, FaqCardAppearance } from "#lib/data/faq.ts";
  import FaqAccordion from "./FaqAccordion.svelte";
  let {
    items,
    idBase,
    splitAt = 7,
    defaultOpen = null,
    appearance = "bordered",
  }: {
    items: readonly CardFaqContent[];
    idBase: string;
    splitAt?: number;
    defaultOpen?: string | null;
    appearance?: FaqCardAppearance;
  } = $props();
  const firstColumn = $derived(items.slice(0, splitAt));
  const secondColumn = $derived(items.slice(splitAt));
  const group = $derived(idBase + "-accordion");
  const idPrefix = $derived(idBase + "-");
</script>

<div class="row">
  <div class="col-lg-6">
    <FaqAccordion
      items={firstColumn}
      {group}
      {idPrefix}
      {defaultOpen}
      {appearance}
    />
  </div>
  <div class="col-lg-6 mt-lg-0 mt-2">
    <FaqAccordion
      items={secondColumn}
      {group}
      {idPrefix}
      {defaultOpen}
      {appearance}
    />
  </div>
</div>
