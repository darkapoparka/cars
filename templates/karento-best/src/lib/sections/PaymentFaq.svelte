<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import FaqColumns from "#lib/components/faq/FaqColumns.svelte";
  import { referencePaymentFaqItems } from "#lib/data/faq.ts";
  const idBase = $props.id();
</script>

<section
  class="section-faqs-2 pt-80 pb-80 background-body desktop-collection-section"
>
  <div class="container">
    <div class="text-start mb-40 desktop-section-heading">
      <h2 class="my-3 neutral-1000 desktop-type-faq-group"
        >{locale.t("ui.payment-faq.payments")}</h2
      >
    </div>
    <FaqColumns
      items={referencePaymentFaqItems}
      {idBase}
      splitAt={6}
      appearance="rounded"
    />
    <div class="row">
      <div class="col-12 mt-4">
        <div class="d-flex justify-content-start gap-2">
          <a
            class="btn btn-gray2 desktop-type-control"
            href={locale.href("/contact")}
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
          </a>
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

<style>
  @media (min-width: 992px) {
    .desktop-section-heading h2 {
      margin-block: 0 !important;
    }
  }
</style>
