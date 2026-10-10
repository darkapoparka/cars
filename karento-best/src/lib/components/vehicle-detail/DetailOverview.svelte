<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { referenceOverview } from "#lib/data/vehicle-detail.ts";
  let {
    paragraphs = referenceOverview,
  }: { paragraphs?: readonly CatalogText[] } = $props();
</script>

<div class="card card-body"
  >{#each paragraphs as paragraph (paragraph)}<p class="desktop-type-body"
      >{locale.text(paragraph)}</p
    >{/each}</div
>
