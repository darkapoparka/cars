<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import FaqSupportCard from "#lib/components/faq/FaqSupportCard.svelte";
  import { referenceFaqSupportTopics } from "#lib/data/faq.ts";
  import { message } from "#lib/i18n/text.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobileFaqTopic from "#lib/components/mobile/MobileFaqTopic.svelte";
  import DesktopPageHeading from "#lib/components/page-header/DesktopPageHeading.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const desktopTopicDetails = {
    account: {
      description: message("reference.faq.desktop.account"),
      href: "/login",
      actionLabel: message("account.signIn"),
    },
    booking: {
      description: message("reference.faq.desktop.booking"),
      href: "/contact",
      actionLabel: message("reference.faq.contact"),
    },
    payments: {
      title: message("ui.payment-faq.payments"),
      description: message("reference.faq.desktop.payments"),
      href: "/contact",
      actionLabel: message("reference.faq.contact"),
    },
    activity: {
      description: message("reference.faq.desktop.activity"),
      href: "/services",
      actionLabel: message("ui.services-heading.services"),
    },
    cancellations: {
      description: message("reference.faq.desktop.cancellations"),
      href: "/terms",
      actionLabel: message("ui.term.terms"),
    },
    technical: {
      description: message("reference.faq.desktop.technical"),
      href: "/contact",
      actionLabel: message("reference.faq.contact"),
    },
    policies: {
      description: message("reference.faq.desktop.policies"),
      href: "/terms",
      actionLabel: message("ui.term.terms"),
    },
    safety: {
      description: message("reference.faq.desktop.safety"),
      href: "/contact",
      actionLabel: message("reference.faq.contact"),
    },
  } as const;
  let open = $state(false);
</script>

<section
  class="box-section background-2 py-96 karento-faq-topics desktop-heading-container"
>
  <div class="container">
    {#if desktop.current}
      <DesktopPageHeading
        title={locale.t("ui.faq-support-topics.frequently-asked-questions")}
        breadcrumb={locale.t("ui.faq-support-topics.faqs")}
        description={locale.t(
          "ui.faq-support-topics.any-questions-we-would-be-happy-to-help-you",
        )}
      />
    {:else}
      <div class="text-center mb-40">
        <div
          class="background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex"
        >
          <a
            href={locale.href("/")}
            class="neutral-700 text-md-medium"
            aria-label={locale.t("ui.faq-support-topics.home")}
            >{locale.t("ui.faq-support-topics.home")}</a
          >
          <span>
            <img
              src="/assets/imgs/template/icons/arrow-right.svg"
              alt={locale.t("image.illustrative")}
            />
          </span>
          <DemoActionLink
            href="#!"
            class="neutral-1000 text-md-bold"
            aria-label={locale.t("ui.faq-support-topics.faqs")}
            >{locale.t("ui.faq-support-topics.faqs")}</DemoActionLink
          >
        </div>
        <h3 class="my-3 neutral-1000"
          >{locale.t("ui.faq-support-topics.frequently-asked-questions")}</h3
        >
        <p class="text-xl-medium neutral-500 desktop-type-lead"
          >{locale.t(
            "ui.faq-support-topics.any-questions-we-would-be-happy-to-help-you",
          )}</p
        >
      </div>
    {/if}
    {#if phone.current}
      <div class="mobile-faq-topic-summary">
        <MobilePill
          label={locale.t("ui.faq-support-topics.browse-help-topics")}
          trailingIcon="chevron-down"
          popup="dialog"
          expanded={open}
          onclick={() => (open = true)}
        />
        <p class="neutral-500"
          >{referenceFaqSupportTopics.length}
          {locale.t("ui.faq-support-topics.support-topics")}</p
        >
      </div>
      <MobileSheet
        bind:open
        title={locale.t("ui.faq-support-topics.help-topics")}
      >
        <div class="mobile-faq-topic-list">
          {#each referenceFaqSupportTopics as topic (topic.id)}
            <MobileFaqTopic {topic} />
          {/each}
        </div>
      </MobileSheet>
    {:else}
      <div class="row mt-60 desktop-hero-content">
        {#each referenceFaqSupportTopics as topic (topic.id)}
          <FaqSupportCard
            desktop={desktop.current}
            topic={desktop.current
              ? { ...topic, ...desktopTopicDetails[topic.id] }
              : topic}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  @media (min-width: 992px) {
    :global(.main) .karento-faq-topics {
      padding-bottom: var(--karento-desktop-space-8) !important;
    }
    .karento-faq-topics :global(.card-contact) {
      display: flex;
      flex-direction: column;
      height: calc(100% - var(--karento-desktop-space-6));
      margin-bottom: var(--karento-desktop-space-6);
      padding: var(--karento-desktop-card-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
    .karento-faq-topics :global(.card-contact .card-title .title) {
      margin-bottom: 0;
      font-size: var(--karento-type-compact-card-size);
      line-height: var(--karento-type-compact-card-leading);
    }
    .karento-faq-topics :global(.card-contact .card-info) {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .karento-faq-topics :global(.card-contact .card-title) {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--karento-desktop-space-3);
      margin-bottom: 0;
    }
    .karento-faq-topics :global(.card-contact .card-title p) {
      min-height: 2lh;
      margin: auto 0 0;
      white-space: pre-line;
    }
    .karento-faq-topics :global(.card-contact .card-method-contact) {
      margin-top: auto;
      padding-top: var(--karento-desktop-space-4);
    }
  }
</style>
