<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  let {
    href,
    label,
    image,
    imageAlt,
    fit = "cover",
    loading = "eager",
    class: className = "",
    children,
    onclick,
    expanded,
    layout = "row",
  }: {
    href: string;
    label: string;
    image: string;
    imageAlt: string;
    fit?: "cover" | "contain";
    loading?: "eager" | "lazy";
    class?: string;
    children: Snippet;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    expanded?: boolean;
    layout?: "row" | "tile";
  } = $props();
</script>

{#snippet content()}
  <div class={["media-row-photo", { contained: fit === "contain" }]}>
    <img src={image} alt={imageAlt} {loading} decoding="async" />
  </div>
  {@render children()}
{/snippet}

{#if onclick}
  <button
    type="button"
    class={[
      "mobile-media-row",
      className,
      { "mobile-media-tile": layout === "tile" },
    ]}
    aria-label={label}
    aria-haspopup="dialog"
    aria-expanded={expanded}
    {onclick}>{@render content()}</button
  >
{:else}
  <a
    class={[
      "mobile-media-row",
      className,
      { "mobile-media-tile": layout === "tile" },
    ]}
    href={locale.href(href)}
    aria-label={label}>{@render content()}</a
  >
{/if}

<style>
  button.mobile-media-row {
    width: 100%;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
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
  @media (max-width: 767.98px) {
    .mobile-media-row.mobile-media-tile {
      grid-template-columns: minmax(0, 1fr);
      align-content: start;
      gap: var(--karento-space-2);
      padding: 0;
      border: 0;
      background: transparent;
    }
    .mobile-media-tile .media-row-photo {
      aspect-ratio: 3 / 2;
      border-radius: var(--karento-radius-card);
    }
    .mobile-media-tile .media-row-photo.contained {
      aspect-ratio: 1;
    }
    .mobile-media-tile .contained img {
      padding: var(--karento-space-3);
    }
  }
</style>
