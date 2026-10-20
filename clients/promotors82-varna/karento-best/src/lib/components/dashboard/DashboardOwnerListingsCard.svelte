<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { dashboardOwnerInventory } from "#lib/data/dashboard.ts";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import {
    dashboardMakeConfig,
    dashboardPriceConfig,
    matchDashboardVehicles,
  } from "#lib/data/dashboard-mobile.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  let query = $state("");
  let make = $state<CatalogText>();
  let sort = $state<CatalogText>();
  const makeConfig = dashboardMakeConfig(
    dashboardDropdowns.ownerListingsVehicleType,
    dashboardOwnerInventory,
  );
  const priceConfig = dashboardPriceConfig(
    dashboardDropdowns.ownerListingsSort,
  );
  const cards = $derived(
    phone.current || desktop.current
      ? matchDashboardVehicles(dashboardOwnerInventory, query, make, sort)
      : dashboardOwnerInventory,
  );
  function clear(event: MouseEvent) {
    query = "";
    make = undefined;
    sort = undefined;
    (event.currentTarget as HTMLElement)
      .closest(".card")
      ?.querySelector<HTMLInputElement>("input")
      ?.focus({ preventScroll: true });
  }
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t(
          desktop.current
            ? "reference.dynamic.dashboard-audiences.owner.links.2.label"
            : "ui.dashboard-owner-listings-card.booking-list",
        )}</span
      >
      <div class="fillter d-flex gap-2">
        <div class="input-icon-start position-relative">
          <span class="icon-addon">
            <i class="fi fi-rr-search"></i>
          </span>
          <input
            type={phone.current ? "search" : "text"}
            bind:value={query}
            class="input-small"
            placeholder={locale.t("ui.dashboard-owner-listings-card.search")}
            aria-label={locale.t("ui.dashboard-owner-listings-card.search")}
          />
        </div>
        <DashboardDropdown
          config={phone.current || desktop.current
            ? makeConfig
            : dashboardDropdowns.ownerListingsVehicleType}
          bind:selection={make}
        />
        <DashboardDropdown
          config={phone.current || desktop.current
            ? priceConfig
            : dashboardDropdowns.ownerListingsSort}
          bind:selection={sort}
        />
      </div>
    </div>
  </div>
  <div class="card-body">
    {#if phone.current || desktop.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(cards.length)}</span
      >{/if}
    {#if (phone.current || desktop.current) && cards.length === 0}
      <div class="py-4 text-center">
        <p class="neutral-500 mb-3"
          >{locale.t("ui.desktop-catalog-results.no-matching-vehicles")}</p
        >
        {#if desktop.current}<button
            type="button"
            class="desktop-card-action desktop-action-primary"
            onclick={clear}
            >{locale.t("ui.mobile-catalog.clear-filters")}</button
          >{:else}<MobilePill
            label={locale.t("ui.mobile-catalog.clear-filters")}
            variant="secondary"
            onclick={clear}
          />{/if}
      </div>
    {:else}
      <div class="box-grid-tours">
        <div class="row">
          {#each cards as card (card.image + card.title)}
            <div class="col-lg-4 col-md-6">
              <VehicleGridCard showAction={false} {card} />
            </div>
          {/each}
        </div>
      </div>
      <ListingPagination />
    {/if}
  </div>
</div>
