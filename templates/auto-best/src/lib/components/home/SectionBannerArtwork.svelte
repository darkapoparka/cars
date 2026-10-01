<script lang="ts">
  import { leadSite } from '$config/lead-site';

  let { section }: { section: keyof typeof leadSite.artwork.homeSectionBanners } = $props();
</script>

<picture class="dn-section-banner-artwork" class:dn-section-banner-artwork--inventory={section === 'inventory'} aria-hidden="true">
  <source media="(min-width: 992px)" srcset={leadSite.artwork.homeSectionBanners[section]} />
  <img
    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    alt=""
    width="1440"
    height={section === 'body' ? 481 : 480}
    loading="lazy"
    decoding="async"
  />
</picture>

<style>
  .dn-section-banner-artwork { display: none; }

  @media (min-width: 992px) {
    .dn-section-banner-artwork {
      position: absolute;
      inset: 0 0 0 34%;
      z-index: 0;
      display: block;
      pointer-events: none;
      mask-image: linear-gradient(90deg, transparent, black 30%);
    }

    .dn-section-banner-artwork img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: right center;
    }

    .dn-section-banner-artwork--inventory img { object-position: right 42%; }
  }
</style>
