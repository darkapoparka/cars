<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { dashboardWalletTransactions } from "#lib/data/dashboard.ts";
  import DashboardWalletTransactionRow from "./DashboardWalletTransactionRow.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { message, type CatalogText } from "#lib/i18n/text.ts";
  import { matchDashboardTransactions } from "#lib/data/dashboard-mobile.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  let query = $state("");
  let status = $state<CatalogText>();
  let sort = $state<CatalogText>();
  const statusConfig = {
    ...dashboardDropdowns.walletStatus,
    options: [
      message("ui.desktop-catalog-filter-modal.all"),
      ...dashboardDropdowns.walletStatus.options,
    ],
  };
  const dateConfig = {
    ...dashboardDropdowns.walletSort,
    options: [
      message("catalog.order.default"),
      ...dashboardDropdowns.walletSort.options.slice(0, 2),
    ],
  };
  const transactions = $derived(
    phone.current || desktop.current
      ? matchDashboardTransactions(
          dashboardWalletTransactions,
          query,
          status,
          sort,
          locale.text,
        )
      : dashboardWalletTransactions,
  );
  function clear(event: MouseEvent) {
    query = "";
    status = undefined;
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
        >{locale.t("ui.dashboard-transactions-card.transactions-list")}</span
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
            placeholder={locale.t("ui.dashboard-transactions-card.search")}
            aria-label={locale.t("ui.dashboard-transactions-card.search")}
          />
        </div>
        <DashboardDropdown
          config={phone.current || desktop.current
            ? statusConfig
            : dashboardDropdowns.walletStatus}
          bind:selection={status}
        />
        <DashboardDropdown
          config={phone.current || desktop.current
            ? dateConfig
            : dashboardDropdowns.walletSort}
          bind:selection={sort}
        />
      </div>
    </div>
  </div>

  <div class="card-body">
    {#if phone.current || desktop.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(transactions.length, "results")}</span
      >{/if}
    {#if (phone.current || desktop.current) && transactions.length === 0}
      <div class="py-4 text-center">
        <p class="neutral-500 mb-3">{locale.count(0, "results")}</p>
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
      <div class="table-responsive">
        <table class="table">
          <thead class="thead-light">
            <tr>
              <th>{locale.t("ui.dashboard-transactions-card.payment-type")}</th>
              <th>{locale.t("ui.dashboard-transactions-card.credit-debit")}</th>
              <th>{locale.t("ui.dashboard-transactions-card.date")}</th>
              <th>{locale.t("ui.dashboard-transactions-card.amount")}</th>
              <th>{locale.t("ui.dashboard-transactions-card.balance")}</th>
              <th>{locale.t("ui.dashboard-transactions-card.status")}</th>
            </tr>
          </thead>
          <tbody
            >{#each transactions as transaction (transaction.key)}<DashboardWalletTransactionRow
                {transaction}
              />{/each}</tbody
          >
        </table>
      </div>
      <ListingPagination />
    {/if}
  </div>
</div>
