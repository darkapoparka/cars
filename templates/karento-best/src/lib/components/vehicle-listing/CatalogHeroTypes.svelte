<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { dealer } from "#lib/content.ts";
  import { compareBodyTypes } from "#lib/data/body-type-artwork.ts";
  import {
    readDesktopCatalogFilters,
    selectDesktopCatalogTypeDestination,
    vehicleBodyType,
  } from "#lib/data/desktop-catalog.ts";
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";

  let { cards }: { cards: readonly ListingVehicle[] } = $props();
  const inventory = $derived(
    cards.map((card) => ({ ...card, ...dealer.inventory[card.title] })),
  );
  const types = $derived(
    [...new Set(inventory.map(vehicleBodyType).filter(Boolean))].sort(
      compareBodyTypes,
    ),
  );
  const selected = $derived(
    readDesktopCatalogFilters(page.url.searchParams).type,
  );

  function navigate(
    event: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement },
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    void goto(locale.href(event.currentTarget.href), { reset: false });
  }
</script>

<div
  class="catalog-hero-types"
  role="group"
  aria-label={locale.t("ui.catalog-hero-types.quick-vehicle-types")}
>
  {#each ["", ...types] as type (type)}
    <a
      class:active={selected === type}
      aria-current={selected === type ? "true" : undefined}
      href={locale.href(
        selectDesktopCatalogTypeDestination(
          page.url.pathname,
          page.url.searchParams,
          type,
        ),
      )}
      onclick={navigate}
      class="desktop-type-pill"
      >{type || locale.t("ui.catalog-hero-types.all-types")}</a
    >
  {/each}
</div>

<style>
  .catalog-hero-types {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 6px 16px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.18);
    color: #fff;
    font-size: 13px;
    line-height: 22px;
    font-weight: 500;
    white-space: nowrap;
    text-decoration: none;
  }
  a:hover {
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.16);
    color: #fff !important;
  }
  a.active {
    border-color: #fff;
    background: #fff;
    color: #171717;
  }
  a.active:hover {
    border-color: #fff;
    background: #f2f4f6;
    color: #171717 !important;
  }
  a:focus-visible {
    outline: 2px solid #fff !important;
    outline-offset: 3px;
  }
</style>
