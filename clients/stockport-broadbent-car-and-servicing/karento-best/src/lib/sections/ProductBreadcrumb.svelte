<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { MediaQuery } from "svelte/reactivity";
  import { selectedReferenceProduct } from "#lib/data/shop-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const selected = $derived(selectedReferenceProduct(page.url.searchParams));
</script>

<section
  class="box-section box-breadcrumb background-body karento-product-breadcrumb"
  role="navigation"
  aria-label={locale.t("ui.product-breadcrumb.breadcrumb")}
>
  <div class="container">
    <ul class="breadcrumbs">
      <li>
        <a
          href={locale.href("/")}
          aria-label={locale.t("ui.product-breadcrumb.home")}
          >{locale.t("ui.product-breadcrumb.home")}</a
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
          href={locale.href("/shop")}
          aria-label={locale.t("ui.product-breadcrumb.shop")}
          >{locale.t("ui.product-breadcrumb.shop")}</a
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
          >{phone.current || desktop.current
            ? selected.title
            : "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend"}</span
        ></li
      >
    </ul>
  </div>
</section>
