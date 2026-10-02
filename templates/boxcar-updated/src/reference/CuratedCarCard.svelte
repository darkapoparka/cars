<script lang="ts">
  import { detailHref, money, number, type Vehicle } from "../lib/catalog";
  import { selections, toggleFavorite } from "../lib/state.svelte";
  let { vehicle }: { vehicle: Vehicle } = $props();
  let saved = $derived(selections.favorites.includes(vehicle.id));
</script>

<div
  class="box-car car-block-ten col-lg-3 col-md-6 col-sm-12"
  data-vehicle-id={vehicle.id}
>
  <div class="inner-box">
    <div class="image-box">
      <div class="image">
        <a href={detailHref(vehicle)} aria-label={`View ${vehicle.title}`}>
          <img
            src={vehicle.image}
            alt={vehicle.title}
            width="660"
            height="440"
          />
        </a>
      </div>
      <span>{vehicle.condition}</span>
      <button
        type="button"
        class="icon-box"
        aria-label={`${saved ? "Unsave" : "Save"} ${vehicle.title}`}
        aria-pressed={saved}
        onmousedowncapture={(event) => event.stopPropagation()}
        ontouchstartcapture={(event) => event.stopPropagation()}
        onclickcapture={(event) => {
          // Handle the real button before Slick's list click handler can consume it.
          event.stopPropagation();
          toggleFavorite(vehicle.id);
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 12 12"
          aria-hidden="true"
          fill={saved ? "currentColor" : "none"}
        >
          <path
            d="M2.2 1.1h7.6v9.8L6 8.3l-3.8 2.6V1.1Z"
            stroke="currentColor"
            stroke-width="1.1"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div class="content-box">
      <h3 class="title"><a href={detailHref(vehicle)}>{vehicle.title}</a></h3>
      <p class="curated-car-summary">
        {vehicle.year} · {vehicle.body} · {vehicle.engine}L
      </p>
      <ul>
        <li>{number(vehicle.mileage)} miles</li>
        <li>{vehicle.fuel}</li>
        <li>{vehicle.transmission}</li>
      </ul>
      <div class="btn-box">
        <small>{money(vehicle.price)}</small>
        <a href={detailHref(vehicle)} class="details">
          <span>View details</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 14"
            aria-hidden="true"
            fill="none"
          >
            <path
              d="M1 13 13 1M5 1h8v8"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>
