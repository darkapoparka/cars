<svelte:options runes={true} />

<script module lang="ts">
  const paths = {
    "chevron-down": "m6 9 6 6 6-6",
    "arrow-up-right": "M7 17 17 7M7 7h10v10",
    "arrow-right": "M5 12h14m-6-6 6 6-6 6",
    "arrow-left": "M19 12H5m6-6-6 6 6 6",
    share: "M12 16V3m-4 4 4-4 4 4M8 10H5v11h14V10h-3",
    heart:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    filters: "M4 7h7m4 0h5M4 17h3m4 0h9M11 4v6M7 14v6",
    sort: "m4 7 3-3 3 3M7 4v16m7-3 3 3 3-3M17 20V4",
    close: "m6 6 12 12M18 6 6 18",
    search: "m21 21-5.3-5.3M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    message:
      "M21 15a3 3 0 0 1-3 3H7l-4 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9ZM7 8h10M7 12h6",
  } as const;

  export type MobileIconName = keyof typeof paths;
</script>

<script lang="ts">
  let {
    name,
    size = 16,
  }: {
    name: MobileIconName;
    size?: number;
  } = $props();
</script>

<svg
  width={size}
  height={size}
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
