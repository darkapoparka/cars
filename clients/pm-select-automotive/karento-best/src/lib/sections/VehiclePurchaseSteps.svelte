<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import {
    purchaseProcess,
    type PurchaseProcess,
  } from "#lib/data/purchase-process.ts";

  let { process = purchaseProcess }: { process?: PurchaseProcess } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="karento-how-it-works background-body desktop-marketing-section"
  id="how-it-works"
  aria-labelledby="how-it-works-title"
>
  <div class="container karento-process-surface">
    <div class="karento-process-heading text-center desktop-section-heading">
      <span
        class="karento-process-label background-2 neutral-1000 desktop-type-eyebrow"
        >{locale.t("ui.vehicle-purchase-steps.how-it-works")}</span
      >
      <h3 class="neutral-1000 desktop-section-title" id="how-it-works-title"
        >{locale.text(process.title)}</h3
      >
      <p class="text-lg-medium neutral-500 desktop-type-lead"
        >{locale.text(process.description)}</p
      >
    </div>
    <ol class="karento-process-grid" role="list">
      {#each process.steps as step, index (step.id)}
        <li class="karento-process-step">
          <a
            class="karento-process-step-link"
            href={locale.href(step.href)}
            aria-labelledby={`purchase-step-${step.id}`}
            aria-describedby={`purchase-step-${step.id}-description`}
          >
            <div class="karento-process-image">
              <img
                src={step.image}
                alt=""
                width="1672"
                height="941"
                loading="lazy"
                decoding="async"
              />
              <span class="karento-process-number" aria-hidden="true"
                >{String(index + 1).padStart(2, "0")}</span
              >
            </div>
            <div class="karento-process-copy">
              <h6
                class="neutral-1000 desktop-card-title"
                id={`purchase-step-${step.id}`}>{locale.text(step.title)}</h6
              >
              <p
                class="text-md-medium neutral-500 desktop-type-body"
                id={`purchase-step-${step.id}-description`}
              >
                {#if phone.current && step.mobileDescriptionLines}
                  <span class="karento-process-description-line"
                    >{locale.text(step.mobileDescriptionLines[0])}&nbsp;</span
                  >
                  <span class="karento-process-description-line"
                    >{locale.text(step.mobileDescriptionLines[1])}</span
                  >
                {:else}
                  {locale.text(step.description)}
                {/if}
              </p>
            </div>
          </a>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .karento-process-step-link {
    display: block;
  }

  .karento-process-copy {
    display: contents;
  }

  .karento-process-description-line {
    display: block;
  }

  @media (min-width: 992px) {
    .karento-process-number {
      width: 28px;
      height: 28px;
      border: 1px solid var(--bs-border-color);
      border-radius: 50%;
      background: var(--bs-neutral-0);
      color: var(--bs-neutral-1000);
      box-shadow: 0 2px 7px rgb(0 0 0 / 7%);
      font-size: var(--karento-type-badge-size);
      line-height: var(--karento-type-counter-leading);
    }
  }

  @media (max-width: 767.98px) {
    .karento-how-it-works {
      padding-block: var(--karento-space-6);
    }

    .karento-process-surface {
      width: calc(100% - 2 * var(--karento-space-4));
      padding: var(--karento-space-4);
      border-radius: var(--karento-radius-card);
      background: var(--bs-neutral-100);
    }

    .karento-process-label {
      background: var(--bs-neutral-0);
      font-size: var(--karento-type-eyebrow-size);
      font-weight: var(--karento-type-eyebrow-weight);
      line-height: var(--karento-type-eyebrow-leading);
    }

    .karento-process-heading {
      margin-bottom: var(--karento-space-4);
    }

    .karento-process-heading h3 {
      margin-block: var(--karento-space-3) var(--karento-space-2);
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }

    .karento-process-heading p {
      font-size: var(--karento-type-lead-size);
      font-weight: var(--karento-type-lead-weight);
      line-height: var(--karento-type-lead-leading);
    }

    .karento-process-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--karento-space-3);
    }

    .karento-process-step {
      text-align: left;
    }

    .karento-process-step-link {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
      align-items: center;
      gap: var(--karento-space-3);
      min-height: var(--karento-touch-target);
    }

    .karento-process-image {
      align-self: stretch;
    }

    .karento-process-image img {
      position: absolute;
      inset: 0;
      height: 100%;
      object-fit: cover;
    }

    .karento-process-copy {
      display: flex;
      flex-direction: column;
      gap: var(--karento-space-1);
      align-self: center;
      min-width: 0;
    }

    .karento-process-number {
      left: var(--karento-space-1);
      bottom: var(--karento-space-1);
      width: var(--karento-space-6);
      height: var(--karento-space-6);
      border-radius: var(--karento-space-1);
      font-size: var(--karento-type-badge-size);
      font-weight: var(--karento-type-badge-weight);
      line-height: var(--karento-type-badge-leading);
    }

    .karento-process-step h6 {
      margin: 0;
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    .karento-process-step p {
      max-width: none;
      margin: 0;
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
