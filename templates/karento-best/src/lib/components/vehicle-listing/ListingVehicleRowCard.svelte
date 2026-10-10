<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileVehicleCard from "#lib/components/mobile/MobileVehicleCard.svelte";
  import type { RentalRow } from "#lib/data/vehicle-listing.ts";
  import { dealer } from "#lib/content.ts";
  let {
    card,
    actionClass = "btn btn-gray",
    showLocation = false,
  }: {
    card: RentalRow;
    actionClass?: string;
    showLocation?: boolean;
  } = $props();
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const display = $derived(presentVehicle(card, locale));
  const baggage = $derived(
    typeof card.baggageCount === "number"
      ? locale.count(card.baggageCount, "largeBags")
      : card.baggage,
  );
  const body = $derived(card.bodyKey ? locale.t(card.bodyKey) : card.body);
</script>

{#if mobile.current}
  <MobileVehicleCard
    {card}
    pricePrefix={locale.t("ui.listing-vehicle-row-card.from")}
    additionalFacts={[baggage, body]}
    {showLocation}
  />
{:else}
  <div class="card-flight card-hotel card-property background-card border">
    <div class="card-image">
      <a
        href={locale.href(card.href)}
        aria-label={locale.t("ui.listing-vehicle-row-card.view-details")}
        ><img src={card.image} alt={card.imageAlt} /></a
      >
    </div>
    <div class="card-info p-md-40 p-3">
      <span class="sale-lbl desktop-type-badge">{card.sale}</span>
      <div class="tour-rate">
        <div class="rate-element">
          <span class="rating"
            >{card.rating}<span class="text-sm-medium neutral-500"
              >{display.reviews}</span
            ></span
          >
        </div>
      </div>
      <div class="card-title"
        ><a
          class="heading-6 neutral-1000 desktop-type-card"
          href={locale.href(card.href)}
          aria-label={card.titleLabel}>{card.title}</a
        ></div
      >
      <div class="card-program">
        <div class="card-location mb-25">
          <p class="text-location text-md-medium neutral-500 desktop-type-meta"
            >{card.location}</p
          >
        </div>
        <div class="card-facilities">
          <div class="item-facilities">
            <p class="room text-md-medium neutral-1000 desktop-type-meta"
              >{display.mileage}</p
            >
          </div>
          <div class="item-facilities">
            <p class="size text-md-medium neutral-1000 desktop-type-meta"
              >{display.transmission}</p
            >
          </div>
          <div class="item-facilities">
            <p class="parking text-md-medium neutral-1000 desktop-type-meta"
              >{baggage}</p
            >
          </div>
          <div class="item-facilities">
            <p class="bed text-md-medium neutral-1000 desktop-type-meta"
              >{display.fuel}</p
            >
          </div>
          <div class="item-facilities">
            <p class="bathroom text-md-medium neutral-1000 desktop-type-meta"
              >{display.seats}</p
            >
          </div>
          <div class="item-facilities">
            <p class="pet text-md-medium neutral-1000 desktop-type-meta"
              >{body}</p
            >
          </div>
        </div>
        <div class="endtime desktop-card-footer">
          <div class="card-price">
            <p class="text-md-medium neutral-500 mr-5 desktop-type-meta"
              >{locale.t("ui.listing-vehicle-row-card.from")}</p
            >
            <h6 class="heading-6 neutral-1000 desktop-type-price"
              >{display.price}</h6
            >
            <p class="text-md-medium neutral-500 desktop-type-meta"
              >{display.pricePeriod}</p
            >
          </div>
          <div class="card-button"
            ><a
              class={[actionClass, "desktop-type-control desktop-card-action"]}
              href={locale.href(card.href)}
              aria-label={dealer.businessPreview
                ? locale.t("action.enquire")
                : display.action}
              >{dealer.businessPreview
                ? locale.t("action.enquire")
                : display.action}</a
            ></div
          >
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @media (min-width: 992px) {
    .card-flight {
      border-radius: var(--karento-desktop-card-radius);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .card-flight .card-info {
      padding: var(--karento-desktop-panel-padding) !important;
    }
    .card-property.card-flight.card-hotel .card-info .card-title {
      margin-bottom: var(--karento-desktop-card-gap);
    }
    .card-flight .card-location {
      margin-bottom: var(--karento-desktop-card-gap) !important;
    }
    .card-property.card-flight.card-hotel .card-facilities {
      margin-bottom: var(--karento-desktop-card-gap);
    }
  }
</style>
