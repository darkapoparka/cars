<script lang="ts">
  import PageHeader2Pt301c1e837c from "#lib/sections/PageHeader2Pt301c1e837c.svelte";
  import BoxSectionBoxSearchAdvanceHome10d473775e from "#lib/sections/BoxSectionBoxSearchAdvanceHome10d473775e.svelte";
  import Pt5072dc7312 from "#lib/sections/Pt5072dc7312.svelte";
  import BoxSectionBlockContentTourlistd3f4436b from "#lib/sections/BoxSectionBlockContentTourlistd3f4436b.svelte";
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
  ><PageHeader2Pt301c1e837c />
  <BoxSectionBoxSearchAdvanceHome10d473775e />
  <Pt5072dc7312 />
  <BoxSectionBlockContentTourlistd3f4436b />
  <Footer /></main
>
