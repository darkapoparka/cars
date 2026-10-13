<svelte:options runes={true} />

<script lang="ts">
  import type { ServiceSpot } from "#lib/data/services.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileIcon, { type MobileIconName } from "./MobileIcon.svelte";
  const locale = useLocale();
  let { spot }: { spot: ServiceSpot } = $props();
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

<a class="home-service-card" href={locale.href(spot.href)} aria-label={title}>
  <span class="service-symbol"
    ><MobileIcon
      name={spot.desktopTitleKey
        ? (icons[spot.desktopTitleKey] ?? "services")
        : "services"}
      size="action"
    /></span
  >
  <span>{title}</span>
</a>

<style>
  .home-service-card {
    display: flex;
    align-items: center;
    gap: var(--karento-space-2);
    padding: var(--karento-space-3);
    min-height: var(--karento-touch-target);
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--bs-border-color);
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    text-decoration: none;
  }
  .service-symbol {
    display: grid;
    place-items: center;
    flex: none;
    width: var(--karento-control-selector);
    height: var(--karento-control-selector);
    border-radius: var(--karento-radius-media);
    background: var(--bs-neutral-100);
  }
  span:not(.service-symbol) {
    display: block;
    min-width: 0;
    font-size: var(--karento-type-card-size);
    font-weight: var(--karento-type-card-weight);
    line-height: var(--karento-type-card-leading);
  }
  .home-service-card:focus-visible {
    outline: 2px solid var(--karento-accent);
    outline-offset: var(--karento-space-1);
  }
</style>
