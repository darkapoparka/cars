<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import { leadSite } from '$config/lead-site';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopHeroScene from '$components/ui/DesktopHeroScene.svelte';
  import HeroLocation from '$components/ui/HeroLocation.svelte';
  import DesktopSocialLinks from './DesktopSocialLinks.svelte';
</script>

<section class="dn-about-hero dn-information-hero dn-route-hero dn-route-hero--studio dn-route-hero--campaign" aria-labelledby="about-title">
  <DesktopHeroScene scene="about" />
  <picture class="dn-about-hero__showroom" aria-hidden="true">
    <source media="(max-width: 991px)" srcset={leadSite.artwork.routeHero.colored.showroom} />
    <img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width="1537" height="1023" fetchpriority="high" decoding="async" />
  </picture>
  <div class="container dn-about-hero__content dn-route-hero__layout">
    <div class="dn-about-hero__copy dn-route-hero__copy">
      <HeroLocation aboveTitle />
      <h1 id="about-title">{i18n.t("m_b4b580a9ad8c")}</h1>
      <p class="dn-about-hero__lead">{i18n.t("m_b9634bb91bba", { p0: i18n.dealer('city') })}</p>
    </div>
    <a class="dn-about-button dn-about-button--primary dn-route-hero__control" href={i18n.href(resolve('/listing-grid'))}>
      <span>{i18n.t("m_9304497d3f4b")}</span>
      <Icon name="arrow-right" size={18} strokeWidth={1.8} />
    </a>
    <DesktopSocialLinks hero onDark />
  </div>
</section>

<style>
  .dn-about-hero__showroom { display: none; }

  @media (max-width: 991px) {
    .dn-about-hero__showroom { display: block; width: min(calc(100% - var(--dn-space-6)), 360px); margin-inline: auto; pointer-events: none; }
    .dn-about-hero__showroom img {
      display: block;
      width: 100%;
      height: auto;
      mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 82%, transparent);
      mask-composite: intersect;
    }
  }

  @media (min-width: 992px) {
    .dn-about-hero__lead { display: none; }
  }
</style>
