<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import FaqSupportTopics from "#lib/sections/FaqSupportTopics.svelte";
  import GeneralFaq from "#lib/sections/GeneralFaq.svelte";
  import PaymentFaq from "#lib/sections/PaymentFaq.svelte";
  import BusinessStats from "#lib/sections/BusinessStats.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import HomeFaq from "#lib/sections/HomeFaq.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<PageMetadata title={locale.t("ui.faqs.faq")} />
<main class="main karento-faq-page"
  >{#if dealer.businessPreview}<HomeFaq />{:else}<FaqSupportTopics />
    <GeneralFaq />
    <PaymentFaq />
    <BusinessStats />
  {/if}
  <Footer /></main
>

<style>
  @media (min-width: 992px) {
    .karento-faq-page :global(.karento-faq-topics),
    .karento-faq-page :global(.karento-faq-topics .heading-panel),
    .karento-faq-page :global(.karento-faq-card),
    .karento-faq-page :global(.karento-faq-card > .card-header),
    .karento-faq-page :global(.section-static-1) {
      background-color: var(--bs-background-body) !important;
    }
  }
</style>
