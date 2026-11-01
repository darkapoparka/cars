<script lang="ts">
  import { money, type Car } from "../showroom";
  import Icon from "./Icon.svelte";
  let { car, list = false }: { car: Car; list?: boolean } = $props();
</script>

<article class={["dn-car-card", { "dn-list-card": list }]}>
  <a
    class="dn-car-photo"
    href={"/vehicle?id=" + encodeURIComponent(car.id)}
    data-sveltekit-reload
    aria-label={"View " + car.title}
  >
    <img
      src={car.image}
      alt={car.title}
      loading="lazy"
      width="640"
      height="480"
    />
    {#if car.expectedImport}<span class="dn-import-badge">Expected import</span
      >{/if}
  </a>
  <div class="dn-car-info">
    <h3>
      <a
        href={"/vehicle?id=" + encodeURIComponent(car.id)}
        data-sveltekit-reload
        title={car.originalTitle}>{car.title}</a
      >
    </h3>
    <p class="dn-car-specs">
      {car.year}<span>·</span>{new Intl.NumberFormat("en-GB").format(
        car.mileage,
      )} km
    </p>
    <p class="dn-car-extra">
      {car.fuel}{car.transmission
        ? " · " + car.transmission
        : ""}{#if list && car.power}<span> · {car.power} hp</span>{/if}
    </p>
    <div class="dn-car-bottom">
      <strong>{money(car.priceAmount, car.currency)}</strong><a
        class="dn-card-view"
        href={"/vehicle?id=" + encodeURIComponent(car.id)}
        data-sveltekit-reload
        aria-label={"View details for " + car.title}
        ><span>View</span><Icon name="arrow" size={18} /></a
      >
    </div>
  </div>
</article>
