<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { CatalogText } from "#lib/i18n/text.ts";
  const locale = useLocale();
  const group = $props.id();
  const questions = [
    {
      id: "choose",
      question: "Which plan should I choose?",
      answer:
        "Compare the features in each card and choose the level that fits your needs. These are example plans; contact us to confirm the options and pricing available to you.",
    },
    {
      id: "billing",
      question: "How do monthly and annual prices compare?",
      answer:
        "The billing switch shows either the monthly amount or the annual total. The annual examples equal twelve monthly payments, so no annual discount is included in the displayed prices.",
    },
    {
      id: "included",
      question: "What is included in each plan?",
      answer:
        "The feature list under each plan shows the example benefits. Vehicle availability, insurance cover, mileage and any additional charges should be confirmed with the team before you choose a plan.",
    },
    {
      id: "start",
      question: "How do I get started?",
      answer:
        "Contact us with the plan you are interested in and the vehicle or service you need. The team can confirm the details and explain the next steps. Selecting a plan here does not activate a membership or take a payment.",
    },
    {
      id: "changes",
      question: "Can I change or cancel a plan?",
      answer:
        "Changes, cancellations and any notice period depend on the confirmed plan terms. Ask the team to explain these conditions before you agree to a membership.",
    },
    {
      id: "help",
      question: "Can someone help me compare the plans?",
      answer:
        "Yes. Contact us with your requirements and the plans you are considering so the team can help you compare the available options.",
    },
  ] as const satisfies readonly {
    id: string;
    question: CatalogText;
    answer: CatalogText;
  }[];
</script>

<section class="pricing-faq section-faqs-2 border-bottom background-body">
  <div class="container">
    <div class="pricing-faq-heading text-center">
      <h3 class="neutral-1000 desktop-section-title"
        >{locale.t("ui.home-faq-columns.frequently-asked-questions")}</h3
      >
      <p class="neutral-500 desktop-type-lead"
        >{locale.t(
          "ui.home-faq-columns.any-questions-we-would-be-happy-to-help-you",
        )}</p
      >
    </div>
    <div class="pricing-faq-list">
      {#each questions as item, index (item.id)}
        <details name={group} open={index === 0}>
          <summary class="desktop-type-control">
            <span>{locale.text(item.question)}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              ><path
                d="m3 6 5 5 5-5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              /></svg
            >
          </summary>
          <p class="desktop-type-body">{locale.text(item.answer)}</p>
        </details>
      {/each}
      <div class="pricing-faq-contact">
        <a
          class="btn btn-white desktop-type-control desktop-panel-action"
          href={locale.href("/contact")}
          >{locale.t("ui.home-faq-columns.contact-us")}
          <span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .pricing-faq {
      padding-block: var(--karento-desktop-section-padding-compact);
    }
    .pricing-faq-heading {
      margin-bottom: var(--karento-desktop-heading-gap);
    }
    .pricing-faq-heading h3 {
      margin-bottom: var(--karento-desktop-space-3);
    }
    .pricing-faq-heading p {
      margin: 0;
    }
    .pricing-faq-list {
      max-width: 840px;
      margin-inline: auto;
    }
    details {
      margin-bottom: var(--karento-desktop-space-3);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-background-body);
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--karento-desktop-panel-gap);
      min-height: var(--karento-desktop-disclosure-height);
      padding: var(--karento-desktop-space-4) var(--karento-desktop-space-5);
      color: var(--bs-neutral-1000);
      list-style: none;
      cursor: pointer;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary svg {
      flex: 0 0 auto;
    }
    details[open] summary svg {
      transform: rotate(180deg);
    }
    details p {
      margin: 0;
      padding: 0 var(--karento-desktop-space-5) var(--karento-desktop-space-5);
      color: var(--bs-neutral-500);
    }
    summary:focus-visible,
    .pricing-faq-contact a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: 3px;
      border-radius: var(--karento-desktop-control-radius);
    }
    .pricing-faq-contact {
      display: flex;
      justify-content: center;
      margin-top: var(--karento-desktop-panel-gap);
    }
    .pricing-faq-contact a {
      gap: var(--karento-desktop-card-gap);
    }
  }
</style>
