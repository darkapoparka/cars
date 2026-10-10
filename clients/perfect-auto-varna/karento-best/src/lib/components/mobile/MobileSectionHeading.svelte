<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Snippet } from "svelte";
  import MobilePill from "./MobilePill.svelte";

  let {
    title,
    description,
    actionLabel,
    actionHref,
    action,
  }: {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    action?: Snippet;
  } = $props();
</script>

<div class="mobile-section-heading">
  <h3 class="neutral-1000">{title}</h3>
  {#if action}
    {@render action()}
  {:else if actionLabel && actionHref}
    <MobilePill
      label={actionLabel}
      href={locale.href(actionHref)}
      variant="secondary"
    />
  {/if}
  {#if description}
    <p class="text-lg-medium neutral-500">{description}</p>
  {/if}
</div>

<style>
  .mobile-section-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--karento-space-1) var(--karento-space-2);
    margin-bottom: var(--karento-space-3);
  }

  h3 {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    grid-column: 1 / -1;
    min-width: 0;
    margin: 0;
  }

  @media (max-width: 767.98px) {
    h3 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }

    p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }

  @media (min-width: 768px) {
    h3 {
      font-size: var(--karento-text-heading);
      line-height: 1.25;
    }
  }
</style>
