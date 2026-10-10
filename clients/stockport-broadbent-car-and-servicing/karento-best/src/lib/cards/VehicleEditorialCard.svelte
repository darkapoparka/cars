<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileVehicleCard from "#lib/components/mobile/MobileVehicleCard.svelte";
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  let {
    card: referenceCard,
    nowrapTitle = false,
  }: { card: VehicleCardContent; nowrapTitle?: boolean } = $props();
  const card = $derived(dealer.inventory[referenceCard.title] ?? referenceCard);
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const display = $derived(presentVehicle(card, locale));
</script>

{#if mobile.current}
  <MobileVehicleCard {card} />
{:else}
  <div class="card-journey-small background-card">
    <div class="card-image">
      <a
        href={locale.href(card.href)}
        aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
      >
        <img src={card.image} alt={card.imageAlt} />
      </a>
    </div>
    <div class="card-info">
      {#if !dealer.businessPreview && card.rating}<div class="card-rating">
          <div class="card-left"></div>
          <div class="card-right">
            {#if card.rating && card.reviews}<span class="rating desktop-type-badge"
              >{card.rating}<span class="text-sm-medium neutral-500"
                >{display.reviews}</span
              ></span
            >{/if}
          </div>
        </div>{/if}
      <div class="card-title"
        ><a
          class={[
            "heading-6 neutral-1000 desktop-type-compact-card",
            { "text-nowrap": nowrapTitle },
          ]}
          href={locale.href(card.href)}
          aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
          >{card.title}</a
        ></div
      >
      <div class="card-program">
        <div class="card-location">
          <p class="text-location text-md-medium neutral-500 desktop-type-meta"
            >{card.location}</p
          >
        </div>
        <div class="card-facitlities">
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
        <div class="endtime desktop-card-footer">
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
      padding: var(--karento-desktop-card-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
    .card-journey-small .card-info .card-rating {
      left: var(--karento-desktop-card-padding);
      right: var(--karento-desktop-card-padding);
    }
    .card-journey-small .card-info .card-title {
      margin-bottom: var(--karento-desktop-card-gap);
    }
    .card-journey-small .card-info .card-program .card-location {
      margin-bottom: var(--karento-desktop-panel-gap);
    }
    .card-journey-small .card-info .card-program .card-facitlities {
      padding-top: var(--karento-desktop-card-gap);
      margin-bottom: var(--karento-desktop-card-gap);
    }
  }
</style>
