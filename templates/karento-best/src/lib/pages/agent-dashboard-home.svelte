<script lang="ts">
  import BoxSectionPt804c15694e from "#lib/sections/BoxSectionPt804c15694e.svelte";
  import BoxSectionPt80747088cf from "#lib/sections/BoxSectionPt80747088cf.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Dealer Overview | Karento"
      : "Dealer Overview" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt804c15694e />
  <BoxSectionPt80747088cf />
  <Footer /></main
>
