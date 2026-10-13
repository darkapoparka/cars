<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { ImportSourceItem } from "#lib/data/editorial.ts";
  import { importSourceHref } from "#lib/data/import-sources.ts";

  let { item }: { item: ImportSourceItem } = $props();
  const destination = $derived(locale.href(importSourceHref(item)));
</script>

<div class="col-lg-4 col-sm-6">
  <div class="card-contact card-dealer d-flex import-source-card desktop-card">
    <div class="card-image me-3">
      <div class="position-relative">
        <a
          href={destination}
          aria-label={`${locale.t("ui.import-source-card.view-source-profile")}: ${item.name}`}
          ><img src={item.image} alt="" /></a
        >
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">
        <a
          class="title heading-6 desktop-type-card"
          href={destination}
          aria-label={item.nameLabel}>{item.name}</a
        >
        <p class="text-md-medium neutral-500 desktop-type-body-small"
          >{item.address}</p
        >
      </div>
      <div class="card-method-contact2">
        <a
          class="email text-xs-bold desktop-type-pill"
          href={destination}
          aria-label={`${locale.t("ui.import-source-card.view-source-profile")}: ${item.name}`}
          >{locale.t("editorial.source.view")}</a
        >
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .import-source-card {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-padding);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .import-source-card .card-image {
      display: grid;
      place-items: center;
      flex: none;
      width: var(--karento-desktop-space-18);
      height: var(--karento-desktop-space-18);
      max-width: none;
      margin: 0 !important;
    }
    .import-source-card .card-image img {
      display: block;
      width: var(--karento-desktop-space-14);
      height: var(--karento-desktop-space-14);
      object-fit: contain;
    }
    .import-source-card .card-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      gap: var(--karento-desktop-card-gap);
      width: 100%;
      min-width: 0;
    }
    .import-source-card .card-title {
      width: 100%;
      margin: 0;
    }
    .import-source-card .card-title .title {
      margin-bottom: var(--karento-desktop-space-2);
    }
    .import-source-card .card-title p {
      max-width: 100%;
      margin: 0;
      overflow-wrap: anywhere;
    }
    .import-source-card .card-method-contact2 {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: auto;
    }
    .import-source-card .card-method-contact2 a {
      margin: 0;
      padding: var(--karento-desktop-space-1-5) var(--karento-desktop-space-3);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
    }
  }
</style>
