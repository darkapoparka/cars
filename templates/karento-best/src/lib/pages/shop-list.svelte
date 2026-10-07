<script lang="ts">
  import PageHeader2Pt3016496a82 from "#lib/sections/PageHeader2Pt3016496a82.svelte";
  import Pt50fb3d9b0c from "#lib/sections/Pt50fb3d9b0c.svelte";
  import BoxSectionBlockContentTourlist726813ea from "#lib/sections/BoxSectionBlockContentTourlist726813ea.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { dealer } from "#lib/content.ts";
</script>

<svelte:head
  ><title
    >{dealer.name === "Karento"
      ? "Shop | Karento"
      : "Shop" + " | " + dealer.name}</title
  ></svelte:head
>
<main class="main"
  ><PageHeader2Pt3016496a82 />
  <Pt50fb3d9b0c />
  <BoxSectionBlockContentTourlist726813ea />
  <Footer /></main
>
