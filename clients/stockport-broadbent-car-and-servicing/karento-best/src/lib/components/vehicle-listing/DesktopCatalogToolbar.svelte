<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { DesktopFilterLayout } from "#lib/data/desktop-catalog-modal.ts";
  import {
    desktopCatalogFilterKeys,
    type DesktopCatalogFilters,
  } from "#lib/data/desktop-catalog.ts";
  import {
    catalogDestination,
    catalogSortOptions,
  } from "#lib/data/mobile-catalog.ts";

  let {
    count,
    total,
    filters,
    selectedFilters,
    onfilters,
    onalternative,
    filtersOpen,
    alternativeOpen,
    defaultLayout,
    showLayoutOptions,
    filterDialogId,
  }: {
    count: number;
    total: number;
    filters: DesktopCatalogFilters;
    selectedFilters: Snippet;
    onfilters: () => void;
    onalternative: () => void;
    filtersOpen: boolean;
    alternativeOpen: boolean;
    defaultLayout: DesktopFilterLayout;
    showLayoutOptions: boolean;
    filterDialogId: string;
  } = $props();
  const filterCount = $derived(
    desktopCatalogFilterKeys.filter((key) => filters[key]).length,
  );
  const active = $derived(filterCount > 0);
  const desktop = new MediaQuery("(min-width: 992px)");

  function sort(value: string) {
    void goto(
      locale.href(
        catalogDestination(
          page.url.pathname,
          { ...filters, sort: value },
          page.url.searchParams,
          page.url.hash,
        ),
      ),
      { reset: false },
    );
  }
</script>

<div class="desktop-catalog-toolbar">
  <p
    role="status"
    aria-live="polite"
    data-desktop-catalog-count
    class="desktop-type-body-small"
  >
    <strong>{locale.number(count)}</strong>{active
      ? " " + locale.t("catalog.of", { count: locale.number(total) })
      : ""}
    {locale.t(
      (active ? total : count) === 1
        ? "catalog.vehicle.one"
        : "catalog.vehicle.other",
    )}
  </p>
  <div class="catalog-selected-filters">
    {@render selectedFilters()}
  </div>
  <div class="catalog-actions">
    <button
      class="catalog-open-filters desktop-type-control"
      type="button"
      aria-haspopup="dialog"
      aria-expanded={filtersOpen}
      aria-controls={!desktop.current || filtersOpen
        ? filterDialogId
        : undefined}
      onclick={onfilters}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 5h14M3 10h14M3 15h14M7 3v4M13 8v4M8 13v4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
      <span>{locale.t("ui.desktop-catalog-toolbar.filters")}</span>
      {#if filterCount}<span class="catalog-filter-count desktop-type-badge"
          >{filterCount}</span
        >{/if}
    </button>
    {#if showLayoutOptions}
      <button
        class="catalog-open-alternative desktop-type-control"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={alternativeOpen}
        aria-controls={!desktop.current || alternativeOpen
          ? filterDialogId
          : undefined}
        onclick={onalternative}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="4"
            width="14"
            height="12"
            rx="3"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path d="M8 4v12" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <span
          >{defaultLayout === "drawer"
            ? locale.t("ui.desktop-catalog-toolbar.filter-modals")
            : locale.t("ui.desktop-catalog-toolbar.filter-drawer")}</span
        >
      </button>
    {/if}
    <label class="catalog-sort desktop-type-label">
      <span>{locale.t("ui.desktop-catalog-toolbar.sort-by")}</span>
      <select
        aria-label={locale.t("ui.desktop-catalog-toolbar.sort-vehicles")}
        value={filters.sort}
        onchange={(event) => sort(event.currentTarget.value)}
        class="desktop-type-control"
      >
        {#each catalogSortOptions as option (option.value)}
          <option value={option.value}>{locale.t(option.labelKey)}</option>
        {/each}
      </select>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        ><path
          d="m4 6 4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        /></svg
      >
    </label>
  </div>
</div>

<style>
  .desktop-catalog-toolbar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
  }
  .catalog-selected-filters {
    min-width: 0;
    padding: 4px;
    margin: -4px;
  }
  .catalog-actions {
    display: flex;
    align-items: center;
    justify-self: end;
    gap: 12px;
  }
  .catalog-open-filters,
  .catalog-open-alternative {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 14px;
    border: 1px solid var(--bs-neutral-1000, #171717);
    border-radius: 999px;
    background: var(--bs-neutral-1000, #171717);
    color: var(--bs-neutral-0, #fff);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    cursor: pointer;
    white-space: nowrap;
  }
  .catalog-open-filters:hover {
    border-color: #222;
    background: #222;
  }
  .catalog-open-alternative {
    background: var(--bs-background-card, #fff);
    border-color: var(--bs-neutral-200, #e5e5e5);
    color: var(--bs-neutral-1000, #171717);
  }
  .catalog-open-alternative:hover {
    border-color: var(--bs-neutral-500, #737373);
    background: var(--bs-neutral-100, #f5f5f5);
  }
  .catalog-open-filters:focus-visible,
  .catalog-open-alternative:focus-visible {
    outline: 2px solid var(--bs-neutral-1000, #171717) !important;
    outline-offset: 3px;
  }
  .catalog-filter-count {
    display: grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--bs-neutral-0, #fff);
    color: var(--bs-neutral-1000, #171717);
    font-size: 11px;
    line-height: 20px;
  }
  p {
    margin: 0;
    color: var(--bs-neutral-500, #737373);
    font-size: 14px;
    justify-self: start;
    line-height: 22px;
  }
  strong {
    color: var(--bs-neutral-1000, #171717);
    font-weight: 600;
  }
  .catalog-sort {
    display: flex;
    align-items: center;
    position: relative;
    gap: 8px;
    margin: 0;
    color: var(--bs-neutral-500, #737373);
    font-size: 14px;
    justify-self: end;
  }
  .catalog-sort > span {
    flex-shrink: 0;
    white-space: nowrap;
  }
  select {
    appearance: none;
    height: 40px;
    min-width: 182px;
    margin: 0;
    padding: 0 34px 0 14px;
    border: 1px solid var(--bs-neutral-200, #e5e5e5);
    border-radius: 999px;
    background: var(--bs-background-card, #fff);
    color: var(--bs-neutral-1000, #171717);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
  }
  select:hover {
    border-color: var(--bs-neutral-500, #737373);
  }
  select:focus-visible {
    outline: 2px solid currentColor !important;
    outline-offset: 3px;
  }
  .catalog-sort svg {
    position: absolute;
    right: 14px;
    pointer-events: none;
    color: var(--bs-neutral-1000, #171717);
  }

  @media (min-width: 992px) {
    .desktop-catalog-toolbar {
      gap: var(--karento-desktop-space-5);
    }
    .catalog-actions {
      gap: var(--karento-desktop-space-3);
    }
    .catalog-open-filters,
    .catalog-open-alternative {
      min-height: var(--karento-desktop-pill-height);
      border-radius: var(--karento-desktop-pill-radius);
      gap: var(--karento-desktop-space-2);
    }
    .catalog-sort {
      gap: var(--karento-desktop-space-2);
    }
    select {
      height: var(--karento-desktop-pill-height);
      border-radius: var(--karento-desktop-pill-radius);
    }
    .catalog-filter-count {
      border-radius: var(--karento-desktop-pill-radius);
    }
  }
</style>
