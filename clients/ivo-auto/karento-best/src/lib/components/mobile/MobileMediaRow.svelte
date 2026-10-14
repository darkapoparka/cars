<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Snippet } from "svelte";

  let {
    href,
    label,
    image,
    imageAlt,
    fit = "cover",
    loading = "eager",
    class: className = "",
    children,
  }: {
    href: string;
    label: string;
    image: string;
    imageAlt: string;
    fit?: "cover" | "contain";
    loading?: "eager" | "lazy";
    class?: string;
    children: Snippet;
  } = $props();
</script>

<a
  class={["mobile-media-row", className]}
  href={locale.href(href)}
  aria-label={label}
>
  <div class={["media-row-photo", { contained: fit === "contain" }]}>
    <img src={image} alt={imageAlt} {loading} decoding="async" />
  </div>
  {@render children()}
</a>

<style>
  .mobile-media-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: var(--karento-space-3);
    min-width: 0;
    min-height: var(--karento-touch-target);
    padding: var(--karento-space-3);
    border: 1px solid var(--karento-border-tool);
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }

  .mobile-media-row:hover,
  .mobile-media-row:focus-visible {
    border-color: currentColor;
  }

  .mobile-media-row:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }

  .media-row-photo {
    position: relative;
    align-self: stretch;
    width: 100%;
    aspect-ratio: var(--karento-image-wide);
    min-width: 0;
    overflow: hidden;
    border-radius: var(--karento-radius-media);
    background: var(--karento-surface-tool);
  }

  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .contained img {
    object-fit: contain;
    mix-blend-mode: multiply;
  }
</style>
