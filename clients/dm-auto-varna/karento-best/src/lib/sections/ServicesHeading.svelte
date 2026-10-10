<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import DesktopDiscoveryHero from "#lib/components/page-header/DesktopDiscoveryHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import MobileSearchField from "#lib/components/mobile/MobileSearchField.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { serviceCards, type ServiceFilterId } from "#lib/data/services.ts";
  import { filterDesktopServices } from "#lib/data/desktop-services.ts";

  let {
    query = $bindable(""),
    category = $bindable<ServiceFilterId>("all"),
  }: { query?: string; category?: ServiceFilterId } = $props();
  const desktop = new MediaQuery("(min-width: 992px)");
  const reducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");
  const filters = $derived(
    filterDesktopServices(serviceCards, query, category, locale.locale).filters,
  );

  function submitSearch(event: SubmitEvent) {
    event.preventDefault();
    const results = document.getElementById("services-results");
    results?.focus({ preventScroll: true });
    results?.scrollIntoView({
      block: "start",
      behavior: reducedMotion.current ? "auto" : "smooth",
    });
  }
</script>

{#if desktop.current}
  <DesktopDiscoveryHero
    image={pageHeroes.services.image}
    title={locale.t("ui.services-heading.services")}
    titleId="services-title"
    searchLabel={locale.t("ui.services-heading.search-services")}
    placeholder={locale.t("ui.services-heading.service-name-or-keyword")}
    bind:query
    filters={filters.map((filter) => ({
      id: filter.id,
      label:
        filter.id === "all"
          ? locale.t("reference.services.all")
          : locale.t(filter.labelKey),
      count: filter.count,
    }))}
    selected={category}
    filtersLabel={locale.t("ui.services-heading.service-categories")}
    onselect={(id) => (category = id)}
    onsubmit={submitSearch}
    class="services-desktop-hero"
    searchClass="desktop-service-search"
  />{:else}
  <PageHero header={pageHeroes.services}>
    {#snippet mobileControls()}
      <div class="mobile-service-tools">
        <MobileSearchField
          label={locale.t("ui.services-heading.search-services")}
          bind:value={query}
        />
        <MobilePill
          label={locale.t("ui.services-heading.contact-us")}
          ariaLabel={locale.t("ui.services-heading.contact-us")}
          href={locale.href("/contact")}
          leadingIcon="message"
          iconOnly
          class="mobile-service-contact"
        />
      </div>
    {/snippet}
  </PageHero>
{/if}
