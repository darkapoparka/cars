<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  let { card: referenceCard }: { card: VehicleCardContent } = $props();
  const card = $derived(dealer.inventory[referenceCard.title] ?? referenceCard);
</script>

<div class="card-journey-small background-card">
  <div class="card-image">
    <img src={card.image} alt={card.imageAlt} />
  </div>
  <div class="card-info p-4 pt-30">
    <div class="card-rating">
      <div class="card-left"></div>
      <div class="card-right">
        <span class="rating text-xs-medium rounded-pill"
          >{card.rating}<span class="text-xs-medium neutral-500"
            >{card.reviews}</span
          ></span
        >
      </div>
    </div>
    <div class="card-title"
      ><a
        class="text-lg-bold neutral-1000 text-nowrap"
        href={card.href}
        aria-label={`View ${card.title}`}>{card.title}</a
      ></div
    >
    <div class="card-program">
      <div class="card-location">
        <p class="text-location text-sm-medium neutral-500">{card.location}</p>
      </div>
      <div class="card-facitlities">
        <p class="card-miles text-md-medium">{card.mileage}</p>
        <p class="card-gear text-md-medium">{card.transmission}</p>
        <p class="card-fuel text-md-medium">{card.fuel}</p>
        <p class="card-seat text-md-medium">{card.seats}</p>
      </div>
      <div class="endtime">
        <div class="card-price">
          <h6 class="text-lg-bold neutral-1000">{card.price}</h6>
          <p class="text-md-medium neutral-500">{card.pricePeriod}</p>
        </div>
        <div class="card-button"
          ><a
            class="btn btn-gray"
            href={card.href}
            aria-label={`View ${card.title}`}>{card.action}</a
          ></div
        >
      </div>
    </div>
  </div>
</div>
