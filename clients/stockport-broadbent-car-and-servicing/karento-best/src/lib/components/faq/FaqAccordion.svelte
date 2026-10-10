<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  import type { FaqCardAppearance, FaqItemContent } from "#lib/data/faq.ts";
  import FaqAccordionItem from "./FaqAccordionItem.svelte";
  let {
    items,
    group,
    id,
    idPrefix = "",
    defaultOpen = null,
    appearance = "bordered",
  }: {
    items: readonly FaqItemContent[];
    group: string;
    id?: string;
    idPrefix?: string;
    defaultOpen?: string | null;
    appearance?: FaqCardAppearance;
  } = $props();
  const preview = usePreview();
  const selected = $derived(preview.panels[group]);
  const activePanel = $derived(selected === undefined ? defaultOpen : selected);
</script>

<div class="accordion" {id}>
  {#each items as item (item.suffix)}
    {@const panelId = idPrefix + item.suffix}
    {@const open = activePanel === "#" + panelId}
    <FaqAccordionItem
      {item}
      id={panelId}
      parent={id ? "#" + id : ".accordion"}
      {open}
      collapsed={!open || (item.kind === "card" && selected === undefined)}
      {appearance}
      onclick={() => (preview.panels[group] = open ? null : "#" + panelId)}
    />
  {/each}
</div>
