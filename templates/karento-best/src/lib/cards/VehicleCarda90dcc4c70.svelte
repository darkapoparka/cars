<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { dealer, type VehicleCardContent } from "#lib/content.ts";
  let { card: referenceCard }: { card: VehicleCardContent } = $props();
  const card = $derived(dealer.inventory[referenceCard.title] ?? referenceCard);
</script>

<div
  class="card-journey-small card-journey-small-listing-3 background-0 d-flex flex-md-row flex-column align-items-center mw-100 position-relative"
>
  <div class="card-image w-100">
    <a href={card.href} aria-label={`View ${card.title}`}>
      <img src={card.image} alt={card.imageAlt} />
    </a>
  </div>
  <div
    class="card-info p-4 mt-0 position-relative end-0 h-100 w-lg-55 rounded-12"
  >
    <div class="card-rating position-relative start-0 top-0">
      <div class="card-right">
        <span class="rating shadow-none border-0 bg-transparent"
          >{card.rating}<span class="text-sm-medium neutral-500"
            >{card.reviews}</span
          >
        </span>
      </div>
    </div>
    <div class="card-title pb-1"
      ><a
        class="heading-6 neutral-1000"
        href={card.href}
        aria-label={`View ${card.title}`}>{card.title}</a
      ></div
    >
    <div class="card-program">
      <div class="card-facitlities border-0 pb-3">
        <p class="card-miles text-md-medium">{card.mileage}</p>
        <p class="card-gear text-md-medium">{card.transmission}</p>
        <p class="card-fuel text-md-medium">{card.fuel}</p>
        <p class="card-seat text-md-medium">{card.seats}</p>
      </div>
      <div class="endtime border-top pt-4">
        <div class="card-price">
          <p class="text-md-medium neutral-500 me-2">{card.pricePeriod}</p>
          <h6 class="heading-6 neutral-1000">{card.price}</h6>
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
