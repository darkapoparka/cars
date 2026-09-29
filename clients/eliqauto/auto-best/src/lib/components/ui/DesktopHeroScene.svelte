<script lang="ts">
  import { leadSite } from '$config/lead-site';

  let { scene }: { scene: keyof typeof leadSite.artwork.desktopHeroScenes } = $props();
</script>

<picture class="dn-desktop-hero-scene" data-scene={scene} aria-hidden="true">
  <source media="(min-width: 992px)" srcset={leadSite.artwork.desktopHeroScenes[scene]} />
  <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="2172" height="724" fetchpriority="high" decoding="async" />
</picture>

<style>
  .dn-desktop-hero-scene { display: none; }

  @media (min-width: 992px) {
    .dn-desktop-hero-scene { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
    img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  }

  /* Below wide desktop, use the space below navigation to keep the scene's edges in view. */
  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-desktop-hero-scene { top: 140px; }
  }
</style>
