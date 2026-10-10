<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import DesktopHeroBreadcrumb from "./DesktopHeroBreadcrumb.svelte";
  const locale = useLocale();
  let {
    title,
    breadcrumb = title,
    description,
  }: {
    title: CatalogText;
    breadcrumb?: CatalogText;
    description?: CatalogText;
  } = $props();
</script>

<header class="desktop-page-heading desktop-page-hero">
  <div class="heading-panel">
    <h1 class="desktop-page-title">{locale.text(title)}</h1>
    {#if description}<p class="desktop-type-lead">{locale.text(description)}</p
      >{/if}
  </div>
  <DesktopHeroBreadcrumb label={breadcrumb} />
</header>

<style>
  .desktop-page-heading {
    display: none;
  }

  @media (min-width: 992px) {
    .desktop-page-heading {
      display: block;
      position: relative;
      text-align: center;
    }
    .heading-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--karento-desktop-space-3);
      min-height: var(--karento-desktop-hero-compact-height);
      padding: var(--karento-desktop-space-8) var(--karento-desktop-space-6);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-100);
    }
    h1 {
      max-width: 100%;
      margin: 0;
      color: var(--bs-neutral-1000);
      font-weight: var(--karento-type-page-weight);
    }
    p {
      max-width: min(100%, 640px);
      margin: 0;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-lead-size);
      line-height: var(--karento-type-lead-leading);
    }
  }
</style>
