<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Snippet } from "svelte";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";

  let {
    id,
    title,
    actionLabel,
    actionHref,
    note,
    body,
    featured = false,
  }: {
    id?: string;
    title: string;
    actionLabel: string;
    actionHref?: string;
    note?: string;
    body: Snippet;
    featured?: boolean;
  } = $props();
  let open = $state(false);
  let artworkVisible = $state(true);
</script>

{#snippet sheetBody()}
  <div class="mobile-loan-body form-contact">
    <div class="row">{@render body()}</div>
    <p class="mobile-loan-note"
      >{note ??
        locale.t("ui.mobile-loan-card.example-figures-for-this-demo")}</p
    >
  </div>
{/snippet}

{#snippet sheetFooter()}
  {#snippet actionContent()}
    {actionLabel}<MobileIcon name="arrow-right" />
  {/snippet}
  {#if actionHref}
    <a class="btn btn-book" href={actionHref}>{@render actionContent()}</a>
  {:else}
    <DemoActionButton
      class="btn btn-book"
      aria-label={actionLabel}
      type="button">{@render actionContent()}</DemoActionButton
    >
  {/if}
{/snippet}

<button
  {id}
  type="button"
  class="mobile-loan-trigger"
  class:mobile-loan-featured={featured}
  aria-label={featured
    ? `${locale.t("referenceFinance.useCalculator")}: ${title}`
    : locale.t("action.openNamed", { name: title.toLocaleLowerCase() })}
  aria-haspopup="dialog"
  aria-expanded={open}
  onclick={() => (open = true)}
>
  {#if artworkVisible}
    <img
      class="mobile-loan-artwork"
      src="/assets/imgs/mobile/loan-calculator.webp"
      alt=""
      width={featured ? 128 : 44}
      height={featured ? 128 : 44}
      decoding="async"
      onerror={() => (artworkVisible = false)}
    />
  {/if}
  <span class="mobile-loan-copy"
    ><strong>{title}</strong><small
      >{locale.t("ui.mobile-loan-card.estimate-monthly-payments")}</small
    ></span
  >
  {#if featured}
    <span class="mobile-loan-cta">
      <span>{locale.t("referenceFinance.calculate")}</span>
      <MobileIcon name="arrow-right" size="compact" />
    </span>
  {:else}
    <span class="mobile-loan-action" aria-hidden="true"
      ><MobileIcon name="arrow-right" size="action" /></span
    >
  {/if}
</button>
<MobileSheet
  bind:open
  {title}
  class="mobile-loan-sheet"
  children={sheetBody}
  footer={sheetFooter}
/>

<style>
  @media (max-width: 767.98px) {
    .mobile-loan-trigger {
      display: flex;
      align-items: center;
      gap: var(--karento-space-3);
      width: 100%;
      min-height: 88px;
      padding: var(--karento-space-4);
      border: 1px solid var(--karento-border-tool);
      border-radius: var(--karento-radius-card);
      background: var(--karento-surface-tool);
      color: var(--bs-neutral-1000);
      text-align: left;
      font: inherit;
    }

    .mobile-loan-trigger:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: var(--karento-space-1);
    }

    .mobile-loan-copy {
      display: grid;
      flex: 1 1 auto;
      min-width: 0;
      gap: var(--karento-space-1);
    }

    .mobile-loan-artwork {
      flex: 0 0 var(--karento-touch-target);
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      object-fit: contain;
    }

    .mobile-loan-featured {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: var(--karento-space-3);
    }

    .mobile-loan-featured .mobile-loan-copy {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    .mobile-loan-featured strong {
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }

    .mobile-loan-featured .mobile-loan-artwork {
      grid-column: 1;
      grid-row: 2;
      width: min(100%, 160px);
      height: auto;
      aspect-ratio: 5 / 3;
      object-fit: cover;
    }

    .mobile-loan-cta {
      display: inline-flex;
      grid-column: 2;
      grid-row: 2;
      align-items: center;
      justify-content: center;
      justify-self: end;
      align-self: end;
      gap: var(--karento-space-1);
      max-width: 100%;
      min-height: var(--karento-touch-target);
      padding: var(--karento-space-2) var(--karento-space-3);
      border-radius: var(--karento-radius-pill);
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
      font-size: var(--karento-type-pill-size);
      font-weight: var(--karento-type-pill-weight);
      line-height: var(--karento-type-pill-leading);
      text-align: center;
    }

    .mobile-loan-cta > span {
      min-width: 0;
      overflow-wrap: anywhere;
    }

    strong {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    small {
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .mobile-loan-note {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .mobile-loan-action {
      display: grid;
      place-items: center;
      flex: 0 0 var(--karento-space-8);
      width: var(--karento-space-8);
      height: var(--karento-space-8);
      border-radius: 50%;
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
    }
  }
</style>
