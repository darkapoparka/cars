<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { stockFaqAnswer } from "#lib/i18n/dealer.ts";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import FaqAccordion from "#lib/components/faq/FaqAccordion.svelte";
  import { referenceNumberedFaqItems } from "#lib/data/faq.ts";
  import { dealer } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  const items = $derived(
    dealer.businessPreview
      ? (["availability", "viewing", "history"] as const).map(
          (topic, index) => ({
            kind: "numbered" as const,
            suffix: `dealer-faq-${topic}`,
            heading: `dealer-faq-heading-${topic}`,
            number: locale.number(index + 1),
            question: locale.t(`dealer.faq.${topic}.question`),
            answer: stockFaqAnswer(topic, dealer.businessPreview, locale),
          }),
        )
      : referenceNumberedFaqItems,
  );
</script>

<section
  class="section-box box-faqs background-body pt-0 desktop-marketing-section"
>
  <div class="box-faqs-inner">
    <div class="container">
      <div class="text-center">
        <span
          class="text-sm-bold bg-2 p-3 rounded-12 mobile-section-label desktop-type-eyebrow"
          >{locale.t("ui.home-faq.our-support")}</span
        >
        <h3 class="mt-4 neutral-1000 desktop-section-title"
          >{locale.t("ui.home-faq.frequently-asked-questions")}</h3
        >
      </div>
      <div class="block-faqs">
        <FaqAccordion
          {items}
          group="#accordionFAQ"
          id="accordionFAQ"
          defaultOpen="#collapseOne"
        />
      </div>
      <div class="row">
        <div class="col-12 mt-4">
          <div class="d-flex justify-content-center gap-2">
            <DemoActionLink
              class="btn btn-primary mt-2 desktop-type-control"
              href="#!"
              aria-label={locale.t("ui.home-faq.contact-us")}
            >
              {locale.t("ui.home-faq.contact-us")}
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
              class="btn btn-primary bg-transparent mt-2 invert desktop-type-control"
              href="#!"
              aria-label={locale.t("ui.home-faq.help-center")}
            >
              {locale.t("ui.home-faq.help-center")}
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
  </div>
</section>
