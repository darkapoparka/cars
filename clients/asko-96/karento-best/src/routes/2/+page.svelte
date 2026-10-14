<script lang="ts">
  import { page } from "$app/state";
  import { untrack } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import OriginalHome from "#lib/pages/index-3.svelte";
  import DiscoveryHome from "./DiscoveryHome.svelte";
  import DiscoveryBrowse from "./DiscoveryBrowse.svelte";
  import DiscoveryDetail from "./DiscoveryDetail.svelte";
  import DiscoveryNavigation from "./DiscoveryNavigation.svelte";
  import {
    findCar,
    findCollection,
    readDiscoveryFilters,
    discoveryText,
  } from "./discovery.ts";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const phone = new MediaQuery(
    "(max-width: 767.98px)",
    untrack(() => data.phoneHint),
  );
  const locale = useLocale();
  const car = $derived(findCar(page.url.searchParams.get("car")));
  const query = $derived(page.url.searchParams.get("q"));
  const filters = $derived(readDiscoveryFilters(page.url.searchParams));
  const searching = $derived(
    query !== null ||
      !!(
        filters.make ||
        filters.model ||
        filters.priceMax ||
        filters.yearFrom ||
        filters.yearTo
      ),
  );
  const collection = $derived(
    findCollection(page.url.searchParams.get("collection")),
  );
  const title = $derived(
    car?.title ??
      discoveryText(
        locale.locale,
        searching ? "searchResults" : (collection?.title ?? "home"),
      ),
  );
</script>

{#if phone.current}
  <PageMetadata {title} />
  {#if car}
    <DiscoveryDetail {car} />
  {:else if searching}
    <DiscoveryBrowse query={query ?? ""} {filters} />
  {:else if collection}
    <DiscoveryBrowse {collection} />
  {:else}
    <DiscoveryHome />
  {/if}
  <DiscoveryNavigation />
{:else}
  <OriginalHome />
{/if}

<style>
  @media (max-width: 767.98px) {
    :global(
      body:has(.discovery-home, .discovery-interior)
        .header
        :is(.karento-header-cta, .karento-menu-toggle)
    ) {
      --discovery-header-surface: var(--bs-neutral-100);
      --discovery-header-border: var(--bs-neutral-200);
      --discovery-header-blur: none;
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      padding: 0;
      border: 0 !important;
      border-radius: var(--karento-radius-pill);
      background: transparent !important;
      color: var(--bs-neutral-1000) !important;
      box-shadow: none;
      backdrop-filter: none !important;
      line-height: 1;
    }
    :global(
      body:has(.discovery-home, .discovery-interior)
        .header
        :is(.karento-header-cta, .karento-menu-toggle)::before
    ) {
      content: "";
      position: absolute;
      z-index: -1;
      inset: var(--karento-space-1);
      box-sizing: border-box;
      border: 1px solid var(--discovery-header-border);
      border-radius: inherit;
      background: var(--discovery-header-surface);
      backdrop-filter: var(--discovery-header-blur);
      pointer-events: none;
    }
    :global(
      body:has(.discovery-home, .discovery-interior)
        .header
        :is(.karento-header-cta, .karento-menu-toggle)
        :is(svg, img)
    ) {
      display: block;
      width: 18px;
      height: 18px;
      margin: 0;
    }
    :global(
      body:has(.discovery-home, .discovery-interior)
        .header
        .karento-header-cta
        svg
    ) {
      /* Balance the profile artwork's lower shoulder strokes. */
      transform: translateY(-0.5px);
    }
    :global(
      body:has(.discovery-home, .discovery-interior)
        .header
        :is(.karento-header-cta, .karento-menu-toggle):focus-visible
    ) {
      outline: 2px solid currentColor !important;
      outline-offset: 0;
    }
    :global(
      body:has(.discovery-home)
        .header.mobile-hero-header:not(.mobile-header-scrolled)
        :is(.karento-header-cta, .karento-menu-toggle)
    ) {
      --discovery-header-surface: rgb(255 255 255 / 14%);
      --discovery-header-border: rgb(255 255 255 / 28%);
      --discovery-header-blur: blur(12px);
      color: white !important;
    }
    :global(body:has(.discovery-interior) .header.mobile-hero-header) {
      position: relative;
      inset: auto;
      background: var(--bs-neutral-0);
      box-shadow: none;
    }
    :global(
      body:has(.discovery-interior) .header.mobile-hero-header .container-fluid
    ) {
      background: var(--bs-neutral-0) !important;
    }
    :global(
      body:has(.discovery-interior) .header.mobile-hero-header .light-mode
    ),
    :global(
      body:has(.discovery-interior)
        .header.mobile-hero-header
        .karento-menu-toggle
        img
    ) {
      filter: none !important;
    }
    :global(
      body:has(.discovery-interior)
        .header.mobile-hero-header
        .karento-header-cta
    ),
    :global(
      body:has(.discovery-interior)
        .header.mobile-hero-header
        .karento-menu-toggle
    ) {
      color: var(--bs-neutral-1000);
      background: var(--bs-neutral-100);
      border-color: var(--bs-neutral-200);
      backdrop-filter: none;
    }
  }
</style>
