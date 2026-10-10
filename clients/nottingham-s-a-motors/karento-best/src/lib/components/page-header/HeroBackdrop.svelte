<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { HeaderImage } from "#lib/data/page-headers.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { image }: { image: HeaderImage } = $props();
</script>

<div class="bg-overlay rounded-12 overflow-hidden"
  ><img
    class={image.className}
    src={image.src}
    alt={locale.text(image.alt)}
  /></div
>
