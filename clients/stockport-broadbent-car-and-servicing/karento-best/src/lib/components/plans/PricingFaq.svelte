<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { message, type CatalogText } from "#lib/i18n/text.ts";
  const locale = useLocale();
  const group = $props.id();
  const questions = [
    {
      id: "choose",
      question: message("reference.faq.plans.choose.question"),
      answer: message("reference.faq.plans.choose.answer"),
    },
    {
      id: "billing",
      question: message("reference.faq.plans.billing.question"),
      answer: message("reference.faq.plans.billing.answer"),
    },
    {
      id: "included",
      question: message("reference.faq.plans.included.question"),
      answer: message("reference.faq.plans.included.answer"),
    },
    {
      id: "start",
      question: message("reference.faq.plans.start.question"),
      answer: message("reference.faq.plans.start.answer"),
    },
    {
      id: "changes",
      question: message("reference.faq.plans.changes.question"),
      answer: message("reference.faq.plans.changes.answer"),
    },
    {
      id: "help",
      question: message("reference.faq.plans.help.question"),
      answer: message("reference.faq.plans.help.answer"),
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
