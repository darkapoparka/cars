<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import { MediaQuery } from "svelte/reactivity";
  import DesktopPageHeading from "#lib/components/page-header/DesktopPageHeading.svelte";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if desktop.current}
  <div class="container desktop-heading-container">
    <DesktopPageHeading
      title={locale.t("ui.membership-plans.membership-plans")}
      breadcrumb={pageHeroes.pricing.title}
      description={pageHeroes.pricing.description?.text}
    />
  </div>
{:else}
  <PageHero header={pageHeroes.pricing} />
{/if}
