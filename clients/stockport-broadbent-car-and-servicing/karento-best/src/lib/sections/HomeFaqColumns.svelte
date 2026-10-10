<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import FaqColumns from "#lib/components/faq/FaqColumns.svelte";
  import { referenceCardFaqItems } from "#lib/data/faq.ts";
  import PricingFaq from "#lib/components/plans/PricingFaq.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
  const idBase = $props.id();
</script>

{#if desktop.current}
  <PricingFaq />
{:else}
  <section
    class="section-faqs-2 pt-80 pb-80 border-bottom background-body position-relative"
  >
    <div class="container position-relative z-2">
      <div class="text-center mb-40">
        <h3 class="my-3 neutral-1000 desktop-type-section"
          >{locale.t("ui.home-faq-columns.frequently-asked-questions")}</h3
        >
        <p class="text-xl-medium neutral-500 desktop-type-lead"
          >{locale.t(
            "ui.home-faq-columns.any-questions-we-would-be-happy-to-help-you",
          )}</p
        >
      </div>
      <FaqColumns
        items={referenceCardFaqItems}
        {idBase}
        defaultOpen={"#" + idBase + "-collapse01"}
      />
      <div class="row">
        <div class="col-12 mt-4">
          <div class="d-flex justify-content-center gap-2">
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
            >
              {locale.t("reference.faq.ticket")}
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
    </div>
  </section>
{/if}
