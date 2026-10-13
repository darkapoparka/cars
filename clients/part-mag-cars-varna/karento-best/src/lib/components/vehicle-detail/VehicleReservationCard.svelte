<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { stockNotice } from "#lib/i18n/dealer.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import ReservationDateField from "./ReservationDateField.svelte";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import {
    referenceReservation,
    type DetailReservation,
  } from "#lib/data/vehicle-detail.ts";
  let {
    reservation = referenceReservation,
  }: { reservation?: DetailReservation } = $props();
</script>

<div class="booking-form">
  <div class="head-booking-form">
    <p class="text-xl-bold neutral-1000 desktop-type-panel"
      >{dealer.businessPreview
        ? locale.t("action.vehicleEnquiry")
        : locale.text(reservation.title)}</p
    >
  </div>
  <div class="content-booking-form">
    {#if dealer.businessPreview}
      <div class="item-line-booking last-item">
        <strong class="text-md-bold neutral-1000 desktop-type-label"
          >{locale.t(
            dealer.businessPreview?.mode === "illustrative-not-dealer-stock"
              ? "vehicle.illustrativePrice"
              : "vehicle.price",
          )}</strong
        >
        <div class="line-booking-right"
          ><p class="text-xl-bold neutral-1000 desktop-type-buy-price"
            >{typeof reservation.priceAmount === "number" &&
            reservation.currency
              ? locale.money(reservation.priceAmount, reservation.currency)
              : reservation.total || locale.t("vehicle.notProvided")}</p
          ></div
        >
      </div>
      <div class="box-button-book"
        ><a
          class="btn btn-book desktop-type-control desktop-panel-action"
          href={locale.href("/contact#contact-enquiry")}
          >{locale.t("action.enquire")}</a
        ></div
      >
      <p class="text-sm-medium neutral-500 desktop-type-meta"
        >{stockNotice(dealer.businessPreview, locale)}</p
      >
    {:else}
      <div class="booking-dates">
        <ReservationDateField
          label={locale.t("ui.vehicle-reservation-card.pick-up")}
          value={reservation.pickUp}
          accessibleLabel={locale.t("ui.vehicle-reservation-card.pick-up")}
          first
        />
        <ReservationDateField
          label={locale.t("ui.vehicle-reservation-card.drop-off")}
          value={reservation.dropOff}
          accessibleLabel={locale.t("ui.vehicle-reservation-card.drop-off")}
        />
      </div>
      <div class="item-line-booking">
        <div class="box-tickets">
          <strong class="text-md-bold neutral-1000 desktop-type-label"
            >{locale.t("ui.vehicle-reservation-card.add-extra")}</strong
          >
          {#each reservation.extras as extra (extra.id)}<div
              class="line-booking-tickets"
              ><div class="item-ticket"
                ><ul class="list-filter-checkbox"
                  ><li
                    ><label class="cb-container"
                      ><input
                        type="checkbox"
                        aria-label={locale.text(extra.label)}
                      /><span class="text-md-medium desktop-type-body-small"
                        >{locale.text(extra.label)}
                      </span><span class="checkmark"></span></label
                    ></li
                  ></ul
                ></div
              ><div class="include-price"
                ><p class="text-md-bold neutral-1000 desktop-type-body-small"
                  >{extra.price}</p
                ></div
              ></div
            >{/each}
        </div>
      </div>
      <div class="booking-totals">
        <div class="item-line-booking last-item pb-0">
          <strong class="text-md-medium neutral-1000 desktop-type-label"
            >{locale.t("ui.vehicle-reservation-card.subtotal")}</strong
          >
          <div class="line-booking-right">
            <p class="text-xl-bold neutral-1000 desktop-type-body-small"
              >{reservation.subtotal}</p
            >
          </div>
        </div>
        <div class="item-line-booking last-item pb-0">
          <strong class="text-md-medium neutral-1000 desktop-type-label"
            >{locale.t("ui.vehicle-reservation-card.sale-discount")}</strong
          >
          <div class="line-booking-right">
            <p class="text-xl-bold neutral-1000 desktop-type-body-small"
              >{reservation.discount}</p
            >
          </div>
        </div>
        <div class="item-line-booking last-item booking-total">
          <strong class="text-md-bold neutral-1000 desktop-type-label"
            >{locale.t("ui.vehicle-reservation-card.total-payable")}</strong
          >
          <div class="line-booking-right">
            <p class="text-xl-bold neutral-1000 desktop-type-buy-price"
              >{reservation.total}</p
            >
          </div>
        </div>
      </div>
      <div class="box-button-book">
        <DemoActionLink
          class="btn btn-book desktop-type-control desktop-panel-action"
          href="#!"
          aria-label={locale.t("ui.vehicle-reservation-card.book-now")}
        >
          {locale.t("ui.vehicle-reservation-card.book-now")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 15L15 8L8 1M15 8L1 8"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </DemoActionLink>
      </div>
      <div class="box-need-help">
        <DemoActionLink
          href="#!"
          aria-label={locale.t("ui.vehicle-reservation-card.need-some-help")}
        >
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2.83366 3.66667C2.83366 1.92067 4.25433 0.5 6.00033 0.5C7.74633 0.5 9.16699 1.92067 9.16699 3.66667C9.16699 5.41267 7.74633 6.83333 6.00033 6.83333C4.25433 6.83333 2.83366 5.41267 2.83366 3.66667ZM8.00033 7.83333H4.00033C1.88699 7.83333 0.166992 9.55333 0.166992 11.6667C0.166992 12.678 0.988992 13.5 2.00033 13.5H10.0003C11.0117 13.5 11.8337 12.678 11.8337 11.6667C11.8337 9.55333 10.1137 7.83333 8.00033 7.83333Z"
              fill=""
            ></path>
          </svg>
          {locale.t("ui.vehicle-reservation-card.need-some-help")}
        </DemoActionLink>
      </div>
    {/if}
  </div>
</div>

<style>
  .booking-dates,
  .booking-totals {
    display: contents;
  }

  @media (max-width: 767.98px) {
    .booking-form {
      border-radius: var(--karento-radius-card);
    }

    .booking-form .head-booking-form {
      padding: var(--karento-space-4);
      border-radius: var(--karento-radius-card) var(--karento-radius-card) 0 0;
    }

    .head-booking-form p {
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }

    .booking-form .content-booking-form {
      display: grid;
      gap: var(--karento-space-4);
      padding: var(--karento-space-4);
    }

    .booking-dates {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      gap: var(--karento-space-3);
    }

    .content-booking-form .item-line-booking {
      min-width: 0;
      gap: var(--karento-space-3);
      margin: 0;
      padding: 0;
      border: 0;
    }

    .content-booking-form > .item-line-booking:not(.last-item) {
      padding-block: var(--karento-space-3);
      border-block: 1px solid var(--bs-border-color);
    }

    .booking-form .content-booking-form strong,
    .booking-dates :global(.reservation-date-field strong),
    .line-booking-tickets .cb-container > .text-md-medium {
      font-size: var(--karento-type-label-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-label-leading);
    }

    .booking-dates :global(input) {
      font-size: var(--karento-type-field-size);
      font-weight: var(--karento-type-field-weight);
      line-height: var(--karento-type-field-leading);
    }

    .line-booking-tickets {
      display: grid;
      grid-template-columns: minmax(0, 1fr) max-content;
      align-items: center;
      gap: var(--karento-space-3);
    }

    .line-booking-tickets .item-ticket {
      display: block;
      min-width: 0;
    }

    .line-booking-tickets .list-filter-checkbox {
      margin: 0;
      padding: 0;
    }

    .line-booking-tickets .item-ticket .list-filter-checkbox li,
    .line-booking-tickets .include-price {
      margin: 0;
    }

    .line-booking-tickets .cb-container {
      align-items: center;
      min-height: var(--karento-touch-target);
      padding-inline-start: calc(
        var(--karento-control-icon) + var(--karento-space-3)
      );
    }

    .cb-container > input {
      inset: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      margin: 0;
      touch-action: manipulation;
    }

    .cb-container:has(input:focus-visible) {
      border-radius: var(--karento-radius-media);
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: var(--karento-space-1);
    }

    .cb-container .checkmark {
      top: 50%;
      transform: translateY(-50%);
    }

    .line-booking-tickets p,
    .booking-totals p {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .booking-totals {
      display: grid;
      gap: var(--karento-space-2);
    }

    .booking-totals .booking-total p,
    .content-booking-form > .last-item .line-booking-right p {
      font-size: var(--karento-type-price-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }

    .content-booking-form > p {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .box-button-book :global(.btn),
    .box-need-help :global(a) {
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
    }

    .booking-form :global(output[data-demo-action]) {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .booking-form .box-need-help {
      padding: 0;
    }

    .box-need-help :global(a) {
      min-height: var(--karento-touch-target);
    }
  }

  @media (min-width: 992px) {
    .booking-form {
      border-radius: var(--karento-desktop-card-radius);
    }
    .booking-form .head-booking-form {
      padding: var(--karento-desktop-panel-padding);
      border-radius: var(--karento-desktop-card-radius)
        var(--karento-desktop-card-radius) 0 0;
    }
    .booking-form .head-booking-form p {
      margin: 0;
    }
    .booking-form .content-booking-form {
      padding: var(--karento-desktop-panel-padding);
    }
    .booking-form .item-line-booking {
      gap: var(--karento-desktop-space-3);
      padding-bottom: var(--karento-desktop-space-4);
      margin-bottom: var(--karento-desktop-space-4);
    }
    .booking-form .line-booking-tickets {
      gap: var(--karento-desktop-space-3);
      margin-top: var(--karento-desktop-space-3);
    }
    .booking-form .box-button-book {
      margin-top: var(--karento-desktop-space-4);
    }
    .booking-form .box-need-help {
      margin-top: var(--karento-desktop-space-4);
    }
  }
</style>
