<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import DesktopDiscoveryHero from "#lib/components/page-header/DesktopDiscoveryHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import type { ImportSourceItem } from "#lib/data/editorial.ts";
  import {
    importCountryFilters,
    referenceImportCountryChoices,
    type ImportCountryChoice,
  } from "#lib/data/import-sources.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  const locale = useLocale();
  const desktop = new MediaQuery("(min-width: 992px)");
  const reducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");
  let {
    sources,
    query = $bindable(""),
    country = $bindable("all"),
    countryChoices = referenceImportCountryChoices,
  }: {
    sources: readonly ImportSourceItem[];
    query?: string;
    country?: string;
    countryChoices?: readonly ImportCountryChoice[];
  } = $props();
  const countryFilters = $derived(
    importCountryFilters(sources, locale.locale, countryChoices),
  );
  const countries = $derived(
    countryFilters.length > 1
      ? [
          {
            id: "all",
            label: locale.t("ui.import-discovery.all"),
          },
          ...countryFilters,
        ]
      : [],
  );

  function submitSearch(event: SubmitEvent) {
    event.preventDefault();
    const results = document.getElementById("import-results");
    results?.focus({ preventScroll: true });
    results?.scrollIntoView({
      block: "start",
      behavior: reducedMotion.current ? "auto" : "smooth",
    });
  }
</script>

{#if desktop.current}
  <DesktopDiscoveryHero
    image={pageHeroes.importSources.image}
    title={locale.text(pageHeroes.importSources.title)}
    titleId="import-title"
    searchLabel={locale.t("ui.import-discovery.search-sources")}
    placeholder={locale.t("ui.import-discovery.source-name-or-location")}
    bind:query
    filters={countries}
    selected={country}
    filtersLabel={locale.t("ui.import-discovery.source-countries")}
    onselect={(id) => (country = id)}
    onsubmit={submitSearch}
    searchClass="desktop-import-search"
  />
{:else}
  <PageHero header={pageHeroes.importSources} />
{/if}
