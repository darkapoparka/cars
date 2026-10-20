<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import ImportSourceCard from "#lib/components/editorial/ImportSourceCard.svelte";
  import type { ImportSourceItem } from "#lib/data/editorial.ts";
  import { filterImportSources } from "#lib/data/import-sources.ts";
  import { MediaQuery } from "svelte/reactivity";
  const locale = useLocale();
  const desktop = new MediaQuery("(min-width: 992px)");
  let {
    sources,
    query = "",
    country = "all",
    onclear,
  }: {
    sources: readonly ImportSourceItem[];
    query?: string;
    country?: string;
    onclear?: () => void;
  } = $props();
  const filtered = $derived(
    filterImportSources(sources, query, country, locale.locale),
  );
  const shown = $derived(desktop.current ? filtered.sources : sources);
  const active = $derived(Boolean(query.trim()) || country !== "all");
  const hasSampleSources = $derived(sources.some((source) => source.sample));
  const countLabel = $derived(
    locale.t(
      shown.length === 1
        ? "ui.import-discovery.source-count"
        : "ui.import-discovery.sources-count",
      { count: locale.number(shown.length) },
    ),
  );
</script>

<section
  class="box-section background-body py-96 border-bottom karento-import-directory desktop-collection-section"
  id="import-results"
  tabindex="-1"
  aria-label={locale.t("ui.import-source-directory.explore-import-sources")}
>
  <div class="container">
    {#if desktop.current}
      <div class="text-center desktop-section-heading">
        <h2 class="neutral-1000 desktop-type-collection import-directory-title"
          >{locale.t("ui.import-source-directory.explore-import-sources")}</h2
        >
      </div>
    {:else}
      <div class="row align-items-end desktop-section-heading">
        <div class="col-md-8">
          <h2
            class="neutral-1000 desktop-type-collection import-directory-title"
            >{locale.t("ui.import-source-directory.explore-import-sources")}</h2
          >
          <p class="text-lg-medium neutral-500 desktop-type-lead"
            >{locale.t(
              sources.length > 0 && sources.every((source) => source.sample)
                ? "ui.import-source-directory.illustrative-source-profiles-discuss-availability-and-your-preferred-vehicle"
                : "ui.import-source-profile.tell-us-your-preferred-model-source-market-and-budget",
            )}</p
          >
        </div>
        <div class="col-md-4">
          <div class="d-flex justify-content-end mt-md-0 mt-4">
            <a
              class="btn btn-primary rounded-3 desktop-type-control"
              href={locale.href("/contact")}
            >
              {locale.t("ui.import-source-directory.discuss-an-import")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                focusable="false"
                ><path
                  d="M8 15L15 8L8 1M15 8L1 8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                /></svg
              >
            </a>
          </div>
        </div>
      </div>
    {/if}
    {#if desktop.current && active}
      <div class="import-results-toolbar">
        <p class="desktop-type-body-small" role="status" aria-live="polite"
          >{countLabel}</p
        >
        <button type="button" class="desktop-type-control" onclick={onclear}
          >{locale.t("ui.import-discovery.clear-filters")}</button
        >
      </div>
    {/if}
    {#if shown.length}
      <div class="row mt-60">
        {#each shown as item (item.id)}<ImportSourceCard {item} />{/each}
      </div>
    {:else}
      <div class="import-empty">
        <h3 class="desktop-type-panel"
          >{locale.t("ui.import-discovery.no-matching-sources")}</h3
        >
        <p class="desktop-type-body"
          >{locale.t(
            "ui.import-discovery.try-another-source-name-location-or-country",
          )}</p
        >
        {#if active}<button
            type="button"
            class="btn btn-primary desktop-type-control"
            onclick={onclear}
            >{locale.t("ui.import-discovery.clear-filters")}</button
          >{/if}
      </div>
    {/if}
    {#if desktop.current}
      <div
        class="d-flex flex-column align-items-center justify-content-center import-enquiry"
      >
        {#if hasSampleSources}<p
            class="neutral-500 desktop-type-body-small mb-0"
            >{locale.t("ui.import-discovery.sample-notice")}</p
          >{/if}
        <a
          class="btn btn-primary desktop-type-pill desktop-section-action"
          href={locale.href("/contact")}
          >{locale.t("ui.import-source-directory.discuss-an-import")}</a
        >
      </div>
    {/if}
  </div>
</section>

<style>
  .karento-import-directory:focus {
    outline: none;
  }
  @media (min-width: 992px) {
    .import-directory-title {
      margin: 0;
      font-size: var(--karento-desktop-section-title-size);
      line-height: var(--karento-type-panel-leading);
    }
    .import-enquiry {
      margin-top: var(--karento-desktop-space-2);
      gap: var(--karento-desktop-card-gap);
    }
    .row.mt-60 {
      margin-top: 0 !important;
    }
    .import-results-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--karento-desktop-card-gap);
      min-height: var(--karento-desktop-pill-height);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .import-results-toolbar p {
      margin: 0;
      color: var(--bs-neutral-500);
    }
    .import-results-toolbar button {
      border: 0;
      padding: var(--karento-desktop-space-1-5) 0;
      background: transparent;
      color: var(--bs-neutral-1000);
      font: inherit;
      text-decoration: underline;
      text-underline-offset: var(--karento-desktop-space-1);
      cursor: pointer;
    }
    .import-empty {
      display: grid;
      justify-items: center;
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-space-16)
        var(--karento-desktop-panel-padding);
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-100);
      text-align: center;
    }
    .import-empty h3,
    .import-empty p {
      margin: 0;
    }
    .import-empty p {
      color: var(--bs-neutral-500);
    }
    button:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: var(--karento-desktop-space-1);
    }
  }
</style>
