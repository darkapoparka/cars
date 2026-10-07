<script lang="ts">
  import PageHeader2Pt30dc16efd0 from "#lib/sections/PageHeader2Pt30dc16efd0.svelte";
  import BoxSectionBoxSearchAdvanceHome10d473775e from "#lib/sections/BoxSectionBoxSearchAdvanceHome10d473775e.svelte";
  import Pt5072dc7312 from "#lib/sections/Pt5072dc7312.svelte";
  import BoxSectionBlockContentTourlist89624236 from "#lib/sections/BoxSectionBlockContentTourlist89624236.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Vehicles | Karento"
      : "Vehicles" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeader2Pt30dc16efd0 />
  <BoxSectionBoxSearchAdvanceHome10d473775e />
  <Pt5072dc7312 />
  <BoxSectionBlockContentTourlist89624236 />
  <Footer /></main
>
