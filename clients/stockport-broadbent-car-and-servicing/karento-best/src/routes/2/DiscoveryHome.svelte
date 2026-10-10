<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import HomeVehicleCarousel from "#lib/sections/HomeVehicleCarousel.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  import DiscoveryCard from "./DiscoveryCard.svelte";
  import DiscoverySearch from "./DiscoverySearch.svelte";
  import {
    collections,
    collectionCars,
    discoveryText,
    type DiscoveryPanel,
  } from "./discovery.ts";

  const locale = useLocale();
  let search: { openSearch: (panel?: DiscoveryPanel) => void } | undefined =
    $state();
  const pills = [
  {
    "title": "all",
    "section": "collections"
  },
  {
    "title": "brandPill",
    "section": "brand-search"
  },
  {
    "title": "cheapest",
    "section": "collection-cheapest"
  }
] as const;
</script>

<main class="main background-body discovery-home">
  <HomeVehicleCarousel />
  <div class="home-search"><DiscoverySearch bind:this={search} /></div>
  <div class="discovery-pills">
    <MobilePillRail label={discoveryText(locale.locale, "explore")}>
      {#each pills as pill (pill.section)}
        <MobilePill
          label={discoveryText(locale.locale, pill.title)}
          href={pill.title === "brandPill" ? undefined : "/2#" + pill.section}
          popup={pill.title === "brandPill" ? "dialog" : undefined}
          onclick={pill.title === "brandPill"
            ? () => search?.openSearch("make")
            : undefined}
        />
      {/each}
    </MobilePillRail>
  </div>
  <p class="sample-note">{discoveryText(locale.locale, "sample")}</p>
  <div id="collections" class="collections">
    {#each collections as collection (collection.id)}
      <section
        id={"collection-" + collection.id}
        aria-label={discoveryText(locale.locale, collection.title)}
      >
        <div class="collection-heading">
          <MobileSectionHeading
            title={discoveryText(locale.locale, collection.title)}
          >
            {#snippet action()}
              <MobilePill
                label={discoveryText(locale.locale, "viewAll")}
                ariaLabel={discoveryText(locale.locale, "viewAll") +
                  ": " +
                  discoveryText(locale.locale, collection.title)}
                href={"/2?collection=" + collection.id}
                trailingIcon="arrow-right"
                variant="secondary"
              />
            {/snippet}
          </MobileSectionHeading>
        </div>
        <div
          class="car-rail"
          role="region"
          aria-label={discoveryText(locale.locale, collection.title)}
          {@attach focusableScroll}
        >
          {#each collectionCars(collection.id).slice(0, 6) as car (car.id)}
            <DiscoveryCard {car} />
          {/each}
        </div>
      </section>
    {/each}
  </div>
</main>

<style>
  @media (max-width: 767.98px) {
    .discovery-home {
      padding-bottom: var(--karento-space-8);
    }
    .home-search {
      position: relative;
      z-index: 2;
      margin: calc(-1 * var(--karento-space-8)) var(--karento-space-4) 0;
    }
    .discovery-pills {
      padding: var(--karento-space-3) var(--karento-space-4) 0;
    }
    .sample-note {
      margin: var(--karento-space-2) var(--karento-space-4)
        var(--karento-space-6);
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .collections {
      display: grid;
      gap: var(--karento-space-8);
      min-width: 0;
    }
    section {
      min-width: 0;
      scroll-margin-top: var(--karento-space-4);
    }
    .collection-heading {
      padding-inline: var(--karento-space-4);
    }
    .car-rail {
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 64%;
      align-items: start;
      gap: var(--karento-space-3);
      min-width: 0;
      max-width: 100%;
      padding: var(--karento-space-1) var(--karento-space-4);
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scroll-padding-inline: var(--karento-space-4);
      scrollbar-width: none;
    }
    .car-rail::-webkit-scrollbar {
      display: none;
    }
    .car-rail:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: -2px;
    }
  }
</style>
