<svelte:options runes={true} />

<script lang="ts">
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import type { VehicleDetailIntent } from "#lib/data/vehicle-detail-selection.ts";
  const locale = useLocale();
  let {
    vehicle,
    intent,
  }: { vehicle: VehicleCardContent; intent: VehicleDetailIntent } = $props();
  const display = $derived(presentVehicle(vehicle, locale));
</script>

<aside class="vehicle-reference-sidebar">
  <section class="vehicle-intent-panel desktop-panel">
    <h2 class="desktop-type-panel">
      {locale.t(
        intent === "rental"
          ? "reference.vehicle.reservation.title"
          : "action.vehicleEnquiry",
      )}
    </h2>
    <div class="vehicle-detail-price">
      <strong class="desktop-type-buy-price">{display.price}</strong>
      {#if display.pricePeriod}<span class="desktop-type-meta"
          >{display.pricePeriod}</span
        >{/if}
    </div>
    <a
      class="desktop-section-action desktop-action-primary desktop-type-control"
      href={locale.href("/contact#contact-enquiry")}
      >{locale.t("action.enquire")}<span aria-hidden="true">↗</span></a
    >
  </section>
  <section class="vehicle-contact-panel desktop-panel">
    <div class="vehicle-contact-heading">
      <img
        src={dealer.logo.light}
        alt={dealer.logo.alt}
        width="168"
        height="76"
      />
      <h2 class="visually-hidden">{dealer.name}</h2>
    </div>
    <div class="vehicle-contact-links desktop-type-body-small">
      {#if dealer.contacts.phone}<a
          href={locale.href(`tel:${dealer.contacts.phone}`)}
          >{dealer.contacts.phone}</a
        >{/if}
      {#if dealer.contacts.email}<a
          href={locale.href(`mailto:${dealer.contacts.email}`)}
          >{dealer.contacts.email}</a
        >{/if}
    </div>
    <a
      class="desktop-section-action desktop-type-control"
      href={locale.href("/vehicles")}
      >{locale.t("action.backVehicles")}<span aria-hidden="true">↗</span></a
    >
  </section>
</aside>

<style>
  @media (min-width: 992px) {
    .vehicle-reference-sidebar {
      display: grid;
      gap: var(--karento-desktop-panel-gap);
      align-content: start;
    }
    .vehicle-reference-sidebar section {
      display: grid;
      justify-items: start;
      gap: var(--karento-desktop-space-4);
      min-width: 0;
      border: 1px solid var(--bs-border-color);
      background: var(--bs-background-card);
    }
    h2 {
      margin: 0;
      color: var(--bs-neutral-1000);
    }
    .vehicle-detail-price {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: var(--karento-desktop-space-2);
      color: var(--bs-neutral-1000);
    }
    .vehicle-detail-price span {
      color: var(--bs-neutral-500);
    }
    .vehicle-contact-heading {
      display: flex;
      align-items: center;
      gap: var(--karento-desktop-space-3);
    }
    .vehicle-contact-heading img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
    .vehicle-contact-links {
      display: grid;
      gap: var(--karento-desktop-space-3);
      max-width: 100%;
    }
    .vehicle-contact-links a {
      overflow-wrap: anywhere;
      color: var(--bs-neutral-600);
    }
    .vehicle-contact-panel > a {
      border: 1px solid var(--bs-border-color);
      color: var(--bs-neutral-1000);
      background: var(--bs-background-card);
    }
    a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: var(--karento-desktop-space-1);
    }
  }
</style>
