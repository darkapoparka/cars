<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    serviceCards,
    serviceFilters,
    type ServiceFilterId,
  } from "#lib/data/services.ts";
  import { filterDesktopServices } from "#lib/data/desktop-services.ts";

  let {
    query = $bindable(""),
    category = $bindable<ServiceFilterId>("all"),
    onclear,
  }: {
    query?: string;
    category?: ServiceFilterId;
    onclear?: () => void;
  } = $props();
  const results = $derived(
    filterDesktopServices(serviceCards, query, category, locale.locale),
  );
  const active = $derived(Boolean(query.trim()) || category !== "all");
  const categoryLabel = $derived(
    locale.t(
      serviceFilters.find((filter) => filter.id === category)?.labelKey ??
        "reference.dynamic.service-filters.all.label",
    ),
  );
</script>

<section
  class="desktop-services background-body"
  aria-label={locale.t("ui.desktop-services.service-results")}
  id="services-results"
  tabindex="-1"
>
  <div class="container">
    <div class="services-toolbar">
      <p
        class="service-count desktop-type-body-small"
        role="status"
        aria-live="polite"
        data-desktop-service-count
      >
        <strong>{results.cards.length}</strong>
        {locale.t(
          results.cards.length === 1
            ? "reference.services.sample.one"
            : "reference.services.sample.other",
        )}
        {locale.t(
          results.cards.length === 1
            ? "reference.services.service.one"
            : "reference.services.service.other",
        )}
      </p>
      <div
        class="services-selection"
        aria-label={locale.t("ui.desktop-services.selected-service-filters")}
      >
        {#if category !== "all"}
          <button
            type="button"
            onclick={() => (category = "all")}
            aria-label={locale.t("reference.services.removeCategory", {
              category: categoryLabel,
            })}
          >
            <span>{categoryLabel}</span><span aria-hidden="true">×</span>
          </button>
        {/if}
        {#if query.trim()}
          <button
            type="button"
            onclick={() => (query = "")}
            aria-label={locale.t("reference.services.removeSearch", {
              query: query.trim(),
            })}
          >
            <span>“{query.trim()}”</span><span aria-hidden="true">×</span>
          </button>
        {/if}
      </div>
      {#if active}<button
          class="services-clear desktop-type-control"
          type="button"
          onclick={onclear}>{locale.t("ui.desktop-services.clear-all")}</button
        >{/if}
    </div>
    {#if results.cards.length}
      <div class="desktop-service-grid">
        {#each results.cards as service (service.id)}
          <a
            class="desktop-service-card"
            href={locale.href(service.href)}
            aria-label={locale.t("reference.services.enquire", {
              service: service.titleKey
                ? locale.t(service.titleKey)
                : service.title,
            })}
          >
            <div class="service-photo">
              <img src={service.image} alt="" loading="lazy" decoding="async" />
              <span class="service-category desktop-type-badge"
                >{locale.t(
                  serviceFilters.find(
                    (filter) => filter.id === service.category,
                  )?.labelKey ?? "reference.dynamic.service-filters.all.label",
                )}</span
              >
            </div>
            <div class="service-card-copy">
              <h4 class="desktop-type-compact-card"
                >{service.titleKey
                  ? locale.t(service.titleKey)
                  : service.title}</h4
              >
              <span
                class="service-enquire desktop-card-action desktop-action-primary desktop-type-control"
                >{locale.t("ui.desktop-services.enquire")}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 8h10m-4-4 4 4-4 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg></span
              >
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="desktop-service-empty">
        <h4 class="desktop-type-compact-card"
          >{locale.t("ui.desktop-services.no-matching-services")}</h4
        >
        <p class="desktop-type-body"
          >{locale.t(
            "ui.desktop-services.try-another-service-name-or-category",
          )}</p
        >
        <button type="button" onclick={onclear}
          >{locale.t("ui.desktop-services.clear-filters")}</button
        >
      </div>
    {/if}
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-services {
      padding-block: var(--karento-desktop-space-8)
        var(--karento-desktop-space-16);
      scroll-margin-top: calc(
        var(--karento-desktop-space-16) + var(--karento-desktop-space-8)
      );
    }
    .desktop-services:focus {
      outline: none;
    }
    .services-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--karento-desktop-space-5);
      min-height: 40px;
      margin-bottom: var(--karento-desktop-space-6);
    }
    button:focus-visible,
    a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000) !important;
      outline-offset: 4px;
    }
    .service-count {
      flex-shrink: 0;
      margin: 0;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
    }
    .service-count strong {
      color: var(--bs-neutral-1000);
      font-weight: var(--karento-type-control-weight);
    }
    .services-selection {
      display: flex;
      flex: 1;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--karento-desktop-space-2);
      min-width: 0;
    }
    .services-selection button {
      display: inline-flex;
      align-items: center;
      gap: var(--karento-desktop-space-2);
      max-width: min(100%, 280px);
      padding: 6px var(--karento-desktop-space-3);
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: var(--karento-type-pill-size);
      line-height: var(--karento-type-pill-leading);
      white-space: nowrap;
      cursor: pointer;
    }
    .services-selection button > span:first-child {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .services-selection button > span:last-child {
      flex-shrink: 0;
    }
    .services-selection button:hover {
      background: var(--bs-neutral-200);
    }
    .services-clear {
      flex-shrink: 0;
      padding: 6px 0;
      border: 0;
      background: transparent;
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      text-decoration: underline;
      text-underline-offset: 4px;
      cursor: pointer;
    }
    .desktop-service-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--karento-desktop-space-6);
    }
    .desktop-service-card {
      display: grid;
      grid-template-rows: auto 1fr;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-background-card);
      color: var(--bs-neutral-1000);
      text-decoration: none;
      transition: border-color 0.15s ease;
    }
    .desktop-service-card:hover {
      border-color: var(--bs-neutral-500);
    }
    .service-photo {
      position: relative;
    }
    .service-photo img {
      display: block;
      width: 100%;
      aspect-ratio: 384 / 227;
      object-fit: cover;
    }
    .service-category {
      position: absolute;
      top: 14px;
      left: 14px;
      padding: 5px 10px;
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-background-card);
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-badge-size);
      font-weight: var(--karento-type-badge-weight);
      line-height: var(--karento-type-badge-leading);
    }
    .service-card-copy {
      display: flex;
      align-items: start;
      flex-direction: column;
      gap: 18px;
      padding: var(--karento-desktop-space-5);
    }
    h4 {
      margin: 0;
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-compact-card-size);
      font-weight: var(--karento-type-compact-card-weight);
      line-height: var(--karento-type-compact-card-leading);
    }
    .service-enquire {
      align-self: flex-end;
      margin-top: auto;
    }
    .desktop-service-empty {
      display: grid;
      justify-items: center;
      gap: 14px;
      padding: var(--karento-desktop-space-16) var(--karento-desktop-space-6);
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-100);
      text-align: center;
    }
    .desktop-service-empty p {
      margin: 0;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-size);
    }
    .desktop-service-empty button {
      padding: 10px var(--karento-desktop-space-5);
      border: 1px solid var(--bs-neutral-1000);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
      font: inherit;
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      cursor: pointer;
    }
  }
  @media (min-width: 1200px) {
    .desktop-service-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .service-card-copy {
      gap: 14px;
      padding: 18px;
    }
    h4 {
      font-size: var(--karento-type-compact-card-size);
    }
  }

  @media (min-width: 992px) {
    .desktop-services {
      padding-block: var(--karento-desktop-space-8)
        var(--karento-desktop-space-16);
    }
    .services-toolbar {
      gap: var(--karento-desktop-space-5);
      min-height: var(--karento-desktop-pill-height);
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .services-selection {
      gap: var(--karento-desktop-space-2);
    }
    .services-selection button {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .desktop-service-grid {
      gap: var(--karento-desktop-grid-gap);
    }
    .desktop-service-card {
      border-radius: var(--karento-desktop-card-radius);
    }
    .service-category {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .service-card-copy {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-card-padding);
    }
    .desktop-service-empty {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-space-16)
        var(--karento-desktop-panel-padding);
      border-radius: var(--karento-desktop-card-radius);
    }
    .desktop-service-empty button {
      border-radius: var(--karento-desktop-pill-radius);
      min-height: var(--karento-desktop-pill-height);
    }
  }
</style>
