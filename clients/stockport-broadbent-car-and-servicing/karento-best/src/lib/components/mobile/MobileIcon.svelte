<svelte:options runes={true} />

<script module lang="ts">
  const paths = {
    "chevron-down": "m6 9 6 6 6-6",
    "chevron-left": "m15 18-6-6 6-6",
    "chevron-right": "m9 6 6 6-6 6",
    "arrow-up-right": "M7 17 17 7M7 7h10v10",
    "arrow-right": "M5 12h14m-6-6 6 6-6 6",
    "arrow-left": "M19 12H5m6-6-6 6 6 6",
    share: "M12 16V3m-4 4 4-4 4 4M8 10H5v11h14V10h-3",
    heart:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    filters: "M4 7h7m4 0h5M4 17h3m4 0h9M11 4v6M7 14v6",
    sort: "m4 7 3-3 3 3M7 4v16m7-3 3 3 3-3M17 20V4",
    close: "m6 6 12 12M18 6 6 18",
    edit: "m16 3 5 5-13 13-5-5 13-13ZM3 16v5h5M14 5l5 5",
    menu: "M4 6h16M4 12h16M4 18h16",
    home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z",
    vehicles: "m5 7 2-4h10l2 4M3 10l2-3h14l2 3v8H3Zm0 8v3m18-3v3M6 13h2m8 0h2",
    services:
      "M14 3a6 6 0 0 0-7 8L3 15a3 3 0 0 0 4 4l4-4a6 6 0 0 0 8-7l-4 4-3-3 4-4Z",
    shop: "M4 8h16l1 13H3ZM8 8V6a4 4 0 0 1 8 0v2",
    account:
      "M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 20v-1a7 7 0 0 1 14 0v1",
    search: "m21 21-5.3-5.3M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    message:
      "M21 15a3 3 0 0 1-3 3H7l-4 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9ZM7 8h10M7 12h6",
  } as const;

  export type MobileIconName = keyof typeof paths;
</script>

<script lang="ts">
  let {
    name,
    size = "compact",
  }: {
    name: MobileIconName;
    // Numeric sizes retain the frozen /2 reference's existing geometry.
    size?: "compact" | "action" | number;
  } = $props();
</script>

<svg
  class:mobile-icon-compact={size === "compact"}
  class:mobile-icon-action={size === "action"}
  width={typeof size === "number" ? size : undefined}
  height={typeof size === "number" ? size : undefined}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
  focusable="false"
>
  <path
    d={paths[name]}
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>

<style>
  .mobile-icon-compact,
  .mobile-icon-action {
    display: block;
    flex-shrink: 0;
  }

  .mobile-icon-compact {
    width: var(--karento-control-icon);
    height: var(--karento-control-icon);
  }

  .mobile-icon-action {
    width: var(--karento-control-icon-action);
    height: var(--karento-control-icon-action);
  }
</style>
