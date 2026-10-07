<script lang="ts">
  import BoxSectionBoxBreadcrumba56474dc from "#lib/sections/BoxSectionBoxBreadcrumba56474dc.svelte";
  import BoxBannerHome21ffcb101 from "#lib/sections/BoxBannerHome21ffcb101.svelte";
  import BoxSectionBoxContentTourDetaile917d0ab from "#lib/sections/BoxSectionBoxContentTourDetaile917d0ab.svelte";
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
  <BoxBannerHome21ffcb101 />
  <BoxSectionBoxContentTourDetaile917d0ab />
  <Footer /></main
>
