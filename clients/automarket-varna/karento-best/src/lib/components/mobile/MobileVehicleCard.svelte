<svelte:options runes={true} />

<script lang="ts">
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { VehicleCardContent } from "#lib/content.ts";

  type PhoneVehicle = Pick<
    VehicleCardContent,
    | "image"
    | "imageAlt"
    | "href"
    | "title"
    | "location"
    | "listingHighlights"
    | "price"
    | "pricePeriod"
    | "mileage"
    | "transmission"
    | "fuel"
    | "seats"
    | "seatsCount"
    | "pricePeriodKey"
    | "priceAmount"
    | "currency"
    | "mileageValue"
    | "mileageUnit"
    | "fuelType"
    | "transmissionType"
  >;

  let {
    card,
    pricePrefix,
    additionalFacts = [],
    showLocation = false,
  }: {
    card: PhoneVehicle;
    pricePrefix?: string;
    additionalFacts?: readonly string[];
    showLocation?: boolean;
  } = $props();

  const display = $derived(presentVehicle(card, locale));
  const context = $derived(
    showLocation ? card.location.trim() : display.listingHighlights,
  );
  const facts = $derived(
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
      ...additionalFacts.map((value, index) => ({
        id: `additional-${index}`,
        label: "",
        value,
      })),
    ].filter((fact) => fact.value),
  );
</script>

<article class="mobile-vehicle-card background-card">
  <div class="mobile-vehicle-photo">
    <img src={card.image} alt={card.imageAlt} />
  </div>
  <div class="mobile-vehicle-copy">
    <a
      class="mobile-vehicle-link"
      href={locale.href(card.href)}
      aria-label={locale.t("action.viewVehicle", { vehicle: card.title })}
    >
      <div class="mobile-vehicle-summary">
        <h3 class="mobile-vehicle-title">{card.title}</h3>
        {#if context}
          <p class="mobile-vehicle-context">{context}</p>
        {/if}
      </div>
      <p class="mobile-vehicle-price">
        {#if pricePrefix}<span>{pricePrefix}</span>{/if}
        <strong>{display.price}</strong>
        {#if card.pricePeriod}<span>{display.pricePeriod}</span>{/if}
      </p>
    </a>
  </div>
  {#if facts.length}
    <ul
      class="mobile-vehicle-facts"
      aria-label={locale.t("vehicle.facts", { vehicle: card.title })}
    >
      {#each facts as fact (fact.id)}
        <li>
          {#if fact.label}<span class="visually-hidden"
              >{fact.label}:
            </span>{/if}
          {fact.value}
        </li>
      {/each}
    </ul>
  {/if}
</article>

<style>
  @media (max-width: 767.98px) {
    .mobile-vehicle-card.background-card {
      position: relative;
      display: grid;
      grid-template-columns: min(44%, var(--karento-vehicle-media-max)) minmax(
          0,
          1fr
        );
      align-items: stretch;
      gap: var(--karento-space-2);
      min-width: 0;
      margin: var(--karento-vehicle-card-margin, 0 0 var(--karento-space-3));
      padding: var(--karento-space-3);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-radius-card);
      color: var(--bs-neutral-1000);
    }
    .mobile-vehicle-card .mobile-vehicle-photo {
      width: 100%;
      height: auto;
      aspect-ratio: var(--karento-image-landscape);
      min-width: 0;
      margin: 0;
      padding: 0;
      border-radius: var(--karento-radius-media);
      background: var(--bs-neutral-100);
      overflow: hidden;
    }
    .mobile-vehicle-card .mobile-vehicle-photo img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .mobile-vehicle-card .mobile-vehicle-copy,
    .mobile-vehicle-card .mobile-vehicle-link {
      display: flex;
      flex-direction: column;
      gap: var(--karento-space-1);
      min-width: 0;
      margin: 0;
      padding: 0;
    }
    .mobile-vehicle-card .mobile-vehicle-link {
      flex: 1;
      justify-content: center;
      gap: var(--karento-space-2);
      min-height: var(--karento-touch-target);
      color: inherit;
      text-decoration: none;
    }
    .mobile-vehicle-card .mobile-vehicle-link::after {
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: inherit;
      content: "";
    }
    .mobile-vehicle-card:has(.mobile-vehicle-link:focus-visible) {
      outline: 2px solid var(--karento-accent);
      outline-offset: 3px;
    }
    .mobile-vehicle-card .mobile-vehicle-link:focus-visible {
      outline: none !important;
    }
    .mobile-vehicle-summary {
      display: grid;
      gap: var(--karento-space-1);
      min-width: 0;
    }
    .mobile-vehicle-card .mobile-vehicle-context {
      margin: 0;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
      overflow-wrap: anywhere;
    }
    .mobile-vehicle-card .mobile-vehicle-title {
      margin: 0;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
      letter-spacing: 0;
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .mobile-vehicle-card .mobile-vehicle-price {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0 var(--karento-space-1);
      margin: 0;
    }
    .mobile-vehicle-card .mobile-vehicle-price strong {
      margin: 0;
      font-size: var(--karento-type-price-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }
    .mobile-vehicle-card .mobile-vehicle-price span {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .mobile-vehicle-card.background-card .mobile-vehicle-facts {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--karento-space-1);
      min-width: 0;
      margin: 0;
      padding: var(--karento-space-2) 0 0;
      border-top: 1px solid var(--bs-border-color);
      list-style: none;
      color: var(--bs-neutral-700);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
    .mobile-vehicle-facts li {
      min-width: 0;
      max-width: 100%;
      padding: var(--karento-space-1) var(--karento-space-2);
      border-radius: var(--karento-radius-media);
      background: var(--bs-neutral-100);
      overflow-wrap: anywhere;
    }
  }
</style>
