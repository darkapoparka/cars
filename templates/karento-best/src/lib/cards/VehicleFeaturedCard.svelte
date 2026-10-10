<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileVehicleCard from "#lib/components/mobile/MobileVehicleCard.svelte";
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  let { card: referenceCard }: { card: VehicleCardContent } = $props();
  const card = $derived(dealer.inventory[referenceCard.title] ?? referenceCard);
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const display = $derived(presentVehicle(card, locale));
</script>

{#if mobile.current}
  <MobileVehicleCard {card} />
{:else}
  <div
    class="card-journey-small card-journey-small-listing-3 background-0 d-flex flex-md-row flex-column align-items-center mw-100 position-relative"
  >
    <div class="card-image w-100">
      <a
        href={locale.href(card.href)}
        aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
      >
        <img src={card.image} alt={card.imageAlt} />
      </a>
    </div>
    <div
      class="card-info p-4 mt-0 position-relative end-0 h-100 w-lg-55 rounded-12"
    >
      {#if !dealer.businessPreview && card.rating}<div
          class="card-rating position-relative start-0 top-0"
        >
          <div class="card-right">
            <span
              class="rating shadow-none border-0 bg-transparent desktop-type-badge"
              >{card.rating}<span class="text-sm-medium neutral-500"
                >{display.reviews}</span
              >
            </span>
          </div>
        </div>{/if}
      <div class="card-title pb-1"
        ><a
          class="heading-6 neutral-1000 desktop-type-card"
          href={locale.href(card.href)}
          aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
          >{card.title}</a
        ></div
      >
      <div class="card-program">
        <div class="card-facitlities border-0 pb-3">
          <p class="card-miles text-md-medium desktop-type-meta"
            >{display.mileage}</p
          >
          <p class="card-gear text-md-medium desktop-type-meta"
            >{display.transmission}</p
          >
          <p class="card-fuel text-md-medium desktop-type-meta"
            >{display.fuel}</p
          >
          <p class="card-seat text-md-medium desktop-type-meta"
            >{display.seats}</p
          >
        </div>
        <div class="endtime border-top pt-4 desktop-card-footer">
          <div class="card-price">
            <p class="text-md-medium neutral-500 me-2 desktop-type-meta"
              >{display.pricePeriod}</p
            >
            <h6 class="heading-6 neutral-1000 desktop-type-price"
              >{display.price}</h6
            >
          </div>
          <div class="card-button"
            ><a
              class="btn btn-gray desktop-type-control desktop-card-action"
              href={locale.href(card.href)}
              aria-label={locale.t("action.viewVehicle", {
                vehicle: card.title,
              })}
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
    .card-journey-small {
      border-radius: var(--karento-desktop-card-radius);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .card-journey-small .card-info {
      padding: var(--karento-desktop-panel-padding) !important;
      border-radius: var(--karento-desktop-card-radius) !important;
    }
    .card-journey-small .card-info .card-title {
      margin-bottom: var(--karento-desktop-card-gap);
    }
    .card-journey-small .card-info .card-program .card-facitlities {
      padding-top: var(--karento-desktop-card-gap);
      padding-bottom: var(--karento-desktop-card-gap) !important;
      margin-bottom: var(--karento-desktop-card-gap);
    }
    .card-program .endtime {
      padding-top: var(--karento-desktop-card-gap) !important;
    }
  }
</style>
