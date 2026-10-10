<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import type { ImportSourceItem } from "#lib/data/editorial.ts";
  let { source }: { source: ImportSourceItem } = $props();
  const header = $derived({
    ...pageHeroes.sourceProfile,
    description: source.sample
      ? pageHeroes.sourceProfile.description
      : undefined,
  });
</script>

<PageHero {header} titleOverride={source.name} />
