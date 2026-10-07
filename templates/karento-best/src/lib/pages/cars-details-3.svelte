<script lang="ts">
  import BoxSectionBoxBreadcrumba56474dc from "#lib/sections/BoxSectionBoxBreadcrumba56474dc.svelte";
  import BoxSectionBoxContentTourDetail41a18aee from "#lib/sections/BoxSectionBoxContentTourDetail41a18aee.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Vehicle Details | Karento"
      : "Vehicle Details" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionBoxBreadcrumba56474dc centered />
  <BoxSectionBoxContentTourDetail41a18aee />
  <Footer /></main
>
