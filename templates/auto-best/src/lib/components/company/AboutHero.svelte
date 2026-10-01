<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopHeroScene from '$components/ui/DesktopHeroScene.svelte';
  import HeroLocation from '$components/ui/HeroLocation.svelte';
  import DesktopSocialLinks from './DesktopSocialLinks.svelte';
</script>

<section class="dn-about-hero dn-information-hero dn-route-hero dn-route-hero--studio dn-route-hero--light" aria-labelledby="about-title">
  <DesktopHeroScene scene="about" />
  <div class="container dn-about-hero__content dn-route-hero__layout">
    <div class="dn-about-hero__copy dn-route-hero__copy">
      <h1 id="about-title">{i18n.t("m_b4b580a9ad8c")}</h1>
      <HeroLocation />
      <p class="dn-about-hero__lead">{i18n.t("m_b9634bb91bba", { p0: i18n.dealer('city') })}</p>
    </div>
    <a class="dn-about-button dn-about-button--primary dn-route-hero__control" href={i18n.href(resolve('/listing-grid'))}>
      <span>{i18n.t("m_9304497d3f4b")}</span>
      <Icon name="arrow-right" size={18} strokeWidth={1.8} />
    </a>
    <DesktopSocialLinks hero />
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .dn-about-hero :global(.dn-desktop-hero-scene) { filter: grayscale(1); }
    .dn-about-hero__lead { display: none; }
  }
</style>
