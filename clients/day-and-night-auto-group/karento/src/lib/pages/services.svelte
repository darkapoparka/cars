<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { snapshot } from "$app/navigation";
  import type { ServiceFilterId } from "#lib/data/services.ts";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ServicesCatalog from "#lib/components/services/ServicesCatalog.svelte";
  import Footer from "#lib/components/Footer.svelte";

  interface ServicesFilterSnapshot {
    query: string;
    category: ServiceFilterId;
  }

  let query = $state("");
  let category = $state<ServiceFilterId>("all");
  snapshot<ServicesFilterSnapshot>({
    id: "karento-services-filters",
    capture: () => ({ query, category }),
    restore: (value) => {
      query = value.query;
      category = value.category;
    },
    reset: resetFilters,
  });

  function resetFilters() {
    query = "";
    category = "all";
  }
</script>

<PageMetadata title={locale.t("ui.services.services")} />
<main class="main">
  <ServicesCatalog bind:query bind:category />
  <Footer />
</main>
