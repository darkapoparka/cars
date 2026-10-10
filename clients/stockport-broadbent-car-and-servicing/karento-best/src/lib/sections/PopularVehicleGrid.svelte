<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { stockNotice } from "#lib/i18n/dealer.ts";
  import { dealer } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  import { referenceVehicles } from "#lib/data/vehicles.ts";
  import PopularVehicleFilters from "#lib/components/vehicles/PopularVehicleFilters.svelte";
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  const mobile = new MediaQuery("(max-width: 767.98px)");
</script>

<section class="section-box background-body py-96 desktop-collection-section">
  <div class="container">
    <div
      class="row align-items-end home-section-heading home-section-heading--filters desktop-section-heading"
    >
      <div class="col-lg-6 mb-30 text-center text-lg-start home-section-title">
        <h2 class="neutral-1000 desktop-type-collection"
          >{locale.t("ui.popular-vehicle-grid.popular-vehicles")}</h2
        >
        <p
          class="text-xl-medium neutral-500 home-section-description desktop-type-lead"
          >{dealer.businessPreview
            ? stockNotice(dealer.businessPreview, locale)
            : locale.t(
                "ui.popular-vehicle-grid.favorite-vehicles-based-on-customer-reviews",
              )}</p
        >
      </div>
      <div class="col-lg-6 mb-30 home-section-actions">
        <PopularVehicleFilters />
      </div>
    </div>
    {#if mobile.current}
      <div
        class="mobile-home-vehicles"
        role="region"
        aria-label={locale.t("ui.popular-vehicle-grid.popular-vehicles-7dcd98")}
      >
        {#each referenceVehicles.popularVehicles.slice(0, 3) as card (card.title)}
          <VehicleGridCard {card} />
        {/each}
      </div>
    {:else}
      <div
        class="row mobile-vehicle-rail"
        role={mobile.current ? "region" : undefined}
        aria-label={mobile.current
          ? locale.t("ui.popular-vehicle-grid.popular-vehicles-7dcd98")
          : undefined}
        {@attach focusableScroll}
      >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[0]}<VehicleGridCard card={referenceVehicles.popularVehicles[0]} />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[1]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[1]}
          />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[2]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[2]}
          />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[3]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[3]}
          />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[4]}<VehicleGridCard card={referenceVehicles.popularVehicles[4]} />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[5]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[5]}
          />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[6]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[6]}
          />{/if}</div
        >
        <div class="col-lg-3 col-md-6">
          {#if referenceVehicles.popularVehicles[7]}<VehicleGridCard
            nowrapTitle={false}
            card={referenceVehicles.popularVehicles[7]}
          />{/if}</div
        >
      </div>
    {/if}
    <div class="d-flex justify-content-center">
      {#if mobile.current}
        <MobilePill
          label={locale.t("ui.popular-vehicle-grid.load-more-cars")}
          href={locale.href("/vehicles")}
          variant="secondary"
        />
      {:else}
        <a
          class="btn btn-brand-2 text-nowrap desktop-type-control desktop-panel-action"
          href={locale.href("/vehicles")}
          aria-label={locale.t("ui.popular-vehicle-grid.load-more-cars")}
        >
          <svg
            class="me-2"
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <g clip-path="url(#clip0_117_4717)">
              <path
                d="M4.4024 14.0977C1.60418 11.2899 1.60418 6.71576 4.4024 3.90794L5.89511 5.40064V0.90332H1.39779L3.13528 2.64081C-0.378102 6.1494 -0.378102 11.8562 3.13528 15.3696C5.35275 17.5823 8.43896 18.403 11.2996 17.8175V15.9648C8.91413 16.584 6.26949 15.9648 4.4024 14.0977Z"
                fill="#101010"
              ></path>
              <path
                d="M15.864 2.64036C13.6465 0.418093 10.5603 -0.402657 7.69971 0.182907V2.03559C10.0852 1.41643 12.7346 2.04519 14.5969 3.90748C17.4047 6.71531 17.4047 11.2894 14.5969 14.0973L13.1042 12.6045V17.1067H17.6063L15.8688 15.3692C19.3774 11.8558 19.3774 6.14894 15.864 2.64036Z"
                fill="#101010"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_117_4717">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0.5)"
                ></rect>
              </clipPath>
            </defs>
          </svg>
          {locale.t("ui.popular-vehicle-grid.load-more-cars")}
        </a>
      {/if}
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-section-heading > .mb-30 {
      margin-bottom: 0 !important;
    }
  }
</style>
