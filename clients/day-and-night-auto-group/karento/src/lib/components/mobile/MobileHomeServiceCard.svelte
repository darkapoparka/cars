<svelte:options runes={true} />

<script lang="ts">
  import type { ServiceSpot } from "#lib/data/services.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileIcon, { type MobileIconName } from "./MobileIcon.svelte";
  const locale = useLocale();
  let {
    spot,
    onselect,
    expanded,
  }: {
    spot: ServiceSpot;
    onselect?: (spot: ServiceSpot) => void;
    expanded?: boolean;
  } = $props();
  const title = $derived(
    spot.desktopTitleKey ? locale.t(spot.desktopTitleKey) : spot.title,
  );
  const icons: Partial<
    Record<NonNullable<ServiceSpot["desktopTitleKey"]>, MobileIconName>
  > = {
    "referenceHome.services.import": "transport",
    "referenceHome.services.sell": "sell",
    "referenceHome.services.buy": "key",
    "referenceHome.services.lease": "finance",
  };
</script>

{#snippet content()}
  <span class="service-symbol"
    ><MobileIcon
      name={spot.desktopTitleKey
        ? (icons[spot.desktopTitleKey] ?? "services")
        : "services"}
      size="action"
    /></span
  >
  <span>{title}</span>
{/snippet}

{#if onselect}
  <button
    type="button"
    class="home-service-card"
    aria-label={title}
    aria-haspopup="dialog"
    aria-expanded={expanded}
    onclick={() => onselect?.(spot)}>{@render content()}</button
  >
{:else}
  <a class="home-service-card" href={locale.href(spot.href)} aria-label={title}>
    {@render content()}
  </a>
{/if}

<style>
  button.home-service-card {
    width: 100%;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .home-service-card {
    display: flex;
    align-items: center;
    gap: var(--karento-space-1);
    padding: var(--karento-space-3);
    min-height: var(--karento-touch-target);
    min-width: 0;
    border: 1px solid var(--karento-border-tool);
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  .service-symbol {
    display: grid;
    place-items: center;
    flex: none;
    width: var(--karento-space-6);
    height: var(--karento-space-6);
  }
  span:not(.service-symbol) {
    display: block;
    min-width: 0;
    overflow-wrap: anywhere;
    font-size: var(--karento-type-card-size);
    font-weight: var(--karento-type-control-weight);
    line-height: var(--karento-type-card-leading);
  }
  .home-service-card:focus-visible {
    outline: 2px solid var(--karento-accent);
    outline-offset: var(--karento-space-1);
  }
</style>
