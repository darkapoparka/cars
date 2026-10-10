<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { MediaQuery } from "svelte/reactivity";
  import MobileBodyTypeRail, {
    type MobileBodyType,
  } from "#lib/components/mobile/MobileBodyTypeRail.svelte";
  let { mobileLayout = "rail" }: { mobileLayout?: "rail" | "grid" } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const bodyTypes = $derived([
    {
      id: "suv",
      label: locale.t("ui.vehicle-type-showcase.suv"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-1.png",
      width: 262,
      height: 117,
    },
    {
      id: "hatchback",
      label: locale.t("ui.vehicle-type-showcase.hatchback"),
      count: 16,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-2.png",
      width: 262,
      height: 117,
    },
    {
      id: "sedan",
      label: locale.t("ui.vehicle-type-showcase.sedan"),
      count: 150,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-3.png",
      width: 262,
      height: 117,
    },
    {
      id: "crossover",
      label: locale.t("ui.vehicle-type-showcase.crossover"),
      count: 25,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-4.png",
      width: 262,
      height: 117,
    },
    {
      id: "minivan",
      label: locale.t("ui.vehicle-type-showcase.minivan"),
      count: 56,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-5.png",
      width: 262,
      height: 117,
    },
    {
      id: "coupe",
      label: locale.t("ui.vehicle-type-showcase.coupe"),
      count: 25,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-6.png",
      width: 262,
      height: 117,
    },
    {
      id: "sport",
      label: locale.t("ui.vehicle-type-showcase.sport-cars"),
      count: 125,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-7.png",
      width: 786,
      height: 351,
    },
    {
      id: "pickup",
      label: locale.t("ui.vehicle-type-showcase.pickup-truck"),
      count: locale.t("reference.bodyTypes.browse"),
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-1/car-8.png",
      width: 262,
      height: 117,
    },
  ] as const satisfies readonly MobileBodyType[]);
</script>

{#if phone.current}
  <section class="section-box background-body py-96 desktop-collection-section">
    <div class="container">
      <MobileBodyTypeRail
        items={bodyTypes}
        layout={mobileLayout}
        actionLabel={locale.t("action.viewMore")}
        actionHref="/vehicles"
      />
    </div>
  </section>
{:else}
  <!-- prettier-ignore -->
  <section class="section-box background-body py-96 desktop-collection-section">
  <div class="container">
    <div class="row align-items-end mb-40 home-section-heading desktop-section-heading">
      <div class="col-md-8 home-section-title">
        <h3 class="neutral-1000 desktop-type-collection">{locale.t("ui.vehicle-type-showcase.browse-by-type")}</h3>
        <p class="text-xl-medium neutral-500 home-section-description desktop-type-lead"
          >{locale.t("reference.bodyTypes.intro")}</p
        >
      </div>
      <div class="col-md-4 home-section-actions">
        <div class="d-flex justify-content-md-end mt-md-0 mt-4">
          <a class="btn btn-primary desktop-type-pill desktop-section-action" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-more")}>
            {locale.t("ui.vehicle-type-showcase.view-more")}
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
    <div class="box-list-populars">
      <div class="row">
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-1.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.suv")}>{locale.t("ui.vehicle-type-showcase.suv")}</a>
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(24)}
                    >{phone.current ? "24" : "24 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-2.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.hatchback")}
                >{locale.t("ui.vehicle-type-showcase.hatchback")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(16)}
                    >{phone.current ? "16" : "16 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-3.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.sedan")}>{locale.t("ui.vehicle-type-showcase.sedan")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(150)}
                    >{phone.current ? "150" : "150 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-4.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.crossover")}
                >{locale.t("ui.vehicle-type-showcase.crossover")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(25)}
                    >{phone.current ? "25" : "25 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-5.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.minivan")}
                >{locale.t("ui.vehicle-type-showcase.minivan")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(56)}
                    >{phone.current ? "56" : "56 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-6.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.coupe")}>{locale.t("ui.vehicle-type-showcase.coupe")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(25)}
                    >{phone.current ? "25" : "25 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-7.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.sport-cars")}
                >{locale.t("ui.vehicle-type-showcase.sport-cars")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.count(125)}
                    >{phone.current ? "125" : "125 Vehicles"}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-sm-6">
          <div class="card-popular background-card">
            <div class="card-image">
              <a class="card-title" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}
                ><img
                  src="/assets/imgs/categories/categories-1/car-8.png"
                  alt={locale.t("image.illustrative")}
                /></a
              >
            </div>
            <div class="card-info">
              <a class="card-title desktop-type-compact-card" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.pickup-truck")}
                >{locale.t("ui.vehicle-type-showcase.pickup-truck")}</a
              >
              <div class="card-meta">
                <div class="meta-links"
                  ><a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.vehicles")}
                    >{phone.current ? "Browse" : locale.t("ui.vehicle-type-showcase.vehicles")}</a
                  ></div
                >
                <div class="card-button">
                  <a href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-showcase.view-details")}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{/if}
