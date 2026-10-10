<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileVehicleCard from "#lib/components/mobile/MobileVehicleCard.svelte";
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  import { referenceVehicleDestination } from "#lib/data/vehicle-detail-selection.ts";
  let {
    card: referenceCard,
    linkedImage = true,
    paddedRating = false,
    nowrapTitle = true,
    showAction = true,
    showLocation = false,
  }: {
    card: VehicleCardContent;
    linkedImage?: boolean;
    paddedRating?: boolean;
    nowrapTitle?: boolean;
    showAction?: boolean;
    showLocation?: boolean;
  } = $props();
  const card = $derived(dealer.inventory[referenceCard.title] ?? referenceCard);
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const destination = $derived(
    desktop.current && card === referenceCard
      ? referenceVehicleDestination(card)
      : card.href,
  );
  const display = $derived(presentVehicle(card, locale));
  const desktopFacts = $derived(
    [
      {
        id: "mileage",
        label: locale.t("vehicle.mileage"),
        value: display.mileage,
      },
      {
        id: "transmission",
        label: locale.t("vehicle.transmission"),
        value: display.transmission,
      },
      { id: "fuel", label: locale.t("vehicle.fuel"), value: display.fuel },
      { id: "seats", label: locale.t("vehicle.seats"), value: display.seats },
    ].filter((fact) => fact.value),
  );
</script>

{#if mobile.current}
  <MobileVehicleCard {card} {showLocation} />
{:else}
  <div class="card-journey-small background-card">
    <div class="card-image">
      {#if linkedImage}<a
          href={locale.href(destination)}
          aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
        >
          <img src={card.image} alt={card.imageAlt} />
        </a>{:else}<img src={card.image} alt={card.imageAlt} />{/if}
    </div>
    <div class="card-info p-4 pt-30">
      {#if !dealer.businessPreview && card.rating}<div class="card-rating">
          <div class="card-left"></div>
          <div class="card-right">
            <span
              class={[
                "rating text-xs-medium desktop-type-badge",
                { "py-1": paddedRating },
                "rounded-pill",
              ]}
              >{card.rating}<span class="text-xs-medium neutral-500"
                >{display.reviews}</span
              ></span
            >
          </div>
        </div>{/if}
      <div class="card-title"
        ><a
          class={[
            "text-lg-bold neutral-1000 desktop-type-compact-card",
            { "text-nowrap": nowrapTitle },
          ]}
          href={locale.href(destination)}
          aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
          >{card.title}</a
        ></div
      >
      <div class="card-program">
        <div class="card-location">
          <p class="text-location text-sm-medium neutral-500 desktop-type-meta"
            >{card.location}</p
          >
        </div>
        {#if desktopFacts.length}
          <ul
            class="desktop-vehicle-facts"
            aria-label={locale.t("vehicle.facts", { vehicle: card.title })}
          >
            {#each desktopFacts as fact (fact.id)}
              <li class="desktop-type-pill" title={fact.value}
                ><span class="visually-hidden">{fact.label}: </span>{fact.value}
              </li>
            {/each}
          </ul>
        {/if}
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
            <h6 class="text-lg-bold neutral-1000 desktop-type-price"
              >{display.price}</h6
            >
            <p class="text-md-medium neutral-500 desktop-type-meta"
              >{display.pricePeriod}</p
            >
          </div>
          {#if showAction}<div class="card-button"
              ><a
                class="btn btn-gray desktop-type-control desktop-card-action"
                href={locale.href(destination)}
                aria-label={locale.t("action.viewVehicle", {
                  vehicle: card.title,
                })}
                >{dealer.businessPreview
                  ? locale.t("action.enquire")
                  : display.action}</a
              ></div
            >{/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .desktop-vehicle-facts {
    display: none;
  }

  @media (min-width: 992px) {
    .card-journey-small {
      border-radius: var(--karento-desktop-card-radius);
      margin-bottom: var(--karento-desktop-grid-gap);
    }

    .card-journey-small .card-info {
      padding: var(--karento-desktop-card-padding) !important;
      border-radius: var(--karento-desktop-card-radius);
    }

    .card-journey-small .card-info .card-rating {
      left: var(--karento-desktop-card-padding);
      right: var(--karento-desktop-card-padding);
    }

    .card-journey-small .card-info .card-title {
      margin-bottom: var(--karento-desktop-card-gap);
    }

    .card-journey-small .card-image img {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      height: auto;
      aspect-ratio: 3 / 2;
      object-fit: cover;
    }

    .card-title a {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      white-space: normal !important;
    }

    .card-journey-small
      .card-info
      .card-program
      :is(.card-location, .card-facitlities) {
      display: none;
    }

    .desktop-vehicle-facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px var(--karento-desktop-space-2);
      margin: 0 0 var(--karento-desktop-card-gap);
      padding: 0;
      list-style: none;
    }

    .desktop-vehicle-facts li {
      min-width: 0;
      width: 100%;
      max-width: 100%;
      padding: var(--karento-desktop-space-1) var(--karento-desktop-space-2);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-700);
      font-size: var(--karento-type-pill-size);
      font-weight: var(--karento-type-pill-weight);
      line-height: var(--karento-type-pill-leading);
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-program .endtime {
      flex-wrap: wrap;
    }

    .card-button .btn-gray {
      color: var(--bs-neutral-0) !important;
      background-color: var(--bs-neutral-1000);
      border-color: var(--bs-neutral-1000);
    }

    .card-button .btn-gray:is(:hover, :focus-visible) {
      color: var(--bs-neutral-0) !important;
      background-color: var(--bs-neutral-800);
      border-color: var(--bs-neutral-800);
    }

    .card-button .btn-gray:focus-visible {
      outline: 2px solid var(--bs-neutral-1000) !important;
      outline-offset: 3px;
    }
  }

  @media (min-width: 992px) and (max-width: 1199.98px) {
    .card-journey-small .card-info {
      padding: var(--karento-desktop-card-padding-compact) !important;
    }

    .card-journey-small .card-info .card-rating {
      left: var(--karento-desktop-card-padding-compact);
      right: var(--karento-desktop-card-padding-compact);
    }

    .desktop-vehicle-facts li {
      padding-inline: 6px;
      font-size: var(--karento-type-badge-size);
    }

    .card-program .endtime {
      gap: var(--karento-desktop-space-1);
    }
  }
</style>
