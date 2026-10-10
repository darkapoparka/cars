<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import { slider } from "#lib/vendor.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const planningSteps = [
    {
      id: "dates",
      titleKey: "reference.services.planning.dates.title",
      descriptionKey: "reference.services.planning.dates.body",
    },
    {
      id: "vehicle",
      titleKey: "reference.services.planning.vehicle.title",
      descriptionKey: "reference.services.planning.vehicle.body",
    },
    {
      id: "details",
      titleKey: "reference.services.planning.details.title",
      descriptionKey: "reference.services.planning.details.body",
    },
  ] as const;
</script>

{#if phone.current}
  <section
    class="section-cta-7 mobile-trip-planning"
    aria-labelledby="trip-planning-title"
  >
    <div class="container">
      <div class="trip-planning-panel">
        <img
          src="/assets/imgs/cta/cta-10/img-1.png"
          alt={locale.t("reference.services.planning.image")}
          loading="lazy"
          decoding="async"
        />
        <div class="trip-planning-copy">
          <h3 id="trip-planning-title"
            >{locale.t("ui.trip-planning-carousel.plan-your-trip")}</h3
          >
          <p class="planning-introduction"
            >{locale.t("reference.services.planning.intro")}</p
          >
          <ol>
            {#each planningSteps as step (step.id)}
              <li
                ><h4>{locale.t(step.titleKey)}</h4><p
                  >{locale.t(step.descriptionKey)}</p
                ></li
              >
            {/each}
          </ol>
          <MobilePill
            label={locale.t("ui.trip-planning-carousel.contact-us")}
            variant="secondary"
            href={locale.href("/contact#contact-enquiry")}
          />
        </div>
      </div>
    </div>
  </section>
{:else}
  <section class="section-cta-7 background-body">
    <div class="box-cta-6">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="box-swiper">
              <div class="swiper-container swiper-group-1" {@attach slider}>
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <img
                      class="rounded-12"
                      src="/assets/imgs/cta/cta-10/img-1.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </div>
                  <div class="swiper-slide">
                    <img
                      class="rounded-12"
                      src="/assets/imgs/cta/cta-10/img-1.png"
                      alt={locale.t("image.illustrative")}
                    />
                  </div>
                </div>
                <div class="position-absolute end-0 bottom-0 p-40">
                  <div
                    class="box-button-slider box-button-slider-team justify-content-end"
                  >
                    <div
                      class="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2"
                      tabindex="0"
                      role="button"
                      aria-label={locale.t(
                        "ui.trip-planning-carousel.previous-slide",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666"
                          stroke=""
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <div
                      class="swiper-button-next swiper-button-next-style-1 swiper-button-next-2"
                      tabindex="0"
                      role="button"
                      aria-label={locale.t(
                        "ui.trip-planning-carousel.next-slide",
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992"
                          stroke=""
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 ps-lg-5 mt-lg-0 mt-4">
            <h4 class="mb-4 neutral-1000 desktop-type-section"
              >{locale.t(
                "ui.trip-planning-carousel.plan-your-trip-with-us",
              )}</h4
            >
            <p class="text-lg-medium neutral-500 mb-4 desktop-type-lead"
              >{locale.t(
                "ui.trip-planning-carousel.let-us-help-you-make-your-next-journey-smooth",
              )}</p
            >
            <div class="row">
              <div class="col">
                <ul class="list-ticks-green list-ticks-green-2">
                  <li class="neutral-1000 pe-0 desktop-type-body"
                    >{locale.t("reference.services.planning.descriptions")}</li
                  >
                  <li class="neutral-1000 pe-0 desktop-type-body"
                    >{locale.t("reference.services.planning.filters")}</li
                  >
                  <li class="neutral-1000 pe-0 desktop-type-body"
                    >{locale.t("reference.services.planning.availability")}</li
                  >
                </ul>
              </div>
            </div>
            <DemoActionLink
              class="btn btn-primary mt-2 desktop-type-control"
              href="#!"
              aria-label={locale.t("ui.trip-planning-carousel.get-started-now")}
            >
              {locale.t("ui.trip-planning-carousel.get-started-now")}
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
        </div>
      </div>
      <div
        class="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill"
      ></div>
    </div>
  </section>
{/if}

<style>
  .mobile-trip-planning {
    padding-block: var(--karento-space-6);
  }
  .trip-planning-panel {
    overflow: hidden;
    border: 1px solid var(--karento-border-tool);
    border-radius: var(--karento-radius-card);
    background: var(--karento-surface-tool);
  }
  .trip-planning-panel > img {
    display: block;
    width: 100%;
    aspect-ratio: var(--karento-image-wide);
    object-fit: cover;
    object-position: center top;
  }
  .trip-planning-copy {
    display: grid;
    justify-items: start;
    gap: var(--karento-space-3);
    padding: var(--karento-space-4);
  }
  h3 {
    margin: 0;
  }
  .planning-introduction,
  li p {
    margin: 0;
    color: var(--bs-neutral-500);
  }
  ol {
    list-style: decimal;
    display: grid;
    gap: var(--karento-space-4);
    margin: var(--karento-space-2) 0;
    padding-left: var(--karento-space-6);
  }
  li::marker {
    color: var(--bs-neutral-500);
  }
  li h4 {
    margin: 0 0 var(--karento-space-1);
  }
  @media (min-width: 768px) {
    h3 {
      font-size: var(--karento-text-section);
      line-height: 1.3;
    }
    .planning-introduction,
    li p {
      font-size: var(--karento-text-body);
      line-height: 1.45;
    }
    li::marker {
      font-size: var(--karento-text-body);
      font-weight: 600;
    }
    li h4 {
      font-size: var(--karento-text-card-title);
      line-height: 1.3;
    }
  }
  @media (max-width: 767.98px) {
    h3 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }
    .planning-introduction,
    li p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    li::marker {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-pill-weight);
      line-height: var(--karento-type-body-leading);
    }
    li h4 {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }
  }
</style>
