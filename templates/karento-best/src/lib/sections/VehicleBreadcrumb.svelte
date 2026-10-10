<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import { referenceHeading } from "#lib/data/vehicle-detail.ts";
  let {
    centered = false,
    vehicleTitle,
  }: { centered?: boolean; vehicleTitle?: string } = $props();
</script>

<section
  class={[
    "box-section box-breadcrumb background-body",
    { "karento-product-breadcrumb": centered },
  ]}
  role="navigation"
  aria-label={locale.t("ui.vehicle-breadcrumb.breadcrumb")}
>
  <div class="container">
    <ul class="breadcrumbs">
      <li>
        <a
          href={locale.href("/")}
          aria-label={locale.t("ui.vehicle-breadcrumb.home")}
          >{locale.t("ui.vehicle-breadcrumb.home")}</a
        >
        <span class="arrow-right">
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 11L6 6L1 1"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </li>
      <li>
        <a
          href={locale.href("/vehicles")}
          aria-label={locale.t("ui.vehicle-breadcrumb.vehicles")}
          >{locale.t("ui.vehicle-breadcrumb.vehicles")}</a
        >
        <span class="arrow-right">
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 11L6 6L1 1"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </span>
      </li>
      <li
        ><span class="text-breadcrumb" aria-current="page"
          >{vehicleTitle ??
            (dealer.businessPreview
              ? locale.t("vehicle.page")
              : referenceHeading.title)}
        </span></li
      >
    </ul>
  </div>
</section>
