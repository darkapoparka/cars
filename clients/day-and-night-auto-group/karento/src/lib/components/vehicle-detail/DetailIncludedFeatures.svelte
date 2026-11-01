<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { referenceIncludedFeatures } from "#lib/data/vehicle-detail.ts";
  let {
    items = referenceIncludedFeatures,
  }: { items?: readonly CatalogText[] } = $props();
</script>

<div class="card card-body"
  ><ul class="list-checked-green"
    >{#each items as item (item)}<li class="desktop-type-body-small"
        >{locale.text(item)}</li
      >{/each}</ul
  ></div
>
