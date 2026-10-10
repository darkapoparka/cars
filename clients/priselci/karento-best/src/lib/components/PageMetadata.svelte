<svelte:options runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  let { title }: { title: string } = $props();
</script>

<svelte:head><title>{title} | {dealer.name}</title></svelte:head>
