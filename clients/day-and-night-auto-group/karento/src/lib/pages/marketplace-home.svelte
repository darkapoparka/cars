<script lang="ts">
  import { page } from "$app/state";
  import { untrack } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import OriginalHome from "#lib/pages/index-3.svelte";
  import DiscoveryHome from "#lib/discovery/DiscoveryHome.svelte";
  import DiscoveryBrowse from "#lib/discovery/DiscoveryBrowse.svelte";
  import DiscoveryDetail from "#lib/discovery/DiscoveryDetail.svelte";
  import {
    findCar,
    findCollection,
    readDiscoveryFilters,
    discoveryText,
  } from "#lib/discovery/discovery.ts";

  let { phoneHint = false }: { phoneHint?: boolean } = $props();
  const phone = new MediaQuery(
    "(max-width: 767.98px)",
    untrack(() => phoneHint),
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
{:else}
  <OriginalHome />
{/if}
