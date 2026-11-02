<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { page } from "$app/state";
  import { selectedReferenceProduct } from "#lib/data/shop-mobile.ts";
  const selected = $derived(selectedReferenceProduct(page.url.searchParams));
  const backHref = $derived.by(() => {
    const parameters = new URLSearchParams(page.url.searchParams.toString());
    parameters.delete("product");
    return locale.href(`/shop${parameters.size ? "?" + parameters : ""}`);
  });
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
        <a href={backHref} aria-label={locale.t("ui.product-breadcrumb.shop")}
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
      <li>
        <span class="text-breadcrumb" aria-current="page">{selected.title}</span
        >
      </li>
    </ul>
  </div>
</section>
