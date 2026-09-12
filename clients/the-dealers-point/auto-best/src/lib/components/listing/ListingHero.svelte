<script lang="ts">
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  let { count }: { count: number } = $props();
</script>

<section class="dn-listing-hero dn-route-hero dn-route-hero--studio" aria-labelledby="listing-title">
  <HeroVehicles pair="inventory" />
  <div class="dn-listing-hero__media" aria-hidden="true"></div>
  <div class="dn-listing-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-listing-hero__content dn-route-hero__layout">
    <div class="dn-listing-hero__copy dn-route-hero__copy">
      <h1 id="listing-title">Намерете своя автомобил</h1>
      <p>{count} {count === 1 ? 'автомобил' : 'автомобила'} в каталога</p>
    </div>
  </div>
</section>
