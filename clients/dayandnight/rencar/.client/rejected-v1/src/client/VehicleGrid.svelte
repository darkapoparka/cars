<script>
  import {vehicles,detailUrl} from './data.js';
  let {items=vehicles,limit=6,returnTo='/car.html'}=$props();
</script>
<div class="dn-vehicle-grid">
  {#each items.slice(0,limit) as vehicle (vehicle.id)}
    <article class="car-item dn-vehicle-card">
      <a class="car-img" href={detailUrl(vehicle,returnTo)} aria-label={`Разгледайте ${vehicle.title}`}>
        <img src={vehicle.image} alt={vehicle.title} loading="lazy" width="1600" height="1067" />
        <span class="dn-body-tag">{vehicle.body}</span>
      </a>
      <div class="car-content">
        <h3 class="car-title"><a href={detailUrl(vehicle,returnTo)}>{vehicle.title}</a></h3>
        <div class="dn-car-specs"><span><i class="fal fa-gas-pump" aria-hidden="true"></i>{vehicle.fuel}</span><span><i class="fal fa-cog" aria-hidden="true"></i>{vehicle.transmission}</span></div>
        <div class="car-footer"><span class="car-price">{vehicle.priceLabel}</span><a class="dn-card-link" href={detailUrl(vehicle,returnTo)}>Детайли <i class="far fa-arrow-up-right" aria-hidden="true"></i></a></div>
      </div>
    </article>
  {/each}
</div>
