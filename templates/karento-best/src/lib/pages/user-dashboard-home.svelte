<script lang="ts">
  import BoxSectionPt80f8b6bc4c from "#lib/sections/BoxSectionPt80f8b6bc4c.svelte";
  import BoxSectionPt80d3a48737 from "#lib/sections/BoxSectionPt80d3a48737.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Member Overview | Karento"
      : "Member Overview" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80f8b6bc4c />
  <BoxSectionPt80d3a48737 />
  <Footer /></main
>
