<script lang="ts">
  import { type Vehicle, detailHref, money, number } from "../lib/catalog";
  import {
    selections,
    toggleFavorite,
    toggleCompare,
  } from "../lib/state.svelte";
  import Icon from "./Icon.svelte";
  import { route } from "../lib/router.svelte";
  let {
    vehicle,
    layout = "grid",
    dark = false,
  }: { vehicle: Vehicle; layout?: string; dark?: boolean } = $props();
  let destination = $derived(detailHref(vehicle, route.path + route.search));
  let compared = $derived(selections.compare.includes(vehicle.id));
</script>

<article class="vehicle-card {layout}" class:dark data-vehicle-id={vehicle.id}>
  <div class="vehicle-image">
    <img
      src={vehicle.image}
      alt={vehicle.title}
      loading="lazy"
      width="660"
      height="440"
    />
    {#if vehicle.badge}<span
        class="vehicle-badge"
        class:green={vehicle.badge === "Great Price"}
      >
        {vehicle.badge}
      </span>{/if}
    <button
      class="save-button"
      class:selected={selections.favorites.includes(vehicle.id)}
      aria-label={`${selections.favorites.includes(vehicle.id) ? "Unsave" : "Save"} ${vehicle.title}`}
      aria-pressed={selections.favorites.includes(vehicle.id)}
      onclick={() => toggleFavorite(vehicle.id)}
    >
      <Icon name="bookmark" size={16} />
    </button>
  </div>
  <div class="vehicle-content">
    <h3><a class="vehicle-card-link" href={destination}>{vehicle.title}</a></h3>
    <p class="vehicle-subtitle">
      {vehicle.year} · {vehicle.engine}L · {vehicle.condition}
    </p>
    <ul class="vehicle-specs">
      <li>
        <span class="boxcar-symbol" aria-hidden="true">&#xf106;</span>
        {number(vehicle.mileage)} miles
      </li>
      <li>
        <span class="boxcar-symbol" aria-hidden="true">&#xf107;</span>
        {vehicle.fuel}
      </li>
      <li>
        <span class="boxcar-symbol" aria-hidden="true">&#xf105;</span>
        {vehicle.transmission}
      </li>
    </ul>
    <div class="vehicle-bottom">
      <strong>{money(vehicle.price)}</strong>
      <div class="vehicle-card-actions">
        <button
          class="compare-button"
          aria-label={compared
            ? `Remove ${vehicle.title} from comparison`
            : `Compare ${vehicle.title}`}
          aria-pressed={compared}
          onclick={() => toggleCompare(vehicle.id)}
        >
          <Icon name="compare" size={18} />{compared ? "Compared" : "Compare"}
        </button>
        <span class="vehicle-card-cue" aria-hidden="true">
          <Icon name="arrow" size={20} />
        </span>
      </div>
    </div>
  </div>
</article>
