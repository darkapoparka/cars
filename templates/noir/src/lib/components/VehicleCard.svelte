<script lang="ts">
  import { asset } from "$app/paths";
  import {
    attr,
    formatKm,
    formatPrice,
    type Vehicle,
  } from "#lib/data/vehicles.ts";
  import { currentLocale, paths, t } from "#lib/i18n/index.ts";

  let { vehicle, eager = false }: { vehicle: Vehicle; eager?: boolean } =
    $props();

  const locale = $derived(currentLocale());
  const m = $derived(t());
</script>

<a class="card" href={paths.vehicle(locale, vehicle.id)}>
  <div class="stage">
    <img
      src={asset(vehicle.image)}
      alt="{vehicle.make} {vehicle.model}"
      width="280"
      height="210"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
    {#if vehicle.incoming}
      <span class="status">{m.vehicle.incoming}</span>
    {/if}
  </div>
  <div class="body">
    <p class="label">{vehicle.make}</p>
    <h3 class="display">{vehicle.model}</h3>
    <ul class="specs">
      <li>{vehicle.year ?? "—"}</li>
      <li>{formatKm(vehicle.mileageKm, locale)}</li>
      <li>{attr(vehicle.fuel, locale)}</li>
    </ul>
    <div class="foot">
      <span class="price">{formatPrice(vehicle.priceEur, locale)}</span>
      <span class="go" aria-hidden="true"><span class="arrow"></span></span>
    </div>
  </div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-top: 1px solid var(--line);
    padding-top: 1.25rem;
    transition: border-color var(--fast) ease;
  }

  .card:hover {
    border-top-color: var(--text);
  }

  .stage {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--stage);
    border-radius: var(--radius);
  }

  .stage img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s var(--ease);
  }

  .card:hover img {
    transform: scale(1.04);
  }

  .status {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.375rem 0.625rem;
    background: rgb(11 11 11 / 0.72);
    backdrop-filter: blur(8px);
    color: #f4f3ef;
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 1.25rem;
  }

  h3 {
    margin-top: 0.375rem;
    font-size: var(--step-2);
  }

  .specs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0;
    margin-top: 0.875rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  .specs li + li::before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0.75em;
    margin-inline: 0.75rem;
    background: var(--line-strong);
  }

  .foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 1.25rem;
  }

  .price {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: var(--step-1);
    letter-spacing: -0.01em;
  }

  .go {
    display: inline-flex;
    color: var(--muted);
    transition: color var(--fast) ease;
  }

  .card:hover .go {
    color: var(--accent);
  }

  .card:hover .arrow {
    width: 1.75rem;
  }
</style>
