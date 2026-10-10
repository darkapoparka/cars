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
  }: {
    id?: string;
    title: string;
    actionLabel: string;
    actionHref?: string;
    note?: string;
    body: Snippet;
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
    {actionLabel}<svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      aria-hidden="true"
      ><path
        d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
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
  aria-label={locale.t("action.openNamed", { name: title.toLocaleLowerCase() })}
  aria-haspopup="dialog"
  aria-expanded={open}
  onclick={() => (open = true)}
>
  {#if artworkVisible}
    <img
      class="mobile-loan-artwork"
      src="/assets/imgs/mobile/loan-calculator.webp"
      alt=""
      width="44"
      height="44"
      decoding="async"
      onerror={() => (artworkVisible = false)}
    />
  {/if}
  <span class="mobile-loan-copy"
    ><strong>{title}</strong><small
      >{locale.t("ui.mobile-loan-card.estimate-monthly-payments")}</small
    ></span
  >
  <span class="mobile-loan-action" aria-hidden="true"
    ><MobileIcon name="arrow-right" size={18} /></span
  >
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
