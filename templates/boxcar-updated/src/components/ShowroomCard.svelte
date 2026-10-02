<script lang="ts">
  import { brand } from "../data/brand";
  import Icon from "./Icon.svelte";
</script>

<section class="showroom-card" aria-label={`${brand.name} showroom`}>
  {#if brand.showroomBanner}
    <img
      class="showroom-banner"
      src={brand.showroomBanner.src}
      alt={brand.showroomBanner.alt}
      width="960"
      height="540"
      loading="lazy"
      decoding="async"
    />
  {/if}
  <div class="showroom-copy">
    <h3>{brand.name} Showroom</h3>
    <p>Ask about this car or arrange a viewing.</p>
    <a class="button showroom-link" href="/contact/?intent=viewing">
      <span>Contact the showroom</span>
      <Icon name="arrow" size={20} />
    </a>
  </div>
</section>
