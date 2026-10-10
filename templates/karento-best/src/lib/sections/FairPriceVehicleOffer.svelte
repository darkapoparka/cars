<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section class="section-cta-7 background-body py-96 desktop-marketing-section">
  <div class="box-cta-6">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-5">
          {#if phone.current}<span
              class="mobile-section-label bg-2 text-dark mb-4"
              >{locale.t("referenceOffers.mission.title")}</span
            >
          {:else}<DemoActionLink
              class="btn btn-signin bg-2 text-dark mb-4 desktop-type-control"
              href="#!"
              aria-label={locale.t("referenceOffers.mission.title")}
              >{locale.t("referenceOffers.mission.title")}</DemoActionLink
            >{/if}
          <h4 class="mb-4 neutral-1000 desktop-section-title"
            >{locale.t("referenceOffers.mission.sell")} <br />{locale.t(
              "ui.fair-price-vehicle-offer.get-started-with-us-today",
            )}</h4
          >
          <p class="text-lg-medium neutral-500 mb-4 desktop-type-lead"
            >{locale.t("referenceOffers.mission.body")}</p
          >
          <div class="row">
            <div class="col">
              <ul class="list-ticks-green list-ticks-green-2">
                <li class="neutral-1000 pe-0"
                  >{locale.t("referenceOffers.rental.flexible")}</li
                >
                <li class="neutral-1000 pe-0"
                  >{locale.t("referenceOffers.rental.insurance")}</li
                >
                <li class="neutral-1000 pe-0"
                  >{locale.t("referenceOffers.rental.support")}</li
                >
              </ul>
            </div>
          </div>
          <DemoActionLink
            class="btn btn-primary mt-2 desktop-type-control"
            href="#!"
            aria-label={locale.t("ui.fair-price-vehicle-offer.get-started-now")}
          >
            {locale.t("ui.fair-price-vehicle-offer.get-started-now")}
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
          </DemoActionLink>
        </div>
        <div class="col-lg-6 offset-lg-1 position-relative z-1 mt-lg-0 mt-4">
          <div class="d-flex flex-column gap-4">
            <div class="d-flex gap-4">
              <div class="position-relative">
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-8/img-1.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
              <div class="mt-auto">
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-8/img-2.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
            </div>
            <div class="d-flex gap-4">
              <div class="position-relative">
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-8/img-3.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
              <div class="position-relative">
                <img
                  class="bdrd8 w-100"
                  src="/assets/imgs/cta/cta-8/img-4.png"
                  alt={locale.t("image.illustrative")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill"
    ></div>
  </div>
</section>
