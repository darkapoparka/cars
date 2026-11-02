<script lang="ts">
  import { page } from "$app/state";
  import { buyReturn } from "#lib/data/journeys.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { DealerDetail } from "#lib/data/dealer-detail.ts";
  import EnquiryHandoff from "./EnquiryHandoff.svelte";

  let {
    vehicle,
    viewing = false,
  }: { vehicle: DealerDetail; viewing?: boolean } = $props();
  const locale = useLocale();
  let message = $derived(
    locale.locale === "bg"
      ? `${viewing ? "Искам да уговоря оглед на" : "Интересувам се от покупката на"} ${vehicle.heading.title}. Моля, потвърдете актуалната цена и наличност.`
      : `${viewing ? "I would like to arrange a viewing of" : "I am interested in buying"} ${vehicle.heading.title}. Please confirm the current price and availability.`,
  );
  const text = $derived(
    `${vehicle.heading.title}\n${locale.locale === "bg" ? "Обява" : "Listing"}: ${vehicle.id}\n${message.trim()}`,
  );
</script>

<div class="purchase-enquiry" data-purchase-enquiry={vehicle.id}>
  <a
    class="selected-vehicle"
    href={locale.href(
      "/vehicle?id=" +
        encodeURIComponent(vehicle.id) +
        "&returnTo=" +
        encodeURIComponent(buyReturn(page.url.searchParams.get("returnTo"))),
    )}
  >
    <img
      src={vehicle.gallery.slides[0]?.src}
      alt={vehicle.heading.title}
      width="96"
      height="72"
    />
    <span
      ><strong>{vehicle.heading.title}</strong><span
        >{typeof vehicle.reservation.priceAmount === "number" &&
        vehicle.reservation.currency
          ? locale.money(
              vehicle.reservation.priceAmount,
              vehicle.reservation.currency,
            )
          : vehicle.reservation.total}</span
      ></span
    >
  </a>
  <p class="vehicle-note">
    {locale.locale === "bg"
      ? "Цена от датираната обява · потвърдете с автосалона."
      : "Price from the dated listing · confirm with the dealership."}
  </p>
  <label
    ><span>{locale.locale === "bg" ? "Вашето запитване" : "Your enquiry"}</span
    ><textarea name="message" rows="5" maxlength="2000" bind:value={message}
    ></textarea></label
  >
  <input type="hidden" name="vehicleId" value={vehicle.id} />
  <EnquiryHandoff {text} />
</div>

<style>
  .purchase-enquiry {
    display: grid;
    gap: 16px;
  }
  .selected-vehicle {
    display: flex;
    align-items: center;
    gap: 12px;
    color: inherit;
    text-decoration: none;
  }
  img {
    flex: 0 0 88px;
    width: 88px;
    height: 66px;
    object-fit: cover;
    border-radius: 10px;
  }
  .selected-vehicle > span {
    display: grid;
    gap: 4px;
    min-width: 0;
    font-size: 16px;
    line-height: 1.4;
  }
  strong {
    overflow-wrap: anywhere;
  }
  .vehicle-note {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 13px;
    line-height: 1.5;
  }
  label {
    display: grid;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  }
  textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: 16px;
    line-height: 1.5;
    resize: vertical;
  }
  a:focus-visible,
  textarea:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
</style>
