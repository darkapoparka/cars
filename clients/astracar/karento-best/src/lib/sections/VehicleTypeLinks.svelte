<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileBodyTypeRail, {
    type MobileBodyType,
  } from "#lib/components/mobile/MobileBodyTypeRail.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const bodyTypes = $derived([
    {
      id: "crossover",
      label: locale.t("ui.vehicle-type-links.crossover"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/cross-over.png",
      width: 500,
      height: 243,
    },
    {
      id: "hatchback",
      label: locale.t("ui.vehicle-type-links.hatchback"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/hatchback.png",
      width: 500,
      height: 243,
    },
    {
      id: "sedan",
      label: locale.t("ui.vehicle-type-links.sedan"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/sedan.png",
      width: 500,
      height: 243,
    },
    {
      id: "suv",
      label: locale.t("ui.vehicle-type-links.suv"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/SUV.png",
      width: 500,
      height: 243,
    },
    {
      id: "sport",
      label: locale.t("ui.vehicle-type-links.sport"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/sport.png",
      width: 500,
      height: 243,
    },
    {
      id: "minivan",
      label: locale.t("ui.vehicle-type-links.minivan"),
      count: 24,
      href: "/vehicles",
      image: "/assets/imgs/categories/categories-2/minivan.png",
      width: 500,
      height: 243,
    },
  ] as const satisfies readonly MobileBodyType[]);
</script>

{#if phone.current}
  <section
    class="section-box background-body py-96 border-bottom desktop-collection-section"
  >
    <div class="container">
      <MobileBodyTypeRail
        items={bodyTypes}
        actionLabel={locale.t("action.viewAll")}
        actionHref="/vehicles"
      />
    </div>
  </section>
{:else}
  <!-- prettier-ignore -->
  <section class="section-box background-body py-96 border-bottom desktop-collection-section">
  <div class="container">
    <div class="row align-items-end mb-40 desktop-section-heading">
      <div class="col-md-8">
        <h3 class="neutral-1000 desktop-type-collection">{locale.t("ui.vehicle-type-links.browse-by-type")}</h3>
        <p class="text-xl-medium neutral-500 desktop-type-lead"
          >{locale.t("reference.bodyTypes.intro")}</p
        >
      </div>
      <div class="col-md-4">
        <div class="d-flex justify-content-md-end mt-md-0 mt-4">
          <a class="btn btn-primary desktop-type-pill desktop-section-action" href={locale.href("/vehicles")} aria-label={locale.t("ui.vehicle-type-links.view-all")}>
            {locale.t("ui.vehicle-type-links.view-all")}
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
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/cross-over.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.crossover")}>{locale.t("ui.vehicle-type-links.crossover")}</a
          >
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/hatchback.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.hatchback")}>{locale.t("ui.vehicle-type-links.hatchback")}</a
          >
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/sedan.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.sedan")}>{locale.t("ui.vehicle-type-links.sedan")}</a
          >
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/SUV.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.suv")}>{locale.t("ui.vehicle-type-links.suv")}</a
          >
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/sport.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.sport")}>{locale.t("ui.vehicle-type-links.sport")}</a
          >
        </div>
        <div class="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3">
          <div class="card-popular background-100 position-relative">
            <a
              href={locale.href("/vehicles")}
              class="card-image border-0"
              aria-label={locale.t("ui.vehicle-type-links.view-details")}
              ><img
                src="/assets/imgs/categories/categories-2/minivan.png"
                alt={locale.t("image.illustrative")}
              /></a
            >
            <div class="card-info">
              <div
                class="card-meta position-absolute top-100 start-50 translate-middle"
              >
                <div class="meta-links"
                  ><a
                    class="background-0"
                    href={locale.href("/vehicles")}
                    aria-label={locale.count(24)}>{locale.count(24)}</a
                  ></div
                >
              </div>
            </div>
          </div>
          <a
            class="card-title text-lg-bold neutral-1000 desktop-type-compact-card"
            href={locale.href("/vehicles")}
            aria-label={locale.t("ui.vehicle-type-links.minivan")}>{locale.t("ui.vehicle-type-links.minivan")}</a
          >
        </div>
      </div>
    </div>
  </div>
</section>
{/if}
