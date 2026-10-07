<script lang="ts">
  import PageHeader2Pt301e056f20 from "#lib/sections/PageHeader2Pt301e056f20.svelte";
  import BoxSectionBoxSearchAdvanceHome10d473775e from "#lib/sections/BoxSectionBoxSearchAdvanceHome10d473775e.svelte";
  import Pt5072dc7312 from "#lib/sections/Pt5072dc7312.svelte";
  import BoxSectionBlockContentTourlist0437bfdf from "#lib/sections/BoxSectionBlockContentTourlist0437bfdf.svelte";
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
  ><PageHeader2Pt301e056f20 />
  <BoxSectionBoxSearchAdvanceHome10d473775e />
  <Pt5072dc7312 />
  <BoxSectionBlockContentTourlist0437bfdf />
  <Footer /></main
>
