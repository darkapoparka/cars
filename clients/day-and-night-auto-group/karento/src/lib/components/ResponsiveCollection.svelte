<script lang="ts">
  import type { Snippet } from "svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";

  let {
    class: className = "row",
    mobileLayout = "grid",
    label,
    children,
  }: {
    class?: string;
    mobileLayout?: "grid" | "rail" | "list";
    label?: string;
    children: Snippet;
  } = $props();
</script>

<div
  class={[
    className,
    "responsive-collection",
    {
      "mobile-rail": mobileLayout === "rail",
      "mobile-list": mobileLayout === "list",
    },
  ]}
  role={mobileLayout !== "grid" ? "region" : undefined}
  aria-label={label}
  {@attach mobileLayout === "rail" ? focusableScroll : undefined}
>
  {@render children()}
</div>

<style>
  @media (max-width: 767.98px) {
    .responsive-collection {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--karento-space-3);
      margin: 0 !important;
      --bs-gutter-x: 0;
      --bs-gutter-y: 0;
    }

    .responsive-collection > :global(*) {
      width: auto;
      min-width: 0;
      padding: 0;
    }

    .responsive-collection.mobile-list {
      grid-template-columns: minmax(0, 1fr);
    }

    .responsive-collection.mobile-rail {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
      padding-block: var(--karento-space-3);
    }

    .responsive-collection.mobile-rail > :global(*) {
      flex: 0 0 calc(100% - var(--karento-space-8) - var(--karento-space-3));
      scroll-snap-align: start;
    }

    .responsive-collection.mobile-rail > :global(:only-child) {
      flex-basis: 100%;
    }
  }
</style>
