<script lang="ts">
  let { name = "arrow", size = 20 }: { name?: string; size?: number } =
    $props();
  const paths: Record<string, string> = {
    arrow: "M5 19 19 5M5 5h14v14",
    search: "M21 21l-5-5M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13",
    bookmark: "M6 3h12v18l-6-4-6 4z",
    compare: "M6 3v18M18 3v18M3 7l3-3 3 3M15 17l3 3 3-3",
    chevron: "m6 9 6 6 6-6",
    menu: "M3 6h18M3 12h18M3 18h18",
    close: "m6 6 12 12M6 18 18 6",
    fuel: "M4 21V3h10v18M2 21h14M4 10h10M14 6h3l3 3v9a2 2 0 0 1-4 0v-5h-2",
    speed: "M3 18a9 9 0 1 1 18 0M12 14l5-6M6 11l-1-1M12 6V4M18 11l1-1M8 20h8",
    gear: "M6 4v16M18 4v8M12 4v16M6 12h12M4 4h4M10 4h4M16 4h4",
    car: "M3 12l2-6h14l2 6M2 12h20v7H2zM5 19v2M19 19v2M5 15h3M16 15h3",
    shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6",
    check: "m5 12 4 4L19 6",
    wallet: "M3 6h18v14H3zM3 6V3h15v3M15 11h6v5h-6z",
    wrench:
      "m14 6 4-4a6 6 0 0 1-8 8L3 17a3 3 0 0 0 4 4l7-7a6 6 0 0 0 8-8l-4 4z",
    mail: "M3 5h18v14H3zM3 5l9 8 9-8",
    location:
      "M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12zM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z",
    plus: "M12 4v16M4 12h16",
    filter: "M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l4 2",
    left: "m15 6-6 6 6 6",
    right: "m9 6 6 6-6 6",
    phone: "M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4c-8 4-21-9-16-16",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    list: "M3 4h4v4H3zM11 6h10M3 10h4v4H3zM11 12h10M3 16h4v4H3zM11 18h10",
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={paths[name] || paths.car} />
</svg>
