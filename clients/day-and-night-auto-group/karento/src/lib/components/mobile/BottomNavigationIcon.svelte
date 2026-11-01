<svelte:options runes={true} />

<script module lang="ts">
  // Lucide geometry and license are pinned in provenance/signature-bottom-navigation-icons.json.
  const paths = {
    home: [
      "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
      "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
    ],
    vehicles: [
      "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",
      "M7 14h.01M17 14h.01",
      "M5 18v2M19 18v2",
    ],
    services: [
      "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
    ],
    shop: [
      "M16 10a4 4 0 0 1-8 0",
      "M3.103 6.034h17.794",
      "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
    ],
    menu: ["M4 5h16M4 12h16M4 19h16"],
  } as const;

  export type BottomNavigationIconName = keyof typeof paths;
</script>

<script lang="ts">
  import { asset } from "$app/paths";

  let {
    name,
    appearance = "outline",
    active = false,
  }: {
    name: BottomNavigationIconName;
    appearance?: "outline" | "graphite";
    active?: boolean;
  } = $props();
</script>

{#if appearance === "graphite"}
  <img
    class="bottom-navigation-icon bottom-navigation-icon-graphite"
    class:bottom-navigation-icon-active={active}
    src={asset(`assets/icons/signature-graphite-refined/${name}.png`)}
    width="96"
    height="96"
    alt=""
    aria-hidden="true"
    decoding="async"
    data-bottom-icon={name}
    data-icon-appearance={appearance}
  />
{:else}
  <svg
    class="bottom-navigation-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    data-bottom-icon={name}
    data-icon-appearance={appearance}
  >
    {#if name === "vehicles"}
      <rect x="3" y="10" width="18" height="8" rx="2" />
    {/if}
    {#each paths[name] as path (path)}
      <path d={path} />
    {/each}
  </svg>
{/if}

<style>
  .bottom-navigation-icon {
    display: block;
    flex-shrink: 0;
    width: var(--karento-mobile-navigation-icon-size);
    height: var(--karento-mobile-navigation-icon-size);
    object-fit: contain;
  }

  .bottom-navigation-icon-graphite {
    opacity: 0.78;
  }

  .bottom-navigation-icon-active {
    opacity: 1;
  }
</style>
