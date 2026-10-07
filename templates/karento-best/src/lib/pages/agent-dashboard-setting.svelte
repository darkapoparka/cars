<script lang="ts">
  import BoxSectionPt80a9956b80 from "#lib/sections/BoxSectionPt80a9956b80.svelte";
  import BoxSectionPt802c5ad6f8 from "#lib/sections/BoxSectionPt802c5ad6f8.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Dealer Settings | Karento"
      : "Dealer Settings" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionPt80a9956b80 />
  <BoxSectionPt802c5ad6f8 />
  <Footer /></main
>
