<svelte:options runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DealershipVehicleSearch from "#lib/components/search/DealershipVehicleSearch.svelte";
  const image = $derived(
    dealer.hero?.desktopImage ??
      "/assets/imgs/hero/hero-3/dealership-desktop.webp",
  );
</script>

<div class="desktop-hero-frame container">
  <section
    class="dealership-hero"
    aria-label={locale.t("ui.desktop-dealership-hero.find-your-next-car")}
  >
    <picture class="hero-artwork">
      <source media="(min-width: 992px)" srcset={image} />
      <img
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt={dealer.hero?.imageAlt ?? locale.t("image.illustrative")}
        width="2172"
        height="724"
        fetchpriority="high"
        decoding="async"
      />
    </picture>
    <div class="hero-shade"></div>
    <div class="hero-content">
      <h1 class="desktop-hero-title"
        >{dealer.businessPreview
          ? locale.t("dealer.home.heading")
          : dealer.contentStatus === "reference-demo"
            ? locale.t(
                "ui.desktop-dealership-hero.discover-your-next-car-today",
              )
            : (dealer.copy["home.hero"] ??
              locale.t(
                "ui.desktop-dealership-hero.discover-your-next-car-today",
              ))}</h1
      >
      <div class="hero-search"><DealershipVehicleSearch /></div>
      <a class="hero-help" href={locale.href("/contact")}
        >{locale.t("ui.desktop-dealership-hero.need-help-choosing")}</a
      >
    </div>
  </section>
</div>

<style>
  .desktop-hero-frame {
    display: none;
  }
  @media (min-width: 992px) {
    .desktop-hero-frame {
      display: block;
      padding-top: 30px;
    }
    .dealership-hero {
      display: block;
      position: relative;
      width: 100%;
      height: var(--karento-desktop-hero-height);
      margin: 0 auto;
      border-radius: 20px;
      background: #24282c;
      isolation: isolate;
      z-index: 20;
    }
    .hero-artwork,
    .hero-shade {
      position: absolute;
      inset: 0;
      border-radius: inherit;
    }
    .hero-artwork {
      overflow: hidden;
      z-index: -2;
    }
    .hero-artwork img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: right bottom;
    }
    .hero-shade {
      background: linear-gradient(
        90deg,
        rgb(0 0 0 / 36%) 0%,
        rgb(0 0 0 / 18%) 55%,
        rgb(0 0 0 / 4%) 100%
      );
      z-index: -1;
    }
    .hero-content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: min(960px, calc(100% - 96px));
      height: 100%;
      margin: 0 auto;
      color: #fff;
      text-align: center;
    }
    h1 {
      margin: 0 0 var(--karento-desktop-space-6);
      color: #fff;
      font-size: var(--karento-desktop-hero-title-size);
      line-height: var(--karento-type-hero-leading);
    }
    .hero-search {
      width: 100%;
      margin: 0;
    }
    .hero-help {
      display: inline-flex;
      align-self: center;
      align-items: center;
      width: fit-content;
      min-height: 36px;
      margin: var(--karento-desktop-space-4) auto 0;
      color: #fff;
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-body-small-leading);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .hero-content {
      width: calc(100% - 64px);
    }
  }
</style>
