<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from "svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";

  let {
    label,
    children,
    variant = "default",
    class: className = "",
  }: {
    label: string;
    children: Snippet;
    variant?: "default" | "secondary";
    class?: string;
  } = $props();
</script>

<nav
  class={[
    "mobile-pill-rail",
    { "mobile-pill-rail-secondary": variant === "secondary" },
    className,
  ]}
  aria-label={label}
  {@attach focusableScroll}
>
  {@render children()}
</nav>

<style>
  @media (max-width: 767.98px) {
    nav {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: var(--karento-space-2);
      min-width: 0;
      max-width: 100%;
      /* Reserve the transparent 44px touch coverage around a 36px pill. */
      padding-block: var(--karento-space-1);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scrollbar-width: none;
    }
    nav::-webkit-scrollbar {
      display: none;
    }
    nav.mobile-pill-rail-secondary {
      /* A 28px secondary pill needs 8px on each side of its 44px tap area. */
      padding-block: var(--karento-space-2);
    }
    :global(.mobile-sheet) nav {
      /* Reserve the outer focus ring without moving the painted pills. */
      margin-inline: calc(-1 * var(--karento-space-1));
      padding-inline: var(--karento-space-1);
      max-width: calc(100% + 2 * var(--karento-space-1));
      scroll-padding-inline: var(--karento-space-1);
    }
    nav:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 2px;
    }
  }
</style>
