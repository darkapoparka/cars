<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

<div class="row mb-3">
  <div class="col-lg-3 mb-3 mb-lg-0">
    <div class="card shadow-none flex-fill bg-1">
      <div class="box-earning px-3 py-4 text-center">
        <span class="avatar rounded-circle bg-primary me-3">
          <i class="fi fi-rr-piggy-bank"></i>
        </span>
        <p class="desktop-type-body-small"
          >{locale.t("ui.dashboard-transfer-cards.balances")}</p
        >
        <h6 class="desktop-type-price">$125.987</h6>
        <DemoActionLink
          href="#!"
          aria-label={locale.t("ui.dashboard-transfer-cards.view-transactions")}
          >{locale.t(
            "ui.dashboard-transfer-cards.view-transactions",
          )}</DemoActionLink
        >
      </div>
    </div>
  </div>
  <div class="col-lg-9">
    <div class="card shadow-none flex-fill bg-3">
      <div class="box-earning px-3 py-4">
        <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
          >{locale.t("ui.dashboard-transfer-cards.withdraw-transfer")}</span
        >
        <div class="row">
          <div class="col-lg-3 me-2 me-lg-0">
            <p class="fs-8 two-line-ellipsis neutral-500 desktop-type-meta"
              >{locale.t("ui.dashboard-transfer-cards.bank-name")}</p
            >
            <p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
              >Agrik Bank Inc</p
            >
          </div>
          <div class="col-lg-4 me-2 me-lg-0">
            <p class="fs-8 two-line-ellipsis neutral-500 desktop-type-meta"
              >{locale.t("ui.dashboard-transfer-cards.card-number")}</p
            >
            <p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
              >1658 - 2563 - 2356 - 2533</p
            >
          </div>
          <div class="col-lg-3 me-2 me-lg-0">
            <p class="fs-8 two-line-ellipsis neutral-500 desktop-type-meta"
              >{locale.t("ui.dashboard-transfer-cards.name-on-card")}</p
            >
            <p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
              >JOND DAVICE</p
            >
          </div>
          <div class="col-lg-2 me-2 me-lg-0">
            <p class="fs-8 two-line-ellipsis neutral-500 desktop-type-meta"
              >PIN</p
            >
            <p class="fs-6 text-truncate text-md-bold desktop-type-compact-card"
              >256</p
            >
          </div>
        </div>
        <div class="d-flex gap-5 justify-content-between w-100 mt-4">
          <DemoActionLink
            class="d-flex align-items-center gap-1 text-primary-dark"
            href="#!"
            aria-label={locale.t("ui.dashboard-transfer-cards.add-new-card")}
            ><i class="fi fi-rr-add"></i>{locale.t(
              "ui.dashboard-transfer-cards.add-new-card",
            )}</DemoActionLink
          >
          <DemoActionLink
            class="d-flex align-items-center gap-1 text-primary-dark"
            href="#!"
            aria-label={locale.t(
              "ui.dashboard-transfer-cards.withdraw-to-bank",
            )}
            ><i class="fi fi-rr-bank"></i>{locale.t(
              "ui.dashboard-transfer-cards.withdraw-to-bank",
            )}</DemoActionLink
          >
        </div>
      </div>
    </div>
  </div>
</div>
