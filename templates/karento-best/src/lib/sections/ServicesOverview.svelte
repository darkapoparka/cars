<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { MediaQuery } from "svelte/reactivity";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import ServiceSpotCard from "#lib/components/ServiceSpotCard.svelte";
  import { serviceSpots } from "#lib/data/services.ts";
  import { slider } from "#lib/vendor.ts";
  const mobile = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="section-box box-properties-area pt-96 pb-50 background-body desktop-collection-section"
>
  <div class="container">
    {#if mobile.current}
      <MobileSectionHeading
        title={locale.t("ui.services-overview.our-services")}
        description={locale.t(
          "ui.services-overview.serving-you-with-quality-comfort-and-convenience",
        )}
        actionLabel={locale.t("action.viewMore")}
        actionHref="/services"
      />
    {:else}
      <div
        class="row align-items-end mb-40 home-section-heading desktop-section-heading"
      >
        <div class="col-md-8 home-section-title">
          <h3 class="neutral-1000 desktop-type-collection"
            >{locale.t("ui.services-overview.our-services")}</h3
          >
          <p
            class="text-lg-medium neutral-500 home-section-description desktop-type-lead"
            >{locale.t(
              "ui.services-overview.serving-you-with-quality-comfort-and-convenience",
            )}</p
          >
        </div>
        <div class="col-md-4 mt-md-0 mt-4 home-section-actions">
          <div class="d-flex justify-content-md-end justify-content-center">
            <a
              class="btn btn-primary desktop-type-pill desktop-section-action"
              href={locale.href("/services")}
              aria-label={locale.t("ui.services-overview.view-more")}
            >
              {locale.t("ui.services-overview.view-more")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M8 15L15 8L8 1M15 8L1 8"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    {/if}
    <div class="box-list-featured">
      <div class="box-swiper mt-0">
        <div
          class="swiper-container swiper-group-4 swiper-group-journey"
          {@attach slider}
        >
          <div class="swiper-wrapper">
            {#each serviceSpots as spot (spot.id)}
              <div class="swiper-slide"><ServiceSpotCard {spot} /></div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
