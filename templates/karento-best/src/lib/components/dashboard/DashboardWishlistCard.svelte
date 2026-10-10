<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import ListingVehicleRowCard from "#lib/components/vehicle-listing/ListingVehicleRowCard.svelte";
  import { dashboardWishlist } from "#lib/data/dashboard.ts";

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
  let query = $state("");
  let make = $state<CatalogText>();
  let sort = $state<CatalogText>();
  const makeConfig = dashboardMakeConfig(
    dashboardDropdowns.wishlistVehicleType,
    dashboardWishlist,
  );
  const priceConfig = dashboardPriceConfig(dashboardDropdowns.wishlistSort);
  const cards = $derived(
    phone.current
      ? matchDashboardVehicles(dashboardWishlist, query, make, sort)
      : dashboardWishlist,
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
        >{locale.t("ui.dashboard-wishlist-card.my-wishlist")}</span
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
            placeholder={locale.t("ui.dashboard-wishlist-card.search")}
            aria-label={locale.t("ui.dashboard-wishlist-card.search")}
          />
        </div>
        <DashboardDropdown
          config={phone.current
            ? makeConfig
            : dashboardDropdowns.wishlistVehicleType}
          bind:selection={make}
        />
        <DashboardDropdown
          config={phone.current ? priceConfig : dashboardDropdowns.wishlistSort}
          bind:selection={sort}
        />
      </div>
    </div>
  </div>
  <div class="card-body">
    {#if phone.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(cards.length)}</span
      >{/if}
    {#if phone.current && cards.length === 0}
      <div class="py-4 text-center">
        <p class="neutral-500 mb-3"
          >{locale.t("ui.desktop-catalog-results.no-matching-vehicles")}</p
        >
        <MobilePill
          label={locale.t("ui.mobile-catalog.clear-filters")}
          variant="secondary"
          onclick={clear}
        />
      </div>
    {:else}
      <div class="row box-grid-hotels"
        >{#each cards as card (card.id)}<div class="col-xl-12 col-lg-12"
            ><ListingVehicleRowCard {card} actionClass="btn btn-primary" /></div
          >{/each}</div
      >
      <ListingPagination />
    {/if}
  </div>
</div>
