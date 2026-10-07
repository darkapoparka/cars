<script lang="ts">
  import BoxSectionBoxBreadcrumba56474dc from "#lib/sections/BoxSectionBoxBreadcrumba56474dc.svelte";
  import BoxSectionBoxContentTourDetailaf5525a3 from "#lib/sections/BoxSectionBoxContentTourDetailaf5525a3.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Carento - Car rental Bootstrap 5 Template"
      : "Carento - Car rental Bootstrap 5 Template" +
        " | " +
        dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><BoxSectionBoxBreadcrumba56474dc />
  <BoxSectionBoxContentTourDetailaf5525a3 />
  <Footer /></main
>
