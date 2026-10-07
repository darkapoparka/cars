<script lang="ts">
  import BoxSectionPt80bdf4b13f from "#lib/sections/BoxSectionPt80bdf4b13f.svelte";
  import BoxSectionPt80097cadd1 from "#lib/sections/BoxSectionPt80097cadd1.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Member Settings | Karento"
      : "Member Settings" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80bdf4b13f />
  <BoxSectionPt80097cadd1 />
  <Footer /></main
>
