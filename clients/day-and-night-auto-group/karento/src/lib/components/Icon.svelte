<script lang="ts">
  let { name, size = 20 }: { name: string; size?: number } = $props();
  const paths: Record<string, string> = {
    car: "M5 17H3v-7l2-6h14l2 6v7h-2M5 17v3m14-3v3M3 10h18M7 14h.01M17 14h.01M5 17h14",
    search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    calendar: "M8 2v4m8-4v4M3 10h18M3 5h18v16H3z",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    chevron: "m9 5 7 7-7 7",
    close: "m6 6 12 12M6 18 18 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    phone:
      "m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3c0 3-2 5-5 4C8 18 4 14 2 6 1 3 4 1 7 3",
    grid: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
    list: "M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01",
    check: "m5 12 4 4L19 6",
    pin: "M12 22s8-9 8-14a8 8 0 1 0-16 0c0 5 8 14 8 14m3-14a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
    import: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
    value: "M3 3h9l9 9-9 9-9-9V3m5 5h.01",
    service: "m14 5 5-3-1 6-4 2-8 10-4-4 10-8 2-3",
    transport:
      "M2 5h12v12H2zm12 5h4l4 5v2h-8M5 17a2 2 0 1 0 4 0m7 0a2 2 0 1 0 4 0",
    home: "m3 10 9-8 9 8v11h-6v-7H9v7H3V10",
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"><path d={paths[name] || paths.car} /></svg
>
