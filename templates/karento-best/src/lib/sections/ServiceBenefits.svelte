<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { tick } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";
  import { MediaQuery } from "svelte/reactivity";
  import {
    serviceCards,
    serviceFilters,
    type ServiceCardContent,
    type ServiceFilterId,
  } from "#lib/data/services.ts";
  import MobileServiceCard from "#lib/components/mobile/MobileServiceCard.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import DesktopServices from "#lib/components/services/DesktopServices.svelte";
  let {
    query = $bindable(""),
    category = $bindable<ServiceFilterId>("all"),
    onclear,
  }: {
    query?: string;
    category?: ServiceFilterId;
    onclear?: () => void;
  } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const suppliedServiceCards: readonly ServiceCardContent[] = serviceCards;
  const search = $derived(query.trim().toLowerCase());
  const matchingServices = $derived(
    suppliedServiceCards.filter((service) =>
      `${service.title} ${service.titleKey ? locale.t(service.titleKey) : service.title} ${service.summaryKey ? locale.t(service.summaryKey) : service.summary} ${service.descriptionKey ? locale.t(service.descriptionKey) : service.description}`
        .toLowerCase()
        .includes(search),
    ),
  );
  const services = $derived(
    matchingServices.filter(
      (service) => category === "all" || service.category === category,
    ),
  );
  const categoryLabel = $derived(
    locale.t(
      serviceFilters.find((filter) => filter.id === category)?.labelKey ??
        "reference.dynamic.service-filters.all.label",
    ),
  );
  const countLabel = $derived(locale.count(services.length, "services"));
  const resultLabel = $derived(
    `${category === "all" ? "" : `${categoryLabel} · `}${countLabel}${search ? ` · “${query.trim()}”` : ""}`,
  );
  const filters = $derived(
    serviceFilters.map((filter) => ({
      ...filter,
      count: matchingServices.filter(
        (service) => filter.id === "all" || service.category === filter.id,
      ).length,
    })),
  );
  const removeCategory: MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    const rail = event.currentTarget
      .closest("section")
      ?.querySelector(".mobile-service-filters");
    const selector = Array.from(
      rail?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    ).find((button) => button.getAttribute("aria-label") === categoryLabel);
    category = "all";
    await tick();
    selector?.focus({ preventScroll: true });
  };
</script>

{#if desktop.current}
  <DesktopServices bind:query bind:category {onclear} />
{:else}
  <section class="section-box background-body py-96 karento-service-benefits">
    <div class="container">
      <div class="row align-items-end">
        <div class="col-lg-7">
          <h3 class="neutral-1000"
            >{#if phone.current}{locale.t(
                "ui.service-benefits.browse-services",
              )}{:else}{locale.t("reference.services.heading.prefix")}&#32;<span
                class="text-primary"
                >{locale.t("reference.services.heading.middle")}</span
              >
              {locale.t("reference.services.heading.suffix")}{/if}</h3
          >
        </div>
        <div class="col-lg-5">
          <p class="text-lg-medium neutral-500 desktop-type-lead"
            >{#if phone.current}{locale.t(
                "ui.service-benefits.rentals-transfers-and-vehicle-support",
              )}{:else}{locale.t(
                "reference.services.heading.description",
              )}{/if}</p
          >
        </div>
      </div>
      {#if phone.current}
        <MobilePillRail
          label={locale.t("ui.service-benefits.service-categories")}
          class="mobile-service-filters"
        >
          {#each filters as filter (filter.id)}
            <MobilePill
              label={locale.t(filter.labelKey)}
              ariaLabel={locale.t(filter.labelKey)}
              count={filter.count}
              showZeroCount
              selected={category === filter.id}
              pressed={category === filter.id}
              onclick={() => (category = filter.id)}
            />
          {/each}
        </MobilePillRail>
        <div class="service-results">
          <p
            class={category === "all"
              ? "mobile-result-count"
              : "visually-hidden"}
            data-service-count
            role="status"
            aria-label={resultLabel}
            aria-live="polite"
            aria-atomic="true"
            title={resultLabel}
          >
            {category === "all" ? countLabel : resultLabel}
          </p>
          {#if category !== "all"}
            <MobilePill
              label={categoryLabel}
              ariaLabel={locale.t("reference.services.removeFilter", {
                category: categoryLabel,
              })}
              trailingIcon="close"
              variant="secondary"
              onclick={removeCategory}
            />
          {/if}
        </div>
        {#if services.length}
          <div class="mobile-service-list">
            {#each services as service (service.id)}
              <MobileServiceCard {service} />
            {/each}
          </div>
        {:else}
          <div class="mobile-service-empty">
            <h4 class="neutral-1000"
              >{locale.t("ui.service-benefits.no-matching-services")}</h4
            >
            <p class="neutral-500"
              >{locale.t(
                "ui.service-benefits.try-another-service-name-or-category",
              )}</p
            >
          </div>
        {/if}
      {:else}
        <div class="row mt-50">
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-1.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.daily-weekly.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.daily-weekly.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-2.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.long-term.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.long-term.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.long-term.description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-3.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "ui.service-benefits.luxury-car-rentals",
                    )}>{locale.t("ui.service-benefits.luxury-car-rentals")}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.luxury.description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-4.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.vip-transfer.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.vip-transfer.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-5.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.chauffeur.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.chauffeur.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-6.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.airport.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.airport.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-7.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.concierge.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.concierge.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-8.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.roadside.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.roadside.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="card-news background-card mb-24">
              <div class="card-image">
                <a
                  class="d-block"
                  href={locale.href("/news/article")}
                  aria-label={locale.t("ui.service-benefits.read-article")}
                  ><img
                    src="/assets/imgs/services/services-list-1/img-9.png"
                    alt={locale.t("image.illustrative")}
                  /></a
                >
              </div>
              <div class="card-info">
                <div class="card-title mb-3">
                  <a
                    class="text-xl-bold neutral-1000 d-block"
                    href={locale.href("/news/article")}
                    aria-label={locale.t(
                      "reference.dynamic.service-cards.custom-packages.title",
                    )}
                    >{locale.t(
                      "reference.dynamic.service-cards.custom-packages.title",
                    )}</a
                  >
                  <p class="text-md-medium neutral-500 mt-2 desktop-type-body"
                    >{locale.t(
                      "reference.dynamic.service-cards.rental-description",
                    )}</p
                  >
                </div>
                <div class="card-program">
                  <div class="endtime">
                    <div class="card-button"
                      ><a
                        class="btn btn-primary2 desktop-type-control"
                        href={locale.href("/news/article")}
                        aria-label={locale.t(
                          "ui.service-benefits.view-details",
                        )}>{locale.t("ui.service-benefits.view-details")}</a
                      ></div
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}

<style>
  @media (max-width: 767.98px) {
    .mobile-service-list {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--karento-space-3);
    }
    .service-results {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: var(--karento-space-3);
      min-block-size: var(--karento-touch-target);
    }
    .service-results .mobile-result-count {
      margin: 0;
      white-space: nowrap;
    }
  }
</style>
