<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PromotionCard from "#lib/components/PromotionCard.svelte";
  import { rentalPromotions } from "#lib/data/promotions.ts";
</script>

<section
  class="section-box-banner-2 background-body py-96 desktop-marketing-section"
>
  <div class="container">
    <div class="row">
      {#each rentalPromotions as promotion (promotion.id)}
        <div class="col-lg-6"><PromotionCard {promotion} /></div>
      {/each}
    </div>
  </div>
</section>
