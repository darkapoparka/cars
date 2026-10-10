<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { dashboardWalletTransactions } from "#lib/data/dashboard.ts";
  import DashboardWalletTransactionRow from "./DashboardWalletTransactionRow.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
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
            type="text"
            class="input-small"
            placeholder={locale.t("ui.dashboard-transactions-card.search")}
            aria-label={locale.t("ui.dashboard-transactions-card.search")}
          />
        </div>
        <DashboardDropdown config={dashboardDropdowns.walletStatus} />
        <DashboardDropdown config={dashboardDropdowns.walletSort} />
      </div>
    </div>
  </div>

  <div class="card-body">
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
          >{#each dashboardWalletTransactions as transaction (transaction.key)}<DashboardWalletTransactionRow
              {transaction}
            />{/each}</tbody
        >
      </table>
    </div>
    <ListingPagination />
  </div>
</div>
