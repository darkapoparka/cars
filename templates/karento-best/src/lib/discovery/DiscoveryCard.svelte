<script lang="ts">
  import { page } from "$app/state";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import type { DiscoveryCar } from "./discovery.ts";

  let { car }: { car: DiscoveryCar } = $props();
  const locale = useLocale();
  const display = $derived(presentVehicle(car, locale));
  const destination = $derived(
    car.href +
      "&returnTo=" +
      encodeURIComponent(page.url.pathname + page.url.search + page.url.hash),
  );
</script>

<article class="discovery-card">
  <a
    href={locale.href(destination)}
    aria-label={locale.t("action.viewVehicle", { vehicle: car.title })}
  >
    <div class="car-photo">
      <img src={car.image} alt={car.imageAlt} loading="lazy" decoding="async" />
    </div>
    <div class="car-copy">
      <h3 title={car.title}>{car.title}</h3>
      <p class="car-meta"
        >{car.year} <span aria-hidden="true">·</span> {display.mileage}</p
      >
      <p class="car-price"><strong>{display.price}</strong></p>
    </div>
  </a>
</article>

<style>
  @media (max-width: 767.98px) {
    .discovery-card {
      min-width: 0;
      margin: 0;
      scroll-snap-align: start;
    }
    a {
      display: block;
      color: var(--bs-neutral-1000);
      text-decoration: none;
      border-radius: var(--karento-radius-card);
    }
    a:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 3px;
    }
    .car-photo {
      aspect-ratio: 3 / 2;
      overflow: hidden;
      border-radius: var(--karento-radius-card);
      background: var(--bs-neutral-100);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .car-copy {
      display: grid;
      gap: var(--karento-space-1);
      padding-top: var(--karento-space-2);
    }
    h3 {
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }
    p {
      margin: 0;
    }
    .car-meta {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .car-price {
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-price-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }
  }
</style>
