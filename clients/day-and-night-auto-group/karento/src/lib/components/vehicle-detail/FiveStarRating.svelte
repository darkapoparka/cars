<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let {
    source,
    imageClass,
    spaceBetween = false,
  }: { source: string; imageClass?: string; spaceBetween?: boolean } = $props();
</script>

<img
  class={imageClass}
  src={source}
  alt={locale.t("ui.five-star-rating.carento")}
/>{#if spaceBetween}{" "}{/if}<img
  class={imageClass}
  src={source}
  alt={locale.t("ui.five-star-rating.carento")}
/>{#if spaceBetween}{" "}{/if}<img
  class={imageClass}
  src={source}
  alt={locale.t("ui.five-star-rating.carento")}
/>{#if spaceBetween}{" "}{/if}<img
  class={imageClass}
  src={source}
  alt={locale.t("ui.five-star-rating.carento")}
/>{#if spaceBetween}{" "}{/if}<img
  class={imageClass}
  src={source}
  alt={locale.t("ui.five-star-rating.carento")}
/>
