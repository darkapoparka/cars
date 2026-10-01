<script lang="ts">
  import { leadSite } from '$config/lead-site';
  import CampaignVehiclePair from './CampaignVehiclePair.svelte';

  let { scene }: { scene: keyof typeof leadSite.artwork.desktopHeroScenes } = $props();
  const artwork = $derived(leadSite.artwork.desktopHeroScenes[scene]);
</script>

<div class="dn-desktop-hero-scene" data-scene={scene} data-artwork={artwork.kind} aria-hidden="true">
  {#if artwork.kind === 'image'}
    <picture>
      <source media="(min-width: 992px)" srcset={artwork.src} />
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="2160" height="720" fetchpriority="high" decoding="async" />
    </picture>
  {:else}
    <CampaignVehiclePair pair={artwork.pair} priority />
  {/if}
</div>

<style>
  .dn-desktop-hero-scene { display: none; }

  @media (min-width: 992px) {
    .dn-desktop-hero-scene { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    picture { display: contents; }
    img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  }

  /* Below wide desktop, use the space below navigation to keep the scene's edges in view. */
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-desktop-hero-scene { top: 140px; }
  }
</style>
