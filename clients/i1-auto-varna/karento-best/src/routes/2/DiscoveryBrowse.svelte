<script lang="ts">
  import { page } from "$app/state";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import DiscoveryCard from "./DiscoveryCard.svelte";
  import DiscoverySearch from "./DiscoverySearch.svelte";
  import {
    collectionCars,
    searchCars,
    discoveryText,
    discoveryDestination,
    discoveryYearLabel,
    discoveryModelLabel,
    type Collection,
    emptyDiscoveryFilters,
    type DiscoveryFilters,
  } from "./discovery.ts";

  let {
    collection,
    query = "",
    filters = emptyDiscoveryFilters,
  }: {
    collection?: Collection;
    query?: string;
    filters?: DiscoveryFilters;
  } = $props();
  const locale = useLocale();
  const cars = $derived(
    collection ? collectionCars(collection.id) : searchCars(query, filters),
  );
  const tags = $derived(
    [
      { id: "q", label: query.trim(), keys: ["q"] },
      { id: "make", label: filters.make, keys: ["make", "model"] },
      {
        id: "model",
        label: discoveryModelLabel(filters.make, filters.model),
        keys: ["model"],
      },
      {
        id: "priceMax",
        label: filters.priceMax
          ? discoveryText(locale.locale, "upTo") +
            " " +
            locale.money(Number(filters.priceMax), "EUR")
          : "",
        keys: ["priceMax"],
      },
      {
        id: "year",
        label: discoveryYearLabel(filters, locale.locale),
        keys: ["yearFrom", "yearTo"],
      },
    ].filter((tag) => tag.label),
  );
  function without(keys: readonly string[]) {
    const next = { ...filters };
    for (const key of [
      "make",
      "model",
      "priceMax",
      "yearFrom",
      "yearTo",
    ] as const) {
      if (keys.includes(key)) next[key] = "";
    }
    return discoveryDestination(
      keys.includes("q") ? "" : query,
      next,
      page.url.searchParams,
      page.url.hash,
    );
  }
</script>

<main class="main background-body discovery-browse discovery-interior">
  <header class="browse-heading">
    <a
      class="browse-back"
      aria-label={discoveryText(locale.locale, "backHome")}
      href={locale.href(collection ? "/2#collection-" + collection.id : "/2")}
      ><MobileIcon name="arrow-left" size={24} /></a
    >
    <div class="browse-title">
      <h1 class:search-title={!collection}>
        <span class="browse-name"
          >{discoveryText(
            locale.locale,
            collection?.title ?? "searchResults",
          )}</span
        >{#if !collection}&nbsp;<span class="browse-count"
            >({locale.number(cars.length)})</span
          >{/if}</h1
      >
      <p
        class="browse-summary"
        class:visually-hidden={!collection}
        role="status"
        aria-live="polite"
        >{locale.count(cars.length)}{#if !collection && tags.length}<span
            class="visually-hidden"
            >{" · " + tags.map((tag) => tag.label).join(" · ")}</span
          >{/if}</p
      >
    </div>
  </header>
  {#if !collection}
    <div class="results-search"><DiscoverySearch {query} {filters} /></div>
  {/if}
  {#if !collection && tags.length}
    <div class="results-feedback">
      <MobilePillRail
        label={discoveryText(locale.locale, "searchResults")}
        variant="secondary"
      >
        {#each tags as tag (tag.id)}
          <MobilePill
            label={tag.label}
            href={without(tag.keys)}
            trailingIcon="close"
            variant="secondary"
            ariaLabel={discoveryText(locale.locale, "removeFilter") +
              " " +
              tag.label}
          />
        {/each}
      </MobilePillRail>
    </div>
  {/if}
  <p class="sample-note">{discoveryText(locale.locale, "sample")}</p>
  {#if cars.length}
    <div class="car-grid">
      {#each cars as car (car.id)}<DiscoveryCard {car} />{/each}
    </div>
  {:else}
    <div class="empty-results">
      <p>{discoveryText(locale.locale, "noResults")}</p>
      <MobilePill
        label={discoveryText(locale.locale, "all")}
        href="/2?q="
        trailingIcon="arrow-right"
        variant="secondary"
      />
    </div>
  {/if}
</main>

<style>
  @media (max-width: 767.98px) {
    :global(body:has(.discovery-browse) header.header) {
      display: none;
    }
    .discovery-browse {
      padding: var(--karento-space-4) var(--karento-space-4)
        var(--karento-space-8);
    }
    .browse-heading {
      position: sticky;
      top: 0;
      z-index: 210;
      display: flex;
      align-items: center;
      gap: var(--karento-space-2);
      margin: calc(-1 * var(--karento-space-4))
        calc(-1 * var(--karento-space-4)) 0;
      padding: calc(var(--karento-space-3) + env(safe-area-inset-top, 0px))
        var(--karento-space-4) var(--karento-space-3);
      border-bottom: 1px solid var(--bs-border-color);
      background: var(--bs-neutral-0);
    }
    .browse-title {
      flex: 1;
      min-width: 0;
    }
    .browse-back {
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      flex: 0 0 var(--karento-touch-target);
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      margin-inline: calc((24px - var(--karento-touch-target)) / 2);
      padding: 0;
      border: 0;
      border-radius: var(--karento-radius-pill);
      background: transparent;
      color: var(--bs-neutral-1000);
      text-decoration: none;
    }
    .browse-back::before {
      content: "";
      position: absolute;
      inset: var(--karento-space-1);
      z-index: -1;
      border-radius: inherit;
      pointer-events: none;
    }
    .browse-back:active::before,
    .browse-back:focus-visible::before {
      background: var(--bs-neutral-100);
    }
    .browse-back:focus-visible {
      outline: 2px solid currentColor !important;
      outline-offset: calc(-1 * var(--karento-space-1));
    }
    h1 {
      min-width: 0;
      margin: 0;
      font-size: var(--karento-type-page-size);
      font-weight: var(--karento-type-page-weight);
      line-height: var(--karento-type-page-leading);
    }
    .search-title {
      display: flex;
      align-items: center;
    }
    .search-title .browse-name {
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .browse-count {
      flex-shrink: 0;
    }
    .browse-summary {
      margin: 0;
    }
    .results-feedback {
      display: grid;
      gap: var(--karento-space-1);
      align-items: center;
      min-width: 0;
      min-height: var(--karento-touch-target);
      margin-top: var(--karento-space-2);
    }
    .sample-note {
      margin: var(--karento-space-2) 0 var(--karento-space-6);
    }
    .browse-summary,
    .sample-note {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .results-search {
      margin-top: var(--karento-space-4);
    }
    .empty-results p {
      margin-bottom: var(--karento-space-4);
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .car-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--karento-space-6) var(--karento-space-3);
    }
  }
  @media (max-width: 767.98px) and (hover: hover) {
    .browse-back:hover::before {
      background: var(--bs-neutral-100);
    }
  }
</style>
