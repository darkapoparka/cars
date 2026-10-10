<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { dashboardOwnerInventory } from "#lib/data/dashboard.ts";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-owner-listings-card.booking-list")}</span
      >
      <div class="fillter d-flex gap-2">
        <div class="input-icon-start position-relative">
          <span class="icon-addon">
            <i class="fi fi-rr-search"></i>
          </span>
          <input
            type="text"
            class="input-small"
            placeholder={locale.t("ui.dashboard-owner-listings-card.search")}
            aria-label={locale.t("ui.dashboard-owner-listings-card.search")}
          />
        </div>
        <DashboardDropdown
          config={dashboardDropdowns.ownerListingsVehicleType}
        />
        <DashboardDropdown config={dashboardDropdowns.ownerListingsSort} />
      </div>
    </div>
  </div>
  <div class="card-body">
    <div class="box-grid-tours">
      <div class="row">
        {#each dashboardOwnerInventory as card (card.image + card.title)}
          <div class="col-lg-4 col-md-6">
            <VehicleGridCard showAction={false} {card} />
          </div>
        {/each}
      </div>
    </div>
    <ListingPagination />
  </div>
</div>
