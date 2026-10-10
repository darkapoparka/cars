<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ImportProfileHeading from "#lib/sections/ImportProfileHeading.svelte";
  import ImportSourceProfile from "#lib/sections/ImportSourceProfile.svelte";
  import ImportVehiclesHeading from "#lib/sections/ImportVehiclesHeading.svelte";
  import ImportSourceVehicleListing from "#lib/sections/ImportSourceVehicleListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { page } from "$app/state";
  import {
    findImportSource,
    suppliedImportSources,
  } from "#lib/data/import-sources.ts";
  const sources = suppliedImportSources();
  const source = $derived(
    findImportSource(sources, page.url.searchParams.get("source")),
  );
</script>

<PageMetadata
  title={source?.name ?? locale.t("ui.import-discovery.source-unavailable")}
/>
<main class="main"
  >{#if source}
    <ImportProfileHeading {source} />
    <ImportSourceProfile {source} />
    {#if source.vehicles?.length}
      <ImportVehiclesHeading />
      <ImportSourceVehicleListing cards={source.vehicles} />
    {/if}
  {:else}
    <section class="container desktop-collection-section">
      <h1 class="desktop-type-page"
        >{locale.t("ui.import-discovery.source-unavailable")}</h1
      >
      <p class="desktop-type-body"
        >{locale.t("ui.import-discovery.choose-another-source")}</p
      >
      <a
        class="btn btn-primary desktop-type-control"
        href={locale.href("/import")}
        >{locale.t("ui.import-discovery.back-to-sources")}</a
      >
    </section>
  {/if}
  <Footer /></main
>
