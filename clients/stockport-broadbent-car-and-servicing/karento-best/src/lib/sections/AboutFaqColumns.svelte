<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import FaqColumns from "#lib/components/faq/FaqColumns.svelte";
  import {
    desktopPaymentFaqItems,
    referenceCardFaqItems,
  } from "#lib/data/faq.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
  const idBase = $props.id();
</script>

<section
  class="section-faqs-2 pt-80 pb-80 border-bottom background-body position-relative desktop-marketing-section"
>
  <div class="container position-relative z-2">
    <div class="text-center mb-40 desktop-section-heading">
      <h3 class="my-3 neutral-1000 text-start desktop-section-title"
        >{locale.t("ui.about-faq-columns.frequently-asked-questions")}</h3
      >
      <p class="text-xl-medium neutral-500 d-none desktop-type-lead"
        >{locale.t(
          "ui.about-faq-columns.any-questions-we-would-be-happy-to-help-you",
        )}</p
      >
    </div>
    <FaqColumns
      items={desktop.current ? desktopPaymentFaqItems : referenceCardFaqItems}
      {idBase}
      splitAt={desktop.current ? 3 : 7}
      defaultOpen={"#" +
        idBase +
        "-" +
        (desktop.current ? desktopPaymentFaqItems[0].suffix : "collapse01")}
    />
    <div class="row">
      <div class="col-12 mt-4">
        <div class="d-flex justify-content-center gap-2">
          {#if desktop.current}
            <a
              class="btn btn-gray2 desktop-type-control desktop-card-action desktop-action-primary"
              href={locale.href("/contact")}
              >{locale.t("reference.faq.contact")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><path
                  d="M8 15L15 8L8 1M15 8L1 8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              ></a
            >
          {:else}
            <DemoActionLink
              class="btn btn-gray2 desktop-type-control"
              href="#!"
              aria-label={locale.t("reference.faq.contact")}
            >
              {locale.t("reference.faq.contact")}
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
            <DemoActionLink
              class="btn btn-primary rounded-3 desktop-type-control"
              href="#!"
              aria-label={locale.t("reference.faq.ticket")}
              >{locale.t("reference.faq.ticket")}<svg
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
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    a.desktop-card-action svg path {
      fill: none;
      stroke: currentColor;
    }
  }
</style>
