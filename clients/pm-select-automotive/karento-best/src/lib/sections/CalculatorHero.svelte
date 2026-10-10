<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { referenceLoanHero } from "#lib/data/finance.ts";
  import DesktopPageHeading from "#lib/components/page-header/DesktopPageHeading.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section
  class="section-cta-11 background-body pt-85 pb-85 karento-calculator-hero desktop-heading-container"
>
  <div class="container">
    <div class="row">
      <div class="col-lg-12 karento-calculator-copy">
        {#if desktop.current}
          <DesktopPageHeading
            title={referenceLoanHero.title}
            breadcrumb={locale.t("ui.calculator.car-calculator")}
            description={referenceLoanHero.description}
          />
        {:else}
          <h4 class="mb-10 neutral-1000 karento-hero-title desktop-hero-title"
            >{locale.text(referenceLoanHero.title)}</h4
          >
          <p class="text-lg-medium mt-2 neutral-1000 desktop-type-lead"
            >{locale.text(referenceLoanHero.description)}</p
          >
        {/if}
        {#if !desktop.current}
          <a
            class="btn btn-primary karento-hero-action desktop-type-control desktop-hero-content"
            href={locale.href(referenceLoanHero.href)}
            >{locale.text(referenceLoanHero.actionLabel)}
            <span aria-hidden="true">↓</span></a
          >
        {/if}
      </div>
      {#if !desktop.current}<div
          class="mt-lg-0 mt-4 col-lg-12 karento-calculator-images"
        >
          <div
            class="d-flex flex-md-row flex-column align-items-center justify-content-center gap-3 mb-30"
          >
            {#each referenceLoanHero.images as image (image.src)}
              <div
                ><img
                  class="rounded-12"
                  src={image.src}
                  alt={locale.text(image.alt)}
                /></div
              >
            {/each}
          </div>
        </div>{/if}
    </div></div
  ></section
>

<style>
  @media (min-width: 992px) {
    :global(.main) .karento-calculator-hero {
      padding-bottom: 0 !important;
    }
    .karento-calculator-hero :global(.heading-panel) {
      background: var(--bs-background-body);
    }
    .karento-calculator-copy {
      padding-bottom: 0 !important;
    }
  }
</style>
