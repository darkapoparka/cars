<script lang="ts">
  import { leadSite } from '$config/lead-site';
  import CampaignVehiclePair from './CampaignVehiclePair.svelte';

  let { scene }: { scene: keyof typeof leadSite.artwork.desktopHeroScenes } = $props();
  const artwork = $derived(leadSite.artwork.desktopHeroScenes[scene]);
  const discoveryBackground = $derived(artwork.kind === 'vehicles' && (scene === 'home' || scene === 'inventory' || scene === 'blog'));
</script>

<div class="dn-desktop-hero-scene" class:dn-desktop-hero-scene--discovery={discoveryBackground} class:dn-desktop-hero-scene--image={artwork.kind === 'image'}
  data-scene={scene} data-artwork={artwork.kind} aria-hidden="true">
  {#if artwork.kind === 'image'}
    <picture>
      <source media="(min-width: 992px)" srcset={artwork.src} />
      <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="2160" height="720" fetchpriority="high" decoding="async" />
    </picture>
  {:else}
    <CampaignVehiclePair pair={artwork.pair} framing={scene === 'home' || scene === 'inventory' || scene === 'blog' ? 'search' : 'hero'} decoration={!discoveryBackground} priority />
  {/if}
</div>

<style>
  .dn-desktop-hero-scene { display: none; }

  @media (min-width: 992px) {
    .dn-desktop-hero-scene { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    .dn-desktop-hero-scene--discovery {
      background-image: radial-gradient(ellipse at 50% 24%, var(--dn-theme-hero-surface-mid) 0%, var(--dn-theme-hero-surface-deep) 68%);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .dn-desktop-hero-scene--image { background: var(--dn-theme-hero-surface-deep); }
    picture { display: contents; }
    /* Anchor the scene's floor instead of recropping the cars to the hero height. */
    img {
      position: absolute;
      top: calc(100% - 50px);
      left: 50%;
      width: max(100%, 1200px);
      max-width: none;
      height: auto;
      transform: translate(-50%, -86%);
      mask-image: linear-gradient(to bottom, transparent, #000 var(--dn-space-6));
    }
  }

  /* Below wide desktop, use the space below navigation to keep the scene's edges in view. */
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-desktop-hero-scene:not(.dn-desktop-hero-scene--image) { top: 140px; }
  }
</style>
