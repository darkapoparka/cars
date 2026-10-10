<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import PageHero from "#lib/components/page-header/PageHero.svelte";
  import { pageHeroes } from "#lib/data/page-headers.ts";
  import { MediaQuery } from "svelte/reactivity";
  import DesktopPageHeading from "#lib/components/page-header/DesktopPageHeading.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if desktop.current}
  <div class="container desktop-heading-container">
    <DesktopPageHeading
      title={pageHeroes.terms.title}
      description={pageHeroes.terms.description?.text}
    />
  </div>
{:else}
  <PageHero header={pageHeroes.terms} />
{/if}
