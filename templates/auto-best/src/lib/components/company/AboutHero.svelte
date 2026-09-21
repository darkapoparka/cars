<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

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
    src="/assets/images/section/bg-12.jpg"
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
      <h1 id="about-title">{i18n.t("m_b4b580a9ad8c")}</h1>
      <p class="dn-about-hero__lead">{i18n.t("m_b9634bb91bba", { p0: i18n.dealer('city') })}</p>
    </div>
    <a class="dn-about-button dn-about-button--primary dn-route-hero__control" href={i18n.href(resolve('/listing-grid'))}>
      <span>{i18n.t("m_9304497d3f4b")}</span>
      <Icon name="arrow-right" size={18} strokeWidth={1.8} />
    </a>
    {#if socialProfiles.some(profile => profile.href)}
    <nav class="dn-about-socials" aria-label={i18n.t("m_3931afa2068d")}>
      <span>{i18n.t("m_9200ee75efd0")}</span>
      <div class="dn-about-socials__links">
        {#each socialProfiles.filter(profile => profile.href) as profile (profile.name)}
          <a href={i18n.href(profile.href)} target="_blank" rel="noopener noreferrer" aria-label={i18n.t("m_c0b8af66cd54", { p0: profile.label })}>
            <SocialBrandIcon name={profile.name} size={28} />
          </a>
        {/each}
      </div>
    </nav>
    {/if}
  </div>
</section>

<style>
  .dn-about-socials { display: flex; flex-direction: column; align-items: center; gap: 10px; align-self: center; }
  .dn-about-socials > span { color: #c9cbd0; font-size: var(--dn-text-meta); line-height: var(--dn-leading-body); }
  .dn-about-socials__links { display: flex; gap: 16px; }
  .dn-about-socials a { display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border: 1px solid #686c73; border-radius: 50%; color: #fff; }
  .dn-about-socials a:hover { background: #fff; border-color: #fff; color: #1d1f23; }
  .dn-about-socials a:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
  @media (min-width: 992px) {
    .dn-about-socials { position: absolute; top: 390px; left: 0; width: 100%; gap: 12px; }
    .dn-about-socials a { width: 56px; height: 56px; }
  }
</style>
