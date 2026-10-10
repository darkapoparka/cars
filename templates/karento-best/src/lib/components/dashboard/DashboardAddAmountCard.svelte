<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t("ui.dashboard-add-amount-card.add-amount")}</p
    >
  </div>
  <div class="card-body">
    <p class="mb-3"
      >{locale.t(
        "ui.dashboard-add-amount-card.add-funds-to-your-account-ready-for-any-transaction",
      )}</p
    >
    <input
      type="text"
      class="form-control"
      placeholder="$"
      inputmode={phone.current ? "decimal" : undefined}
      aria-label={phone.current
        ? locale.t("ui.dashboard-transactions-card.amount")
        : "$"}
    />

    <div class="mt-3">
      <div class="credit-card-details">
        <div class="card-form">
          <div class="row">
            <div class="col-lg-6">
              <div class="mb-2">
                <label
                  class="form-label desktop-type-label"
                  for="field-0c8b68bb-0"
                  >{locale.t(
                    "ui.dashboard-add-amount-card.card-holder-name",
                  )}</label
                >
                <div class="user-icon">
                  <span class="input-icon fs-14"
                    ><i class="fi fi-rr-user"></i></span
                  >
                  <input
                    type={phone.current ? "text" : "email"}
                    class="form-control"
                    placeholder={locale.t("reference.controls.nameOnCard")}
                    id="field-0c8b68bb-0"
                    aria-label={phone.current
                      ? undefined
                      : locale.t("reference.controls.nameOnCard")}
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-2">
                <label
                  class="form-label desktop-type-label"
                  for="field-0c8b68bb-1"
                  >{locale.t("ui.dashboard-add-amount-card.card-number")}</label
                >
                <div class="user-icon">
                  <span class="input-icon fs-14"
                    ><i class="fi fi-rr-credit-card"></i></span
                  >
                  <input
                    type={phone.current ? "text" : "email"}
                    inputmode={phone.current ? "numeric" : undefined}
                    class="form-control"
                    placeholder="*** *** *** ***"
                    id="field-0c8b68bb-1"
                    aria-label={phone.current ? undefined : "*** *** *** ***"}
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label
                  class="form-label desktop-type-label"
                  for="field-0c8b68bb-2"
                  >{locale.t("ui.dashboard-add-amount-card.expire-date")}</label
                >
                <div class="user-icon">
                  <span class="input-icon fs-14"
                    ><i class="fi fi-rr-calendar-lines"></i></span
                  >
                  <input
                    type={phone.current ? "text" : "email"}
                    inputmode={phone.current ? "numeric" : undefined}
                    class="form-control"
                    placeholder={locale.t(
                      "reference.ancillary.DashboardAddAmountCard.mm-yyyy",
                    )}
                    id="field-0c8b68bb-2"
                    aria-label={phone.current
                      ? undefined
                      : locale.t(
                          "reference.ancillary.DashboardAddAmountCard.mm-yyyy",
                        )}
                  />
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="mb-3">
                <label
                  class="form-label desktop-type-label"
                  for="field-0c8b68bb-3">CVV</label
                >
                <div class="user-icon">
                  <span class="input-icon fs-14"
                    ><i class="fi fi-rr-qr-scan"></i></span
                  >
                  <input
                    type={phone.current ? "text" : "email"}
                    inputmode={phone.current ? "numeric" : undefined}
                    class="form-control"
                    placeholder="***"
                    id="field-0c8b68bb-3"
                    aria-label={phone.current ? undefined : "***"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-start">
        <DemoActionLink
          href="#!"
          class="btn btn-primary"
          aria-label={locale.t("ui.dashboard-add-amount-card.add-payment")}
          >{locale.t(
            "ui.dashboard-add-amount-card.add-payment",
          )}</DemoActionLink
        >
      </div>
    </div>
  </div>
</div>
