<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  let { compactMobile = false }: { compactMobile?: boolean } = $props();
  import { dealer } from "#lib/content.ts";
  const mobile = new MediaQuery("(max-width: 767.98px)");
</script>

<div
  class="karento-home-brands background-100 desktop-collection-section"
  data-brand-source="index"
  class:compact-mobile-brands={compactMobile && mobile.current}
>
  <div class="container">
    <div class="box-search-category"
      >{#if mobile.current && compactMobile}
        <MobileSectionHeading
          title={locale.t("ui.home-brand-links.popular-brands")}
          actionLabel={locale.t("action.viewMore")}
          actionHref="/vehicles"
        />
      {:else}<div class="karento-brands-heading desktop-section-heading">
          <h3 class="heading-3 neutral-1000 desktop-type-collection"
            >{locale.t("ui.home-brand-links.popular-brands")}</h3
          >
          <p
            class="text-lg-medium neutral-500 home-section-description desktop-type-lead"
            >{dealer.copy["home.brandsIntro"] ??
              "Explore a range of leading car manufacturers."}</p
          >
          {#if mobile.current}
            <MobilePill
              label={locale.t("ui.home-brand-links.view-all-vehicles")}
              href={locale.href("/vehicles")}
              variant="secondary"
            />
          {:else}
            <a
              href={locale.href("/vehicles")}
              class="text-sm-bold neutral-1000 home-brands-browse"
              aria-label={locale.t("ui.home-brand-links.view-all-vehicles")}
              >{locale.t("ui.home-brand-links.view-all-vehicles")}
              <span aria-hidden="true">↗</span></a
            >
          {/if}
        </div>{/if}
      <ul
        class="karento-brands-grid"
        aria-label={locale.t("ui.home-brand-links.sample-car-brands")}
        {@attach compactMobile && mobile.current ? focusableScroll : undefined}
      >
        <li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/lexus.png"
            alt="Lexus"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/mer.png"
            alt="Mercedes-Benz"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/bugatti.png"
            alt="Bugatti"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/jaguar.png"
            alt="Jaguar"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/honda.png"
            alt="Honda"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/chevrolet.png"
            alt="Chevrolet"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/acura.png"
            alt="Acura"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/bmw.png"
            alt="BMW"
            loading="lazy"
            decoding="async"
          /></li
        ><li class="karento-brand-logo"
          ><img
            src="/assets/imgs/page/homepage2/toyota.png"
            alt="Toyota"
            loading="lazy"
            decoding="async"
          /></li
        >
      </ul></div
    >
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .compact-mobile-brands .box-search-category {
      margin-top: 0;
    }
    .compact-mobile-brands .karento-brands-grid {
      margin-top: var(--karento-space-3);
      scrollbar-width: none;
    }
    .compact-mobile-brands .karento-brands-grid::-webkit-scrollbar {
      display: none;
    }
    .compact-mobile-brands .karento-brands-grid:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: var(--karento-space-1);
    }
  }
  @media (min-width: 992px) {
    .box-search-category {
      margin-top: 0;
    }
    .karento-brands-grid {
      margin-top: 0;
    }
  }
</style>
