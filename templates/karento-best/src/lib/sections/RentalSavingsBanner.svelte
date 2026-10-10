<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  let { servicesMobile = false }: { servicesMobile?: boolean } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

{#if servicesMobile && phone.current}
  <section class="section-box-banner-3 mobile-rental-introduction">
    <div class="container">
      <div class="rental-copy">
        <h3>{locale.t("referenceOffers.savings.title")}</h3>
        <p>{locale.t("referenceOffers.savings.body")}</p>
        <MobilePill
          label={locale.t("ui.rental-savings-banner.view-rentals")}
          variant="secondary"
          href={locale.href("/cars-list-4")}
        />
      </div>
    </div>
  </section>
{:else}
  <section class="section-box-banner-3 banner-2 background-body">
    <div class="container pt-110 pb-110 position-relative z-1">
      <div class="row justify-content-center">
        <div
          class="col-auto text-center justify-content-center d-flex flex-column align-items-center"
        >
          <h2 class="text-white desktop-banner-title"
            >{locale.t("ui.rental-savings-banner.best-car-rent-deals")}</h2
          >
          <h6 class="text-white desktop-type-lead">
            {locale.t(
              "ui.rental-savings-banner.save-15-or-more-when-you-book-and-ride",
            )} <br />
            {locale.t("referenceOffers.savings.deadline")}
          </h6>
          <DemoActionLink
            class="btn btn-primary rounded-pill btn-lg mt-20 desktop-type-control"
            href="#!"
            aria-label={locale.t(
              "ui.rental-savings-banner.find-early-2025-deals",
            )}
          >
            {locale.t("ui.rental-savings-banner.find-early-2025-deals")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12.5 19L19.5 12L12.5 5M19.5 12L5.5 12"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </DemoActionLink>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .mobile-rental-introduction {
    padding-block: var(--karento-space-8);
    background-position: center;
  }
  .rental-copy {
    position: relative;
    z-index: 1;
    display: grid;
    justify-items: start;
    gap: var(--karento-space-3);
    max-width: 28rem;
  }
  .rental-copy h3 {
    margin: 0;
    color: white;
  }
  .rental-copy p {
    margin: 0 0 var(--karento-space-2);
    color: white;
  }
  @media (min-width: 768px) {
    .rental-copy h3 {
      font-size: var(--karento-text-section);
      line-height: 1.3;
    }
    .rental-copy p {
      font-size: var(--karento-text-body);
      line-height: 1.5;
    }
  }
  @media (max-width: 767.98px) {
    .rental-copy h3 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }
    .rental-copy p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
</style>
