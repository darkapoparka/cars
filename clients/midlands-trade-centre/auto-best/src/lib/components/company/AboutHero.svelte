<script lang="ts">
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import SocialBrandIcon from './SocialBrandIcon.svelte';

  const socialProfiles = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

<section class="dn-about-hero dn-route-hero dn-route-hero--studio dn-route-hero--charcoal" aria-labelledby="about-title">
  <HeroVehicles pair="about" />
  <picture>
  <img
    class="dn-about-hero__media"
    src="/dealer/inventory/202601169196000-1.webp"
    alt=""
    width="1920"
    height="880"
    fetchpriority="high"
    decoding="async"
  />
  </picture>
  <div class="dn-about-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-about-hero__content dn-route-hero__layout">
    <div class="dn-about-hero__copy dn-route-hero__copy">
      <h1 id="about-title">About us</h1>
      <p class="dn-about-hero__lead">Used vehicles in {brand.city} · Viewings by arrangement</p>
    </div>
    <a class="dn-about-button dn-about-button--primary dn-route-hero__control" href={resolve('/listing-grid')}>
      <span>View vehicles</span>
      <Icon name="arrow-right" size={18} strokeWidth={1.8} />
    </a>
    <nav class="dn-about-socials" aria-label="Follow us on social media">
      <span>Contact the dealership</span>
      <div class="dn-about-socials__links">
        {#each socialProfiles.filter(profile => profile.href) as profile (profile.name)}
          <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.label} — opens in a new tab`}>
            <SocialBrandIcon name={profile.name} size={28} />
          </a>
        {/each}
      </div>
    </nav>
  </div>
</section>

<style>
  .dn-about-socials { display: flex; flex-direction: column; align-items: center; gap: 10px; align-self: center; }
  .dn-about-socials > span { color: #c9cbd0; font-size: 14px; line-height: 1.5; }
  .dn-about-socials__links { display: flex; gap: 16px; }
  .dn-about-socials a { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border: 1px solid #686c73; border-radius: 50%; color: #fff; }
  .dn-about-socials a:hover { background: #fff; border-color: #fff; color: #1d1f23; }
  .dn-about-socials a:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
  @media (min-width: 992px) {
    .dn-about-socials { position: absolute; top: 390px; left: 0; width: 100%; gap: 12px; }
    .dn-about-socials a { width: 56px; height: 56px; }
  }
</style>
