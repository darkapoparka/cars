<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if !desktop.current}
  <section class="section-box pt-50 background-body">
    <div class="container">
      <div class="row align-items-end">
        <div class="col-md-9 mb-30">
          <h4 class="title-svg neutral-1000 mb-15 desktop-type-section"
            >{locale.t("ui.products-heading.latest-products")}</h4
          >
          {#if phone.current}<p class="product-reference-note"
              >{locale.t(
                "ui.products-heading.reference-products-browse-the-sample-collection",
              )}</p
            >{:else}<p
              class="text-lg-medium text-bold neutral-500 desktop-type-lead"
              >{locale.t("reference.product.heading")}</p
            >{/if}
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  @media (max-width: 767.98px) {
    .section-box .product-reference-note {
      display: block !important;
      margin-top: 6px;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
